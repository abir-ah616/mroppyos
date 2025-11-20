import { useMemo } from 'react';
import { FolderGit2, ExternalLink } from 'lucide-react';
import projectsJson from '../assets/projects/json.txt?raw';

// Define the Project interface
interface Project {
    name: string;
    description: string;
    tags: string[];
    link: string;
    picture: string;
}

export const Projects = () => {
    // Parse the JSON data
    const projects: Project[] = useMemo(() => {
        try {
            return JSON.parse(projectsJson);
        } catch (e) {
            console.error("Failed to parse projects JSON", e);
            return [];
        }
    }, []);

    // Dynamically import all images from the assets/projects folder
    const images = import.meta.glob<{ default: string }>('../assets/projects/*.png', { eager: true });

    const getImageUrl = (filename: string) => {
        const path = `../assets/projects/${filename}`;
        return images[path]?.default || '';
    };

    return (
        <div style={{ padding: '30px', color: 'white', height: '100%', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>My Projects</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {projects.map((project, index) => (
                    <div key={index} style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {/* Project Image */}
                        <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                            {getImageUrl(project.picture) ? (
                                <img
                                    src={getImageUrl(project.picture)}
                                    alt={project.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FolderGit2 size={48} color="#555" />
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                            <h3 style={{ fontSize: '18px', margin: 0 }}>{project.name}</h3>

                            <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.5', flex: 1 }}>{project.description}</p>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {project.tags.map(t => (
                                    <span key={t} style={{
                                        fontSize: '12px',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: '#fff'
                                    }}>
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#0078d4',
                                        color: 'white',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        fontSize: '14px'
                                    }}
                                >
                                    <ExternalLink size={14} /> Visit
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
