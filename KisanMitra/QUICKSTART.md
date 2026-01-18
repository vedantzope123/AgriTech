# 🚀 QUICKSTART GUIDE - KisanMitra

Get the system running in **5 minutes**!

## Step 1: Get Your FREE Gemini API Key (2 minutes)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the key (starts with `AIzaSy...`)

---

## Step 2: Setup (Windows)

### Option A: Automatic Setup (Recommended)
```bash
setup.bat
```
This will automatically install everything.

### Option B: Manual Setup

**Backend:**
```bash
cd server
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt

# Create .env with your API key
echo GEMINI_API_KEY=your_key_here >> .env
echo FLASK_ENV=development >> .env
```

**Frontend:**
```bash
cd client
npm install
```

---

## Step 3: Run the Application

### Terminal 1 - Backend (Flask)
```bash
cd server
venv\Scripts\activate.bat
python app.py
```
✅ Backend running at `http://localhost:5000`

### Terminal 2 - Frontend (React)
```bash
cd client
npm start
```
✅ Frontend opens at `http://localhost:3000`

---

## Step 4: Test It

1. **Open** http://localhost:3000 in your browser
2. **Click** "Configure" and paste your Gemini API key (or use form field)
3. **Drag & drop** a Soil Health Card image
4. **Watch** the AI analyze it and show results! ✨

---

## 📸 Where to Get Test Images?

- Search for "Soil Health Card" on Google Images
- Look for official government SHC images
- Can be English, Hindi, or regional language

---

## 🎯 What to Expect

After uploading an image, you should see:
- ✅ Farmer name and card ID extracted
- ✅ 12 soil parameters with status indicators
- ✅ Color-coded traffic lights (🔴 Red/🟡 Amber/🟢 Green)
- ✅ AI-generated fertilizer recommendations
- ✅ Crop suggestions
- ✅ Play advisory aloud (Voice button)

---

## ⚠️ Common Issues

### "ModuleNotFoundError: No module named 'flask'"
```bash
cd server
pip install -r requirements.txt
```

### "npm: command not found"
Install Node.js from https://nodejs.org/

### "Invalid API Key"
- Check key starts with `AIzaSy...`
- No extra spaces
- Using fresh key? May take few seconds to activate

### Backend/Frontend not connecting
Ensure both are running:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

---

## 🎓 Next Steps

1. **Test with multiple cards** to see variations
2. **Try the language toggle** (English ↔ Hindi)
3. **Click "Play Advisory"** for voice output
4. **Customize colors** in `client/tailwind.config.js`
5. **Deploy** to production (Heroku, Vercel)

---

## 📞 Need Help?

- Backend issues? Check `server/app.py` logs
- Frontend issues? Check browser console (F12)
- API issues? Verify key in .env file

---

## 🌟 You're All Set!

The system is ready for the hackathon. Here's what makes it special:

✨ **Traffic Light System** - Easy for farmers to understand
✨ **Voice Output** - Read recommendations aloud
✨ **Multi-language** - English/Hindi support
✨ **Mobile Responsive** - Works on phones
✨ **Beautiful Design** - Green & earthy colors
✨ **Fast Processing** - Gemini 1.5 Flash is super quick!

**Good luck! 🚀**

