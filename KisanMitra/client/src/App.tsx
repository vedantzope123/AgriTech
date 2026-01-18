import React, { useState } from 'react';
import { Upload, Settings, Volume2, AlertCircle } from 'lucide-react';
import UploadBox from './components/UploadBox';
import ResultsDashboard from './components/ResultsDashboard';

interface SoilAnalysisResult {
  farmer_name: string;
  health_card_id: string;
  test_date: string;
  village: string;
  district: string;
  parameters: Record<string, any>;
  advisory: {
    summary: string;
    fertilizer_recommendation: string[];
    organic_alternative: string;
    crop_suggestion: string;
  };
}

type Language = 'en' | 'hi';

const ENV_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const ENV_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

export default function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiInput, setShowApiInput] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SoilAnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [language, setLanguage] = useState<Language>('en');
  const [isApiConfigured, setIsApiConfigured] = useState<boolean>(false);

  const handleApiKeySubmit = (key: string) => {
    if (key.trim()) {
      setApiKey(key);
      setIsApiConfigured(true);
      setShowApiInput(false);
      setError('');
    } else {
      setError('Please enter a valid API key');
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!apiKey && !ENV_GEMINI_API_KEY) {
      setError('Please configure API key first');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const apiKeyToUse = apiKey || ENV_GEMINI_API_KEY || '';
      if (apiKeyToUse) {
        formData.append('api_key', apiKeyToUse);
      }

      const response = await fetch(`${ENV_BACKEND_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
        headers: apiKeyToUse ? { 'X-Gemini-API-Key': apiKeyToUse } : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze image');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const speakAdvisory = () => {
    if (result?.advisory.summary) {
      const utterance = new SpeechSynthesisUtterance(result.advisory.summary);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-2.5 shadow-lg shadow-emerald-200">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">KisanMitra</h1>
                <p className="text-emerald-600 text-xs font-medium uppercase tracking-wider">Soil Intelligence System</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-gray-200 hover:border-emerald-500 hover:text-emerald-700 bg-white shadow-sm hover:shadow-md active:scale-95 text-sm"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              {isApiConfigured && (
                <button
                  onClick={() => setShowApiInput(!showApiInput)}
                  className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-500 hover:text-emerald-600 active:scale-95"
                  title="Configure API"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* API Key Alert (if needed) */}
        {!isApiConfigured && !ENV_GEMINI_API_KEY && (
           <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg animate-fade-in">
             <div className="flex">
               <div className="flex-shrink-0">
                 <Settings className="h-5 w-5 text-amber-400" aria-hidden="true" />
               </div>
               <div className="ml-3">
                 <h3 className="text-sm font-medium text-amber-800">Setup Required</h3>
                 <div className="mt-2 text-sm text-amber-700">
                   <p>Please configure your Google Gemini API key to start analyzing soil health cards.</p>
                 </div>
               </div>
             </div>
           </div>
        )}

        {/* Configuration Panel */}
        {showApiInput && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔑</span> Configure Gemini API
            </h2>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="password"
                placeholder="Paste your Google Gemini API key here..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm bg-gray-50 focus:bg-white"
              />
              <button
                onClick={() => handleApiKeySubmit(apiKey)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 active:scale-95"
              >
                Save Key
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              Need a key? <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline font-medium">Get it for free from Google AI Studio</a>
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 animate-slide-up">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Upload */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-1 border border-gray-100">
               <UploadBox onUpload={handleImageUpload} isLoading={isLoading} />
            </div>
            
            {/* Helper Text */}
            {!result && !isLoading && (
              <div className="bg-emerald-50/50 rounded-xl p-6 border border-emerald-100 text-center">
                <h3 className="font-bold text-emerald-900 mb-2">How it works</h3>
                <p className="text-sm text-emerald-700/80 leading-relaxed">
                  Upload a photo of any government-issued Soil Health Card. Our AI will digitize the data and provide personalized farming advice in seconds.
                </p>
              </div>
            )}
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-8">
            {result ? (
              <div className="animate-fade-in">
                <div className="mb-6 flex gap-3 justify-end">
                  <button
                    onClick={speakAdvisory}
                    className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95"
                  >
                    <Volume2 className="w-5 h-5" />
                    Listen
                  </button>
                  <button
                    onClick={() => {
                      setResult(null);
                      setError('');
                    }}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-gray-200"
                  >
                    New Upload
                  </button>
                </div>
                <ResultsDashboard result={result} language={language} />
              </div>
            ) : (
               /* Empty State / Hero */
               <div className="hidden lg:flex flex-col items-center justify-center min-h-[500px] text-center p-12 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50">
                  <div className="bg-white p-6 rounded-full shadow-xl shadow-gray-100 mb-6">
                    <img src="https://cdn-icons-png.flaticon.com/512/3578/3578059.png" alt="Agriculture" className="w-24 h-24 opacity-80" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome to KisanMitra</h2>
                  <p className="text-gray-500 max-w-md text-lg leading-relaxed">
                    Your digital companion for soil health analysis. Upload your card to get started with precision farming.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-lg">
                    <div className="text-center">
                      <div className="font-bold text-2xl text-emerald-600 mb-1">AI</div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Powered</div>
                    </div>
                    <div className="text-center border-l border-r border-gray-200">
                      <div className="font-bold text-2xl text-emerald-600 mb-1">12+</div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Parameters</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-emerald-600 mb-1">24/7</div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Advisory</div>
                    </div>
                  </div>
               </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 KisanMitra. Empowering Indian Farmers.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
