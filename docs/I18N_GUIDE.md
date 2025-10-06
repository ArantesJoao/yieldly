# Internationalization (i18n) Guide

## Overview

This project uses **react-i18next** for internationalization with a context-based approach. The language preference is stored in localStorage and persists across sessions.

## Supported Languages

- **Portuguese (Brazil)** - `pt-BR` (Default)
- **English (US)** - `en-US`

## Architecture

### Key Files

1. **i18n Configuration**: `src/lib/i18n.ts`
   - Initializes i18next with language detection
   - Configures resources and namespaces

2. **Language Context**: `src/contexts/languageContext.tsx`
   - Provides language state and setter
   - Handles localStorage persistence
   - Must be used within client components

3. **Translation Files**: `src/locales/{locale}/{namespace}.json`
   - Organized by namespace (common, dashboard, accounts)
   - Easy to maintain and extend

4. **Language Switcher**: `src/components/navbar/language-switcher.tsx`
   - Toggle button in mobile menu
   - Beautiful UI with current language indicator

## Usage

### In Client Components

```tsx
'use client'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/contexts/languageContext'

function MyComponent() {
  const { t } = useTranslation('namespace') // e.g., 'common', 'dashboard', 'accounts'
  const { locale, setLocale } = useLanguage()

  return (
    <div>
      <h1>{t('key.nested.value')}</h1>
      <p>Current language: {locale}</p>
    </div>
  )
}
```

### With Variables

```tsx
// Translation: "Hello, {{name}}"
<h1>{t('greeting', { name: userName })}</h1>
```

### Cross-Namespace Translations

```tsx
// Access translations from other namespaces
{t('common:buttons.save')}
```

### Date Formatting with Locale

```tsx
import { formatDateShort, formatDateLong } from '@/utils/conversions'
import { useLanguage } from '@/contexts/languageContext'

function DateDisplay() {
  const { locale } = useLanguage()
  
  // Outputs: "5 jan" (pt-BR) or "Jan 5" (en-US)
  const shortDate = formatDateShort('2024-01-05', locale)
  
  // Outputs: "05 de janeiro de 2024" (pt-BR) or "January 05, 2024" (en-US)
  const longDate = formatDateLong(new Date(), locale)
  
  return <div>{shortDate}</div>
}
```

## Translation File Structure

```
src/locales/
├── pt-BR/
│   ├── common.json       # Navbar, buttons, common UI
│   ├── dashboard.json    # Dashboard-specific text
│   └── accounts.json     # Accounts page text
└── en-US/
    ├── common.json
    ├── dashboard.json
    └── accounts.json
```

## Adding New Translations

### 1. Add to Translation Files

**pt-BR/common.json:**
```json
{
  "myFeature": {
    "title": "Título",
    "description": "Descrição"
  }
}
```

**en-US/common.json:**
```json
{
  "myFeature": {
    "title": "Title",
    "description": "Description"
  }
}
```

### 2. Use in Components

```tsx
const { t } = useTranslation('common')
<h1>{t('myFeature.title')}</h1>
```

## Creating a New Namespace

### 1. Create Translation Files

```bash
# Create files for both locales
touch src/locales/pt-BR/myNamespace.json
touch src/locales/en-US/myNamespace.json
```

### 2. Update i18n Config

```typescript
// src/lib/i18n.ts
import myNamespacePT from '@/locales/pt-BR/myNamespace.json'
import myNamespaceEN from '@/locales/en-US/myNamespace.json'

const resources = {
  'pt-BR': {
    // ... existing
    myNamespace: myNamespacePT,
  },
  'en-US': {
    // ... existing
    myNamespace: myNamespaceEN,
  },
}

// Add to ns array
ns: ['common', 'dashboard', 'accounts', 'myNamespace']
```

### 3. Use in Components

```tsx
const { t } = useTranslation('myNamespace')
```

## Language Switcher

The language switcher is available in the mobile menu. It:
- Shows current language (PT/EN)
- Toggles between pt-BR and en-US
- Saves preference to localStorage
- Updates all components automatically

## Date Formatting

All date formatting functions now support locale parameters:

- `formatDateShort(dateStr, locale)` - "5 jan" or "Jan 5"
- `formatDateLong(date, locale)` - "05 de janeiro de 2024" or "January 05, 2024"
- Uses date-fns with proper locale support (ptBR, enUS)

## Best Practices

1. **Always use translation keys** - Never hardcode text
2. **Organize by feature** - Use nested keys for related translations
3. **Keep keys descriptive** - `user.profile.edit` not `up.e`
4. **Use namespaces** - Separate concerns (common, dashboard, etc.)
5. **Test both languages** - Switch languages to verify translations
6. **Use variables** - For dynamic content: `{t('key', { var: value })}`

## Troubleshooting

### Translation not appearing

1. Check if translation exists in both locale files
2. Verify namespace is loaded in i18n config
3. Ensure correct translation key
4. Check console for i18next warnings

### Language not changing

1. Clear localStorage: `localStorage.removeItem('yieldly-language')`
2. Verify LanguageProvider wraps your app
3. Check browser console for errors

### Dates not formatting correctly

1. Verify locale is passed to formatting functions
2. Check date-fns locale import (ptBR, enUS)
3. Ensure date format is correct (YYYY-MM-DD for strings)

## Future Enhancements

- [ ] Add more languages (es-ES, etc.)
- [ ] Implement currency formatting per locale
- [ ] Add RTL support if needed
- [ ] Create translation management workflow
- [ ] Add missing translation warnings in dev mode

