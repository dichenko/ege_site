export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ege9: {
        Row: {
          id: number
          text: string
          answer: number
        }
        Insert: {
          id?: number
          text: string
          answer: number
        }
        Update: {
          id?: number
          text?: string
          answer?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 