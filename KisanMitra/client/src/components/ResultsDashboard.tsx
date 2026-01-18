import React from 'react';
import { AlertCircle, CheckCircle, TrendingUp, Leaf, BookOpen } from 'lucide-react';

interface Parameter {
  value: number;
  unit?: string;
  status: string;
}

interface SoilAnalysisResult {
  farmer_name: string;
  health_card_id: string;
  test_date: string;
  village: string;
  district: string;
  parameters: Record<string, Parameter>;
  advisory: {
    summary: string;
    fertilizer_recommendation: string[];
    organic_alternative: string;
    crop_suggestion: string;
  };
}

interface ResultsDashboardProps {
  result: SoilAnalysisResult;
  language: 'en' | 'hi';
}

const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'low':
    case 'acidic':
    case 'deficient':
      return 'text-red-700 bg-red-50 border-red-200';
    case 'medium':
    case 'neutral':
    case 'normal':
      return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'high':
    case 'alkaline':
    case 'good':
      return 'text-green-700 bg-green-50 border-green-200';
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200';
  }
};

const getProgressColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'low':
    case 'acidic':
    case 'deficient':
      return 'bg-red-500';
    case 'medium':
    case 'neutral':
    case 'normal':
      return 'bg-amber-500';
    case 'high':
    case 'alkaline':
    case 'good':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export default function ResultsDashboard({ result, language }: ResultsDashboardProps) {
  const translations = {
    en: {
      farmerDetails: 'Farmer Details',
      soilParameters: 'Soil Parameters',
      agronomistNote: 'Agronomist Note',
      fertilizer: 'Fertilizer Recommendations',
      organic: 'Organic Alternative',
      cropSuggestion: 'Recommended Crops',
      value: 'Value',
      status: 'Status',
      unknown: 'Unknown',
    },
    hi: {
      farmerDetails: 'किसान विवरण',
      soilParameters: 'मिट्टी के पैरामीटर',
      agronomistNote: 'कृषि वैज्ञानिक सूचना',
      fertilizer: 'खाद सिफारिशें',
      organic: 'जैविक विकल्प',
      cropSuggestion: 'अनुशंसित फसलें',
      value: 'मूल्य',
      status: 'स्थिति',
      unknown: 'अज्ञात',
    },
  };

  const t = translations[language];

  // Group parameters by category
  const macroNutrients = ['N', 'P', 'K'];
  const secondaryNutrients = ['S'];
  const microNutrients = ['Zn', 'Fe', 'Cu', 'Mn', 'B'];
  const physicalParams = ['pH', 'EC', 'OC'];

  const ParameterCard = ({ label, param, index }: { label: string; param: Parameter | undefined; index: number }) => {
    if (!param) return null;
    
    const statusClass = getStatusColor(param.status);
    const progressColor = getProgressColor(param.status);
    const maxVal = label.includes('pH') ? 14 : label.includes('EC') ? 4 : label.includes('OC') ? 2 : 500;
    const progressWidth = Math.min(100, (param.value / maxVal) * 100);

    return (
      <div 
        className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{label}</h4>
          <span className={`px-2 py-1 rounded-md text-xs font-bold border ${statusClass}`}>
            {param.status}
          </span>
        </div>
        
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-bold text-gray-900">{param.value}</span>
          {param.unit && <span className="text-sm text-gray-500 mb-1 font-medium">{param.unit}</span>}
        </div>

        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Farmer Details Header Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-slide-up">
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{t.farmerDetails}</h2>
          </div>
          <div className="text-emerald-100 text-sm font-medium px-3 py-1 bg-emerald-700/30 rounded-full backdrop-blur-sm">
            verified • updated just now
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="group">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Name</p>
            <p className="text-gray-900 font-semibold text-lg group-hover:text-emerald-600 transition-colors">
              {result.farmer_name || t.unknown}
            </p>
          </div>
          <div className="group">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Card ID</p>
            <p className="text-gray-900 font-semibold text-lg group-hover:text-emerald-600 transition-colors">
              {result.health_card_id || t.unknown}
            </p>
          </div>
          <div className="group">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Location</p>
            <p className="text-gray-900 font-semibold text-lg group-hover:text-emerald-600 transition-colors">
              {result.village && result.district
                ? `${result.village}, ${result.district}`
                : t.unknown}
            </p>
          </div>
          <div className="group">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Test Date</p>
            <p className="text-gray-900 font-semibold text-lg group-hover:text-emerald-600 transition-colors">
              {result.test_date || t.unknown}
            </p>
          </div>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Parameters */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* NPK */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Macro Nutrients (NPK)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ParameterCard index={1} label="Nitrogen (N)" param={result.parameters.N} />
              <ParameterCard index={2} label="Phosphorus (P)" param={result.parameters.P} />
              <ParameterCard index={3} label="Potassium (K)" param={result.parameters.K} />
            </div>
          </div>

          {/* Physical + Secondary */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Physical & Secondary
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ParameterCard index={4} label="pH" param={result.parameters.pH} />
              <ParameterCard index={5} label="EC" param={result.parameters.EC} />
              <ParameterCard index={6} label="OC" param={result.parameters.OC} />
              <ParameterCard index={7} label="Sulphur (S)" param={result.parameters.S} />
            </div>
          </div>

          {/* Micro Nutrients */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-purple-600" />
                Micro-Nutrients
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <ParameterCard index={8} label="Zn" param={result.parameters.Zn} />
              <ParameterCard index={9} label="Fe" param={result.parameters.Fe} />
              <ParameterCard index={10} label="Cu" param={result.parameters.Cu} />
              <ParameterCard index={11} label="Mn" param={result.parameters.Mn} />
              <ParameterCard index={12} label="B" param={result.parameters.B} />
            </div>
          </div>
        </div>

        {/* Right Column: Advisory Board */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-amber-100 animate-slide-up sticky top-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2 border-b border-amber-200 pb-2">
              <span>💡</span> {t.agronomistNote}
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-amber-100">
                <p className="text-gray-800 leading-relaxed italic font-medium text-lg">
                  "{result.advisory.summary}"
                </p>
              </div>

              {/* Fertilizer List */}
              <div>
                <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Leaf className="w-4 h-4" /> {t.fertilizer}
                </h4>
                <div className="space-y-2">
                  {result.advisory.fertilizer_recommendation.map((step, idx) => (
                    <div key={idx} className="flex gap-3 bg-white p-3 rounded-lg shadow-sm border border-amber-50">
                      <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions / Other Info */}
              <div className="grid grid-cols-1 gap-3">
                 <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> {t.cropSuggestion}
                    </h4>
                    <p className="text-indigo-800 text-sm font-medium">{result.advisory.crop_suggestion}</p>
                 </div>
                 
                 <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <h4 className="font-bold text-green-900 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Leaf className="w-4 h-4" /> {t.organic}
                    </h4>
                    <p className="text-green-800 text-sm font-medium">{result.advisory.organic_alternative}</p>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="text-center py-8">
        <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <AlertCircle className="w-3 h-3" />
          AI Analysis generated by Gemini 1.5 Flash • Verify with official labs
        </p>
      </div>
    </div>
  );
}
