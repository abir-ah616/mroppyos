import { useOS } from '../../context/OSContext';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { ContextMenu } from './ContextMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import type { AppConfig } from '../../types';

const DesktopIcon = ({ app, launchApp, constraintsRef, size }: { app: AppConfig, launchApp: (id: string) => void, constraintsRef: React.RefObject<any>, size: 'small' | 'medium' | 'large' }) => {
    const [lastClickTime, setLastClickTime] = useState(0);
    const isDragging = useRef(false);

    const handlePointerUp = () => {
        if (!isDragging.current) {
            const now = Date.now();
            if (now - lastClickTime < 300) {
                launchApp(app.id);
            }
            setLastClickTime(now);
        }
    };

    const isMobile = window.innerWidth < 768;
    const iconSize = isMobile ? 48 : (size === 'small' ? 32 : size === 'medium' ? 48 : 64);
    const width = isMobile ? 90 : (size === 'small' ? 70 : size === 'medium' ? 90 : 110);

    return (
        <motion.div
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            onDragStart={() => { isDragging.current = true; }}
            onDragEnd={() => {
                setTimeout(() => { isDragging.current = false; }, 50);
            }}
            onPointerUp={handlePointerUp}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: 'white',
                padding: '8px',
                borderRadius: '4px',
                width: `${width}px`,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                position: 'relative',
                pointerEvents: 'auto'
            }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
            <div style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }}>
                <div style={{ transform: `scale(${size === 'small' ? 1 : size === 'medium' ? 1.5 : 2})` }}>
                    {app.icon}
                </div>
            </div>
            <span style={{
                fontSize: size === 'small' ? '11px' : '13px',
                lineHeight: '1.2',
                fontWeight: 500,
                userSelect: 'none'
            }}>
                {app.title}
            </span>
        </motion.div>
    );
};

export const Desktop = () => {
    const { windows, apps, launchApp, desktopState } = useOS();
    const constraintsRef = useRef(null);
    const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });

    const handleContextMenu = (e: React.MouseEvent) => {
        // Only show context menu if clicking directly on the desktop container or the icons area
        const target = e.target as HTMLElement;
        if (target.id === 'desktop-container' || target.id === 'desktop-icons-area') {
            e.preventDefault();
            setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
        }
    };

    const sortedApps = useMemo(() => {
        const appList = Object.values(apps).filter(app => app.showOnDesktop !== false);
        if (desktopState.sortOrder === 'name-asc') {
            return [...appList].sort((a, b) => a.title.localeCompare(b.title));
        } else if (desktopState.sortOrder === 'name-desc') {
            return [...appList].sort((a, b) => b.title.localeCompare(a.title));
        }
        return appList;
    }, [apps, desktopState.sortOrder]);

    return (
        <div
            id="desktop-container"
            ref={constraintsRef}
            onContextMenu={handleContextMenu}
            style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: desktopState.wallpaper ? `url(${desktopState.wallpaper}) center/cover no-repeat` : undefined,
                backgroundColor: !desktopState.wallpaper ? '#1a1a1a' : undefined
            }}
        >
            {/* Desktop Icons Area */}
            <div
                id="desktop-icons-area"
                style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    flexWrap: 'wrap',
                    height: 'calc(100vh - 48px)',
                    alignContent: 'flex-start',
                    width: '100%',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            >
                {sortedApps.map(app => (
                    <DesktopIcon
                        key={`${app.id}-${desktopState.layoutVersion}`}
                        app={app}
                        launchApp={launchApp}
                        constraintsRef={constraintsRef}
                        size={desktopState.iconSize}
                    />
                ))}
            </div>

            {/* Windows Layer */}
            <AnimatePresence>
                {windows.map(windowState => {
                    const app = apps[windowState.id];
                    if (!app) return null;

                    return (
                        <Window
                            key={windowState.id}
                            windowState={windowState}
                            title={app.title}
                            icon={app.icon}
                            defaultWidth={app.width}
                            defaultHeight={app.height}
                        >
                            {app.component}
                        </Window>
                    );
                })}
            </AnimatePresence>

            <StartMenu />
            <Taskbar />

            {contextMenu.visible && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu({ ...contextMenu, visible: false })}
                />
            )}
        </div>
    );
};
