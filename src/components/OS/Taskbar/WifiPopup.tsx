import { Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOS } from '../../../context/OSContext';

interface WifiPopupProps {
    centerPosition?: number;
}

export const WifiPopup = ({ centerPosition }: WifiPopupProps) => {
    const { isWifiEnabled, toggleWifi } = useOS();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
                position: 'fixed',
                bottom: '60px',
                ...(centerPosition ? { left: centerPosition - 140 } : { right: '150px' }),
                width: '280px',
                backgroundColor: 'rgba(32, 32, 32, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                zIndex: 10001,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}
            onClick={e => e.stopPropagation()}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Wi-Fi</h3>
                <div
                    onClick={toggleWifi}
                    style={{
                        width: '40px',
                        height: '24px',
                        backgroundColor: isWifiEnabled ? 'var(--accent-color)' : '#444',
                        borderRadius: '12px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                >
                    <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: isWifiEnabled ? '18px' : '2px',
                        transition: 'left 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                </div>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: isWifiEnabled ? 'rgba(0, 120, 212, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isWifiEnabled ? 'var(--accent-color)' : '#aaa'
                }}>
                    {isWifiEnabled ? <Wifi size={20} /> : <WifiOff size={20} />}
                </div>
                <div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>
                        {isWifiEnabled ? 'Forsaken OS' : 'Wi-Fi Off'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>
                        {isWifiEnabled ? 'Connected' : 'Turn on Wi-Fi to connect'}
                    </div>
                </div>
            </div>

            {isWifiEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#aaa', fontWeight: 500, paddingLeft: '4px' }}>
                        Available Networks
                    </div>
                    {['SkyNet 5G', 'FBI Surveillance Van', 'Pretty Fly for a WiFi'].map(net => (
                        <div key={net} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <Wifi size={16} color="#aaa" />
                            <span style={{ fontSize: '13px' }}>{net}</span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};
