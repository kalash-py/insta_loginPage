document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('tableBody');
  const totalCountEl = document.getElementById('totalCount');
  const lastUpdatedEl = document.getElementById('lastUpdated');
  const searchInput = document.getElementById('searchInput');
  const refreshBtn = document.getElementById('refreshBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const emptyState = document.getElementById('emptyState');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const responsesTable = document.getElementById('responsesTable');

  let responsesData = [];
  let pollInterval = null;

  async function fetchResponses() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/responses`);
      const json = await res.json();

      if (json.success) {
        responsesData = json.data;
        renderDashboard();
      }
    } catch (err) {
      console.error('Failed to fetch responses:', err);
    } finally {
      loadingSpinner.classList.add('hidden');
    }
  }

  function renderDashboard() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Filter items based on search input
    const filtered = responsesData.filter(item => {
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm) ||
        item.message.toLowerCase().includes(searchTerm) ||
        (item.category && item.category.toLowerCase().includes(searchTerm))
      );
    });

    totalCountEl.textContent = responsesData.length;
    lastUpdatedEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (filtered.length === 0) {
      responsesTable.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    responsesTable.classList.remove('hidden');
    emptyState.classList.add('hidden');

    tableBody.innerHTML = filtered.map(item => {
      const dateStr = new Date(item.timestamp).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      return `
        <tr>
          <td style="white-space: nowrap; color: var(--text-muted); font-size: 0.8rem;">${dateStr}</td>
          <td><strong>${escapeHtml(item.name)}</strong></td>
          <td><a href="mailto:${escapeHtml(item.email)}" style="color: var(--primary-color);">${escapeHtml(item.email)}</a></td>
          <td><span class="category-tag">${escapeHtml(item.category)}</span></td>
          <td style="max-width: 300px; word-break: break-word;">${escapeHtml(item.message)}</td>
          <td><span class="device-badge">${escapeHtml(item.device || 'N/A')}</span></td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteResponse('${item.id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.deleteResponse = async function(id) {
    if (!confirm('Are you sure you want to delete this response entry?')) return;

    try {
     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/responses/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        responsesData = responsesData.filter(item => item.id !== id);
        renderDashboard();
      }
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  };

  clearAllBtn.addEventListener('click', async () => {
    if (responsesData.length === 0) return;
    if (!confirm('Are you sure you want to clear ALL response entries?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/responses`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        responsesData = [];
        renderDashboard();
      }
    } catch (err) {
      alert('Error clearing items: ' + err.message);
    }
  });

  searchInput.addEventListener('input', renderDashboard);
  refreshBtn.addEventListener('click', fetchResponses);

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial load & setup polling (every 3s)
  fetchResponses();
  pollInterval = setInterval(fetchResponses, 3000);
});
