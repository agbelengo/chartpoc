import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  currentUser = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    // Auto-track auth state
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  async signIn(email: string) {
    return await this.supabase.auth.signInWithOtp({ email }); // "Magic Link" login
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }

  // Example of a Signal-ready data fetch
  async getCards() {
    const { data, error } = await this.supabase
      .from('cards')
      .select('*');
    return data;
  }
}