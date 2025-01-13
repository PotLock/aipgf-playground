import React from 'react'

interface CodeProps {
  children: React.ReactNode
  className?: string
}

export function Code({ children, className = '' }: CodeProps) {
  return (
    <pre className={`bg-muted p-4 rounded-md overflow-x-auto ${className}`}>
      <code>{children}</code>
    </pre>
  )
}

