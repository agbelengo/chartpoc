import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

// 1. The Interface: This is our 'Contract' with the DB
export interface Card {
  id?: string;
  user_id?: string;
  card_name: string;
  last_four: string;
  issuer: string;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  
  // This signal tracks if someone is logged in across the whole app
  currentUser = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    // Auto-track auth state (Day 1 logic)
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  // --- AUTH METHODS (From Day 1) ---
  async signIn(email: string) {
    return await this.supabase.auth.signInWithOtp({ email }); 
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }

  // --- CARD METHODS (Day 2 Logic) ---
  async getCards() {
    const { data, error } = await this.supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false }); // Show newest first
    
    if (error) throw error;
    return data as Card[];
  }

  async addCard(card: Card) {
    const user = this.currentUser();
    if (!user) throw new Error('Authentication required to add a card.');

    // We spread the card data and manually inject the user.id
    // This satisfies our RLS (Row Level Security) policy
    const { data, error } = await this.supabase
      .from('cards')
      .insert([{ ...card, user_id: user.id }])
      .select();

    if (error) throw error;
    return data;
  }
}