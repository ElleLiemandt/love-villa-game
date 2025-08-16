#!/usr/bin/env python3
"""
Love Villa Game - Local Server
Run this script to start the game server on localhost
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

def main():
    # Configuration - Try multiple ports to avoid conflicts
    PORTS_TO_TRY = [8000, 8001, 8002, 8003, 3000, 5000]
    DIRECTORY = Path(__file__).parent
    PORT = None
    
    print("🌹 Starting Love Villa Game Server 🌹")
    print(f"📁 Serving files from: {DIRECTORY}")
    
    # Change to the script directory
    os.chdir(DIRECTORY)
    
    # Create the server - try multiple ports
    Handler = http.server.SimpleHTTPRequestHandler
    
    for port_to_try in PORTS_TO_TRY:
        try:
            with socketserver.TCPServer(("", port_to_try), Handler) as httpd:
                PORT = port_to_try
                print(f"🌐 Server found available port: {PORT}")
                break
        except OSError as e:
            if "Address already in use" in str(e):
                print(f"⚠️ Port {port_to_try} in use, trying next...")
                continue
            else:
                raise e
    
    if PORT:
        try:
            with socketserver.TCPServer(("", PORT), Handler) as httpd:
                print(f"\n✨ Server started successfully! ✨")
                print(f"💖 Open your browser and go to: http://localhost:{PORT}")
                print("🔥 Press Ctrl+C to stop the server")
                
                # Automatically open the browser
                try:
                    webbrowser.open(f'http://localhost:{PORT}')
                    print("🚀 Browser should open automatically!")
                except Exception as e:
                    print(f"⚠️  Could not auto-open browser: {e}")
                    print(f"💡 Please manually open http://localhost:{PORT} in your browser")
                
                print("\n" + "="*50)
                print("💕 Love Villa Game is ready to play! 💕")
                print("="*50)
                
                # Start serving
                httpd.serve_forever()
                
        except KeyboardInterrupt:
            print("\n\n💔 Server stopped by user")
            print("👋 Thanks for playing Love Villa Game!")
            sys.exit(0)
        except OSError as e:
            print(f"❌ Server error: {e}")
            sys.exit(1)
    else:
        print("❌ All ports are in use! Please close other applications and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()