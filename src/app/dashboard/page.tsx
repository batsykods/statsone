"use client";

import { useEffect, useState } from 'react';
import Papa from 'papaparse'; // <-- NEW: Import PapaParse

type Dataset = {
  id: number;
  name: string;
  source: string;
  record_count: number;
  description: string | null;
};

export default function DashboardPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [sourceFilter, setSourceFilter] = useState('');
  const [minRecordsFilter, setMinRecordsFilter] = useState('');

  useEffect(() => {
    fetchDatasets(); 
  }, []);

  const fetchDatasets = async (source = '', minRecords = '') => {
    setIsLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/';
      return;
    }

    const queryParams = new URLSearchParams();
    if (source) queryParams.append('source', source);
    if (minRecords) queryParams.append('min_records', minRecords);

    const url = `http://localhost:8000/datasets/?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch data.');
      }

      const data: Dataset[] = await response.json();
      setDatasets(data);
    } catch (err: any) {
      setError(err.message);
      setDatasets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDatasets(sourceFilter, minRecordsFilter);
  };
  
  // --- NEW: Function to handle the CSV export ---
  const handleExport = () => {
    if (datasets.length === 0) {
      alert("No data to export!");
      return;
    }
    // Convert the JSON data to a CSV string
    const csv = Papa.unparse(datasets);

    // Create a blob and trigger a download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'filtered_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };
  
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Researcher Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
          >
            Log Out
          </button>
        </div>

        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <form onSubmit={handleFilterSubmit} className="flex items-end space-x-4">
            {/* Filter Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Source (State)</label>
              <input
                type="text"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                placeholder="e.g., Himachal Pradesh"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min. Institutions</label>
              <input
                type="number"
                value={minRecordsFilter}
                onChange={(e) => setMinRecordsFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                placeholder="e.g., 1000"
              />
            </div>
            {/* Filter Button */}
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Apply Filters
            </button>
            {/* --- NEW: Export Button --- */}
            <button
              type="button"
              onClick={handleExport}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Export to CSV
            </button>
          </form>
        </div>

        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        {isLoading && <p className="text-center text-gray-500">Loading data...</p>}

        {!isLoading && !error && (
          <div className="overflow-hidden rounded-lg bg-white shadow">
            {/* Data Table */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name (District)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Source (State)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total Institutions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {datasets.map((dataset) => (
                  <tr key={dataset.id}>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{dataset.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">{dataset.source}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">{dataset.record_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}