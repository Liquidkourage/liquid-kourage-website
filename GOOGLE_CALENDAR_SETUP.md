# Google Calendar Integration Setup Guide

## � Quick Setup

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### 2. OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Choose "Web Application"
4. Add Authorized redirect URI: `http://localhost:3000/auth/google/callback`
5. Download the credentials JSON file

### 3. Environment Configuration
1. Copy the downloaded JSON file to your project root
2. Update the `.env` file with your credentials:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
   ```

### 4. Install Dependencies
```bash
npm install googleapis dotenv
```

### 5. Start the Server
```bash
node server.js
```

### 6. Connect Google Calendar
1. Visit: `http://localhost:3000/auth/google`
2. Authorize the application
3. You'll be redirected back and can now see real calendar events!

##  Features

###  What's Working
- **Real Google Calendar Integration** - View actual events from your Google Calendar
- **Fallback to Sample Data** - Shows sample events if Google Calendar isn't connected
- **Event Type Detection** - Automatically categorizes events (trivia, karaoke, DJ, wedding, private)
- **Interactive Calendar** - Click on events to see details
- **Responsive Design** - Works on all devices
- **Schedule Tab at Top** - Easy access to the calendar

###  How It Works
1. **Authentication**: OAuth 2.0 flow with Google
2. **Event Fetching**: Retrieves events from Google Calendar API
3. **Event Processing**: Transforms Google Calendar events to match your website format
4. **Fallback System**: Uses sample data if Google Calendar isn't connected
5. **Real-time Updates**: Calendar updates when you navigate months

###  Event Types & Colors
- **Trivia Night** (Red) - Events containing "trivia"
- **Karaoke** (Orange) - Events containing "karaoke"  
- **DJ Event** (Purple) - Events containing "dj" or "music"
- **Wedding** (Green) - Events containing "wedding"
- **Private Event** (Dark Gray) - All other events

##  Next Steps

### For Production
1. **Secure Token Storage**: Use a database instead of memory for user tokens
2. **Multiple Users**: Implement user authentication system
3. **Event Creation**: Add ability to create events from the website
4. **Calendar Sharing**: Allow multiple calendar sources
5. **Notifications**: Add email/SMS notifications for events

### Customization
- Modify event type detection in `google-calendar-service.js`
- Add more event categories and colors
- Customize the calendar appearance in `styles.css`
- Add event creation/editing functionality

##  Useful Links
- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

##  Troubleshooting

### Common Issues
1. **"Not authenticated" error**: Make sure you've completed the OAuth flow
2. **"Invalid redirect URI"**: Check that the redirect URI in Google Console matches your .env file exactly
3. **No events showing**: Verify your Google Calendar has events and the API is enabled
4. **CORS errors**: Make sure you're accessing via localhost:3000

### Getting Help
- Check the browser console for error messages
- Verify your .env file has the correct credentials
- Ensure the Google Calendar API is enabled in your project
- Make sure you're using the correct redirect URI
