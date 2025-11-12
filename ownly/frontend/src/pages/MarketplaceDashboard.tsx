import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, BarChart2, TrendingUp, Zap, Globe, Users, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Types for the dataset
interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  users: number;
  price: number;
  domains: string[];
  trend?: 'up' | 'down';
  change?: number;
}

// Mock data for the marketplace
const MOCK_DATASETS: Dataset[] = [
  {
    id: 'europe-ecommerce',
    title: 'European E-commerce Trends',
    description: 'Quarterly sales data across major European markets',
    category: 'E-commerce',
    users: 1242,
    price: 249,
    domains: ['ecommerce', 'retail', 'europe'],
    trend: 'up',
    change: 15.3
  },
  {
    id: 'fitness-users',
    title: 'Fitness App User Behavior',
    description: 'User engagement metrics from top fitness applications',
    category: 'Health & Fitness',
    users: 897,
    price: 199,
    domains: ['health', 'fitness', 'mobile'],
    trend: 'up',
    change: 8.7
  },
  {
    id: 'real-estate-global',
    title: 'Global Real Estate Prices',
    description: 'Monthly price trends in major cities worldwide',
    category: 'Real Estate',
    users: 1567,
    price: 349,
    domains: ['realestate', 'housing', 'global'],
    trend: 'up',
    change: 22.1
  },
  {
    id: 'crypto-sentiment',
    title: 'Cryptocurrency Market Sentiment',
    description: 'Social media sentiment analysis for top 50 cryptocurrencies',
    category: 'Finance',
    users: 2345,
    price: 299,
    domains: ['crypto', 'finance', 'sentiment'],
    trend: 'down',
    change: 5.2
  }
];

// Chart data type
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
  }[];
}

// Sample chart data - Last 6 months user growth (in thousands)
const CHART_DATA: ChartData = {
  labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  datasets: [
    {
      label: 'Monthly Active Users',
      data: [4200, 4350, 4520, 4780, 5120, 5678],
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f6',
      tension: 0,
      fill: false
    }
  ]
};

// Chart categories
const CHART_CATEGORIES = [
  { name: 'E-commerce', value: 35 },
  { name: 'Finance', value: 25 },
  { name: 'Health', value: 20 },
  { name: 'Real Estate', value: 15 },
  { name: 'Other', value: 5 }
];

// Format data for Recharts
const formatChartData = (data: ChartData) => {
  return data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0].data[index],
  }));
};

// Simple line chart component using Recharts
const SimpleLineChart = ({ data }: { data: ChartData }) => {
  const chartData = formatChartData(data);
  const growthRate = data.datasets[0].data.length > 1 
    ? ((data.datasets[0].data[data.datasets[0].data.length - 1] - data.datasets[0].data[0]) / data.datasets[0].data[0] * 100).toFixed(1)
    : '0.0';
  const isPositive = parseFloat(growthRate) >= 0;
  
  return (
    <div className="relative h-64">
      <div className="absolute right-0 top-0 flex items-center z-10">
        <span className="text-sm font-medium text-slate-500 mr-2">Growth:</span>
        <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(parseFloat(growthRate))}%
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(value) => {
              if (value >= 1000) return `${value / 1000}K`;
              return value;
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              padding: '0.5rem',
            }}
            formatter={(value: number) => [value.toLocaleString(), 'Users']}
            labelFormatter={(label) => `${label} 2023`}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{
              r: 4,
              stroke: '#3b82f6',
              strokeWidth: 2,
              fill: 'white',
            }}
            activeDot={{
              r: 6,
              stroke: '#3b82f6',
              strokeWidth: 2,
              fill: 'white',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const MarketplaceDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>(MOCK_DATASETS);
  
  // Filter datasets based on search query
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredDatasets(MOCK_DATASETS);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = MOCK_DATASETS.filter(dataset => 
      dataset.title.toLowerCase().includes(query) ||
      dataset.description.toLowerCase().includes(query) ||
      dataset.domains.some(domain => domain.includes(query))
    );
    
    setFilteredDatasets(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Data Marketplace</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Discover and connect with high-quality datasets to power your applications and analysis.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-blue-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for datasets (e.g., 'european ecommerce', 'fitness data')"
            className="block w-full pl-10 pr-24 py-3 border border-slate-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2.5 bottom-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-4 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
          >
            Search
          </button>
        </div>
      </form>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Datasets</p>
              <p className="text-2xl font-bold text-slate-900">1,248</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>12% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Users</p>
              <p className="text-2xl font-bold text-slate-900">5,678</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>8% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Customer Satisfaction</p>
              <p className="text-2xl font-bold text-slate-900">4.8/5.0</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>From 4.6 last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12" style={{ minHeight: '320px' }}>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-900">Monthly Growth</h3>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>15.3% from last month</span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <SimpleLineChart data={CHART_DATA} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-medium text-slate-900 mb-4">Categories</h3>
          <div className="space-y-4">
            {CHART_CATEGORIES.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{category.name}</span>
                  <span className="text-slate-500">{category.value}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${category.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Datasets'}
          </h2>
          {searchQuery ? (
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilteredDatasets(MOCK_DATASETS);
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear search
            </button>
          ) : (
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </button>
          )}
        </div>
        
        {filteredDatasets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDatasets.map((dataset) => (
              <motion.div 
                key={dataset.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {dataset.category}
                    </span>
                    <div className="flex items-center text-sm">
                      {dataset.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
                      )}
                      <span className={dataset.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                        {dataset.change}%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{dataset.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{dataset.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span>👥 {dataset.users.toLocaleString()} users</span>
                    <span className="font-medium text-slate-900">${dataset.price}</span>
                  </div>
                  <Link 
                    to={`/create?dataset=${dataset.id}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Zap className="-ml-1 mr-2 h-4 w-4" />
                    Get Dataset
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <p className="text-slate-500">No datasets found matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilteredDatasets(MOCK_DATASETS);
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear search and show all datasets
            </button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'E-commerce', icon: '🛍️' },
            { name: 'Finance', icon: '💰' },
            { name: 'Health', icon: '🏥' },
            { name: 'Real Estate', icon: '🏠' },
            { name: 'Technology', icon: '💻' },
            { name: 'Education', icon: '🎓' }
          ].map((category, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all"
              onClick={() => {
                setSearchQuery(category.name);
                const filtered = MOCK_DATASETS.filter(d => 
                  d.category.toLowerCase().includes(category.name.toLowerCase()) ||
                  d.domains.some(d => d.toLowerCase().includes(category.name.toLowerCase()))
                );
                setFilteredDatasets(filtered);
              }}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium text-slate-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceDashboard;
