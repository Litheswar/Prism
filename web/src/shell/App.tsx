import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const qc = new QueryClient()

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={qc}>
      {children}
    </QueryClientProvider>
  )
}
