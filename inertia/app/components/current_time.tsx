import { useEffect, useState } from 'react'
import { getTimeComponents } from '~/utils/time'

export const CurrentTime = () => {
  const [ts, setTs] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTs(new Date()), 200)

    return () => clearInterval(interval)
  }, [])

  const { H, MM } = getTimeComponents(ts)

  const blink = ts.getSeconds() % 2 === 0

  return (
    <span>
      {H}
      <span className={`${blink ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
        :
      </span>
      {MM}
    </span>
  )
}
