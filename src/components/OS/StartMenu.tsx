import { useState } from 'react';
import { Search, Power, User } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { motion, AnimatePresence } from 'framer-motion';

export const StartMenu = () => {
    const { isStartMenuOpen, toggleStartMenu, apps, launchApp, setShutdownConfirmOpen } = useOS();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredApps = Object.values(apps).filter(app =>
        app.showInStartMenu !== false &&
        app.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isStartMenuOpen && (
                <>
                    {/* Backdrop to close on click outside */}
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                        onClick={toggleStartMenu}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            bottom: '60px', // Positioned above taskbar
                            left: window.innerWidth < 768 ? '50%' : '10px',   // Aligned to the left (Start button position)
                            transform: window.innerWidth < 768 ? 'translateX(-50%)' : 'none',
                            width: window.innerWidth < 768 ? 'calc(100vw - 20px)' : '600px',
                            height: window.innerWidth < 768 ? 'calc(100vh - 80px)' : '700px',
                            maxHeight: '700px',
                            backgroundColor: 'rgba(24, 24, 30, 0.95)', // Darker, less glassy background
                            backdropFilter: 'blur(30px)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            zIndex: 9999,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            padding: '24px'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Search Bar */}
                        <div style={{ marginBottom: '24px', position: 'relative' }}>
                            <Search size={20} style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }} />
                            <input
                                type="text"
                                placeholder="Type here to search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 40px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Pinned / Filtered Apps */}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                                    {searchQuery ? 'Search Results' : 'Pinned'}
                                </span>
                                {!searchQuery && (
                                    <div />
                                )}
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                                gap: '16px'
                            }}>
                                {filteredApps.map(app => (
                                    <button
                                        key={app.id}
                                        onClick={() => {
                                            launchApp(app.id);
                                            toggleStartMenu();
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer',
                                            padding: '12px',
                                            borderRadius: '6px',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {app.icon}
                                        </div>
                                        <span style={{ fontSize: '12px', color: '#eee', textAlign: 'center' }}>{app.title}</span>
                                    </button>
                                ))}
                                {filteredApps.length === 0 && (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', padding: '20px' }}>
                                        No apps found.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Bar (User & Power) */}
                        <div style={{
                            marginTop: 'auto',
                            paddingTop: '16px',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '6px'
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={16} />
                                </div>
                                <span style={{ fontSize: '13px' }}>MR. OPPY</span>
                            </button>

                            <button
                                onClick={() => {
                                    toggleStartMenu();
                                    setShutdownConfirmOpen(true);
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <Power size={20} style={{ pointerEvents: 'none' }} />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
