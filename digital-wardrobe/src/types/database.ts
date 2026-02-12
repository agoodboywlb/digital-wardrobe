
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            items: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string
                    category: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories'
                    sub_category: string | null
                    image_url: string | null
                    brand: string | null
                    size: string | null
                    material: string | null
                    purchase_date: string | null
                    last_worn: string | null
                    status: 'in_wardrobe' | 'to_wash' | 'at_tailor' | 'dry_cleaning'
                    tags: string[] | null
                    price: number | null
                    cpw: number | null
                    wear_count: number | null
                    user_id: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name: string
                    category: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories'
                    sub_category?: string | null
                    image_url?: string | null
                    brand?: string | null
                    size?: string | null
                    material?: string | null
                    purchase_date?: string | null
                    last_worn?: string | null
                    status?: 'in_wardrobe' | 'to_wash' | 'at_tailor' | 'dry_cleaning'
                    tags?: string[] | null
                    price?: number | null
                    cpw?: number | null
                    wear_count?: number | null
                    user_id: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name?: string
                    category?: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories'
                    sub_category?: string | null
                    image_url?: string | null
                    brand?: string | null
                    size?: string | null
                    material?: string | null
                    purchase_date?: string | null
                    last_worn?: string | null
                    status?: 'in_wardrobe' | 'to_wash' | 'at_tailor' | 'dry_cleaning'
                    tags?: string[] | null
                    price?: number | null
                    cpw?: number | null
                    wear_count?: number | null
                    user_id?: string
                }
                Relationships: []
            }
            import_records: {
                Row: {
                    id: string
                    created_at: string
                    title: string
                    source: string
                    order_id: string | null
                    date: string | null
                    price: number | null
                    status: 'parsed' | 'parsing' | 'review_needed' | 'imported'
                    image_url: string | null
                    user_id: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    title: string
                    source: string
                    order_id?: string | null
                    date?: string | null
                    price?: number | null
                    status?: 'parsed' | 'parsing' | 'review_needed' | 'imported'
                    image_url?: string | null
                    user_id: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    title?: string
                    source?: string
                    order_id?: string | null
                    date?: string | null
                    price?: number | null
                    status?: 'parsed' | 'parsing' | 'review_needed' | 'imported'
                    image_url?: string | null
                    user_id?: string
                }
                Relationships: []
            }
            outfits: {
                Row: {
                    id: string
                    created_at: string
                    title: string
                    date: string | null
                    time: string | null
                    occasion: string | null
                    season: 'spring' | 'summer' | 'autumn' | 'winter' | null
                    status: 'planned' | 'completed'
                    user_id: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    title: string
                    date?: string | null
                    time?: string | null
                    occasion?: string | null
                    season?: 'spring' | 'summer' | 'autumn' | 'winter' | null
                    status?: 'planned' | 'completed'
                    user_id: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    title?: string
                    date?: string | null
                    time?: string | null
                    occasion?: string | null
                    season?: 'spring' | 'summer' | 'autumn' | 'winter' | null
                    status?: 'planned' | 'completed'
                    user_id?: string
                }
                Relationships: []
            }
            outfit_items: {
                Row: {
                    outfit_id: string
                    item_id: string
                    user_id: string
                }
                Insert: {
                    outfit_id: string
                    item_id: string
                    user_id: string
                }
                Update: {
                    outfit_id?: string
                    item_id?: string
                    user_id?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    id: string
                    updated_at: string | null
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    height: number | null
                    weight: number | null
                    chest: number | null
                    waist: number | null
                    hips: number | null
                    wechat_openid: string | null
                    bio: string | null
                }
                Insert: {
                    id: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    height?: number | null
                    weight?: number | null
                    chest?: number | null
                    waist?: number | null
                    hips?: number | null
                    wechat_openid?: string | null
                    bio?: string | null
                }
                Update: {
                    id?: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    height?: number | null
                    weight?: number | null
                    chest?: number | null
                    waist?: number | null
                    hips?: number | null
                    wechat_openid?: string | null
                    bio?: string | null
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
            category: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories'
            season: 'spring' | 'summer' | 'autumn' | 'winter'
            item_status: 'in_wardrobe' | 'to_wash' | 'at_tailor' | 'dry_cleaning'
            import_status: 'parsed' | 'parsing' | 'review_needed' | 'imported'
            outfit_status: 'planned' | 'completed'
        }
    }
}
