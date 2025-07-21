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

  formatTestimonialHTML(testimonial) {
    return `
      <div class="testimonial-card">
        <div class="testimonial-header">
          <h3>${this.escapeHtml(testimonial.name)}</h3>
          <span class="service-type">${this.escapeHtml(testimonial.services)}</span>
          <span class="event-type">${this.escapeHtml(testimonial.eventType)}</span>
        </div>
        ${testimonial.reviewTitle ? `<h4 class="review-title">${this.escapeHtml(testimonial.reviewTitle)}</h4>` : ''}
        <p class="testimonial-text">"${this.escapeHtml(testimonial.review)}"</p>
        <div class="testimonial-footer">
          <span class="date">${testimonial.date}</span>
        </div>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
      console.log('No testimonials found, showing empty state');
      this.testimonialsContainer.innerHTML = `
        <div class="no-testimonials">
          <p>No testimonials available at the moment.</p>
          <p>Be the first to leave a review!</p>
        </div>
      `;
      return;
    }

    let html = '';
    testimonials.forEach(testimonial => {
      html += this.formatTestimonialHTML(testimonial);
    });

    console.log('Generated HTML:', html);
    this.testimonialsContainer.innerHTML = html;
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