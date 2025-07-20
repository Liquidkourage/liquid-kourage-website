// Testimonials Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter testimonials
            testimonialCards.forEach(card => {
                const services = card.getAttribute('data-service').split(' ');
                
                if (filter === 'all' || services.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Review form submission
    const reviewForm = document.getElementById('reviewForm');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            // Get all selected services
            const selectedServices = formData.getAll('serviceType');
            
            const reviewData = {
                name: formData.get('reviewerName'),
                email: formData.get('reviewerEmail'),
                service: selectedServices.join(' '), // Join multiple services with space
                services: selectedServices, // Keep as array for flexibility
                eventType: formData.get('eventType'),
                rating: formData.get('rating'),
                title: formData.get('reviewTitle'),
                review: formData.get('reviewText'),
                permission: formData.get('permission')
            };
            
            // Validate form
            if (!validateReviewForm(reviewData)) {
                return;
            }
            
            // Submit review (you can modify this to send to your backend)
            submitReview(reviewData);
        });
    }


});

// Form validation
function validateReviewForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.service || data.service.trim() === '') {
        errors.push('Please select at least one service');
    }
    

    
    if (!data.title || data.title.trim().length < 5) {
        errors.push('Please enter a review title (at least 5 characters)');
    }
    
    if (!data.review || data.review.trim().length < 20) {
        errors.push('Please enter a detailed review (at least 20 characters)');
    }
    
    if (!data.permission) {
        errors.push('Please give permission to display your review');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Submit review function
function submitReview(reviewData) {
    // Show loading state
    const submitButton = document.querySelector('#reviewForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Simulate API call (replace with actual backend submission)
    setTimeout(() => {
        // Success response
        showNotification('Thank you for your review! We will review and publish it soon.', 'success');
        
        // Reset form
        document.getElementById('reviewForm').reset();
        

        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Store review in localStorage for demo purposes
        storeReview(reviewData);
        
    }, 2000);
}

// Store review in localStorage (for demo purposes)
function storeReview(reviewData) {
    let reviews = JSON.parse(localStorage.getItem('liquidKourageReviews') || '[]');
    reviewData.id = Date.now();
    reviewData.date = new Date().toISOString();
    reviews.push(reviewData);
    localStorage.setItem('liquidKourageReviews', JSON.stringify(reviews));
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;
document.head.appendChild(style);

// Load and display stored reviews (for demo purposes)
function loadStoredReviews() {
    const reviews = JSON.parse(localStorage.getItem('liquidKourageReviews') || '[]');
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    
    if (reviews.length > 0 && testimonialsGrid) {
        reviews.forEach(review => {
            const reviewCard = createReviewCard(review);
            testimonialsGrid.appendChild(reviewCard);
        });
    }
}

// Create review card element
function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-service', review.service);
    
    // Create service tags for multiple services
    const serviceTags = review.services ? 
        review.services.map(service => `<span class="service-tag">${service}</span>`).join('') :
        `<span class="service-tag">${review.service}</span>`;
    
    card.innerHTML = `
        <div class="testimonial-content">
            <p>"${review.review}"</p>
            <div class="testimonial-author">
                <div class="author-info">
                    <h4>${review.name}</h4>
                    <p>${review.eventType || 'Client'}</p>
                    ${serviceTags}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Load stored reviews when page loads
document.addEventListener('DOMContentLoaded', loadStoredReviews); 