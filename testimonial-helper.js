/**
 * Testimonial Helper - Convert Google Form responses to HTML
 * This script helps you easily add new testimonials from Google Forms to your HTML
 */

class TestimonialHelper {
  constructor() {
    this.template = this.getTemplate();
  }

  // Get the HTML template for testimonials
  getTemplate() {
    return `
<div class="testimonial-card dynamic-testimonial" data-service="[SERVICES]" data-testimonial-id="testimonial-[TIMESTAMP]-[NAME]">
    <div class="new-badge">NEW</div>
    <div class="testimonial-content">
        <p>"[REVIEW_TEXT]"</p>
        <div class="testimonial-author">
            <div class="author-info">
                <h4>[CLIENT_NAME]</h4>
                <p>[EVENT_TYPE]</p>
                [SERVICE_TAGS]
            </div>
        </div>
    </div>
</div>`;
  }

  // Convert Google Form data to HTML
  generateTestimonialHTML(formData) {
    const timestamp = Date.now();
    const cleanName = formData.name.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');
    
    // Process services into data-service attribute and tags
    const services = this.processServices(formData.services);
    const serviceTags = this.generateServiceTags(formData.services);
    
    let html = this.template
      .replace('[SERVICES]', services.join(' '))
      .replace('[TIMESTAMP]', timestamp)
      .replace('[NAME]', cleanName)
      .replace('[REVIEW_TEXT]', this.escapeHtml(formData.review))
      .replace('[CLIENT_NAME]', this.escapeHtml(formData.name))
      .replace('[EVENT_TYPE]', this.escapeHtml(formData.eventType || 'Client'))
      .replace('[SERVICE_TAGS]', serviceTags);
    
    return html;
  }

  // Process services array into data-service format
  processServices(services) {
    if (Array.isArray(services)) {
      return services.map(service => service.toLowerCase().replace(/\s+/g, ''));
    }
    if (typeof services === 'string') {
      return services.split(',').map(service => service.trim().toLowerCase().replace(/\s+/g, ''));
    }
    return ['general'];
  }

  // Generate service tags HTML
  generateServiceTags(services) {
    if (Array.isArray(services)) {
      return services.map(service => `<span class="service-tag">${this.escapeHtml(service)}</span>`).join('');
    }
    if (typeof services === 'string') {
      return services.split(',').map(service => 
        `<span class="service-tag">${this.escapeHtml(service.trim())}</span>`
      ).join('');
    }
    return '<span class="service-tag">General</span>';
  }

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Generate the complete HTML snippet for copying
  generateHTMLSnippet(formData) {
    const testimonialHTML = this.generateTestimonialHTML(formData);
    
    return `
<!-- Add this testimonial to testimonials.html in the dynamic-testimonials-container section -->
${testimonialHTML}

<!-- Google Form Data for reference:
Name: ${formData.name}
Email: ${formData.email}
Services: ${Array.isArray(formData.services) ? formData.services.join(', ') : formData.services}
Event Type: ${formData.eventType || 'N/A'}
Review Title: ${formData.reviewTitle || 'N/A'}
Review: ${formData.review}
Timestamp: ${new Date().toISOString()}
-->`;
  }

  // Create a form for manual entry
  createManualEntryForm() {
    const formHTML = `
      <div style="background: #f8f9fa; padding: 2rem; border-radius: 8px; margin: 2rem 0;">
        <h3>Add New Testimonial</h3>
        <form id="manualTestimonialForm">
          <div style="margin-bottom: 1rem;">
            <label>Client Name:</label>
            <input type="text" id="clientName" required style="width: 100%; padding: 0.5rem;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label>Email:</label>
            <input type="email" id="clientEmail" style="width: 100%; padding: 0.5rem;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label>Services (comma-separated):</label>
            <input type="text" id="services" placeholder="trivia, karaoke, dj" style="width: 100%; padding: 0.5rem;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label>Event Type:</label>
            <input type="text" id="eventType" placeholder="Wedding, Corporate Event, etc." style="width: 100%; padding: 0.5rem;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label>Review Text:</label>
            <textarea id="reviewText" required style="width: 100%; padding: 0.5rem; height: 100px;"></textarea>
          </div>
          <button type="submit" style="background: #3498db; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">
            Generate HTML
          </button>
        </form>
        <div id="generatedHTML" style="margin-top: 1rem; display: none;">
          <h4>Generated HTML:</h4>
          <textarea id="htmlOutput" style="width: 100%; height: 200px; font-family: monospace;"></textarea>
          <button onclick="copyToClipboard()" style="background: #27ae60; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; margin-top: 0.5rem;">
            Copy to Clipboard
          </button>
        </div>
      </div>
    `;
    
    return formHTML;
  }
}

// Global helper instance
window.testimonialHelper = new TestimonialHelper();

// Copy to clipboard function
function copyToClipboard() {
  const textarea = document.getElementById('htmlOutput');
  textarea.select();
  document.execCommand('copy');
  alert('HTML copied to clipboard!');
}

// Handle manual form submission
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('manualTestimonialForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('clientName').value,
        email: document.getElementById('clientEmail').value,
        services: document.getElementById('services').value.split(',').map(s => s.trim()),
        eventType: document.getElementById('eventType').value,
        review: document.getElementById('reviewText').value
      };
      
      const htmlSnippet = window.testimonialHelper.generateHTMLSnippet(formData);
      document.getElementById('htmlOutput').value = htmlSnippet;
      document.getElementById('generatedHTML').style.display = 'block';
    });
  }
});

// Example usage with Google Form data
function processGoogleFormResponse(formResponse) {
  // Example: formResponse is the data from Google Forms
  const testimonialHTML = window.testimonialHelper.generateHTMLSnippet(formResponse);
  console.log('Generated HTML:', testimonialHTML);
  return testimonialHTML;
} 