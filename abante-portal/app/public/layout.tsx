import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liga Jersey Tracker',
  description: 'Jersey payment transparency for all divisions',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return children
}