/**
 * Google Apps Script to pull testimonials from Google Sheets
 * and format them for the Liquid Kourage website
 */

function getTestimonialsFromSheet() {
  // Replace with your actual Google Sheet ID
  const SHEET_ID = '19kWrHvTTCq6zxN1j_TYU1bDhgMaTUS9j3SjAdokGyho';
  const SHEET_NAME = 'Form Responses 1'; // Default name for form responses
  
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // Columns: Timestamp, Name, Email, Services, Event Type, Review Title, Review, Permission
    const headers = data[0];
    const testimonials = [];
    
    // Skip header row, process each testimonial
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const testimonial = {
        timestamp: row[0],
        name: row[1] || 'Anonymous',
        email: row[2] || '',
        services: row[3] || 'General',
        eventType: row[4] || 'Event',
        reviewTitle: row[5] || '',
        review: row[6] || '',
        permission: row[7] || 'No',
        date: new Date(row[0]).toLocaleDateString()
      };
      
      // Only include testimonials with permission and actual reviews
      if (testimonial.permission.toLowerCase().includes('yes') && 
          testimonial.review && testimonial.review.trim() !== '') {
        testimonials.push(testimonial);
      }
    }
    
    return testimonials;
    
  } catch (error) {
    console.error('Error reading from Google Sheet:', error);
    return [];
  }
}

function formatTestimonialHTML(testimonial) {
  return `
    <div class="testimonial-card">
      <div class="testimonial-header">
        <h3>${testimonial.name}</h3>
        <span class="service-type">${testimonial.services}</span>
        <span class="event-type">${testimonial.eventType}</span>
      </div>
      ${testimonial.reviewTitle ? `<h4 class="review-title">${testimonial.reviewTitle}</h4>` : ''}
      <p class="testimonial-text">"${testimonial.review}"</p>
      <div class="testimonial-footer">
        <span class="date">${testimonial.date}</span>
      </div>
    </div>
  `;
}

function generateTestimonialsHTML() {
  const testimonials = getTestimonialsFromSheet();
  let html = '';
  
  testimonials.forEach(testimonial => {
    html += formatTestimonialHTML(testimonial);
  });
  
  return html;
}

function doGet() {
  // This function is required for Google Apps Script web apps
  // It will return the testimonials as JSON
  const testimonials = getTestimonialsFromSheet();
  
  return ContentService
    .createTextOutput(JSON.stringify(testimonials))
    .setMimeType(ContentService.MimeType.JSON);
}

function createWebhookEndpoint() {
  // This function can be deployed as a web app
  // It will return the testimonials as JSON
  const testimonials = getTestimonialsFromSheet();
  
  return ContentService
    .createTextOutput(JSON.stringify(testimonials))
    .setMimeType(ContentService.MimeType.JSON);
}

// Function to manually trigger updates
function updateTestimonials() {
  const testimonials = getTestimonialsFromSheet();
  console.log(`Found ${testimonials.length} testimonials`);
  
  // You can add logic here to automatically update your website
  // For example, send to a webhook or update a file
  
  return testimonials;
} 