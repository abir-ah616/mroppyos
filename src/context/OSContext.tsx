import { createContext, useContext, useState, type ReactNode, useCallback, useEffect, useRef } from 'react';
import type { AppConfig, AppData, WindowState, DesktopState } from '../types';
import { INITIAL_APPS } from '../config/apps';

interface OSContextType {
    windows: WindowState[];
    activeWindowId: string | null;
    isStartMenuOpen: boolean;
    apps: Record<string, AppConfig>;
    registerApp: (config: AppConfig) => void;
    launchApp: (appId: string, data?: AppData) => void;
    closeApp: (appId: string) => void;
    minimizeApp: (appId: string) => void;
    maximizeApp: (appId: string) => void;
    focusWindow: (appId: string) => void;
    toggleStartMenu: () => void;
    updateWindowPosition: (appId: string, position: { x: number; y: number }) => void;
    desktopState: DesktopState;
    setWallpaper: (url: string) => void;
    setIconSize: (size: 'small' | 'medium' | 'large') => void;
    setSortOrder: (order: 'name-asc' | 'name-desc' | 'none') => void;
    resetIconPositions: () => void;
    isShutDown: boolean;
    shutDown: () => void;
    turnOn: () => void;
    isShutdownConfirmOpen: boolean;
    setShutdownConfirmOpen: (isOpen: boolean) => void;
    volume: number;
    setVolume: (volume: number) => void;
    isMuted: boolean;
    toggleMute: () => void;
    isWifiEnabled: boolean;
    toggleWifi: () => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider = ({ children }: { children: ReactNode }) => {
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [apps, setApps] = useState<Record<string, AppConfig>>(INITIAL_APPS);
    const hasLaunched = useRef(false);
    const [desktopState, setDesktopState] = useState<DesktopState>(() => {
        const saved = localStorage.getItem('windows-12-desktop-state');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved desktop state', e);
            }
        }
        return {
            wallpaper: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
            iconSize: 'medium',
            sortOrder: 'none',
            layoutVersion: 0
        };
    });

    useEffect(() => {
        localStorage.setItem('windows-12-desktop-state', JSON.stringify(desktopState));
    }, [desktopState]);

    const registerApp = useCallback((config: AppConfig) => {
        setApps(prev => ({ ...prev, [config.id]: config }));
    }, []);

    const focusWindow = useCallback((appId: string) => {
        setActiveWindowId(appId);
        setWindows(prev => {
            const maxZ = Math.max(0, ...prev.map(w => w.zIndex));
            return prev.map(w =>
                w.id === appId ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
            );
        });
        setIsStartMenuOpen(false);
    }, []);

    const launchApp = useCallback((appId: string, data?: AppData) => {
        setWindows(prev => {
            const existingWindow = prev.find(w => w.id === appId);
            const maxZ = Math.max(0, ...prev.map(w => w.zIndex));

            if (existingWindow) {
                return prev.map(w =>
                    w.id === appId ? { ...w, data: data || w.data, zIndex: maxZ + 1, isMinimized: false } : w
                );
            }

            return [...prev, {
                id: appId,
                isMinimized: false,
                isMaximized: false,
                zIndex: maxZ + 1,
                data
            }];
        });

        setActiveWindowId(appId);
        setIsStartMenuOpen(false);
    }, []);

    const closeApp = useCallback((appId: string) => {
        setWindows(prev => prev.filter(w => w.id !== appId));
        setActiveWindowId(prev => prev === appId ? null : prev);
    }, []);

    const minimizeApp = useCallback((appId: string) => {
        setWindows(prev => prev.map(w =>
            w.id === appId ? { ...w, isMinimized: true } : w
        ));
        setActiveWindowId(prev => prev === appId ? null : prev);
    }, []);

    const maximizeApp = useCallback((appId: string) => {
        setWindows(prev => prev.map(w =>
            w.id === appId ? { ...w, isMaximized: !w.isMaximized } : w
        ));
        setActiveWindowId(appId);
        setWindows(prev => {
            const maxZ = Math.max(0, ...prev.map(w => w.zIndex));
            return prev.map(w =>
                w.id === appId ? { ...w, zIndex: maxZ + 1 } : w
            );
        });
    }, []);

    const toggleStartMenu = useCallback(() => {
        setIsStartMenuOpen(prev => !prev);
    }, []);

    useEffect(() => {
        if (!hasLaunched.current) {
            setTimeout(() => {
                launchApp('intro');
            }, 0);
            hasLaunched.current = true;
        }
    }, [launchApp]);

    const updateWindowPosition = useCallback((appId: string, position: { x: number; y: number }) => {
        setWindows(prev => prev.map(w =>
            w.id === appId ? { ...w, position } : w
        ));
    }, []);

    const setWallpaper = useCallback((url: string) => {
        setDesktopState(prev => ({ ...prev, wallpaper: url }));
    }, []);

    const setIconSize = useCallback((size: 'small' | 'medium' | 'large') => {
        setDesktopState(prev => ({ ...prev, iconSize: size }));
    }, []);

    const setSortOrder = useCallback((order: 'name-asc' | 'name-desc' | 'none') => {
        setDesktopState(prev => ({ ...prev, sortOrder: order }));
    }, []);

    const resetIconPositions = useCallback(() => {
        setDesktopState(prev => ({ ...prev, layoutVersion: prev.layoutVersion + 1 }));
    }, []);

    const [isShutDown, setIsShutDown] = useState(() => {
        return localStorage.getItem('windows-12-is-shutdown') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('windows-12-is-shutdown', String(isShutDown));
    }, [isShutDown]);

    const shutDown = useCallback(() => {
        setIsShutDown(true);
        setWindows([]); // Close all windows on shutdown
        setActiveWindowId(null);
        setIsStartMenuOpen(false);
    }, []);

    const turnOn = useCallback(() => {
        setIsShutDown(false);
    }, []);

    const [isShutdownConfirmOpen, setShutdownConfirmOpen] = useState(false);

    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const [isWifiEnabled, setIsWifiEnabled] = useState(true);

    const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);
    const toggleWifi = useCallback(() => setIsWifiEnabled(prev => !prev), []);

    return (
        <OSContext.Provider value={{
            windows,
            activeWindowId,
            isStartMenuOpen,
            toggleStartMenu,
            launchApp,
            closeApp,
            minimizeApp,
            maximizeApp,
            focusWindow,
            registerApp,
            apps,
            updateWindowPosition,
            desktopState,
            setWallpaper,
            setIconSize,
            setSortOrder,
            resetIconPositions,
            isShutDown,
            shutDown,
            turnOn,
            isShutdownConfirmOpen,
            setShutdownConfirmOpen,
            volume,
            setVolume,
            isMuted,
            toggleMute,
            isWifiEnabled,
            toggleWifi
        }}>
            {children}
        </OSContext.Provider>
    );
};

export const useOS = () => {
    const context = useContext(OSContext);
    if (!context) throw new Error('useOS must be used within an OSProvider');
    return context;
};
