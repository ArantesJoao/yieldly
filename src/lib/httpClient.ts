import axios from 'axios'

export const httpClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL || ''
    : '',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default httpClient
