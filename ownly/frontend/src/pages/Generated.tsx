import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Copy, Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import { StreamData } from '../types';

export default function Generated() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  const apiUrl = `http://localhost:8000/v1/streams/${id}`;

  const { data: streamData } = useQuery<StreamData>({
    queryKey: ['stream', id],
    queryFn: () => api.getStream(id!),
    refetchInterval: 5000, // Poll every 5 seconds
    enabled: !!id,
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiUrl);
      setCopied(true);
      toast.success('Endpoint copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadCSV = () => {
    if (!streamData?.rows?.length) return;
    
    const headers = Object.keys(streamData.rows[0]);
    const csvRows = [
      headers.join(','),
      ...streamData.rows.map(row => 
        headers.map(field => JSON.stringify(row[field])).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataset-${id}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Dataset is Ready</h1>
          <p className="text-gray-600">Access your real-time data stream</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Live
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">API Endpoint</h2>
          <div className="flex">
            <code className="flex-1 bg-gray-50 p-3 rounded-l-lg text-sm font-mono overflow-x-auto">
              {apiUrl}
            </code>
            <button
              onClick={copyToClipboard}
              className="bg-gray-100 hover:bg-gray-200 px-4 rounded-r-lg transition-colors"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sample Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {streamData?.rows?.[0] &&
                    Object.keys(streamData.rows[0]).map((key: string) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {streamData?.rows?.map((row: Record<string, unknown>, rowIndex: number) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value: unknown, colIndex: number) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={downloadCSV}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <a
              href={`/api-explorer?endpoint=${encodeURIComponent(apiUrl)}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in API Explorer
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Integration Example</h2>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">
            <code>
{`// Using fetch
const response = await fetch('${apiUrl}', {
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
