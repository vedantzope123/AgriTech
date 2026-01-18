from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from dotenv import load_dotenv
import logging

# Gemini import is lazy-loaded only when actually needed
GEMINI_AVAILABLE = False
genai = None

# Load environment variables
load_dotenv()

# Initialize Flask
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:5000"]}})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# System Prompt for Gemini Agent
SYSTEM_PROMPT = """# System Instruction for Gemini Agent
Role: You are an expert Agricultural Scientist and OCR Specialist tailored for the Indian farming ecosystem. Your task is to process images of "Soil Health Cards" (SHC) issued by the Government of India and provide actionable advice.

Input: An image of a physical Soil Health Card (often containing tables, handwritten text, or regional languages like Hindi/Tamil/Marathi).

Capabilities & Tasks:
1. OCR & Extraction: Accurately extract the farmer's details and the 12 key soil parameters:
   - Macro-nutrients: Nitrogen (N), Phosphorus (P), Potassium (K)
   - Secondary-nutrients: Sulphur (S)
   - Micro-nutrients: Zinc (Zn), Iron (Fe), Copper (Cu), Manganese (Mn), Boron (B)
   - Physical parameters: pH, Electrical Conductivity (EC), Organic Carbon (OC)

2. Analysis & Advisory:
   - Compare extracted values against standard "Critical Levels" for Indian soil.
   - Flag parameters that are "Low" (Deficient) or "High" (Toxic).
   - Recommend specific fertilizer dosages (Urea, DAP, MOP) based on the deficiencies.
   - Suggest one "Organic Alternative" (e.g., Vermicompost, Green Manure) to improve Soil Organic Carbon.

3. Output Format: You must strictly return a valid JSON object. Do not include markdown formatting (like ```json) in the response, just the raw JSON.

Critical Levels for Indian Soil (Reference):
- N: <200 kg/ha = Low, 200-400 = Medium, >400 = High
- P: <12 kg/ha = Low, 12-25 = Medium, >25 = High
- K: <120 kg/ha = Low, 120-240 = Medium, >240 = High
- pH: <6.5 = Acidic, 6.5-7.5 = Neutral, >7.5 = Alkaline
- OC: <0.5% = Low, 0.5-1.0% = Medium, >1.0% = High
- EC: <0.2 dS/m = Low, 0.2-2.0 = Normal, >2.0 = High (Saline)
- S: <15 mg/kg = Low, 15-30 = Medium, >30 = High
- Zn: <0.6 mg/kg = Low, 0.6-1.2 = Medium, >1.2 = High
- Fe: <4 mg/kg = Low, 4-8 = Medium, >8 = High
- Cu: <0.2 mg/kg = Low, 0.2-0.4 = Medium, >0.4 = High
- Mn: <2 mg/kg = Low, 2-4 = Medium, >4 = High
- B: <0.5 mg/kg = Low, 0.5-1.0 = Medium, >1.0 = High

Return this JSON structure:
{
  "farmer_name": "String or 'Unknown'",
  "health_card_id": "String or 'Unknown'",
  "test_date": "YYYY-MM-DD or 'Unknown'",
  "village": "String or 'Unknown'",
  "district": "String or 'Unknown'",
  "parameters": {
    "N": { "value": Number, "unit": "kg/ha", "status": "Low/Medium/High" },
    "P": { "value": Number, "unit": "kg/ha", "status": "Low/Medium/High" },
    "K": { "value": Number, "unit": "kg/ha", "status": "Low/Medium/High" },
    "pH": { "value": Number, "status": "Acidic/Neutral/Alkaline" },
    "EC": { "value": Number, "unit": "dS/m", "status": "Low/Normal/High" },
    "OC": { "value": Number, "unit": "%", "status": "Low/Medium/High" },
    "S": { "value": Number, "unit": "mg/kg", "status": "Low/Medium/High" },
    "Zn": { "value": Number, "unit": "mg/kg", "status": "Low/Medium/High" },
    "Fe": { "value": Number, "unit": "mg/kg", "status": "Low/Medium/High" },
    "Cu": { "value": Number, "unit": "mg/kg", "status": "Low/Medium/High" },
    "Mn": { "value": Number, "unit": "mg/kg", "status": "Low/Medium/High" },
    "B": { "value": Number, "unit": "mg/kg", "status": "Low/Medium/High" }
  },
  "advisory": {
    "summary": "2-sentence summary of soil health in simple Indian English.",
    "fertilizer_recommendation": ["Step 1: Apply X kg Urea...", "Step 2: Apply Y kg DAP...", "Step 3: Apply Z kg MOP..."],
    "organic_alternative": "Suggestion like Vermicompost (2 tons/ha) to improve OC and NPK.",
    "crop_suggestion": "Recommended crops for this soil type and season."
  }
}
"""


def configure_gemini_api(api_key):
    """Configure Gemini API with provided API key - Lazy loaded"""
    global genai, GEMINI_AVAILABLE
    try:
        if not GEMINI_AVAILABLE:
            import google.generativeai as genai_import
            genai = genai_import
            GEMINI_AVAILABLE = True
        
        genai.configure(api_key=api_key)
        return True
    except Exception as e:
        logger.error(f"Error configuring Gemini API: {str(e)}")
        return False


def extract_json_from_response(response_text):
    """Extract and parse JSON from Gemini response"""
    try:
        # Try to find JSON in the response
        if "{" in response_text and "}" in response_text:
            start_idx = response_text.find("{")
            end_idx = response_text.rfind("}") + 1
            json_str = response_text[start_idx:end_idx]
            return json.loads(json_str)
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {str(e)}")
        return None
    return None


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "KisanMitra Backend"}), 200


@app.route('/api/analyze', methods=['POST'])
def analyze_soil_card():
    """
    Main endpoint for analyzing Soil Health Card images
    Expects: 
    - image file (multipart/form-data)
    - api_key (optional, can be in header or env)
    """
    try:
        if not GEMINI_AVAILABLE:
            return jsonify({
                "error": "Gemini API not available",
                "message": "Google Generativeai library is not installed or not compatible. Please provide a valid Gemini API key and environment.",
                "status": "warning"
            }), 503
        
        # Get API key from request, environment, or use default
        api_key = request.form.get('api_key') or request.headers.get('X-Gemini-API-Key') or os.getenv('GEMINI_API_KEY')
        
        if not api_key or api_key == 'sk-test-key-placeholder':
            return jsonify({
                "error": "Missing or Invalid API Key",
                "message": "Please provide a valid Gemini API key from https://makersuite.google.com/app/apikey via form data, X-Gemini-API-Key header, or GEMINI_API_KEY environment variable",
                "setup_guide": "1. Get API key from https://makersuite.google.com/app/apikey\n2. Paste in the form or set GEMINI_API_KEY environment variable"
            }), 400
        
        # Configure Gemini with the provided API key
        if not configure_gemini_api(api_key):
            return jsonify({
                "error": "Invalid API Key",
                "message": "Failed to configure Gemini API. Check your API key at https://makersuite.google.com/app/apikey"
            }), 400
        
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
        
        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Read image data
        image_data = image_file.read()
        if not image_data:
            return jsonify({"error": "Failed to read image"}), 400
        
        # Determine MIME type based on file extension
        filename = image_file.filename.lower()
        if filename.endswith('.png'):
            mime_type = "image/png"
        elif filename.endswith('.jpg') or filename.endswith('.jpeg'):
            mime_type = "image/jpeg"
        elif filename.endswith('.gif'):
            mime_type = "image/gif"
        elif filename.endswith('.webp'):
            mime_type = "image/webp"
        else:
            mime_type = "image/jpeg"  # default
        
        logger.info(f"Processing image: {filename} (MIME: {mime_type})")
        
        # Call Gemini API with vision capability
        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            system_instruction=SYSTEM_PROMPT
        )
        
        # Create the prompt for analysis
        analysis_prompt = """Analyze this Soil Health Card image and extract all visible soil parameters and farmer information. 
        Return ONLY a valid JSON object (no markdown, no extra text) with the structure specified in your system instructions.
        If a value is not visible or illegible, use 0 and mark status as 'Unknown'.
        """
        
        # Process image with Gemini
        response = model.generate_content([
            analysis_prompt,
            {
                "mime_type": mime_type,
                "data": image_data
            }
        ])
        
        if not response or not response.text:
            return jsonify({
                "error": "No response from Gemini",
                "message": "The AI model failed to process the image"
            }), 500
        
        logger.info(f"Gemini response received: {response.text[:200]}...")
        
        # Extract and parse JSON from response
        result = extract_json_from_response(response.text)
        
        if not result:
            logger.error(f"Failed to parse response: {response.text}")
            return jsonify({
                "error": "Failed to parse AI response",
                "raw_response": response.text[:500]
            }), 500
        
        return jsonify({
            "success": True,
            "data": result
        }), 200
    
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}")
        return jsonify({
            "error": "Server error",
            "message": str(e)
        }), 500


@app.route('/api/config', methods=['GET'])
def get_config():
    """Get configuration info (for debugging)"""
    return jsonify({
        "api_configured": bool(os.getenv('GEMINI_API_KEY')),
        "environment": "production" if not os.getenv('FLASK_ENV') == 'development' else 'development'
    }), 200


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)
