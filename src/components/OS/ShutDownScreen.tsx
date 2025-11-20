import { Power } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { motion } from 'framer-motion';

export const ShutDownScreen = () => {
    const { turnOn } = useOS();

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '40px'
        }}>
            <motion.button
                onClick={turnOn}
                whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'transparent',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    outline: 'none'
                }}
            >
                <Power size={24} />
            </motion.button>
        </div>
    );
};
