'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, type User } from '../../lib/supabase'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized) {
      console.log('AuthContext: Already initialized, skipping')
      return
    }
    
    console.log('AuthContext: Supabase client:', supabase ? 'configured' : 'not configured')
    setInitialized(true)
    
    // If Supabase is not configured, just set loading to false
    if (!supabase) {
      console.log('AuthContext: Setting loading to false (no supabase)')
      setLoading(false)
      return
    }

    // Add a timeout fallback to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('AuthContext: Timeout reached, setting loading to false')
      setLoading(false)
    }, 3000) // Reduced to 3 seconds

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthContext: Initial session result:', { session: !!session, error })
      clearTimeout(timeoutId)
      setSession(session)
      setUser(session?.user as User | null)
      setLoading(false)
    }).catch(error => {
      console.error('AuthContext: Error getting session:', error)
      clearTimeout(timeoutId)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthContext: Auth state change:', { event: _event, session: !!session })
      clearTimeout(timeoutId)
      setSession(session)
      setUser(session?.user as User | null)
      setLoading(false)
    })

    return () => {
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [initialized])

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!supabase) {
      return { error: { message: 'Authentication not configured' } }
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Authentication not configured' } }
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    if (!supabase) {
      return { error: { message: 'Authentication not configured' } }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 