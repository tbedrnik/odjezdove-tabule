export const getTimeComponents = (date: Date) => {
  const H = date.getHours().toString()
  const MM = date.getMinutes().toString().padStart(2, '0')
  const SS = date.getSeconds().toString().padStart(2, '0')

  return { H, MM, SS }
}

export const formatTime = (dateStr: string, withSeconds = false) => {
  const d = new Date(dateStr)

  const { H, MM, SS } = getTimeComponents(d)

  return `${H}:${MM}${withSeconds ? `:${SS}` : ''}`
}
