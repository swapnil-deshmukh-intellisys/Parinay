import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent {
  faqStates: Record<number, boolean> = {};

  toggleFaq(index: number): void {
    // Close all other FAQs when opening a new one
    if (!this.faqStates[index]) {
      this.faqStates = {};
    }
    this.faqStates[index] = !this.faqStates[index];
  }

  isFaqOpen(index: number): boolean {
    return !!this.faqStates[index];
  }
}