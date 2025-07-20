# Running Liquid Kourage Entertainment Website on Localhost

## 🚀 Quick Start

### Option 1: Using the Batch File (Easiest)
1. Double-click `start-server.bat`
2. The website will be available at: **http://localhost:8000**
3. Press `Ctrl+C` to stop the server

### Option 2: Using PowerShell Directly
1. Open PowerShell in this directory
2. Run: `powershell -ExecutionPolicy Bypass -File "start-server.ps1"`
3. The website will be available at: **http://localhost:8000**
4. Press `Ctrl+C` to stop the server

### Option 3: Manual PowerShell Command
1. Open PowerShell in this directory
2. Run: `powershell -ExecutionPolicy Bypass -File "start-server.ps1"`
3. The website will be available at: **http://localhost:8000**

## 🌐 Accessing the Website

Once the server is running:
- **Homepage**: http://localhost:8000
- **About Page**: http://localhost:8000/about.html
- **Services Page**: http://localhost:8000/services.html
- **Portfolio Page**: http://localhost:8000/portfolio.html
- **Contact Page**: http://localhost:8000/contact.html

## 📝 Server Features

- **Port**: 8000 (can be changed in start-server.ps1)
- **Auto-refresh**: Changes to files will be visible on page refresh
- **404 Handling**: Custom 404 page for missing files
- **Logging**: Server logs all requests to the console
- **Content Types**: Proper MIME types for all file types

## 🔧 Troubleshooting

### If you get a permission error:
1. Right-click on `start-server.bat`
2. Select "Run as administrator"

### If port 8000 is already in use:
1. Edit `start-server.ps1`
2. Change `$port = 8000` to `$port = 8001` (or any other available port)
3. Restart the server

### If PowerShell execution policy is restricted:
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy RemoteSigned`
3. Try running the server again

## 🛑 Stopping the Server

- Press `Ctrl+C` in the terminal/command prompt
- Or close the terminal window

## 📁 Files Served

The server will serve all files in the current directory:
- HTML files (`.html`)
- CSS files (`.css`)
- JavaScript files (`.js`)
- Images (`.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`)
- And other common web file types

---

**Note**: This is a simple development server. For production deployment, use a proper web server like Apache, Nginx, or a cloud hosting service. 