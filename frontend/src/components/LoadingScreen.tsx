import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 border border-[#1A1A1A] m-4 pointer-events-none"></div>
      
      <div className="w-96 relative">
        <div className="absolute inset-0 blur-xl bg-[#ADFF2F]/20"></div>
        <div className="relative bg-black/40 backdrop-blur-sm border border-[#ADFF2F]/30 p-8 rounded-lg">
          <div className="text-[#ADFF2F] text-6xl font-bold mb-4 font-mono">
            {progress}%
          </div>
          <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#ADFF2F] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;