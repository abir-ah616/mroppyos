import React from 'react';
import { MapPin, Briefcase, Globe, GraduationCap, Target, Gamepad, Palette, Music, Film, Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { SiDiscord } from 'react-icons/si';
import profileImage from '../assets/aboutme/image01.jpg';

export const AboutMe = () => {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            background: '#202020',
            color: '#ffffff',
            fontFamily: '"Segoe UI", sans-serif'
        }}>
            {/* Sidebar / Profile Section */}
            <div style={{
                width: '320px',
                background: '#2c2c2c',
                borderRight: '1px solid #1a1a1a',
                padding: '40px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                overflowY: 'auto'
            }}>
                <div style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #333, #555)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    border: '4px solid #3a3a3a',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    overflow: 'hidden'
                }}>
                    <img
                        src={profileImage}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>Hasanuzzaman Oppy</h1>
                <p style={{ color: '#00d8ff', fontSize: '15px', marginBottom: '24px' }}>Front-end Web Developer</p>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                    <SocialButton icon={<Facebook size={18} />} href="https://www.facebook.com/mroppy69" />
                    <SocialButton icon={<Instagram size={18} />} href="https://www.instagram.com/mroppy21" />
                    <SocialButton icon={<Youtube size={18} />} href="https://www.youtube.com/@mroppy" />
                    <SocialButton icon={<SiDiscord size={18} />} href="http://discordapp.com/users/387161872136273922" />
                </div>

                <div style={{ width: '100%', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '13px', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Contact Info</h3>
                    <ContactRow icon={<MapPin size={16} />} text="Dhaka, Bangladesh" />
                    <ContactRow icon={<Mail size={16} />} text="Contact via Socials" />
                    <ContactRow icon={<Globe size={16} />} text="Bangla, English, Hindi" />
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <Section title="Overview">
                    <div style={{ background: '#2c2c2c', borderRadius: '8px', padding: '20px', border: '1px solid #3a3a3a', lineHeight: '1.6', color: '#d0d0d0' }}>
                        Hello! I'm a passionate developer dedicated to building beautiful and functional web experiences.
                        I specialize in Front-end technologies like React and Next.js, transforming complex requirements into
                        simple, elegant solutions.
                    </div>
                </Section>

                <Section title="Professional Journey">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                        <InfoCard icon={<Briefcase size={20} color="#00d8ff" />} title="Experience" value="6+ Months" sub="Web Development" />
                        <InfoCard icon={<Target size={20} color="#ff0055" />} title="Specialization" value="Front-end" sub="React, Next.js" />
                        <InfoCard icon={<GraduationCap size={20} color="#ffcc00" />} title="Education" value="Diploma" sub="Civil Engineering" />
                        <InfoCard icon={<Target size={20} color="#00ff99" />} title="Goal" value="SEO" sub="Optimization" />
                    </div>
                </Section>

                <Section title="Personal Details">
                    <div style={{ background: '#2c2c2c', borderRadius: '8px', border: '1px solid #3a3a3a', overflow: 'hidden' }}>
                        <DetailRow label="Age" value="23 Years Old" />
                        <DetailRow label="Status" value="Single" />
                        <DetailRow label="Nationality" value="Bangladeshi" />
                    </div>
                </Section>

                <Section title="Interests & Hobbies">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <InterestTag icon={<Gamepad size={16} />} label="Gaming" />
                        <InterestTag icon={<Palette size={16} />} label="Anime" />
                        <InterestTag icon={<Music size={16} />} label="Music" />
                        <InterestTag icon={<Film size={16} />} label="Movies" />
                    </div>
                </Section>
            </div>
        </div>
    );
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#ffffff' }}>{title}</h2>
        {children}
    </div>
);

const SocialButton = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#3a3a3a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#e0e0e0',
            textDecoration: 'none',
            transition: 'all 0.2s'
        }}
        onMouseEnter={e => {
            e.currentTarget.style.background = '#4a4a4a';
            e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.background = '#3a3a3a';
            e.currentTarget.style.color = '#e0e0e0';
        }}
    >
        {icon}
    </a>
);

const ContactRow = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: '#d0d0d0', fontSize: '14px' }}>
        <span style={{ color: '#888' }}>{icon}</span>
        <span>{text}</span>
    </div>
);

const InfoCard = ({ icon, title, value, sub }: { icon: React.ReactNode, title: string, value: string, sub: string }) => (
    <div style={{
        background: '#2c2c2c',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #3a3a3a',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    }}>
        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '13px', color: '#888' }}>{title}</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{value}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{sub}</div>
        </div>
    </div>
);

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid #3a3a3a',
        fontSize: '14px'
    }}>
        <span style={{ color: '#a0a0a0' }}>{label}</span>
        <span style={{ color: '#fff', fontWeight: 500 }}>{value}</span>
    </div>
);

const InterestTag = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: '#2c2c2c',
        borderRadius: '20px',
        border: '1px solid #3a3a3a',
        fontSize: '14px',
        color: '#e0e0e0'
    }}>
        {icon}
        <span>{label}</span>
    </div>
);
