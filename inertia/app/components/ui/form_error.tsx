import * as React from 'react'
import { cn } from '~/app/lib/utils'

export const FormError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { error?: string }
>(({ className, children, error, ...props }, ref) => {
  if (!error) {
    return null
  }

  return (
    <p ref={ref} className={cn('text-sm font-medium text-destructive', className)} {...props}>
      {error}
    </p>
  )
})
