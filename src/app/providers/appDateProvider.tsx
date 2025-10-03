"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { getLocalDateString } from '@/utils/conversions'

interface AppDateContextType {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  getCurrentDateString: () => string
}

const AppDateContext = createContext<AppDateContextType | undefined>(undefined)

export function AppDateProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  const getCurrentDateString = () => {
    return getLocalDateString(currentDate)
  }

  return (
    <AppDateContext.Provider value={{ currentDate, setCurrentDate, getCurrentDateString }}>
      {children}
    </AppDateContext.Provider>
  )
}

export function useAppDate() {
  const context = useContext(AppDateContext)
  if (context === undefined) {
    throw new Error('useAppDate must be used within an AppDateProvider')
  }
  return context
}

