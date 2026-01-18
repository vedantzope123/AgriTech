@echo off
REM KisanMitra Setup Script for Windows

echo 🌾 Setting up KisanMitra - Soil Health Card Digitization System
echo.

REM Backend Setup
echo 📦 Installing Backend Dependencies...
cd server
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt

REM Create .env file
if not exist .env (
  copy .env.example .env
  echo ⚠️  Created .env file. Please add your GEMINI_API_KEY
)

echo ✅ Backend setup complete!
echo.

REM Frontend Setup
echo 📦 Installing Frontend Dependencies...
cd ..\client
set NODE_ENV=development
call npm install

REM Create .env file
if not exist .env (
  copy .env.example .env
  echo ⚠️  Created .env file. Configure REACT_APP_BACKEND_URL
)

echo ✅ Frontend setup complete!
echo.

echo 🚀 Ready to run!
echo.
echo To start the backend:
echo   cd server
echo   venv\Scripts\activate.bat
echo   python app.py
echo.
echo To start the frontend:
echo   cd client
echo   npm start
echo.
