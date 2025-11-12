import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Search, Loader2, ArrowRight, Zap } from 'lucide-react';

import { SelectedFields } from '../types';
import SelectionSummary from '../components/SelectionSummary';

// Mock data for the demo
const DEMO_DATA = {
  query: "connect language learning to airbnb rentals",
  detected_domains: ["education", "travel"],
  sources: [
    {
      id: "duolingo",
      name: "Duolingo",
      users: 50000,
      freshness: "daily",
      price_per_user_day: 0.01,
      description: "Language learning progress data",
      fields: [
        "language",
        "lessons_completed",
        "streak_days",
        "xp_points",
        "last_active",
        "learning_streak"
      ]
    },
    {
      id: "airbnb_italy",
      name: "Airbnb Italy Listings",
      users: 3973,
      freshness: "hourly",
      price_per_user_day: 0.025,
      description: "Booking data for Airbnb properties in Italy",
      fields: [
        "airbnb_city",
        "accommodation_type",
        "check_in_date",
        "check_out_date",
        "nights_booked",
        "booking_value_usd",
        "is_superhost"
      ]
    }
  ],
  estimated_users: 12473,
  estimated_monthly_cost: 12473 * 0.02 * 30 // users * avg_price_per_user_day * days_in_month
};

const MOCK_PREVIEW = {
  preview: [
    {
      user_id: "user_1001",
      language: "Italian",
      lessons_completed: 127,
      streak_days: 42,
      xp_points: 2540,
      last_active: new Date().toISOString(),
      learning_streak: "42 days",
      airbnb_city: "Florence",
      accommodation_type: "Private room",
      check_in_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      check_out_date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nights_booked: 7,
      booking_value_usd: 620.75,
      is_superhost: false,
      timestamp: new Date().toISOString(),
      estimated_fluency: "65%"
    },
    {
      user_id: "user_1002",
      language: "Italian",
      lessons_completed: 89,
      streak_days: 15,
      xp_points: 1780,
      last_active: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      learning_streak: "15 days",
      airbnb_city: "Venice",
      accommodation_type: "Entire apartment",
      check_in_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      check_out_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nights_booked: 7,
      booking_value_usd: 1250.00,
      is_superhost: true,
      timestamp: new Date().toISOString(),
      estimated_fluency: "45%"
    }
  ]
};

export default function CreateDataset() {
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFields, setSelectedFields] = useState<SelectedFields>({});
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [estimatedUsers, setEstimatedUsers] = useState(0);
  const [estimatedMonthlyCost, setEstimatedMonthlyCost] = useState(0);
  const [detectedDomains, setDetectedDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const navigate = useNavigate();

  // Handle search submission
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (query.toLowerCase().includes('connect language learning to airbnb rentals')) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setDetectedDomains(DEMO_DATA.detected_domains);
        setEstimatedUsers(DEMO_DATA.estimated_users);
        setEstimatedMonthlyCost(DEMO_DATA.estimated_monthly_cost);
        setSelectedFields({});
        setSelectedSources([]);
        setShowPreview(false);
        setShowResults(true);
        setIsLoading(false);
      }, 500);
    }
  }, [query]);

  // Handle field selection toggle
  const handleToggleField = useCallback((sourceId: string, fieldName: string) => {
    setSelectedFields(prev => {
      const sourceFields = prev[sourceId] || [];
      const newFields = sourceFields.includes(fieldName)
        ? sourceFields.filter(f => f !== fieldName)
        : [...sourceFields, fieldName];

      // Update selected sources
      if (newFields.length === 0) {
        const { [sourceId]: _, ...rest } = prev;
        setSelectedSources(sources => sources.filter(id => id !== sourceId));
        return rest;
      } else {
        if (!selectedSources.includes(sourceId)) {
          setSelectedSources(sources => [...sources, sourceId]);
        }
        return { ...prev, [sourceId]: newFields };
      }
    });
  }, [selectedSources]);

  // Handle preview button click
  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  // Calculate total price based on selected fields
  const calculatePrice = useCallback(() => {
    let total = 0;
    selectedSources.forEach(sourceId => {
      const source = DEMO_DATA.sources.find(s => s.id === sourceId);
      if (source) {
        const fieldCount = selectedFields[sourceId]?.length || 0;
        const fieldRatio = fieldCount / source.fields.length;
        total += source.price_per_user_day * fieldRatio * DEMO_DATA.estimated_users * 30;
      }
    });
    return total;
  }, [selectedFields, selectedSources]);

  // Initialize with demo data
  useEffect(() => {
    const demoQuery = 'connect language learning to airbnb rentals';
    setQuery(demoQuery);
    setDetectedDomains(DEMO_DATA.detected_domains);
    setEstimatedUsers(DEMO_DATA.estimated_users);
    setEstimatedMonthlyCost(DEMO_DATA.estimated_monthly_cost);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Render the component
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Create Your Custom Dataset</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Connect diverse data sources to uncover powerful insights and drive better decisions</p>
      </div>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-12 max-w-2xl mx-auto">
        <div className="relative shadow-lg rounded-xl overflow-hidden">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-blue-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Describe the data you're looking for..."
            className="block w-full pl-10 pr-24 py-4 border-0 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-200"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            <span className="font-medium">Search</span>
          </button>
        </div>
      </form>

      {/* Main Content */}
      <div className="main-content">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-600">Finding the best data sources for you...</span>
          </div>
        ) : showResults ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Source selection */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-8">
                {/* Detected Domains */}
                {detectedDomains.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-500">Detected Domains</h3>
                    <div className="flex flex-wrap gap-2">
                      {detectedDomains.map(domain => (
                        <span 
                          key={domain} 
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                        >
                          {domain.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Data Sources */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-slate-900">Available Data Sources</h3>
                  {DEMO_DATA.sources.map(source => (
                    <div key={source.id} className="border border-slate-200 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-slate-900 mb-2">{source.name}</h4>
                      <p className="text-sm text-slate-600 mb-3">{source.description}</p>
                      <div className="space-y-2">
                        {source.fields.map((field) => (
                          <div key={field} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`${source.id}-${field}`}
                              checked={selectedFields[source.id]?.includes(field) || false}
                              onChange={() => handleToggleField(source.id, field)}
                              className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                            <label htmlFor={`${source.id}-${field}`} className="ml-2 text-sm text-slate-700">
                              {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview Section */}
                <div id="preview-section">
                  {showPreview && (
                    <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Data Preview</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                          <thead className="bg-slate-100">
                            <tr>
                              {Object.keys(MOCK_PREVIEW.preview[0]).map((key) => (
                                <th
                                  key={key}
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                >
                                  {key.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ')}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {MOCK_PREVIEW.preview.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                {Object.values(row).map((value, i) => (
                                  <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {typeof value === 'string' && value.endsWith('Z') 
                                      ? new Date(value).toLocaleDateString() 
                                      : value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 text-sm text-slate-500">
                        Showing {MOCK_PREVIEW.preview.length} sample rows
                      </div>
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          onClick={() => setShowPreview(false)}
                          className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                        >
                          Back to Sources
                        </button>
                        <button
                          onClick={() => {
                            toast.success('Dataset generation started!');
                            setShowPreview(false);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                          Generate Dataset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column - Selection Summary */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <SelectionSummary
                  selectedSources={selectedSources}
                  selectedFields={selectedFields}
                  estimatedUsers={estimatedUsers}
                  estimatedMonthlyCost={calculatePrice()}
                  onPreview={handlePreview}
                  onGenerate={() => setShowPreview(true)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-md text-blue-600 mb-4">
              <Zap className="w-7 h-7" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">What would you like to discover?</h3>
            <p className="text-slate-600 max-w-xl mx-auto mb-6 text-lg">
              Describe your data needs in plain English and we'll find the perfect data sources for you.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setQuery("connect language learning to airbnb rentals");
                  const form = document.querySelector("form");
                  if (form) form.requestSubmit();
                }}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span>Try our demo: "Connect language learning to Airbnb rentals"</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <p className="text-xs text-slate-500">
                Example searches: "e-commerce trends in Europe" • "fitness app user behavior" • "real estate prices in major cities"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
