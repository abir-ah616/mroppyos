import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music as MusicIcon, Globe, Search, Clock, Heart } from 'lucide-react';
import musicsJson from '../assets/musics/All Songs/musics.json';

interface Song {
    name: string;
    url: string;
    source: 'local' | 'external';
    artist?: string;
    duration?: string;
}

export const Music: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'favourites' | 'all'>('favourites');
    const [localSongs, setLocalSongs] = useState<Song[]>([]);
    const [externalSongs, setExternalSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const audioRef = useRef<HTMLAudioElement>(null);

    // Load local songs
    useEffect(() => {
        const modules = import.meta.glob('../assets/musics/*.{mp3,flac,ogg,wav}', { eager: true, query: '?url', import: 'default' });
        const songs: Song[] = Object.entries(modules).map(([path, url]) => {
            const filename = path.split('/').pop()?.split('.').slice(0, -1).join('.') || 'Unknown';
            const decodedName = decodeURIComponent(filename);
            // Try to parse Artist - Title format if present
            const parts = decodedName.split(' - ');
            const title = parts.length > 1 ? parts[0] : decodedName;
            const artist = parts.length > 1 ? parts[1] : 'Unknown Artist';

            return {
                name: title,
                artist: artist,
                url: url as string,
                source: 'local'
            };
        });
        setLocalSongs(songs);
    }, []);

    // Load external songs
    useEffect(() => {
        const songs: Song[] = (musicsJson as any[]).map(item => {
            // Try to parse Artist - Title format if present
            const parts = item.name.split(' - ');
            const title = parts.length > 1 ? parts[0] : item.name;
            const artist = parts.length > 1 ? parts[1] : 'Unknown Artist';

            return {
                name: title,
                artist: artist,
                url: item.link,
                source: 'external'
            };
        });
        setExternalSongs(songs);
    }, []);

    // Audio effects
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSong]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const playSong = (song: Song) => {
        if (currentSong?.url === song.url) {
            togglePlay();
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };



    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleNext = () => {
        const currentList = activeTab === 'favourites' ? localSongs : externalSongs;
        if (!currentSong || currentList.length === 0) return;

        const currentIndex = currentList.findIndex(s => s.url === currentSong.url);
        const nextIndex = (currentIndex + 1) % currentList.length;
        playSong(currentList[nextIndex]);
    };

    const handlePrev = () => {
        const currentList = activeTab === 'favourites' ? localSongs : externalSongs;
        if (!currentSong || currentList.length === 0) return;

        const currentIndex = currentList.findIndex(s => s.url === currentSong.url);
        const prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;
        playSong(currentList[prevIndex]);
    };

    const currentList = activeTab === 'favourites' ? localSongs : externalSongs;
    const filteredList = currentList.filter(song =>
        song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isMobile = window.innerWidth < 768;

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            background: '#1e1e1e', // Darker background for app
            color: '#ffffff',
            fontFamily: '"Segoe UI", "Inter", sans-serif',
            overflow: 'hidden'
        }}>
            {/* Sidebar */}
            <div style={{
                width: isMobile ? '100%' : '260px',
                height: isMobile ? 'auto' : '100%',
                background: '#252525', // Slightly lighter sidebar
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                padding: '10px',
                gap: '8px',
                borderRight: isMobile ? 'none' : '1px solid #333',
                borderBottom: isMobile ? '1px solid #333' : 'none',
                alignItems: isMobile ? 'center' : 'stretch',
                justifyContent: isMobile ? 'space-between' : 'flex-start'
            }}>
                <div style={{ padding: isMobile ? '0' : '0 16px 20px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <MusicIcon size={18} color="white" />
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>Groove Music</span>
                </div>

                <div style={{ padding: isMobile ? '0' : '0 16px', marginBottom: isMobile ? '0' : '16px', flex: isMobile ? 1 : 'none', maxWidth: isMobile ? '200px' : 'none' }}>
                    <div style={{
                        background: '#333',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '6px 12px',
                        border: '1px solid #444'
                    }}>
                        <Search size={14} color="#aaa" style={{ marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                width: '100%',
                                fontSize: '13px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '4px' }}>
                    <button
                        onClick={() => setActiveTab('favourites')}
                        style={{
                            background: activeTab === 'favourites' ? '#3a3a3a' : 'transparent',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '14px',
                            color: activeTab === 'favourites' ? 'white' : '#ccc',
                            textAlign: 'left',
                            transition: 'background 0.2s'
                        }}
                    >
                        <Heart size={18} color={activeTab === 'favourites' ? '#ec4899' : '#ccc'} />
                        {!isMobile && "My Music"}
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        style={{
                            background: activeTab === 'all' ? '#3a3a3a' : 'transparent',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '14px',
                            color: activeTab === 'all' ? 'white' : '#ccc',
                            textAlign: 'left',
                            transition: 'background 0.2s'
                        }}
                    >
                        <Globe size={18} color={activeTab === 'all' ? '#3b82f6' : '#ccc'} />
                        {!isMobile && "Online Stream"}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{
                    padding: '30px 40px',
                    background: 'linear-gradient(to bottom, #2a2a2a, #1e1e1e)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '20px',
                    height: '180px'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: activeTab === 'favourites' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'linear-gradient(135deg, #3b82f6, #10b981)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                    }}>
                        <MusicIcon size={48} color="white" />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', opacity: 0.8 }}>Playlist</div>
                        <h1 style={{ fontSize: '42px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>{activeTab === 'favourites' ? 'My Music' : 'Online Stream'}</h1>
                        <div style={{ marginTop: '12px', fontSize: '14px', opacity: 0.7 }}>
                            {filteredList.length} songs
                        </div>
                    </div>
                </div>

                {/* Song List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px 20px' }}>
                    {/* List Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 4fr 3fr 1fr',
                        padding: '10px 16px',
                        borderBottom: '1px solid #333',
                        fontSize: '13px',
                        color: '#aaa',
                        position: 'sticky',
                        top: 0,
                        background: '#1e1e1e',
                        zIndex: 10
                    }}>
                        <div>#</div>
                        <div>Title</div>
                        <div>Artist</div>
                        <div style={{ textAlign: 'right' }}><Clock size={14} /></div>
                    </div>

                    {/* List Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
                        {filteredList.map((song, index) => (
                            <div
                                key={index}
                                onClick={() => playSong(song)}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '40px 4fr 3fr 1fr',
                                    padding: '12px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    background: currentSong?.url === song.url ? '#333' : 'transparent',
                                    color: currentSong?.url === song.url ? '#ec4899' : '#eee',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentSong?.url !== song.url)
                                        e.currentTarget.style.background = '#2a2a2a';
                                }}
                                onMouseLeave={(e) => {
                                    if (currentSong?.url !== song.url)
                                        e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{ opacity: 0.7, fontSize: '12px' }}>
                                    {currentSong?.url === song.url && isPlaying ? (
                                        <div className="playing-indicator">
                                            <span />
                                            <span />
                                            <span />
                                        </div>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <div style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.name}</div>
                                <div style={{ opacity: 0.7, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist || 'Unknown Artist'}</div>
                                <div style={{ textAlign: 'right', opacity: 0.7, fontSize: '13px' }}>--:--</div>
                            </div>
                        ))}
                        {filteredList.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                                No songs found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Player Bar */}
                <div style={{
                    height: '90px',
                    background: '#181818',
                    borderTop: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    zIndex: 20
                }}>
                    {/* Now Playing Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '30%' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            background: '#333',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <MusicIcon size={24} color="#666" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {currentSong?.name || 'No Song Selected'}
                            </span>
                            <span style={{ fontSize: '12px', color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {currentSong?.artist || 'Select a song to play'}
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '40%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <button onClick={handlePrev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                                <SkipBack size={20} />
                            </button>
                            <button
                                onClick={togglePlay}
                                disabled={!currentSong}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    border: 'none',
                                    color: 'black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: currentSong ? 'pointer' : 'default',
                                    opacity: currentSong ? 1 : 0.5,
                                    transition: 'transform 0.1s'
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" style={{ marginLeft: '2px' }} />}
                            </button>
                            <button onClick={handleNext} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                                <SkipForward size={20} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '400px' }}>
                            <span style={{ fontSize: '11px', color: '#aaa', minWidth: '35px', textAlign: 'right' }}>{formatTime(progress)}</span>
                            <div style={{ flex: 1, position: 'relative', height: '4px', background: '#444', borderRadius: '2px', cursor: 'pointer' }} onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const percent = (e.clientX - rect.left) / rect.width;
                                if (audioRef.current) {
                                    audioRef.current.currentTime = percent * (audioRef.current.duration || 0);
                                    setProgress(audioRef.current.currentTime);
                                }
                            }}>
                                <div style={{ width: `${(progress / (duration || 1)) * 100}%`, height: '100%', background: 'white', borderRadius: '2px' }} />
                            </div>
                            <span style={{ fontSize: '11px', color: '#aaa', minWidth: '35px' }}>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Volume */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', width: '30%' }}>
                        <button onClick={() => setIsMuted(!isMuted)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            style={{
                                width: '100px',
                                height: '4px',
                                accentColor: 'white',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={currentSong?.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleNext}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            />
        </div>
    );
};
