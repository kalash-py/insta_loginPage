import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 1200);

    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-white flex flex-col justify-between items-center py-12 transition-opacity duration-500 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Centered Mock Image */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src="https://i.ibb.co/gLvf8hnF/images-2-removebg-preview.png"
          alt="Splash Mock Logo"
          className="w-16 h-16 object-contain"
        />
      </div>

      {/* 2 Texts at Bottom */}
      <div className="flex flex-col items-center gap-0.5">
  

        <img 
          src="https://i.ibb.co/7dm0TTsh/download.png"
          alt="Meta Logo"
          className="w-20 h-auto object-contain"
        />
      </div>
    </div>
  );
}
