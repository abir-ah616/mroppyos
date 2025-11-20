import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';

export const BootScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999,
                color: 'white'
            }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px'
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                }}>
                    <LayoutGrid size={80} color="#00d2ff" />
                </div>

                <h1 style={{
                    fontFamily: '"Segoe UI", sans-serif',
                    fontSize: '32px',
                    fontWeight: 300,
                    letterSpacing: '4px',
                    margin: 0,
                    background: 'linear-gradient(to right, #fff, #aaa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    FORSAKEN OS
                </h1>

                <div style={{
                    marginTop: '40px',
                    position: 'relative',
                    width: '40px',
                    height: '40px'
                }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: '3px solid rgba(255, 255, 255, 0.1)',
                            borderTopColor: 'white'
                        }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};
