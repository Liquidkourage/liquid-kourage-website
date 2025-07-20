# Liquid Kourage Entertainment Website - Nodemon Setup

This setup provides automatic server restart functionality using nodemon, which will restart the server whenever files change or if the server crashes.

## Prerequisites

You need to install Node.js first:

1. **Download Node.js**: Go to [https://nodejs.org/](https://nodejs.org/)
2. **Install Node.js**: Download the LTS version and run the installer
3. **Verify Installation**: Open a terminal and run:
   ```bash
   node --version
   npm --version
   ```

## Quick Start

### Option 1: Using the Batch File (Windows)
```bash
start-server-nodemon.bat
```

### Option 2: Using PowerShell Script
```powershell
.\start-server-nodemon.ps1
```

### Option 3: Manual Setup
```bash
# Install dependencies (first time only)
npm install

# Start the server with nodemon
npm run dev
```

## What Nodemon Does

- **Auto-restart on file changes**: When you save any HTML, CSS, JS, or image file, the server automatically restarts
- **Auto-restart on crashes**: If the server crashes, nodemon automatically restarts it
- **File watching**: Monitors all relevant file types (html, css, js, png, jpg, etc.)
- **Development-friendly**: Provides clear console output and error messages

## Available Commands

```bash
# Start development server with auto-restart
npm run dev

# Start production server (no auto-restart)
npm start

# Start server with custom nodemon settings
npm run server
```

## Configuration

The nodemon configuration is in `nodemon.json`:

- **Watched files**: HTML, CSS, JS, images, and JSON files
- **Ignored directories**: node_modules, .git, log files
- **Restart delay**: 1 second to prevent excessive restarts
- **Verbose output**: Shows detailed restart information

## Server Features

- **Static file serving**: Serves all your website files
- **Request logging**: Shows all incoming requests with timestamps
- **Error handling**: Beautiful 404 and 500 error pages
- **Graceful shutdown**: Properly closes connections when stopping

## Troubleshooting

### Node.js not found
- Install Node.js from [https://nodejs.org/](https://nodejs.org/)
- Restart your terminal after installation

### Port already in use
- The server uses port 8000 by default
- If the port is busy, change the PORT in `server.js` or set the PORT environment variable

### Dependencies not installed
- Run `npm install` to install required packages

### Server won't start
- Check the console for error messages
- Ensure all files are in the correct directory
- Verify Node.js and npm are properly installed

## File Structure

```
liquid-kourage-website/
├── package.json          # Node.js project configuration
├── server.js             # Express server with nodemon support
├── nodemon.json          # Nodemon configuration
├── start-server-nodemon.bat    # Windows batch file
├── start-server-nodemon.ps1    # PowerShell script
├── index.html            # Your website files
├── styles.css
├── script.js
├── logo.png
└── ... (other website files)
```

## Benefits of This Setup

1. **Automatic restarts**: No need to manually restart the server
2. **Development efficiency**: See changes immediately
3. **Crash recovery**: Server automatically recovers from errors
4. **Professional logging**: Clear console output for debugging
5. **Cross-platform**: Works on Windows, Mac, and Linux

## Next Steps

1. Install Node.js if you haven't already
2. Run one of the start scripts above
3. Open http://localhost:8000 in your browser
4. Make changes to your files and watch the server auto-restart!

The server will now automatically restart whenever you save changes to any of your website files, making development much more efficient! 