import React, { useMemo, useState } from 'react';
import { useOS } from '../context/OSContext';

// Dynamic asset loading for local images
const imageModules = import.meta.glob('../assets/images/*', { eager: true });

// Component to handle image loading state
const ImageWithLoader: React.FC<{
    src: string;
    alt: string;
    onClick: () => void;
    isSelected: boolean;
}> = ({ src, alt, onClick, isSelected }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div
            onClick={onClick}
            style={{
                aspectRatio: '16/9',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: isSelected ? '2px solid #60A5FA' : '2px solid transparent',
                position: 'relative',
                transform: 'translateZ(0)',
                background: '#2a2a2a'
            }}
            title={alt}
        >
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#333'
                }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #444',
                        borderTopColor: '#60A5FA',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                onLoad={() => setIsLoading(false)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: isLoading ? 'none' : 'block',
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease'
                }}
            />
            {!isLoading && (
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '8px',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                >
                    <span style={{ fontSize: '11px', color: '#fff' }}>{alt}</span>
                </div>
            )}
        </div>
    );
};

export const Personalization: React.FC = () => {
    const { desktopState, setWallpaper } = useOS();

    // Process local images
    const localImages = useMemo(() => {
        return Object.entries(imageModules).map(([path, mod]) => {
            const content = (mod as { default: string }).default;
            return {
                id: path,
                url: content,
                name: path.split('/').pop()?.split('.')[0] || 'Unknown'
            };
        });
    }, []);

    // Predefined wallpapers (Online)
    const onlineWallpapers = [
        { id: 'default', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', name: 'Default' },
        { id: 'blue', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=80', name: 'Abstract Blue' },
        { id: 'mountain', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80', name: 'Mountain' },
        { id: 'city', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80', name: 'City Lights' },
        { id: 'forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80', name: 'Forest' },
        { id: 'sunset', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80', name: 'Sunset' },
        { id: 'space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80', name: 'Deep Space' },
        { id: 'minimal', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1600&q=80', name: 'Minimal' },
        { id: 'desert', url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1600&q=80', name: 'Desert' },
        { id: 'ocean', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1600&q=80', name: 'Ocean' }
    ];

    return (
        <div style={{
            height: '100%',
            background: '#1a1a1a',
            color: '#fff',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            overflowY: 'auto'
        }}>
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Background</h2>
                <p style={{ color: '#aaa' }}>Personalize your desktop background</p>
            </div>

            {/* Current Preview */}
            <div style={{
                width: '100%',
                height: '200px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: desktopState.wallpaper ? `url(${desktopState.wallpaper}) center/cover` : '#202020',
                border: '1px solid #333',
                position: 'relative',
                flexShrink: 0
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backdropFilter: 'blur(4px)'
                }}>
                    Current Background
                </div>
            </div>

            {/* Online Wallpapers */}
            <div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Featured</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '16px'
                }}>
                    {onlineWallpapers.map(wp => (
                        <ImageWithLoader
                            key={wp.id}
                            src={wp.url}
                            alt={wp.name}
                            onClick={() => setWallpaper(wp.url)}
                            isSelected={desktopState.wallpaper === wp.url}
                        />
                    ))}
                </div>
            </div>

            {/* Local Assets */}
            <div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Local Images</h3>
                {localImages.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '16px'
                    }}>
                        {localImages.map(img => (
                            <ImageWithLoader
                                key={img.id}
                                src={img.url}
                                alt={img.name}
                                onClick={() => setWallpaper(img.url)}
                                isSelected={desktopState.wallpaper === img.url}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ color: '#888', fontStyle: 'italic' }}>
                        No images found in src/assets/images
                    </div>
                )}
            </div>
        </div>
    );
};
