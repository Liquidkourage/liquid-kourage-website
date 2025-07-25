/**
 * Fetch testimonials from Google Apps Script and update the page
 */

class TestimonialsFetcher {
  constructor(webAppUrl) {
    this.webAppUrl = webAppUrl;
    this.testimonialsContainer = document.getElementById('testimonials-grid');
    console.log('TestimonialsFetcher constructor - container found:', !!this.testimonialsContainer);
    if (!this.testimonialsContainer) {
      console.error('❌ testimonials-grid container not found!');
    }
  }

  async fetchTestimonials() {
    try {
      console.log('Fetching testimonials from:', this.webAppUrl);
      const response = await fetch(this.webAppUrl);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const testimonials = await response.json();
      console.log('Fetched testimonials:', testimonials);
      return testimonials;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  }

  formatTestimonialHTML(testimonial, testimonialId = null) {
    const dynamicClass = testimonialId ? 'dynamic-testimonial' : '';
    const dataAttribute = testimonialId ? `data-testimonial-id="${testimonialId}"` : '';
    
    // Check if this testimonial should show the NEW badge
    const shouldShowNewBadge = testimonialId ? this.shouldShowNewBadge(testimonialId) : false;
    const newBadge = shouldShowNewBadge ? '<div class="new-badge">NEW</div>' : '';
    
    return `
      <div class="testimonial-card ${dynamicClass}" ${dataAttribute}>
        ${newBadge}
        <div class="testimonial-content">
          <p>"${this.escapeHtml(testimonial.review)}"</p>
          <div class="testimonial-author">
            <div class="author-info">
              <h4>${this.escapeHtml(testimonial.name)}</h4>
              <p>${testimonial.reviewTitle ? this.escapeHtml(testimonial.reviewTitle) : this.escapeHtml(testimonial.eventType)}</p>
              <span class="service-tag">${this.escapeHtml(testimonial.services)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Track when testimonials are first seen
  trackTestimonialSeen(testimonialId) {
    const storageKey = `testimonial_${testimonialId}_first_seen`;
    const now = Date.now();
    
    // Only set if not already tracked
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, now.toString());
    }
  }

  // Check if testimonial should show NEW badge (30 days from first seen)
  shouldShowNewBadge(testimonialId) {
    const storageKey = `testimonial_${testimonialId}_first_seen`;
    const firstSeen = localStorage.getItem(storageKey);
    
    if (!firstSeen) {
      // First time seeing this testimonial, track it and show badge
      this.trackTestimonialSeen(testimonialId);
      return true;
    }
    
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const timeSinceFirstSeen = Date.now() - parseInt(firstSeen);
    
    return timeSinceFirstSeen < thirtyDaysInMs;
  }

  async updateTestimonials() {
    console.log('Updating testimonials...');
    
    // Re-find the container in case it wasn't available when constructor ran
    if (!this.testimonialsContainer) {
      this.testimonialsContainer = document.getElementById('testimonials-grid');
      console.log('Re-finding container:', !!this.testimonialsContainer);
    }
    
    if (!this.testimonialsContainer) {
      console.error('❌ testimonials-grid container still not found!');
      return;
    }
    
    const testimonials = await this.fetchTestimonials();
    console.log('Testimonials to display:', testimonials.length);
    
    if (testimonials.length === 0) {
      console.log('No new testimonials found, keeping existing ones');
      return;
    }

    // Check if we've already added these testimonials
    const existingDynamicTestimonials = this.testimonialsContainer.querySelectorAll('.dynamic-testimonial');
    console.log('Existing dynamic testimonials:', existingDynamicTestimonials.length);
    
    // Only add new testimonials that aren't already there
    testimonials.forEach(testimonial => {
      // Create a unique identifier for this testimonial
      const testimonialId = `testimonial-${testimonial.timestamp}-${testimonial.name.replace(/\s+/g, '-')}`;
      
      // Check if this testimonial already exists
      const existingTestimonial = this.testimonialsContainer.querySelector(`[data-testimonial-id="${testimonialId}"]`);
      
      if (!existingTestimonial) {
        console.log('Adding new testimonial:', testimonial.name);
        const testimonialHTML = this.formatTestimonialHTML(testimonial, testimonialId);
        this.testimonialsContainer.insertAdjacentHTML('afterbegin', testimonialHTML);
      } else {
        console.log('Testimonial already exists:', testimonial.name);
      }
    });
  }

  // Auto-refresh testimonials every 5 minutes
  startAutoRefresh() {
    setInterval(() => {
      this.updateTestimonials();
    }, 5 * 60 * 1000); // 5 minutes
  }
}

// Usage example:
// Replace 'YOUR_WEBAPP_URL' with the URL from your deployed Google Apps Script
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Initializing testimonials fetcher');
  
  // Add a small delay to ensure DOM is fully ready
  setTimeout(() => {
    const webAppUrl = 'https://script.google.com/macros/s/AKfycby0xbcmHGMhQ9Il7C50TQVkczRHj4RHcfLrZ0nKZlJTaJMyziGurz7jRgZ6KZLjjdLT/exec';
    
    if (webAppUrl !== 'YOUR_WEBAPP_URL') {
      console.log('Creating TestimonialsFetcher with URL:', webAppUrl);
      const fetcher = new TestimonialsFetcher(webAppUrl);
      console.log('TestimonialsFetcher created, updating testimonials...');
      fetcher.updateTestimonials();
      fetcher.startAutoRefresh();
    } else {
      console.log('Web App URL not configured');
    }
  }, 100); // 100ms delay
}); 