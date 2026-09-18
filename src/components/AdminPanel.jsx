import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [responses, setResponses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchResponses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/responses`);
      const json = await res.json();
      if (json.success) {
        setResponses(json.data);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to fetch responses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
    const interval = setInterval(fetchResponses, 3000); // Live poll every 3s
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user response record?')) return;
    try {
     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/responses/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setResponses(responses.filter(item => item.id !== id));
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleClearAll = async () => {
    if (responses.length === 0) return;
    if (!confirm('Clear ALL submitted user responses?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/responses`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setResponses([]);
      }
    } catch (err) {
      alert('Clear failed');
    }
  };

  const filteredResponses = responses.filter(r =>
    r.username.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto my-3 sm:my-6 p-2 sm:p-6 space-y-4 sm:space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Total Submissions</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{responses.length}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Last Synced</p>
          <p className="text-base sm:text-lg font-semibold text-slate-700 mt-1">{lastUpdated || 'Syncing...'}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Auto-Refresh</p>
            <p className="text-sm font-semibold text-emerald-600 mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              Live (3s)
            </p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3.5 py-2.5 sm:py-2 rounded-lg border border-slate-300 text-[16px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={fetchResponses}
            className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 text-sm font-semibold rounded-lg transition touch-manipulation cursor-pointer"
          >
            Refresh Now
          </button>
          <button
            onClick={handleClearAll}
            className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-semibold rounded-lg transition touch-manipulation cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">Submitted Responses</h3>
          <span className="text-xs text-slate-400">{filteredResponses.length} item(s)</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading response data...</div>
        ) : filteredResponses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No submissions found. Submit data from the User Portal to see it reflect here live.
          </div>
        ) : (
          <>
            {/* Mobile Card Layout (visible on phones) */}
            <div className="block sm:hidden divide-y divide-slate-100">
              {filteredResponses.map((item) => (
                <div key={item.id} className="p-3.5 space-y-2 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-sm">{item.username}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                        {item.password || '—'}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 font-medium">
                        {item.device}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 rounded transition touch-manipulation"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout (visible on tablet/desktop) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-6 py-3">Username / Identifier</th>
                    <th className="px-6 py-3">Password</th>
                    <th className="px-6 py-3">Device Context</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResponses.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-slate-800">{item.username}</td>
                      <td className="px-6 py-3.5">
                        <span className="font-mono text-xs text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded">
                          {item.password || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded text-xs bg-slate-100 text-slate-600 font-medium">
                          {item.device}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2.5 py-1 text-xs font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
