import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class AuthComponent {
  private supabase = inject(SupabaseService);
  
  email = signal('');
  user = this.supabase.currentUser;
  cards = signal<any[]>([]); // Empty list for now

  updateEmail(event: Event) {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
  }

  async login() {
    if (!this.email()) return;
    try {
      await this.supabase.signIn(this.email());
      alert('Check your email for the magic link!');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  async logout() {
    await this.supabase.signOut();
  }
}
