# 🌾 KisanMitra - Soil Health Card Digitization & Advisory System

A hackathon-ready solution for digitizing physical Soil Health Cards (SHC) issued by the Government of India. Uses **Google Gemini 1.5 Flash** for fast, cost-effective AI analysis.

## 📋 Features

- **📸 OCR & Card Recognition**: Extracts farmer details and 12 soil parameters from card images
- **🧪 Soil Parameter Analysis**: 
  - Macro-nutrients (N, P, K)
  - Secondary nutrients (S)
  - Micro-nutrients (Zn, Fe, Cu, Mn, B)
  - Physical parameters (pH, EC, Organic Carbon)
- **🌱 AI-Powered Advisory**: Fertilizer recommendations, crop suggestions, organic alternatives
- **🎨 Beautiful UI**: Tailwind CSS with traffic light system (Red/Amber/Green status)
- **📱 Mobile Responsive**: Works seamlessly on phones (important for farmers)
- **🔊 Voice Output**: Read recommendations aloud using Web Speech API
- **🌐 Language Toggle**: English/Hindi support
- **🔐 Secure API Key Handling**: Flexible input methods (form, headers, environment variables)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Google Gemini API Key (free from [Google AI Studio](https://makersuite.google.com/app/apikey))

### 1️⃣ Backend Setup (Flask)

```bash
cd server
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create `.env` file:
```env
GEMINI_API_KEY=your_api_key_here
FLASK_ENV=development
FLASK_PORT=5000
```

Run the server:
```bash
python app.py
```

Server will be available at `http://localhost:5000`

### 2️⃣ Frontend Setup (React)

```bash
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add REACT_APP_BACKEND_URL=http://localhost:5000
```

Start the React app:
```bash
npm start
```

App will open at `http://localhost:3000`

---

## 📖 How It Works

### System Flow

```
1. User uploads Soil Health Card image
   ↓
2. Frontend sends image to Flask backend
   ↓
3. Gemini 1.5 Flash analyzes image using system prompt
   ↓
4. Backend extracts JSON: farmer details + 12 parameters
   ↓
5. Frontend displays results with:
   - Farmer information card
   - Parameter cards with progress bars
   - Color-coded status (Red/Amber/Green)
   - Agronomist advisory section
```

### API Endpoints

#### POST `/api/analyze`
Analyzes a Soil Health Card image.

**Request:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "image=@soil_card.jpg" \
  -F "api_key=your_gemini_api_key"
```

OR with header:
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "X-Gemini-API-Key: your_gemini_api_key" \
  -F "image=@soil_card.jpg"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "farmer_name": "Rajesh Kumar",
    "health_card_id": "SHC-2024-12345",
    "test_date": "2024-01-15",
    "parameters": {
      "N": { "value": 280, "unit": "kg/ha", "status": "Medium" },
      "P": { "value": 18, "unit": "kg/ha", "status": "Medium" },
      "K": { "value": 180, "unit": "kg/ha", "status": "Medium" },
      "pH": { "value": 7.2, "status": "Neutral" },
      "OC": { "value": 0.65, "unit": "%", "status": "Medium" }
    },
    "advisory": {
      "summary": "Your soil has good pH and balanced NPK. Focus on increasing organic matter.",
      "fertilizer_recommendation": [
        "Apply 100 kg Urea/ha",
        "Apply 50 kg DAP/ha",
        "Apply 40 kg MOP/ha"
      ],
      "organic_alternative": "Add 2 tons vermicompost/ha to improve soil structure",
      "crop_suggestion": "Wheat, Chickpea, or Mustard suitable for this season"
    }
  }
}
```

---

## 🎨 UI Components

### UploadBox.tsx
- Drag-and-drop zone for image upload
- File preview
- Loading state during analysis
- Supports: JPG, PNG, GIF, WebP

### ResultsDashboard.tsx
- **Farmer Details Card**: Name, ID, date, location
- **Parameter Cards**: Each shows:
  - Value with unit
  - Status badge (Red/Amber/Green)
  - Progress bar (Traffic Light System)
- **Advisory Section**:
  - Agronomist summary
  - Step-by-step fertilizer recommendations
  - Organic alternatives
  - Crop suggestions

### Color Scheme (Tailwind)
- Primary: `emerald-600` (Green)
- Secondary: `amber-500` (Yellow/Warning)
- Alert: `red-500` (Red/Danger)
- Background: Gradient from emerald-50 to amber-50

---

## 🔑 API Key Management

The system supports **3 ways** to provide API keys:

1. **Frontend Form Input** (Most User-Friendly)
   - User pastes key in UI
   - Sent securely to backend
   - Never exposed in URL

2. **Request Header**
   ```bash
   X-Gemini-API-Key: your_key_here
   ```

3. **Environment Variable**
   ```bash
   export GEMINI_API_KEY=your_key_here
   ```

---

## 🌾 Soil Parameter Reference

| Parameter | Unit | Low | Medium | High |
|-----------|------|-----|--------|------|
| N | kg/ha | <200 | 200-400 | >400 |
| P | kg/ha | <12 | 12-25 | >25 |
| K | kg/ha | <120 | 120-240 | >240 |
| pH | - | <6.5 | 6.5-7.5 | >7.5 |
| OC | % | <0.5 | 0.5-1.0 | >1.0 |
| EC | dS/m | <0.2 | 0.2-2.0 | >2.0 |
| S | mg/kg | <15 | 15-30 | >30 |
| Zn | mg/kg | <0.6 | 0.6-1.2 | >1.2 |
| Fe | mg/kg | <4 | 4-8 | >8 |
| Cu | mg/kg | <0.2 | 0.2-0.4 | >0.4 |
| Mn | mg/kg | <2 | 2-4 | >4 |
| B | mg/kg | <0.5 | 0.5-1.0 | >1.0 |

---

## 🎯 Hackathon Winning Features

### ✨ Traffic Light System
Visual indicators (🔴 Red/🟡 Amber/🟢 Green) make it accessible for semi-literate users.

### 🔊 Voice Output
Click "Play Advisory" to hear recommendations read aloud using Web Speech API.

### 🌐 Language Toggle
Switch between English and Hindi. Advisory text is requested in the target language from Gemini.

### 📱 Mobile-First Design
Fully responsive layout optimized for smartphones (farmer use case).

### 🎨 Beautiful Gradient UI
Earthy green and amber colors create trust and relevance to agriculture.

---

## 🛠️ Troubleshooting

### Issue: "Missing API Key" error
**Solution**: 
- Use frontend form to input key
- OR add to environment variable
- OR pass in request header

### Issue: Image not analyzed correctly
**Possible causes**:
- Image too small or blurry
- Text not clearly visible
- Regional language text recognition may need adjustment
- **Solution**: Ensure good lighting and clear image

### Issue: Backend not connecting
**Solution**: 
- Verify Flask is running on `http://localhost:5000`
- Check CORS settings in `app.py`
- Verify `.env` file exists with API key

### Issue: "Invalid API Key" error
**Solution**:
- Double-check API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Ensure no extra spaces in the key
- Key should start with `AIzaSy...`

---

## 📁 Project Structure

```
KisanMitra/
├── server/
│   ├── app.py                 # Flask backend with Gemini integration
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment template
│   └── venv/                  # Python virtual environment
│
├── client/
│   ├── src/
│   │   ├── App.tsx            # Main React component
│   │   ├── components/
│   │   │   ├── UploadBox.tsx  # Image upload component
│   │   │   └── ResultsDashboard.tsx  # Results display
│   │   ├── index.tsx          # React entry point
│   │   └── index.css          # Global styles (Tailwind)
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   ├── .env.example           # React env template
│   ├── tsconfig.json          # TypeScript config
│   └── tailwind.config.js     # Tailwind CSS config
│
└── README.md
```

---

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
# Push to Heroku
heroku create kisamitra-backend
git push heroku main

# Set env vars
heroku config:set GEMINI_API_KEY=your_key
```

### Frontend (Vercel)
```bash
# Deploy with Vercel
vercel --prod

# Set env vars in Vercel dashboard
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

---

## 📚 Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Soil Health Card Info](https://shc.nic.in/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Documentation](https://react.dev/)

---

## 🤝 Contributing

This is a hackathon project. Feel free to:
- Add support for more languages
- Improve OCR accuracy with additional system prompts
- Add integration with fertilizer pricing APIs
- Create mobile app version
- Add weather data integration

---

## 📄 License

Open source - use freely for educational and non-commercial purposes.

---

## 🌟 Questions?

- Check the troubleshooting section above
- Review the API endpoint examples
- Test with the provided sample images

**Good luck at the hackathon! 🚀**

