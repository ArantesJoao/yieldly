# Yieldly Backend API Documentation

## Overview

Yieldly is a personal investment tracker focused on logging balances and transactions with simple, user-controlled semantics, especially for Brazil-centric fixed-income workflows. This document provides comprehensive API documentation for backend integration.

## Table of Contents

- [Authentication & Authorization](#authentication--authorization)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

## Authentication & Authorization

### NextAuth Configuration

The application uses NextAuth v5 with JWT sessions for authentication.

#### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/yieldly"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"

# Admin Configuration
ADMIN_EMAIL="admin@example.com"

# OAuth Providers (configure as needed)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

#### Session Structure

```typescript
interface Session {
  user: {
    id: string        // User's database ID
    role: Role        // admin | member | viewer
    email: string
    name?: string
    image?: string
  }
}
```

#### Role-Based Authorization

- **Admin**: Full permissions (determined by `ADMIN_EMAIL` environment variable)
- **Member**: Logged-in demo user with strict write limits (max 1 Account, max 1 LedgerEntry creation total)
- **Viewer**: Logged-out user; access only to landing and login pages

### Authorization Helper

All API endpoints use a centralized authorization helper:

```typescript
await authorize(action, {
  userId: session.user.id,
  role: session.user.role,
  resourceOwnerId?: string  // For ownership checks
})
```

## Environment Setup

### Dependencies Installation

```bash
npm install
```

### Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Or push schema to database (for development)
npm run db:push
```

### Development Server

```bash
npm run dev
```

## Database Setup

### Prisma Schema Overview

The database uses PostgreSQL with the following main entities:

- **User**: Authentication and user preferences
- **Account**: Investment accounts grouped by institution
- **TransactionType**: User-defined categories with direction (inflow/outflow), seeded with "Deposit" and "Yields" as inflows
- **LedgerEntry**: Individual balance movements
- **DailyAccountSummary**: Pre-aggregated daily summaries for fast queries

### Auto-Seeding

When a user first logs in, the system automatically creates two default transaction types (both with direction="inflow"):
- **"Deposit"** - for deposits and initial balances
- **"Yields"** - for investment yields

These default types cannot be deleted but users can create additional custom types via the API.

## API Endpoints

### Authentication Endpoints

#### `GET/POST /api/auth/[...nextauth]`
NextAuth dynamic route for authentication flow.

---

### Accounts

#### `GET /api/accounts`
Returns all accounts owned by the authenticated user.

**Response:**
```json
[
  {
    "id": "1",
    "ownerUserId": "1",
    "institution": "Nubank",
    "label": "Main Account",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### `POST /api/accounts`
Creates a new account.

**Request Body:**
```json
{
  "institution": "string",           // Required, max 100 chars
  "label": "string",                // Required, max 100 chars
  "initialBalanceMinor": 100000,    // Optional, integer (BRL centavos)
  "startDate": "2025-01-01"         // Optional, YYYY-MM-DD format
}
```

**Response:** Created account object with 201 status.

**Behavior:**
- If `initialBalanceMinor` is provided, creates a LedgerEntry with TransactionType="Deposit" and note="Initial balance"
- Updates DailyAccountSummary for the affected date
- Members limited to 1 account total

#### `DELETE /api/accounts/{id}`
Deletes an account (admin or owner only).

**Response:**
```json
{
  "success": true
}
```

---

### Transaction Types

#### `GET /api/transaction-types`
Returns all transaction types for the authenticated user.

**Response:**
```json
[
  {
    "id": "1",
    "ownerUserId": "1",
    "name": "Deposit"
  },
  {
    "id": "2", 
    "ownerUserId": "1",
    "name": "Yields"
  }
]
```

#### `POST /api/transaction-types`
Creates a new transaction type.

**Request Body:**
```json
{
  "name": "string",           // Required, max 50 chars, unique per user
  "direction": "inflow" | "outflow"  // Required, "inflow" for deposits/income, "outflow" for withdrawals/expenses
}
```

**Response:** Created transaction type with 201 status.

**Behavior:**
- Name must be unique per user (enforced by database constraint)
- Cannot create types named "Deposit" or "Yields" if they already exist

#### `DELETE /api/transaction-types/{id}`
Deletes a transaction type (admin or owner only).

**Restrictions:**
- Cannot delete default types: "Deposit" and "Yields"
- Returns 400 error if attempting to delete a default type

---

### Ledger

#### `GET /api/ledger`
Queries ledger entries with filters.

**Query Parameters:**
- `accountId`: Required, BigInt as string
- `from`: Required, YYYY-MM-DD format
- `to`: Required, YYYY-MM-DD format  
- `transactionTypeId`: Optional, BigInt as string

**Response:**
```json
[
  {
    "id": "1",
    "accountId": "1",
    "date": "2025-01-01",
    "transactionTypeId": "1",
    "amountMinor": 100000,
    "note": "Initial deposit",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "transactionType": {
      "id": "1",
      "ownerUserId": "1", 
      "name": "Deposit",
      "direction": "inflow"
    }
  }
]
```

#### `POST /api/ledger`
Creates a single ledger entry.

**Request Body:**
```json
{
  "accountId": "1",             // Required, BigInt as string
  "date": "2025-01-01",         // Required, YYYY-MM-DD format
  "transactionTypeId": "1",     // Required, BigInt as string
  "amountMinor": 100000,        // Required, integer (always positive, direction determined by TransactionType)
  "note": "Optional note"       // Optional, max 500 chars
}
```

**Response:** Created ledger entry with 201 status.

**Behavior:**
- Updates DailyAccountSummary incrementally for the affected date
- Members limited to 1 ledger entry creation total

#### `POST /api/ledger/spread`
Distributes a lump sum across multiple days.

**Request Body:**
```json
{
  "accountId": "1",                    // Required, BigInt as string
  "transactionTypeId": "2",            // Required, typically "Yields"
  "totalAmountMinor": 100000,          // Required, integer >= 0 (R$1000.00)
  "startDate": "2025-01-01",           // Required, YYYY-MM-DD (inclusive)
  "endDate": "2025-01-10",             // Required, YYYY-MM-DD (inclusive)
  "roundingMode": "lastDayGetsRemainder" // Optional, default as shown
}
```

**Response:**
```json
{
  "inserted": 10,
  "entries": [...]  // Array of created ledger entries
}
```

**Algorithm:**
1. Calculate N = number of days in [startDate, endDate]
2. perDay = floor(totalAmountMinor / N)
3. remainder = totalAmountMinor - (perDay * N)
4. Create N entries: first N-1 get `perDay`, last day gets `perDay + remainder`
5. Update DailyAccountSummary for all affected dates

---

### Summaries

#### `GET /api/summary/account`
Returns daily summaries for a specific account.

**Query Parameters:**
- `accountId`: Required, BigInt as string
- `from`: Optional, YYYY-MM-DD format (omit for all-time data)
- `to`: Optional, YYYY-MM-DD format (omit for all-time data)

**Examples:**
- `/api/summary/account?accountId=1` - All-time data for account 1
- `/api/summary/account?accountId=1&from=2025-01-01` - From Jan 1st onwards
- `/api/summary/account?accountId=1&to=2025-12-31` - Up to Dec 31st
- `/api/summary/account?accountId=1&from=2025-01-01&to=2025-12-31` - Specific range

**Response:**
```json
[
  {
    "date": "2025-01-01",
    "balanceEndMinor": 100000,
    "yieldsMinor": 5000,
    "depositsMinor": 95000
  }
]
```

#### `GET /api/summary/total`
Returns daily totals across all user's accounts.

**Query Parameters:**
- `from`: Optional, YYYY-MM-DD format (omit for all-time data)
- `to`: Optional, YYYY-MM-DD format (omit for all-time data)

**Examples:**
- `/api/summary/total` - All-time data across all accounts
- `/api/summary/total?from=2025-01-01` - From Jan 1st onwards
- `/api/summary/total?to=2025-12-31` - Up to Dec 31st
- `/api/summary/total?from=2025-01-01&to=2025-12-31` - Specific range

**Response:** Same format as account summary, but aggregated across all accounts.

## Data Models

### Currency Handling

All monetary amounts are stored as integers in BRL centavos to avoid floating-point errors:
- `amountMinor: 100000` = R$ 1.000,00
- `amountMinor: 1` = R$ 0,01
- Negative amounts are allowed for corrections

### Date Handling

- All dates stored as UTC midnight (00:00:00.000Z)
- API accepts dates in YYYY-MM-DD format
- Frontend should convert user timezone to UTC when sending
- Frontend should convert UTC back to user timezone when displaying

### BigInt Serialization

Database IDs are BigInt but serialized as strings in API responses:
```typescript
// Database: BigInt(123)
// API Response: "123"
```

## Error Handling

### Error Response Format

```json
{
  "error": "error-code",
  "message": "Human readable message"
}
```

### Common Error Codes

- `401 unauthenticated`: No valid session
- `403 forbidden`: Insufficient permissions or demo limits reached
- `404 not-found`: Resource not found
- `422 validation-error`: Invalid request body/parameters
- `500 internal-error`: Server error

### Demo User Limits

Members hit limits with specific error messages:
```json
{
  "error": "forbidden",
  "message": "Demo limit: Members can only create 1 account"
}
```

## Usage Examples

### Basic Workflow

1. **Authentication**: User logs in via OAuth
2. **Create Account**: POST to `/api/accounts` with initial balance
3. **Add Entries**: POST to `/api/ledger` for individual entries
4. **Spread Yields**: POST to `/api/ledger/spread` for yield distribution
5. **View Data**: GET `/api/summary/total` for dashboard charts

### Example: Creating Account with Initial Balance

```javascript
// Create account
const account = await fetch('/api/accounts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    institution: 'Nubank',
    label: 'Conta Principal', 
    initialBalanceMinor: 100000, // R$ 1,000.00
    startDate: '2025-01-01'
  })
})

// This automatically creates:
// 1. Account record
// 2. LedgerEntry with TransactionType="Deposit" (direction="inflow")
// 3. DailyAccountSummary for 2025-01-01
```

### Example: Spreading Yields

```javascript
// Spread R$ 100.00 of yields over 10 days
const spread = await fetch('/api/ledger/spread', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    accountId: '1',
    transactionTypeId: '2', // "Yields" 
    totalAmountMinor: 10000, // R$ 100.00
    startDate: '2025-01-01',
    endDate: '2025-01-10'
  })
})

// Creates 10 LedgerEntry records:
// - 9 entries with amountMinor: 1000 (R$ 10.00)
// - 1 entry with amountMinor: 1000 (R$ 10.00) 
// - Updates DailyAccountSummary for all 10 dates
```

### Example: Getting Summary Data

```javascript
// Get all-time total portfolio summary
const allTimeSummary = await fetch('/api/summary/total')
const allTimeData = await allTimeSummary.json()
// Returns all daily totals across all user's accounts

// Get total portfolio summary for specific date range
const summary = await fetch(
  '/api/summary/total?from=2025-01-01&to=2025-01-30'
)
const data = await summary.json()
// Returns daily totals across all user's accounts for the specified period
```

## Development Notes

### Testing Authorization

Use different email addresses to test roles:
- Set `ADMIN_EMAIL=admin@test.com` 
- Login with `admin@test.com` → Admin role
- Login with `user@test.com` → Member role (with limits)

### Database Inspection

```bash
npm run db:studio  # Opens Prisma Studio at http://localhost:5555
```

### API Testing

All endpoints require authentication. Use tools like:
- Postman with NextAuth session cookies
- Frontend with valid session
- Direct database testing via Prisma Studio

## Deployment Considerations

### Environment Variables

Ensure all required environment variables are set in production:
- `DATABASE_URL` (Neon PostgreSQL)
- `NEXTAUTH_URL` (production domain)
- `NEXTAUTH_SECRET` (random secure string)
- `ADMIN_EMAIL` (admin user email)
- OAuth provider credentials

### Database Migrations

Run migrations in production:
```bash
npx prisma migrate deploy
```

### Performance

- DailyAccountSummary enables fast chart queries
- Proper indexes defined in Prisma schema
- Date range queries are optional; omit `from`/`to` for all-time data
- For large datasets, consider using date ranges to limit response size
- No caching required for v1 (designed for solo use)

---

This completes the comprehensive API documentation for the Yieldly backend. The system is designed for solo use with optional demo access, focusing on Brazilian real (BRL) fixed-income tracking with manual yield inputs and day-level granularity.
