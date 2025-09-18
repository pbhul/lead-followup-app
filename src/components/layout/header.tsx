'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Welcome back, {session?.user?.name || session?.user?.email}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>{session?.user?.role}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}