import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube, ArrowRight, Globe, LayoutGrid } from 'lucide-react';
import { SiDiscord } from 'react-icons/si';

export const Introduction = () => {
    return (
        <div style={{
            height: '100%',
            background: '#202020',
            color: '#ffffff',
            fontFamily: '"Segoe UI", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                background: 'linear-gradient(180deg, #2c2c2c 0%, #202020 100%)',
                borderBottom: '1px solid #333'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #00d8ff, #0055ff)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(0, 216, 255, 0.2)'
                    }}>
                        <LayoutGrid size={20} color="white" fill="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px', lineHeight: 1.2 }}>Welcome to Forsaken OS</h1>
                        <p style={{ fontSize: '13px', color: '#a0a0a0', maxWidth: '500px', lineHeight: 1.4 }}>
                            A web-based operating system experiment built with React.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Content Grid */}
            <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {/* Connect Card */}
                <Card delay={0.2}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ padding: '6px', background: 'rgba(255, 0, 85, 0.1)', borderRadius: '6px', color: '#ff0055' }}>
                            <Globe size={18} />
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Connect with Developer</h3>
                    </div>
                    <p style={{ color: '#a0a0a0', fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' }}>
                        Hi, I'm MR OPPY. Follow me on social media for updates and more projects.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <SocialButton icon={<Facebook size={16} />} label="Facebook" href="https://www.facebook.com/mroppy69" color="#1877f2" />
                        <SocialButton icon={<Instagram size={16} />} label="Instagram" href="https://www.instagram.com/mroppy21" color="#e4405f" />
                        <SocialButton icon={<Youtube size={16} />} label="YouTube" href="https://www.youtube.com/@mroppy" color="#ff0000" />
                        <SocialButton icon={<SiDiscord size={16} />} label="Discord" href="http://discordapp.com/users/387161872136273922" color="#5865F2" />
                    </div>
                </Card>
            </div>
        </div>
    );
};

const Card = ({ children, delay }: { children: React.ReactNode, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        style={{
            background: '#2c2c2c',
            border: '1px solid #3a3a3a',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        {children}
    </motion.div>
);

const SocialButton = ({ icon, label, href, color }: { icon: React.ReactNode, label: string, href: string, color: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            background: '#333',
            borderRadius: '6px',
            color: '#e0e0e0',
            textDecoration: 'none',
            fontSize: '12px',
            transition: 'all 0.2s',
            border: '1px solid transparent'
        }}
        onMouseEnter={e => {
            e.currentTarget.style.background = '#3a3a3a';
            e.currentTarget.style.borderColor = color;
            e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.background = '#333';
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.color = '#e0e0e0';
        }}
    >
        <span style={{ color: color }}>{icon}</span>
        <span>{label}</span>
        <ArrowRight size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />
    </a>
);
