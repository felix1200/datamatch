'use client';

import { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, Calendar, DollarSign } from 'lucide-react';
import { getCurrentUser, getAuthToken } from '@/lib/auth';
import { showToast } from '@/components/toast';

interface DownloadHistory {
  id: string;
  fileName: string;
  fileSize: number;
  rowCount: number;
  createdAt: string;
  amount: number;
  paymentStatus: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<DownloadHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/user/history', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.history);
      } else {
        showToast({ type: 'error', title: 'Failed to load history' });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-[-0.02em] mb-2">Download History</h1>
          <p className="text-[#6e6e73]">View all your past downloads and transactions.</p>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-black/[0.04] text-center">
            <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-[#1d1d1f] mb-2">No downloads yet</h2>
            <p className="text-[#6e6e73] mb-6">Start matching data to see your history here.</p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
            >
              Go to DataMatch
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-black/[0.04] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-[#6e6e73] uppercase tracking-wide px-6 py-4">File</th>
                    <th className="text-left text-xs font-medium text-[#6e6e73] uppercase tracking-wide px-6 py-4">Size</th>
                    <th className="text-left text-xs font-medium text-[#6e6e73] uppercase tracking-wide px-6 py-4">Rows</th>
                    <th className="text-left text-xs font-medium text-[#6e6e73] uppercase tracking-wide px-6 py-4">Date</th>
                    <th className="text-left text-xs font-medium text-[#6e6e73] uppercase tracking-wide px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                          <span className="text-[15px] font-medium text-[#1d1d1f] truncate max-w-[200px]">
                            {item.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-[#6e6e73]">{formatFileSize(item.fileSize)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-[#6e6e73]">{item.rowCount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#6e6e73]" />
                          <span className="text-[14px] text-[#6e6e73]">{formatDate(item.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.amount > 0 ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            <span className="text-[14px] font-medium text-emerald-600">${item.amount.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                            Free
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
