import { useState, useMemo } from 'react';
import { Folder, FileText, Image as ImageIcon, Film, Search, ArrowUp } from 'lucide-react';
import { useOS } from '../context/OSContext';

interface FileSystemItem {
    id: string;
    name: string;
    type: 'folder' | 'image' | 'video' | 'document';
    content?: string; // URL for media or text content
    children?: FileSystemItem[];
}

// Dynamic asset loading
const imageModules = import.meta.glob('../assets/images/*', { eager: true });
const videoModules = import.meta.glob('../assets/videos/*', { eager: true });

const processAssets = (modules: Record<string, unknown>, type: 'image' | 'video'): FileSystemItem[] => {
    return Object.entries(modules).map(([path, mod], index) => {
        const filename = path.split('/').pop() || '';
        const name = filename.split('.').slice(0, -1).join('.'); // Remove extension
        const content = (mod as { default: string }).default;
        return {
            id: `${type}-${index}`,
            name,
            type,
            content
        };
    });
};

const images = processAssets(imageModules, 'image');
const videos = processAssets(videoModules, 'video');

import collectedImagesJson from '../assets/images/collected/images.json?raw';
import collectedVideosJson from '../assets/videos/collected/videos.json?raw';

// Parse collected assets
const collectedImages = JSON.parse(collectedImagesJson).map((img: any, index: number) => ({
    id: `collected-image-${index}`,
    name: img.name,
    type: 'image',
    content: img.link
}));

const collectedVideos = JSON.parse(collectedVideosJson).map((vid: any, index: number) => ({
    id: `collected-video-${index}`,
    name: vid.name,
    type: 'video',
    content: vid.link
}));

const initialFileSystem: FileSystemItem[] = [
    {
        id: 'root',
        name: 'This PC',
        type: 'folder',
        children: [
            {
                id: 'pictures',
                name: 'Pictures',
                type: 'folder',
                children: [
                    {
                        id: 'collected-images',
                        name: 'Collected',
                        type: 'folder',
                        children: collectedImages
                    },
                    ...images
                ]
            },
            {
                id: 'videos',
                name: 'Videos',
                type: 'folder',
                children: [
                    {
                        id: 'collected-videos',
                        name: 'Collected',
                        type: 'folder',
                        children: collectedVideos
                    },
                    ...videos
                ]
            }
        ]
    }
];

export const FileManager = () => {
    const { launchApp } = useOS();
    const [currentPath, setCurrentPath] = useState<FileSystemItem[]>([]);
    const [currentFolder, setCurrentFolder] = useState<FileSystemItem>(initialFileSystem[0]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleNavigate = (folder: FileSystemItem) => {
        setCurrentPath([...currentPath, currentFolder]);
        setCurrentFolder(folder);
        setSearchQuery(''); // Clear search on navigation
    };

    const handleUp = () => {
        if (currentPath.length > 0) {
            const parent = currentPath[currentPath.length - 1];
            setCurrentPath(currentPath.slice(0, -1));
            setCurrentFolder(parent);
            setSearchQuery('');
        }
    };

    const handleItemClick = (item: FileSystemItem) => {
        if (item.type === 'folder') {
            handleNavigate(item);
        } else if (item.type === 'video') {
            launchApp('video-player', { url: item.content, name: item.name });
        } else if (item.type === 'image') {
            launchApp('photos', { url: item.content, name: item.name });
        } else {
            console.log('Opening file:', item.name);
        }
    };

    const getIcon = (item: FileSystemItem) => {
        if (item.type === 'image' && item.content) {
            return (
                <div style={{ width: '100%', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '4px', background: '#000' }}>
                    <img src={item.content} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            );
        }
        if (item.type === 'video' && item.content) {
            return (
                <div style={{ width: '100%', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '4px', background: '#000' }}>
                    <video src={item.content} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            );
        }

        switch (item.type) {
            case 'folder': return <Folder size={48} fill="#FCD34D" color="#F59E0B" />;
            case 'image': return <ImageIcon size={48} color="#60A5FA" />;
            case 'video': return <Film size={48} color="#F472B6" />;
            default: return <FileText size={48} color="#9CA3AF" />;
        }
    };

    const filteredChildren = useMemo(() => {
        if (!currentFolder.children) return [];
        if (!searchQuery) return currentFolder.children;
        return currentFolder.children.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [currentFolder, searchQuery]);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#eee' }}>
            {/* Toolbar */}
            <div style={{
                padding: '12px',
                borderBottom: '1px solid #333',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                backgroundColor: '#252525'
            }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={handleUp}
                        disabled={currentPath.length === 0}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: currentPath.length === 0 ? '#555' : '#eee',
                            cursor: currentPath.length === 0 ? 'default' : 'pointer',
                            padding: '4px'
                        }}
                    >
                        <ArrowUp size={20} />
                    </button>
                </div>

                <div style={{
                    flex: 1,
                    background: '#1a1a1a',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid #333'
                }}>
                    <Folder size={14} color="#888" />
                    <span>{currentPath.map(p => p.name).join(' > ')} {currentPath.length > 0 ? '>' : ''} {currentFolder.name}</span>
                </div>

                <div style={{
                    background: '#1a1a1a',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '200px',
                    border: '1px solid #333'
                }}>
                    <Search size={14} color="#888" style={{ marginRight: '8px' }} />
                    <input
                        type="text"
                        placeholder={`Search ${currentFolder.name}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#eee',
                            width: '100%',
                            fontSize: '13px',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '16px',
                    alignItems: 'start'
                }}>
                    {filteredChildren.map(item => (
                        <div
                            key={item.id}
                            onDoubleClick={() => handleItemClick(item)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            {getIcon(item)}
                            <span style={{
                                fontSize: '13px',
                                textAlign: 'center',
                                wordBreak: 'break-word',
                                maxWidth: '100%'
                            }}>
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
