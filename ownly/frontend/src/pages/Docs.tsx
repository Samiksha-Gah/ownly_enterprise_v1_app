import { useState } from 'react';
import { Copy } from 'lucide-react';

const apiExample = `# Using cURL
curl -X GET 'https://api.ownly.app/v1/datasets/catalog' \
  -H 'X-API-Key: your_api_key_here'

# Using fetch
const response = await fetch('https://api.ownly.app/v1/datasets/catalog', {
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`;

const endpoints = [
  {
    method: 'GET',
    path: '/v1/datasets/catalog',
    description: 'List all available datasets',
    auth: true,
  },
  {
    method: 'POST',
    path: '/v1/datasets/plan',
    description: 'Create a plan for a new dataset',
    auth: true,
    body: {
      query: 'string',
    },
  },
  {
    method: 'POST',
    path: '/v1/datasets/generate',
    description: 'Generate a new dataset',
    auth: true,
    body: {
      dataset_id: 'string',
      selected_sources: ['string'],
    },
  },
  {
    method: 'GET',
    path: '/v1/streams/{dataset_id}',
    description: 'Stream dataset data',
    auth: true,
  },
];

export default function Docs() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h1>
        <p className="text-gray-600">
          Integrate with Ownly Enterprise using our REST API. All API requests must be authenticated using an API key.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication</h2>
            <p className="text-gray-600 mb-4">
              All API requests must include your API key in the request header:
            </p>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>X-API-Key: your_api_key_here</code>
              </pre>
              <button
                onClick={() => copyToClipboard('X-API-Key: your_api_key_here')}
                className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              You can generate an API key from your account settings.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">API Reference</h2>
            
            {endpoints.map((endpoint, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${
                    endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                    endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                  {endpoint.auth && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                      Requires Auth
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{endpoint.description}</p>
                
                {endpoint.body && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Request Body:</h4>
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      <code>{JSON.stringify(endpoint.body, null, 2)}</code>
                    </pre>
                  </div>
                )}
                
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Example Request:</h4>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>
                        {`${endpoint.method} https://api.ownly.app${endpoint.path.replace('{dataset_id}', '123')} \
  -H 'X-API-Key: your_api_key_here'`}
                        {endpoint.method === 'POST' ? `\n  -H 'Content-Type: application/json' \
  -d '${JSON.stringify(endpoint.body, null, 2)}'` : ''}
                      </code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(
                        `curl -X ${endpoint.method} https://api.ownly.app${endpoint.path.replace('{dataset_id}', '123')} \
  -H 'X-API-Key: your_api_key_here'` + 
                        (endpoint.method === 'POST' ? ` \
  -H 'Content-Type: application/json' \
  -d '${JSON.stringify(endpoint.body, null, 2)}'` : '')
                      )}
                      className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h2>
              <p className="text-gray-600 mb-4">
                Here's a quick example of how to use the API:
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{apiExample}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(apiExample)}
                  className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Need help?</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Check out our{' '}
                      <a href="#" className="font-medium underline hover:text-blue-600">
                        API reference
                      </a>{' '}
                      or contact our support team at{' '}
                      <a href="mailto:support@ownly.app" className="font-medium underline hover:text-blue-600">
                        support@ownly.app
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
