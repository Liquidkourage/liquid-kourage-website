// Schedule Calendar JavaScript with Google Calendar Integration
class ScheduleCalendar {
    constructor() {
        this.currentDate = new Date();
        this.events = [];
        this.isGoogleCalendarConnected = false;
        this.init();
    }

    init() {
        this.checkGoogleCalendarAuth();
        this.renderCalendar();
        this.bindEvents();
    }

    async checkGoogleCalendarAuth() {
        try {
            const response = await fetch('/api/calendar/auth-status');
            const data = await response.json();
            this.isGoogleCalendarConnected = data.authenticated;
            
            if (this.isGoogleCalendarConnected) {
                await this.loadGoogleCalendarEvents();
            } else {
                this.loadSampleEvents();
            }
        } catch (error) {
            console.log('Using sample events - Google Calendar not available');
            this.loadSampleEvents();
        }
    }

    async loadGoogleCalendarEvents() {
        try {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 2); // Next 2 months

            const response = await fetch(`/api/calendar/events?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
            
            if (response.ok) {
                const googleEvents = await response.json();
                this.events = googleEvents;
                console.log('Loaded Google Calendar events:', this.events.length);
            } else {
                console.log('Failed to load Google Calendar events, using sample data');
                this.loadSampleEvents();
            }
        } catch (error) {
            console.error('Error loading Google Calendar events:', error);
            this.loadSampleEvents();
        }
    }

    loadSampleEvents() {
        // Sample events data - fallback when Google Calendar is not connected
        this.events = [
            {
                id: 1,
                title: 'Weekly Trivia Night',
                date: new Date(2025, 0, 15),
                time: '7:00 PM',
                type: 'trivia',
                venue: 'Local Brewery',
                description: 'Join us for our weekly trivia night with prizes and great food!'
            },
            {
                id: 2,
                title: 'Karaoke Night',
                date: new Date(2025, 0, 18),
                time: '8:00 PM',
                type: 'karaoke',
                venue: 'Downtown Bar',
                description: 'Sing your heart out at our karaoke night!'
            },
            {
                id: 3,
                title: 'Wedding Reception',
                date: new Date(2025, 0, 25),
                time: '6:00 PM',
                type: 'wedding',
                venue: 'Garden Venue',
                description: 'Complete wedding entertainment package'
            },
            {
                id: 4,
                title: 'Corporate Trivia Event',
                date: new Date(2025, 1, 5),
                time: '12:00 PM',
                type: 'trivia',
                venue: 'Company Office',
                description: 'Team building trivia event for corporate clients'
            },
            {
                id: 5,
                title: 'DJ Party',
                date: new Date(2025, 1, 14),
                time: '9:00 PM',
                type: 'dj',
                venue: 'Event Hall',
                description: 'Valentine'\''s Day dance party with professional DJ'
            }
        ];
    }

    renderCalendar() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        
        const currentMonth = monthNames[this.currentDate.getMonth()];
        const currentYear = this.currentDate.getFullYear();
        
        document.getElementById('currentMonth').textContent = currentMonth + ' ' + currentYear;
        
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';
        
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 42; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (cellDate.getMonth() !== this.currentDate.getMonth()) {
                dayElement.classList.add('other-month');
            }
            
            if (cellDate.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            }
            
            dayElement.innerHTML = '<span class="day-number">' + cellDate.getDate() + '</span>';
            
            const dayEvents = this.getEventsForDate(cellDate);
            if (dayEvents.length > 0) {
                dayElement.classList.add('has-events');
                const eventsContainer = document.createElement('div');
                eventsContainer.className = 'day-events';
                
                dayEvents.forEach(event => {
                    const eventElement = document.createElement('div');
                    eventElement.className = 'event-dot ' + event.type;
                    eventElement.title = event.title;
                    eventElement.onclick = () => this.showEventModal(event);
                    eventsContainer.appendChild(eventElement);
                });
                
                dayElement.appendChild(eventsContainer);
            }
            
            calendarGrid.appendChild(dayElement);
        }

        // Update Google Calendar connection status
        this.updateConnectionStatus();
    }

    updateConnectionStatus() {
        const legend = document.querySelector('.schedule-legend');
        if (legend) {
            let statusElement = legend.querySelector('.google-calendar-status');
            if (!statusElement) {
                statusElement = document.createElement('div');
                statusElement.className = 'google-calendar-status';
                legend.appendChild(statusElement);
            }

            if (this.isGoogleCalendarConnected) {
                statusElement.innerHTML = `
                    <div style="background: #2ecc71; color: white; padding: 10px; border-radius: 8px; margin-top: 15px; text-align: center;">
                        <i class="fab fa-google"></i> Connected to Google Calendar
                    </div>
                `;
            } else {
                statusElement.innerHTML = `
                    <div style="background: #e74c3c; color: white; padding: 10px; border-radius: 8px; margin-top: 15px; text-align: center;">
                        <a href="/auth/google" style="color: white; text-decoration: none;">
                            <i class="fab fa-google"></i> Connect to Google Calendar
                        </a>
                    </div>
                `;
            }
        }
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === date.getDate() &&
                   eventDate.getMonth() === date.getMonth() &&
                   eventDate.getFullYear() === date.getFullYear();
        });
    }

    showEventModal(event) {
        const modal = document.getElementById('eventModal');
        const title = document.getElementById('eventTitle');
        const details = document.getElementById('eventDetails');
        
        title.textContent = event.title;
        details.innerHTML = 
            '<div class="event-detail-item">' +
                '<i class="fas fa-calendar"></i>' +
                '<span>' + event.date.toLocaleDateString() + '</span>' +
            '</div>' +
            '<div class="event-detail-item">' +
                '<i class="fas fa-clock"></i>' +
                '<span>' + event.time + '</span>' +
            '</div>' +
            '<div class="event-detail-item">' +
                '<i class="fas fa-map-marker-alt"></i>' +
                '<span>' + event.venue + '</span>' +
            '</div>' +
            '<div class="event-detail-item">' +
                '<i class="fas fa-info-circle"></i>' +
                '<span>' + event.description + '</span>' +
            '</div>';
        
        modal.style.display = 'block';
    }

    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('eventModal').style.display = 'none';
        });
        
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('eventModal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new ScheduleCalendar();
});

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}
