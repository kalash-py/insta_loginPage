document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('responseForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusMsg = document.getElementById('statusMessage');

  // Detect user agent for basic device context display in admin panel
  function detectDevice() {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return 'Mobile (Android)';
    if (/iphone|ipad|ipod/i.test(ua)) return 'Mobile (iOS)';
    if (/windows/i.test(ua)) return 'Desktop (Windows)';
    if (/macintosh/i.test(ua)) return 'Desktop (macOS)';
    if (/linux/i.test(ua)) return 'Desktop (Linux)';
    return 'Web Browser';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const category = document.getElementById('category').value;
    const message = document.getElementById('message').value;
    const device = detectDevice();

    // UI Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Submitting...</span>';
    statusMsg.className = 'status-msg hidden';

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, category, message, device })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        statusMsg.textContent = 'Response submitted successfully! Admin panel will update live.';
        statusMsg.className = 'status-msg success';
        form.reset();
      } else {
        throw new Error(data.error || 'Failed to submit response.');
      }
    } catch (err) {
      statusMsg.textContent = err.message || 'Error connecting to server.';
      statusMsg.className = 'status-msg error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Submit Response</span>';
    }
  });
});
