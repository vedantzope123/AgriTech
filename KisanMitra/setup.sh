#!/bin/bash

# KisanMitra Setup Script for Linux/macOS

echo "🌾 Setting up KisanMitra - Soil Health Card Digitization System"
echo ""

# Backend Setup
echo "📦 Installing Backend Dependencies..."
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  Created .env file. Please add your GEMINI_API_KEY"
fi

echo "✅ Backend setup complete!"
echo ""

# Frontend Setup
echo "📦 Installing Frontend Dependencies..."
cd ../client
npm install

# Create .env file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  Created .env file. Configure REACT_APP_BACKEND_URL"
fi

echo "✅ Frontend setup complete!"
echo ""

echo "🚀 Ready to run!"
echo ""
echo "To start the backend:"
echo "  cd server"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""
echo "To start the frontend:"
echo "  cd client"
echo "  npm start"
echo ""
