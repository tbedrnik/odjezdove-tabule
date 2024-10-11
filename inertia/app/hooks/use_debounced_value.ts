import { useEffect, useState } from 'react'

export const useDebouncedValue = <T>(value: T, debounceTime: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, debounceTime)

    return () => clearTimeout(timeoutId)
  }, [value, debounceTime])

  return debouncedValue
}
