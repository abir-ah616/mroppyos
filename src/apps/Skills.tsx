import { motion } from 'framer-motion';

export const Skills = () => {
    const skills = [
        { name: 'HTML', level: 96, color: '#E34F26' },
        { name: 'CSS', level: 85, color: '#1572B6' },
        { name: 'JavaScript', level: 80, color: '#F7DF1E' },
        { name: 'React', level: 80, color: '#61DAFB' },
        { name: 'Next.js', level: 70, color: '#000000' },
        { name: 'TypeScript', level: 75, color: '#3178C6' },
        { name: 'Tailwind CSS', level: 70, color: '#06B6D4' },
        { name: 'Figma', level: 10, color: '#F24E1E' },
    ];

    return (
        <div style={{ padding: '30px', color: 'white', height: '100%', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>Technical Proficiency</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {skills.map((skill, index) => (
                    <div key={skill.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>{skill.name}</span>
                            <span style={{ color: '#a0a0a0' }}>{skill.level}%</span>
                        </div>
                        <div style={{
                            height: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                style={{
                                    height: '100%',
                                    background: skill.color === '#000000' ? '#fff' : skill.color,
                                    borderRadius: '4px',
                                    boxShadow: `0 0 10px ${skill.color}`
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
