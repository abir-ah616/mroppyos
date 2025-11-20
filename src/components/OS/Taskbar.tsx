import { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { LayoutGrid, Wifi, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarPopup } from './Taskbar/CalendarPopup';
import { WifiPopup } from './Taskbar/WifiPopup';
import { VolumePopup } from './Taskbar/VolumePopup';
import { AnimatePresence } from 'framer-motion';

export const Taskbar = () => {
    const { windows, activeWindowId, toggleStartMenu, launchApp, minimizeApp, focusWindow, apps, volume, isMuted } = useOS();
    const [time, setTime] = useState(new Date());
    const [activePopup, setActivePopup] = useState<'calendar' | 'wifi' | 'volume' | null>(null);
    const [popupCenter, setPopupCenter] = useState<number>(0);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.taskbar-popup') && !target.closest('.taskbar-trigger')) {
                setActivePopup(null);
            }
        };
        window.addEventListener('click', handleOutsideClick);
        return () => window.removeEventListener('click', handleOutsideClick);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Get all unique app IDs that are either pinned (in apps config) or open
    // Filter out apps that shouldn't be on desktop if we want to hide them from taskbar too? 
    // Usually taskbar shows running apps regardless.
    // But for pinned apps, we might want to stick to the initial list or just show all available.
    // For now, let's show all registered apps as "pinned" or running.
    const allAppIds = Array.from(new Set([
        ...Object.keys(apps).filter(id => apps[id].showOnDesktop !== false),
        ...windows.map(w => w.id)
    ]));

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '48px',
            backgroundColor: 'rgba(10, 10, 10, 0.98)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 10000,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.3)'
        }}>
            {/* Start Button & Widgets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    onClick={toggleStartMenu}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-color)',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <LayoutGrid size={24} />
                </button>
            </div>

            {/* Centered App Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {allAppIds.map(appId => {
                    const app = apps[appId];
                    if (!app) return null;

                    const isOpen = windows.some(w => w.id === appId);
                    const isActive = activeWindowId === appId;
                    const isMinimized = windows.find(w => w.id === appId)?.isMinimized;

                    return (
                        <button
                            key={appId}
                            onClick={() => {
                                if (isOpen) {
                                    if (isActive && !isMinimized) minimizeApp(appId);
                                    else focusWindow(appId);
                                } else {
                                    launchApp(appId);
                                }
                            }}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '6px',
                                border: 'none',
                                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = isActive ? 'rgba(255,255,255,0.1)' : 'transparent'}
                        >
                            <div style={{ transform: isOpen && isMinimized ? 'scale(0.8)' : 'scale(1)', transition: 'transform 0.2s' }}>
                                {app.icon}
                            </div>

                            {/* Active Indicator */}
                            {isOpen && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    width: isActive ? '16px' : '6px',
                                    height: '3px',
                                    borderRadius: '2px',
                                    backgroundColor: 'var(--accent-color)',
                                    transition: 'width 0.2s'
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* System Tray */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', color: 'white' }}>
                    <div
                        className="taskbar-trigger"
                        onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setPopupCenter(rect.left + rect.width / 2);
                            setActivePopup(activePopup === 'wifi' ? null : 'wifi');
                        }}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <Wifi size={18} />
                    </div>
                    <div
                        className="taskbar-trigger"
                        onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setPopupCenter(rect.left + rect.width / 2);
                            setActivePopup(activePopup === 'volume' ? null : 'volume');
                        }}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        {isMuted || volume === 0 ? <VolumeX size={18} /> : volume < 50 ? <Volume1 size={18} /> : <Volume2 size={18} />}
                    </div>
                </div>
                <div
                    className="taskbar-trigger"
                    onClick={(e) => {
                        e.stopPropagation();
                        setActivePopup(activePopup === 'calendar' ? null : 'calendar');
                    }}
                    style={{ textAlign: 'right', color: 'white', fontSize: '12px', cursor: 'pointer' }}
                >
                    <div style={{ fontWeight: 500 }}>{format(time, 'h:mm aa')}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{format(time, 'dd/MM/yyyy')}</div>
                </div>
            </div>

            <AnimatePresence>
                {activePopup === 'calendar' && (
                    <CalendarPopup />
                )}
                {activePopup === 'wifi' && (
                    <WifiPopup centerPosition={popupCenter} />
                )}
                {activePopup === 'volume' && (
                    <VolumePopup centerPosition={popupCenter} />
                )}
            </AnimatePresence>
        </div >
    );
};
