/**
 * Fetch testimonials from Google Apps Script and update the page
 */

class TestimonialsFetcher {
  constructor(webAppUrl) {
    this.webAppUrl = webAppUrl;
    this.testimonialsContainer = document.getElementById('testimonials-grid');
  }

  async fetchTestimonials() {
    try {
      const response = await fetch(this.webAppUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const testimonials = await response.json();
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
    const testimonials = await this.fetchTestimonials();
    
    if (testimonials.length === 0) {
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
  const webAppUrl = 'https://script.google.com/macros/s/AKfycby0xbcmHGMhQ9Il7C50TQVkczRHj4RHcfLrZ0nKZlJTaJMyziGurz7jRgZ6KZLjjdLT/exec';
  
  if (webAppUrl !== 'YOUR_WEBAPP_URL') {
    const fetcher = new TestimonialsFetcher(webAppUrl);
    fetcher.updateTestimonials();
    fetcher.startAutoRefresh();
  }
}); 