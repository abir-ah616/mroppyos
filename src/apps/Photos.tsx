import React, { useState } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface PhotosProps {
    data?: {
        url: string;
        name: string;
    };
}

export const Photos: React.FC<PhotosProps> = ({ data }) => {
    const [scale, setScale] = useState(1);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5));

    if (!data?.url) {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <ImageIcon size={48} />
                <p>No photo selected</p>
                <p style={{ fontSize: '12px' }}>Open an image from File Manager</p>
            </div>
        );
    }

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#111',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Toolbar */}
            <div style={{
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                background: 'rgba(30,30,30,0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 10
            }}>
                <button onClick={handleZoomOut} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <ZoomOut size={20} />
                </button>
                <span style={{ color: 'white', fontSize: '12px', alignSelf: 'center' }}>{Math.round(scale * 100)}%</span>
                <button onClick={handleZoomIn} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <ZoomIn size={20} />
                </button>
            </div>

            {/* Image Container */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'auto',
                padding: '20px'
            }}>
                <img
                    src={data.url}
                    alt={data.name}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        transform: `scale(${scale})`,
                        transition: 'transform 0.2s ease-out'
                    }}
                />
            </div>

            {/* Navigation Overlay (Mockup for now as we don't have a list of files passed yet) */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                zIndex: 10
            }}>
                <button style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'none' // Hidden for now until we implement playlist/gallery
                }}>
                    <ChevronLeft size={24} />
                </button>
            </div>
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                zIndex: 10
            }}>
                <button style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'none' // Hidden for now
                }}>
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};
