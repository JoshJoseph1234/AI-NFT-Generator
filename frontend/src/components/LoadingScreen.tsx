import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  useEffect(() => {
    // Text blinking effect
    const textInterval = setInterval(() => {
      setTextVisible(prev => !prev);
    }, 500);
    
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Border */}
      <div className="absolute inset-0 border border-gray-800 m-4 pointer-events-none"></div>
      
      {/* Content */}
      <div className="w-full max-w-md px-4 relative">
        {/* Glow effect */}
        <div className="absolute -inset-4 blur-xl bg-green-400/10 rounded-xl"></div>
        
        <div className="relative bg-black/60 backdrop-blur-md border border-green-400/20 p-8 rounded-xl shadow-xl">
          <h2 className="font-mono text-green-400 text-xl mb-6 opacity-80">INITIALIZING SYSTEM</h2>
          
          <div className="flex justify-between items-end mb-4">
            <div className={`text-green-400 text-5xl font-bold font-mono transition-opacity duration-200 ${textVisible ? 'opacity-100' : 'opacity-40'}`}>
              {progress}%
            </div>
            <div className="font-mono text-xs text-green-400/60 uppercase tracking-wider">
              {progress < 30 ? 'Scanning' : progress < 60 ? 'Connecting' : progress < 90 ? 'Processing' : 'Complete'}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-300 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-black/40 p-2 rounded-lg">
              <div className="text-green-400 text-xl font-mono">{Math.floor(progress / 3)}</div>
              <div className="text-gray-500 text-xs">Models</div>
            </div>
            <div className="bg-black/40 p-2 rounded-lg">
              <div className="text-green-400 text-xl font-mono">{Math.floor(progress / 10)}</div>
              <div className="text-gray-500 text-xs">Files</div>
            </div>
            <div className="bg-black/40 p-2 rounded-lg">
              <div className="text-green-400 text-xl font-mono">{Math.floor(progress / 20)}</div>
              <div className="text-gray-500 text-xs">Assets</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;