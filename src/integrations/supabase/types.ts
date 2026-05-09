export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_knowledge_base: {
        Row: {
          content: string
          created_at: string
          id: string
          topic: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          topic: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          topic?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          email: string | null
          id: number
          linkedin: string | null
          phone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          linkedin?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          linkedin?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          degree: string
          description: string | null
          end_date: string | null
          gpa: string | null
          id: string
          institution: string
          sort_order: number
          start_date: string | null
        }
        Insert: {
          degree: string
          description?: string | null
          end_date?: string | null
          gpa?: string | null
          id?: string
          institution: string
          sort_order?: number
          start_date?: string | null
        }
        Update: {
          degree?: string
          description?: string | null
          end_date?: string | null
          gpa?: string | null
          id?: string
          institution?: string
          sort_order?: number
          start_date?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          role: string
          sort_order: number
          start_date: string | null
        }
        Insert: {
          company: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          role: string
          sort_order?: number
          start_date?: string | null
        }
        Update: {
          company?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          role?: string
          sort_order?: number
          start_date?: string | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          created_at: string
          file_type: string | null
          filename: string
          id: string
          size_bytes: number | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string
          file_type?: string | null
          filename: string
          id?: string
          size_bytes?: number | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string
          file_type?: string | null
          filename?: string
          id?: string
          size_bytes?: number | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          avatar_url: string | null
          bio: string | null
          id: number
          location: string
          name: string
          title: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          id?: number
          location?: string
          name?: string
          title?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          id?: number
          location?: string
          name?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          created_at: string
          file_type: string | null
          filename: string
          id: string
          project_id: string
          size_bytes: number | null
          url: string
        }
        Insert: {
          created_at?: string
          file_type?: string | null
          filename: string
          id?: string
          project_id: string
          size_bytes?: number | null
          url: string
        }
        Update: {
          created_at?: string
          file_type?: string | null
          filename?: string
          id?: string
          project_id?: string
          size_bytes?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          caption: string | null
          id: string
          project_id: string
          sort_order: number
          url: string
        }
        Insert: {
          caption?: string | null
          id?: string
          project_id: string
          sort_order?: number
          url: string
        }
        Update: {
          caption?: string | null
          id?: string
          project_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          published: boolean
          qr_code: string | null
          slug: string | null
          software: string[] | null
          sort_order: number
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          published?: boolean
          qr_code?: string | null
          slug?: string | null
          software?: string[] | null
          sort_order?: number
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          published?: boolean
          qr_code?: string | null
          slug?: string | null
          software?: string[] | null
          sort_order?: number
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      sections: {
        Row: {
          content: string | null
          id: string
          key: string
          sort_order: number
          title: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          content?: string | null
          id?: string
          key: string
          sort_order?: number
          title?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          content?: string | null
          id?: string
          key?: string
          sort_order?: number
          title?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      services: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          level: number | null
          name: string
          sort_order: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          level?: number | null
          name: string
          sort_order?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          level?: number | null
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          id: string
          name: string
          quote: string
          role: string | null
          sort_order: number
        }
        Insert: {
          avatar_url?: string | null
          id?: string
          name: string
          quote: string
          role?: string | null
          sort_order?: number
        }
        Update: {
          avatar_url?: string | null
          id?: string
          name?: string
          quote?: string
          role?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
