'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Dynamically import supabase to avoid issues with env vars at build time
        const { supabase } = await import('@/lib/supabase')
        const { data } = await supabase.auth.getSession()
        
        // If no session and not on login page, redirect to login
        if (!data.session && window.location.pathname !== '/admin') {
          router.push('/admin')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        // On error, still allow access but log it
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
