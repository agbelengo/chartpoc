import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService, Card } from '../../services/supabase';

@Component({
  selector: 'app-card-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-manager.html',
  styleUrl: './card-manager.scss'
})
export class CardManagerComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private fb = inject(FormBuilder);

  cards = signal<Card[]>([]);
  loading = signal(false);

  cardForm = this.fb.nonNullable.group({
    card_name: ['', [Validators.required]],
    issuer: ['', [Validators.required]],
    last_four: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
  });

  constructor() {
    // Reload cards when user state changes
    effect(() => {
      const user = this.supabase.currentUser();
      if (user) {
        this.loadCards();
      } else {
        this.cards.set([]);
      }
    });
  }

  ngOnInit() {}

  async loadCards() {
    try {
      this.loading.set(true);
      const data = await this.supabase.getCards();
      this.cards.set(data);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit() {
    if (this.cardForm.invalid) return;

    try {
      const formValue = this.cardForm.getRawValue();
      const newCard = await this.supabase.addCard(formValue);
      
      // Update local state immediately
      if (newCard && newCard[0]) {
        this.cards.update(prev => [newCard[0], ...prev]);
      }
      
      this.cardForm.reset();
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Failed to add card. Make sure you are logged in.');
    }
  }
}
