import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOS } from '../../../context/OSContext';

interface VolumePopupProps {
    centerPosition?: number;
}

export const VolumePopup = ({ centerPosition }: VolumePopupProps) => {
    const { volume, setVolume, isMuted, toggleMute } = useOS();

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX size={24} />;
        if (volume < 50) return <Volume1 size={24} />;
        return <Volume2 size={24} />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
                position: 'fixed',
                bottom: '60px',
                ...(centerPosition ? { left: centerPosition - 30 } : { right: '100px' }),
                width: '60px',
                height: '200px',
                backgroundColor: 'rgba(32, 32, 32, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px 0',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                zIndex: 10001,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
            onClick={e => e.stopPropagation()}
        >
            <div style={{
                height: '120px',
                width: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end'
            }}>
                <div style={{
                    width: '100%',
                    height: `${isMuted ? 0 : volume}%`,
                    backgroundColor: 'var(--accent-color)',
                    borderRadius: '3px',
                    transition: 'height 0.1s'
                }} />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                        if (isMuted) toggleMute();
                        setVolume(Number(e.target.value));
                    }}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '-12px',
                        width: '30px',
                        height: '120px',
                        opacity: 0,
                        cursor: 'pointer',
                        appearance: 'slider-vertical' as any // Note: standard input range doesn't support vertical well in all browsers, but we'll use a transform trick if needed or just standard range for now. 
                        // Actually, standard range is horizontal. Let's make it a vertical slider properly or just a simple click/drag area.
                        // For simplicity in this environment, let's use a standard input and rotate it.
                    }}
                />
                {/* Better vertical slider implementation using standard input rotated */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                        if (isMuted) toggleMute();
                        setVolume(Number(e.target.value));
                    }}
                    style={{
                        position: 'absolute',
                        width: '120px',
                        height: '30px',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '15px 15px',
                        bottom: '-15px',
                        left: '-12px',
                        opacity: 0,
                        cursor: 'pointer'
                    }}
                />
            </div>

            <button
                onClick={toggleMute}
                style={{
                    background: isMuted ? 'rgba(255, 59, 48, 0.2)' : 'transparent',
                    border: 'none',
                    color: isMuted ? '#ff3b30' : 'white',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = isMuted ? 'rgba(255, 59, 48, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = isMuted ? 'rgba(255, 59, 48, 0.2)' : 'transparent'}
            >
                {getVolumeIcon()}
            </button>
        </motion.div>
    );
};
