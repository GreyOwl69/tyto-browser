#!/bin/bash
echo "🧹 Clearing Electron and Node cache..."
rm -rf .erb/dll/*
rm -rf node_modules/.cache/
echo "✅ Cache cleared successfully"
echo "🚀 Starting the app..."
npm start
