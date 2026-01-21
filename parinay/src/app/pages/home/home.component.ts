import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentSuccessStoriesComponent } from '../../components/recent-success-stories/recent-success-stories.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Featured profiles data - enhanced with more details
  featuredProfiles = [
    {
      name: 'Priya, 28',
      details: 'Software Engineer | Bangalore',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
      religion: 'Hindu',
      caste: 'Brahmin',
      education: 'MBA'
    },
    {
      name: 'Rahul, 32',
      details: 'Doctor | Mumbai',
      image: 'https://randomuser.me/api/portraits/men/44.jpg',
      religion: 'Hindu',
      caste: 'Maratha',
      education: 'MD'
    },
    {
      name: 'Neha, 26',
      details: 'Architect | Delhi',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      religion: 'Hindu',
      caste: 'Punjabi',
      education: 'B.Arch'
    },
    {
      name: 'Amit, 30',
      details: 'Entrepreneur | Hyderabad',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      religion: 'Hindu',
      caste: 'Gujarati',
      education: 'MBA'
    },
    {
      name: 'Sara, 27',
      details: 'Content Writer | Kolkata',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
      religion: 'Muslim',
      caste: '',
      education: 'MA English'
    },
    {
      name: 'Arjun, 31',
      details: 'Chartered Accountant | Chennai',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      religion: 'Hindu',
      caste: 'Tamil',
      education: 'CA'
    }
  ];

  // Success stories data - enhanced with more details
  successStories = [
    {
      id: 1,
      name1: 'Raj',
      name2: 'Simran',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
      location: 'Mumbai',
      year: 2024,
      story: 'Met on Parinay and married within 8 months',
      quote: '"The compatibility matching was spot on!"'
    },
    {
      id: 2,
      name1: 'Aman',
      name2: 'Priya',
      photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      location: 'Delhi',
      year: 2023,
      story: 'Found each other after years of searching',
      quote: '"We knew instantly this was it!"'
    },
    {
      id: 3,
      name1: 'Kabir',
      name2: 'Ananya',
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      location: 'Bangalore',
      year: 2022,
      story: 'Connected through Parinay\'s smart matching',
      quote: '"The verification process gave us confidence"'
    },
    {
      id: 4,
      name1: 'Ravi',
      name2: 'Pooja',
      photoUrl: 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      location: 'Hyderabad',
      year: 2024,
      story: 'Engaged within 3 months of meeting',
      quote: '"We\'re getting married thanks to Parinay!"'
    }
  ];

  totalMatches = 12500;
  activeTestimonialIndex = 0;
  carouselInterval: any;

  ngOnInit(): void {
    // Animate match counter
    const interval = setInterval(() => {
      if (this.totalMatches < 12650) {
        this.totalMatches += 10;
      } else {
        clearInterval(interval);
      }
    }, 50);

    // Auto-rotate testimonials
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  nextTestimonial(): void {
    this.activeTestimonialIndex = 
      (this.activeTestimonialIndex + 1) % this.successStories.length;
  }

  prevTestimonial(): void {
    this.activeTestimonialIndex = 
      (this.activeTestimonialIndex - 1 + this.successStories.length) % this.successStories.length;
  }

  goToTestimonial(index: number): void {
    this.activeTestimonialIndex = index;
    // Reset the carousel timer when manually navigating
    clearInterval(this.carouselInterval);
    this.startCarousel();
  }

  // Scroll the featured profile container
  scrollProfiles(direction: 'left' | 'right'): void {
    const container = document.getElementById('profileCarousel');
    if (!container) return;

    const scrollAmount = 350; // Matches the card width + gap
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  // For mobile touch support
  handleTouchStart(e: TouchEvent): void {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  handleTouchEnd(e: TouchEvent): void {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private touchStartX = 0;
  private touchEndX = 0;

  private handleSwipe(): void {
    const difference = this.touchStartX - this.touchEndX;
    if (Math.abs(difference) > 50) { // Minimum swipe distance
      if (difference > 0) {
        this.scrollProfiles('right');
      } else {
        this.scrollProfiles('left');
      }
    }
  }
}