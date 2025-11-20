import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Monitor, LayoutGrid, Settings, ChevronRight, Check, ArrowDownAZ } from 'lucide-react';
import { useOS } from '../../context/OSContext';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose }) => {
    const { desktopState, setIconSize, setSortOrder, launchApp, resetIconPositions } = useOS();
    const menuRef = useRef<HTMLDivElement>(null);
    const [showViewSubmenu, setShowViewSubmenu] = useState(false);
    const [showSortSubmenu, setShowSortSubmenu] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleRefresh = () => {
        // Force a re-render of the desktop by toggling a dummy state or just closing for now
        // In a real OS, this might reload icons. Here we can just close the menu as React handles updates.
        // To simulate a visual refresh, we could add a flash effect in Desktop.tsx, but for now just close.
        onClose();
        // We can simulate a refresh by dispatching a custom event if needed, but React state updates are instant.
        window.dispatchEvent(new Event('desktop-refresh'));
    };

    const handlePersonalize = () => {
        launchApp('personalization');
        onClose();
    };

    return (
        <div
            ref={menuRef}
            style={{
                position: 'fixed',
                top: y,
                left: x,
                width: '250px',
                backgroundColor: 'rgba(32, 32, 32, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '4px',
                zIndex: 9999,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                color: '#fff',
                fontSize: '14px',
                userSelect: 'none'
            }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* View Submenu Trigger */}
            <div
                className="menu-item"
                onMouseEnter={() => { setShowViewSubmenu(true); setShowSortSubmenu(false); }}
                style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    position: 'relative'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Monitor size={16} />
                    <span>View</span>
                </div>
                <ChevronRight size={14} />

                {showViewSubmenu && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '100%',
                        width: '200px',
                        backgroundColor: 'rgba(32, 32, 32, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '4px',
                        marginLeft: '4px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div className="submenu-item" onClick={() => { setIconSize('large'); onClose(); }}>
                            <div style={{ width: '20px' }}>{desktopState.iconSize === 'large' && <Check size={14} />}</div>
                            Large icons
                        </div>
                        <div className="submenu-item" onClick={() => { setIconSize('medium'); onClose(); }}>
                            <div style={{ width: '20px' }}>{desktopState.iconSize === 'medium' && <Check size={14} />}</div>
                            Medium icons
                        </div>
                        <div className="submenu-item" onClick={() => { setIconSize('small'); onClose(); }}>
                            <div style={{ width: '20px' }}>{desktopState.iconSize === 'small' && <Check size={14} />}</div>
                            Small icons
                        </div>
                    </div>
                )}
            </div>

            {/* Sort Submenu Trigger */}
            <div
                className="menu-item"
                onMouseEnter={() => { setShowSortSubmenu(true); setShowViewSubmenu(false); }}
                style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    position: 'relative'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowDownAZ size={16} />
                    <span>Sort by</span>
                </div>
                <ChevronRight size={14} />

                {showSortSubmenu && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '100%',
                        width: '200px',
                        backgroundColor: 'rgba(32, 32, 32, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '4px',
                        marginLeft: '4px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div className="submenu-item" onClick={() => { setSortOrder('name-asc'); onClose(); }}>
                            <div style={{ width: '20px' }}>{desktopState.sortOrder === 'name-asc' && <Check size={14} />}</div>
                            Name
                        </div>
                    </div>
                )}
            </div>

            <div
                className="menu-item"
                onClick={() => { resetIconPositions(); onClose(); }}
                onMouseEnter={() => { setShowViewSubmenu(false); setShowSortSubmenu(false); }}
                style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                }}
            >
                <LayoutGrid size={16} />
                <span>Auto arrange icons</span>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '4px 0' }} />

            <div
                className="menu-item"
                onClick={handleRefresh}
                onMouseEnter={() => { setShowViewSubmenu(false); setShowSortSubmenu(false); }}
                style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                }}
            >
                <RefreshCw size={16} />
                <span>Refresh</span>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '4px 0' }} />

            <div
                className="menu-item"
                onClick={handlePersonalize}
                onMouseEnter={() => { setShowViewSubmenu(false); setShowSortSubmenu(false); }}
                style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                }}
            >
                <Settings size={16} />
                <span>Personalize</span>
            </div>

            <style>{`
                .menu-item:hover, .submenu-item:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
                .submenu-item {
                    padding: 8px 12px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};
