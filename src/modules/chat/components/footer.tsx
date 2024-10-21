import React from 'react'

import { cn } from '../utils/utils'
import { ExternalLink } from './external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      Open source AI chatbot built with{' '}
      <ExternalLink href="https://www.aipgf.com/">AI-PGF</ExternalLink> and{' '}
      <ExternalLink href="https://github.com/PotLock/ai-pgf-rfps">
        AI RFPS
      </ExternalLink>
      .
    </p>
  )
}
