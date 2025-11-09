export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type MembershipRole = "admin" | "editor" | "member"

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          iframe_token: string | null
          form_schema: Json | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          subscription_price_id: string | null
          trial_ends_at: string | null
          auto_publish_high_rating: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          iframe_token?: string | null
          form_schema?: Json | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_price_id?: string | null
          trial_ends_at?: string | null
          auto_publish_high_rating?: boolean | null
          created_at?: string | null
        }
        Update: {
          name?: string
          slug?: string
          iframe_token?: string | null
          form_schema?: Json | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_price_id?: string | null
          trial_ends_at?: string | null
          auto_publish_high_rating?: boolean | null
          created_at?: string | null
        }
      }
      memberships: {
        Row: {
          id: string
          company_id: string
          user_id: string
          role: MembershipRole
          created_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          role?: MembershipRole
          created_at?: string | null
        }
        Update: {
          company_id?: string
          user_id?: string
          role?: MembershipRole
          created_at?: string | null
        }
      }
      forms: {
        Row: {
          id: string
          company_id: string
          slug: string
          created_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          slug: string
          created_at?: string | null
        }
        Update: {
          company_id?: string
          slug?: string
          created_at?: string | null
        }
      }
      responses: {
        Row: {
          id: string
          company_id: string
          form_id: string
          payload: Json
          created_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          form_id: string
          payload: Json
          created_at?: string | null
        }
        Update: {
          company_id?: string
          form_id?: string
          payload?: Json
          created_at?: string | null
        }
      }
      testimonials: {
        Row: {
          id: string
          company_id: string
          response_id: string
          is_public: boolean | null
          published_at: string | null
          ai_headline: string | null
          ai_body: string | null
          ai_bullets: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          response_id: string
          is_public?: boolean | null
          published_at?: string | null
          ai_headline?: string | null
          ai_body?: string | null
          ai_bullets?: string[] | null
          created_at?: string | null
        }
        Update: {
          company_id?: string
          response_id?: string
          is_public?: boolean | null
          published_at?: string | null
          ai_headline?: string | null
          ai_body?: string | null
          ai_bullets?: string[] | null
          created_at?: string | null
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          name?: string
          email?: string
          message?: string
          metadata?: Json | null
          created_at?: string | null
        }
      }
      lp_leads: {
        Row: {
          id: string
          email: string
          company: string
          created_at: string | null
        }
        Insert: {
          id?: string
          email: string
          company: string
          created_at?: string | null
        }
        Update: {
          email?: string
          company?: string
          created_at?: string | null
        }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
