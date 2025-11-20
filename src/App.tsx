import { useState, useEffect, useRef } from 'react';
import { OSProvider, useOS } from './context/OSContext';
import { Desktop } from './components/OS/Desktop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BootScreen } from './components/OS/BootScreen';
import { ShutDownScreen } from './components/OS/ShutDownScreen';
import { AnimatePresence } from 'framer-motion';

import { ShutdownConfirmation } from './components/OS/ShutdownConfirmation';

const SystemBoot = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { desktopState, isShutDown, isShutdownConfirmOpen } = useOS();

  const wallpaperRef = useRef(desktopState.wallpaper);
  wallpaperRef.current = desktopState.wallpaper;

  useEffect(() => {
    if (isShutDown) {
      setIsLoading(false);
      return;
    }

    const bootProcess = async () => {
      setIsLoading(true);
      // Minimum boot time
      const minBootTime = new Promise(resolve => setTimeout(resolve, 3000));

      // Preload wallpaper
      const wallpaperLoad = new Promise((resolve) => {
        if (!wallpaperRef.current) {
          resolve(true);
          return;
        }
        const img = new Image();
        img.src = wallpaperRef.current;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true); // Proceed even if wallpaper fails
      });

      await Promise.all([minBootTime, wallpaperLoad]);
      setIsLoading(false);
    };

    bootProcess();
  }, [isShutDown]);

  if (isShutDown) {
    return <ShutDownScreen />;
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <BootScreen key="boot-screen" />
      )}
      {!isLoading && (
        <>
          <Desktop key="desktop" />
          {isShutdownConfirmOpen && <ShutdownConfirmation />}
        </>
      )}
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="app-container">
      <OSProvider>
        <ErrorBoundary>
          <SystemBoot />
        </ErrorBoundary>
      </OSProvider>
    </div>
  );
}

export default App;
