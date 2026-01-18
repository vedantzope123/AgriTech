# 🔌 API Documentation - KisanMitra Backend

Complete guide to using the KisanMitra backend REST API.

---

## 🌐 Base URL

**Development:**
```
http://localhost:5000
```

**Production:**
```
https://kisamitra-backend.herokuapp.com
```

---

## 🔑 Authentication

### API Key Requirement

All requests to `/api/analyze` require a **Google Gemini API Key**. Provide it in one of three ways:

#### Option 1: Form Data (Recommended)
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "image=@card.jpg" \
  -F "api_key=AIzaSy_your_key_here"
```

#### Option 2: HTTP Header
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "X-Gemini-API-Key: AIzaSy_your_key_here" \
  -F "image=@card.jpg"
```

#### Option 3: Environment Variable
```bash
export GEMINI_API_KEY=AIzaSy_your_key_here
# Then no need to pass key in request
```

**Get API Key:** https://makersuite.google.com/app/apikey

---

## 📡 Endpoints

### 1. Health Check

**GET** `/api/health`

Simple endpoint to verify backend is running.

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "KisanMitra Backend"
}
```

---

### 2. Analyze Soil Health Card

**POST** `/api/analyze`

Main endpoint that analyzes a Soil Health Card image using Gemini AI.

#### Request

**Content-Type:** `multipart/form-data`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `image` | File | Yes | Image file (JPG, PNG, GIF, WebP). Max 10MB. |
| `api_key` | String | No* | Gemini API key. Optional if using header or env var. |

*If not provided in form data, must be in `X-Gemini-API-Key` header or `GEMINI_API_KEY` environment variable.

**Examples:**

##### Using curl
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "image=@soil_card.jpg" \
  -F "api_key=AIzaSy_your_key_here"
```

##### Using Python requests
```python
import requests

files = {'image': open('soil_card.jpg', 'rb')}
data = {'api_key': 'AIzaSy_your_key_here'}

response = requests.post(
    'http://localhost:5000/api/analyze',
    files=files,
    data=data
)

print(response.json())
```

##### Using JavaScript fetch
```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('api_key', 'AIzaSy_your_key_here');

const response = await fetch('http://localhost:5000/api/analyze', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "farmer_name": "Rajesh Kumar",
    "health_card_id": "SHC-2024-12345",
    "test_date": "2024-01-15",
    "village": "Rampur",
    "district": "Indore",
    "parameters": {
      "N": {
        "value": 280,
        "unit": "kg/ha",
        "status": "Medium"
      },
      "P": {
        "value": 18,
        "unit": "kg/ha",
        "status": "Medium"
      },
      "K": {
        "value": 180,
        "unit": "kg/ha",
        "status": "Medium"
      },
      "pH": {
        "value": 7.2,
        "status": "Neutral"
      },
      "EC": {
        "value": 0.8,
        "unit": "dS/m",
        "status": "Normal"
      },
      "OC": {
        "value": 0.65,
        "unit": "%",
        "status": "Medium"
      },
      "S": {
        "value": 22,
        "unit": "mg/kg",
        "status": "Medium"
      },
      "Zn": {
        "value": 0.8,
        "unit": "mg/kg",
        "status": "Medium"
      },
      "Fe": {
        "value": 6,
        "unit": "mg/kg",
        "status": "Medium"
      },
      "Cu": {
        "value": 0.3,
        "unit": "mg/kg",
        "status": "Medium"
      },
      "Mn": {
        "value": 3,
        "unit": "mg/kg",
        "status": "Medium"
      },
      "B": {
        "value": 0.7,
        "unit": "mg/kg",
        "status": "Medium"
      }
    },
    "advisory": {
      "summary": "Your soil has good pH balance and adequate NPK levels. Focus on improving organic matter content for better water retention and microbial activity.",
      "fertilizer_recommendation": [
        "Apply 100 kg Urea per hectare for optimal nitrogen",
        "Apply 50 kg DAP per hectare for phosphorus boost",
        "Apply 40 kg MOP per hectare for potassium",
        "Consider spray of 1% Zinc sulfate for micronutrient correction"
      ],
      "organic_alternative": "Add 2-3 tons of vermicompost per hectare to improve organic carbon from 0.65% to at least 1.0%. This will enhance water holding capacity and soil microbes.",
      "crop_suggestion": "For this season, Wheat, Chickpea, or Mustard are ideal crops. Avoid crops requiring high acidic soils."
    }
  }
}
```

**Error (400 - Missing API Key):**
```json
{
  "error": "Missing API Key",
  "message": "Please provide Gemini API key via form data, X-Gemini-API-Key header, or GEMINI_API_KEY environment variable"
}
```

**Error (400 - Invalid API Key):**
```json
{
  "error": "Invalid API Key",
  "message": "Failed to configure Gemini API. Check your API key."
}
```

**Error (400 - No Image):**
```json
{
  "error": "No image provided"
}
```

**Error (500 - Server Error):**
```json
{
  "error": "Server error",
  "message": "Detailed error message here"
}
```

---

## 📊 Response Schema

### Soil Parameter Object

```json
{
  "value": 280,           // Numeric value
  "unit": "kg/ha",        // Unit of measurement (optional)
  "status": "Medium"      // Status: Low/Medium/High/Neutral/Acidic/Alkaline
}
```

### Status Values

| Status | Meaning | Color |
|--------|---------|-------|
| **Low** | Deficient, needs intervention | 🔴 Red |
| **Medium** | Adequate, balanced | 🟡 Amber |
| **High** | Good, sufficient | 🟢 Green |
| **Acidic** | pH < 6.5 | 🔴 Red |
| **Neutral** | pH 6.5-7.5 | 🟢 Green |
| **Alkaline** | pH > 7.5 | 🔴 Red |
| **Normal** | EC 0.2-2.0 dS/m | 🟢 Green |

---

## 🖼️ Supported Image Formats

| Format | Extension | MIME Type | Recommended |
|--------|-----------|-----------|-------------|
| JPEG | .jpg, .jpeg | image/jpeg | ✅ Best |
| PNG | .png | image/png | ✅ Good |
| WebP | .webp | image/webp | ✅ Modern |
| GIF | .gif | image/gif | ⚠️ OK |

**Maximum file size:** 10 MB

---

## ⏱️ Response Times

- **Average:** 8-12 seconds
- **Fast images:** 5-8 seconds
- **Slow images:** 15-30 seconds (blurry/poor quality)

Factors affecting speed:
- Image clarity and size
- Network latency
- Gemini API server load
- Text complexity (handwritten is slower)

---

## 🛡️ Rate Limiting

The backend does NOT have built-in rate limiting. For production, implement:

```python
from flask_limiter import Limiter

limiter = Limiter(
    app=app,
    key_func=lambda: request.remote_addr,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/analyze', methods=['POST'])
@limiter.limit("5 per minute")
def analyze_soil_card():
    ...
```

---

## 🔒 CORS Configuration

The backend allows requests from:

- `http://localhost:3000` (development frontend)
- `http://localhost:5000` (same origin)

To allow additional origins, edit `app.py`:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "https://your-domain.com"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "X-Gemini-API-Key"]
    }
})
```

---

## 📚 Complete API Example

### Full JavaScript Client

```javascript
class KisanMitraAPI {
  constructor(baseURL = 'http://localhost:5000') {
    this.baseURL = baseURL;
    this.apiKey = null;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  async analyzeSoilCard(imageFile) {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('api_key', this.apiKey);

    const response = await fetch(`${this.baseURL}/api/analyze`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, browser will set it with boundary
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze image');
    }

    return await response.json();
  }

  async healthCheck() {
    const response = await fetch(`${this.baseURL}/api/health`);
    return await response.json();
  }
}

// Usage
const api = new KisanMitraAPI('http://localhost:5000');
api.setApiKey('AIzaSy_your_key_here');

// When user selects an image
document.getElementById('imageInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  try {
    const result = await api.analyzeSoilCard(file);
    console.log(result);
    displayResults(result.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
});
```

---

## 🚀 Production Deployment

### Environment Variables

Set these on your production server:

```bash
GEMINI_API_KEY=your_production_key
FLASK_ENV=production
FLASK_PORT=8000
FLASK_CORS_ORIGINS=https://your-frontend.com,https://api.your-domain.com
```

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .

ENV FLASK_ENV=production
ENV FLASK_PORT=8000

EXPOSE 8000

CMD ["python", "app.py"]
```

### Heroku Deployment

```bash
# Create Heroku app
heroku create kisamitra-backend

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
- Verify backend is running on correct port
- Check if frontend URL is in CORS origins
- Ensure no firewall blocking port 5000

### Issue: "Image processing takes > 30 seconds"
- Verify image is clear and readable
- Check network connection
- Try smaller image file size
- Check Gemini API status

### Issue: "API Key not working"
- Verify key starts with `AIzaSy...`
- Ensure no trailing spaces
- Check key hasn't been revoked
- Try creating a new key

### Issue: "Invalid JSON in response"
- Backend likely encountered an error
- Check error message in response
- Review `app.py` logs
- Verify image format is correct

---

## 📞 Support

- **Backend Logs:** Check `app.py` terminal output
- **API Status:** Call `/api/health` endpoint
- **Gemini Issues:** Check [Google AI Documentation](https://ai.google.dev/docs)

---

## 📋 API Changelog

### Version 1.0 (Current)
- ✅ POST /api/analyze - Image analysis
- ✅ GET /api/health - Health check
- ✅ Supports 12 soil parameters
- ✅ Flexible API key input
- ✅ CORS enabled

### Future Versions
- 🔮 Batch analysis endpoint
- 🔮 Rate limiting
- 🔮 Caching layer
- 🔮 Historical data tracking

---

**Built with ❤️ for Indian Farmers** 🌾

