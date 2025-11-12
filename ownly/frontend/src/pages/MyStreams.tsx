import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Stream {
  id: string;
  name: string;
  createdAt: string;
  lastUpdated: string;
  status: 'active' | 'paused' | 'error';
  sourceCount: number;
}

export default function MyStreams() {
  const [streams, setStreams] = useState<Stream[]>([
    {
      id: 'stream-123',
      name: 'E-commerce Analytics',
      createdAt: '2023-05-15T10:30:00Z',
      lastUpdated: '2023-06-20T14:45:00Z',
      status: 'active',
      sourceCount: 3,
    },
    {
      id: 'stream-456',
      name: 'User Behavior',
      createdAt: '2023-06-01T09:15:00Z',
      lastUpdated: '2023-06-20T12:20:00Z',
      status: 'paused',
      sourceCount: 2,
    },
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this stream?')) {
      setStreams(streams.filter(stream => stream.id !== id));
      toast.success('Stream deleted');
    }
  };

  const refreshStream = (id: string) => {
    // In a real app, this would trigger a refetch of the stream data
    toast.success('Refreshing stream data...');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Data Streams</h1>
          <p className="text-gray-600">Manage your active data streams and integrations</p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Create New Stream
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {streams.length === 0 ? (
          <div className="text-center py-12 px-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No streams</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new data stream.
            </p>
            <div className="mt-6">
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                New Stream
              </Link>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sources
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {streams.map((stream) => (
                <tr key={stream.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        <Link to={`/generated/${stream.id}`} className="hover:text-primary">
                          {stream.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{stream.sourceCount} sources</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(stream.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        stream.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : stream.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {stream.status.charAt(0).toUpperCase() + stream.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => refreshStream(stream.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Refresh"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <Link
                        to={`/generated/${stream.id}`}
                        className="text-gray-400 hover:text-primary"
                        title="View"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(stream.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
