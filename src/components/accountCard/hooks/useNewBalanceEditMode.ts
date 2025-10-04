import { useState, useCallback } from 'react'

export function useNewBalanceEditMode() {
  const [isEditingNewBalance, setIsEditingNewBalance] = useState(false)

  const startEditing = useCallback(() => {
    setIsEditingNewBalance(true)
  }, [])

  const stopEditing = useCallback(() => {
    setIsEditingNewBalance(false)
  }, [])

  const toggleEditing = useCallback(() => {
    setIsEditingNewBalance(prev => !prev)
  }, [])

  return {
    isEditingNewBalance,
    startEditing,
    stopEditing,
    toggleEditing,
  }
}

