const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Custom middleware to log requests
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${timestamp} - ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - Page Not Found</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    margin: 0;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }
                h1 { 
                    color: #fff; 
                    margin-bottom: 20px;
                    font-size: 3em;
                }
                p {
                    font-size: 1.2em;
                    margin-bottom: 30px;
                }
                a { 
                    color: #fff; 
                    text-decoration: none; 
                    background: rgba(255, 255, 255, 0.2);
                    padding: 12px 24px;
                    border-radius: 25px;
                    transition: all 0.3s ease;
                }
                a:hover { 
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/">Go back to homepage</a>
            </div>
        </body>
        </html>
    `);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>500 - Server Error</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px; 
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                    color: white;
                    margin: 0;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                }
                h1 { color: #fff; }
                a { color: #fff; text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>500 - Server Error</h1>
                <p>Something went wrong on our end.</p>
                <a href="/">Go back to homepage</a>
            </div>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
    console.log('🚀 Liquid Kourage Entertainment Website Server Started!');
    console.log(`📍 Server running at: http://0.0.0.0:${PORT}`);
    console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
    console.log('🔄 Server will auto-restart when files change (nodemon)');
    console.log('🛑 Press Ctrl+C to stop the server');
    console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Server terminated');
    process.exit(0);
}); 