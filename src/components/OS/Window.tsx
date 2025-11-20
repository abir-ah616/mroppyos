import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import type { WindowState } from '../../types';

interface WindowProps {
    windowState: WindowState;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultWidth?: number;
    defaultHeight?: number;
}

export const Window: React.FC<WindowProps> = ({
    windowState,
    title,
    icon,
    children,
    defaultWidth = 800,
    defaultHeight = 600
}) => {
    const { closeApp, minimizeApp, maximizeApp, focusWindow, updateWindowPosition } = useOS();
    const dragControls = useDragControls();

    if (!windowState) return null;

    const { id } = windowState;

    return (
        <motion.div
            initial={{
                scale: 0.8,
                opacity: 0,
                y: 100,
                x: windowState.position ? windowState.position.x : 50,
                width: defaultWidth,
                height: defaultHeight
            }}
            animate={{
                scale: 1,
                opacity: 1,
                width: windowState.isMaximized ? '100vw' : defaultWidth,
                height: windowState.isMaximized ? 'calc(100vh - 48px)' : defaultHeight,
                top: windowState.isMaximized ? 0 : undefined,
                left: windowState.isMaximized ? 0 : undefined,
                x: windowState.isMaximized ? 0 : (windowState.position?.x ?? 50),
                y: windowState.isMaximized ? 0 : (windowState.position?.y ?? 50)
            }}
            exit={{
                scale: 0.8,
                opacity: 0,
                y: 100,
                transition: { duration: 0.2 }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
                position: 'absolute',
                zIndex: windowState.zIndex,
                backgroundColor: '#202020', // Solid dark background
                border: '1px solid #333',
                borderRadius: windowState.isMaximized ? 0 : '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                top: windowState.isMaximized ? 0 : '10%',
                left: windowState.isMaximized ? 0 : '10%',
            }}
            drag={!windowState.isMaximized}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0.05}
            onPointerDown={() => focusWindow(id)}
            onDragEnd={(_, info) => {
                const currentX = windowState.position?.x ?? 50;
                const currentY = windowState.position?.y ?? 50;
                updateWindowPosition(id, {
                    x: currentX + info.offset.x,
                    y: currentY + info.offset.y
                });
            }}
        >
            {/* Title Bar */}
            <div
                onPointerDown={(e) => {
                    dragControls.start(e);
                    focusWindow(id);
                }}
                style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 16px',
                    borderBottom: '1px solid #333',
                    backgroundColor: '#252525',
                    cursor: windowState.isMaximized ? 'default' : 'grab',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {icon}
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#eee' }}>{title}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); minimizeApp(id); }}
                        className="window-control"
                        style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', padding: '4px' }}
                    >
                        <Minus size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); maximizeApp(id); }}
                        className="window-control"
                        style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', padding: '4px' }}
                    >
                        {windowState.isMaximized ? <Square size={14} /> : <Maximize2 size={14} />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); closeApp(id); }}
                        className="window-control close"
                        style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', padding: '4px' }}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', position: 'relative', backgroundColor: '#1a1a1a' }}>
                {/* Clone children to pass data prop if it's a valid React element */}
                {React.isValidElement(children)
                    ? React.cloneElement(children as React.ReactElement<any>, { data: windowState.data })
                    : children
                }
            </div>
        </motion.div>
    );
};
