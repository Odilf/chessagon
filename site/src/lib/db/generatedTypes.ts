export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      live_games: {
        Row: {
          acceptant_id: string | null
          challenger_color: number | null
          challenger_id: string
          created_at: string
          id: string
          tc_increment: number | null
          tc_minutes: number | null
        }
        Insert: {
          acceptant_id?: string | null
          challenger_color?: number | null
          challenger_id: string
          created_at?: string
          id?: string
          tc_increment?: number | null
          tc_minutes?: number | null
        }
        Update: {
          acceptant_id?: string | null
          challenger_color?: number | null
          challenger_id?: string
          created_at?: string
          id?: string
          tc_increment?: number | null
          tc_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "live_games_acceptant_id_fkey"
            columns: ["acceptant_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_games_challenger_id_fkey"
            columns: ["challenger_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      live_moves: {
        Row: {
          created_at: string
          game: string | null
          id: number
          origin_x: number
          origin_y: number
          target_x: number
          target_y: number
        }
        Insert: {
          created_at?: string
          game?: string | null
          id?: number
          origin_x: number
          origin_y: number
          target_x: number
          target_y: number
        }
        Update: {
          created_at?: string
          game?: string | null
          id?: number
          origin_x?: number
          origin_y?: number
          target_x?: number
          target_y?: number
        }
        Relationships: [
          {
            foreignKeyName: "live_moves_game_fkey"
            columns: ["game"]
            referencedRelation: "live_games"
            referencedColumns: ["id"]
          }
        ]
      }
      moves: {
        Row: {
          id: number
          origin_x: number | null
          origin_y: number | null
          target_x: number | null
          target_y: number | null
          time_remaining: number
        }
        Insert: {
          id?: number
          origin_x?: number | null
          origin_y?: number | null
          target_x?: number | null
          target_y?: number | null
          time_remaining: number
        }
        Update: {
          id?: number
          origin_x?: number | null
          origin_y?: number | null
          target_x?: number | null
          target_y?: number | null
          time_remaining?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          rating: number
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          rating?: number
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

