
import { motion } from 'framer-motion';
import { Power } from 'lucide-react';
import { useOS } from '../../context/OSContext';

export const ShutdownConfirmation = () => {
    const { shutDown, setShutdownConfirmOpen } = useOS();

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100001, // Above everything including Start Menu
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)'
        }}
            onClick={() => setShutdownConfirmOpen(false)}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{
                    width: '400px',
                    backgroundColor: 'rgba(32, 32, 32, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 59, 48, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ff3b30'
                    }}>
                        <Power size={20} />
                    </div>
                    <h3 style={{ margin: 0, color: 'white', fontSize: '18px', fontWeight: 600 }}>Shut Down?</h3>
                </div>

                <p style={{ margin: 0, color: '#aaa', fontSize: '14px', lineHeight: '1.5' }}>
                    Are you sure you want to shut down Forsaken OS? All unsaved work will be lost.
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button
                        onClick={() => setShutdownConfirmOpen(false)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: 'transparent',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '13px',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setShutdownConfirmOpen(false);
                            shutDown();
                        }}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#ff3b30',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 500,
                            transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        Shut Down
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
