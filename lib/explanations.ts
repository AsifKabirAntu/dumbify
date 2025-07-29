import { supabase } from './supabase'

export interface SavedExplanation {
  id?: string
  user_id: string
  code: string
  tone: 'baby' | 'sarcastic' | 'influencer' | 'professor'
  explanation: string
  created_at?: string
  updated_at?: string
}

export async function saveExplanation(data: Omit<SavedExplanation, 'id' | 'created_at' | 'updated_at'>) {
  if (!supabase) {
    console.warn('Supabase not configured, skipping save')
    return null
  }

  try {
    const { data: explanation, error } = await supabase
      .from('explanations')
      .insert([
        {
          user_id: data.user_id,
          code: data.code,
          tone: data.tone,
          explanation: data.explanation,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error saving explanation:', error)
      return null
    }

    return explanation
  } catch (error) {
    console.error('Error saving explanation:', error)
    return null
  }
}

export async function getUserExplanations(userId: string, limit = 50) {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  try {
    const { data: explanations, error } = await supabase
      .from('explanations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error loading explanations:', error)
      return []
    }

    return explanations || []
  } catch (error) {
    console.error('Error loading explanations:', error)
    return []
  }
}

export async function getLatestExplanation(userId: string) {
  if (!supabase) {
    console.warn('Supabase not configured, returning null')
    return null
  }

  try {
    const { data: explanation, error } = await supabase
      .from('explanations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // Don't log error if no explanations found
      if (error.code !== 'PGRST116') {
        console.error('Error loading latest explanation:', error)
      }
      return null
    }

    return explanation
  } catch (error) {
    console.error('Error loading latest explanation:', error)
    return null
  }
}

export async function deleteExplanation(id: string, userId: string) {
  if (!supabase) {
    console.warn('Supabase not configured, skipping delete')
    return false
  }

  try {
    const { error } = await supabase
      .from('explanations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId) // Ensure user can only delete their own explanations

    if (error) {
      console.error('Error deleting explanation:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting explanation:', error)
    return false
  }
} 