// Google Calendar Integration Service
const { google } = require('googleapis');
require('dotenv').config();

class GoogleCalendarService {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    }

    // Get authorization URL for OAuth flow
    getAuthUrl() {
        const scopes = [
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/calendar.events'
        ];

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent'
        });
    }

    // Exchange authorization code for tokens
    async getTokens(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            return tokens;
        } catch (error) {
            console.error('Error getting tokens:', error);
            throw error;
        }
    }

    // Set credentials from stored tokens
    setCredentials(tokens) {
        this.oauth2Client.setCredentials(tokens);
    }

    // Get events from Google Calendar
    async getEvents(timeMin, timeMax, calendarId = 'primary') {
        try {
            const response = await this.calendar.events.list({
                calendarId: calendarId,
                timeMin: timeMin,
                timeMax: timeMax,
                singleEvents: true,
                orderBy: 'startTime'
            });

            return response.data.items || [];
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    // Create a new event
    async createEvent(eventData) {
        try {
            const event = {
                summary: eventData.title,
                description: eventData.description,
                start: {
                    dateTime: eventData.startDateTime,
                    timeZone: 'America/Chicago'
                },
                end: {
                    dateTime: eventData.endDateTime,
                    timeZone: 'America/Chicago'
                },
                location: eventData.location || '',
                attendees: eventData.attendees || []
            };

            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                resource: event
            });

            return response.data;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    // Get busy times for availability checking
    async getBusyTimes(timeMin, timeMax) {
        try {
            const response = await this.calendar.freebusy.query({
                requestBody: {
                    timeMin: timeMin,
                    timeMax: timeMax,
                    items: [{ id: 'primary' }]
                }
            });

            return response.data.calendars.primary.busy || [];
        } catch (error) {
            console.error('Error fetching busy times:', error);
            throw error;
        }
    }
}

module.exports = GoogleCalendarService;
