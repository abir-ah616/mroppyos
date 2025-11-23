import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize, RotateCcw, RotateCw } from 'lucide-react';
import { useOS } from '../context/OSContext';
import type { AppData } from '../types';

interface VideoPlayerProps {
    data?: AppData;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ data }) => {
    const { activeWindowId } = useOS();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastTapRef = useRef<{ time: number, x: number } | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [availableSubtitles, setAvailableSubtitles] = useState<TextTrack[]>([]);

    // Close context menu on click outside
    useEffect(() => {
        const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            setContextMenu({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                visible: true
            });
        }
    };

    const updateSubtitlesList = () => {
        if (videoRef.current) {
            const tracks = Array.from(videoRef.current.textTracks);
            setAvailableSubtitles(tracks);
        }
    };

    const handleUploadSubtitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            let vttContent = content;

            // Simple SRT to VTT conversion
            if (file.name.endsWith('.srt')) {
                vttContent = "WEBVTT\n\n" + content.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
            }

            const blob = new Blob([vttContent], { type: 'text/vtt' });
            const url = URL.createObjectURL(blob);

            if (videoRef.current) {
                // Remove existing tracks
                const oldTracks = videoRef.current.querySelectorAll('track');
                oldTracks.forEach(t => t.remove());

                const track = document.createElement('track');
                track.kind = 'subtitles';
                track.label = file.name;
                track.srclang = 'en';
                track.src = url;
                track.default = true;
                videoRef.current.appendChild(track);

                // Wait for track to be ready or just set it on the element's track property
                // We need to access the TextTrack object from the track element
                if (track.track) {
                    track.track.mode = 'showing';
                }

                updateSubtitlesList();
            }
        };
        reader.readAsText(file);
    };

    const toggleSubtitle = (index: number) => {
        if (videoRef.current) {
            const tracks = videoRef.current.textTracks;
            for (let i = 0; i < tracks.length; i++) {
                tracks[i].mode = i === index ? 'showing' : 'hidden';
            }
            setContextMenu({ ...contextMenu, visible: false });
            updateSubtitlesList(); // Force re-render
        }
    };

    const disableSubtitles = () => {
        if (videoRef.current) {
            const tracks = videoRef.current.textTracks;
            for (let i = 0; i < tracks.length; i++) {
                tracks[i].mode = 'hidden';
            }
            setContextMenu({ ...contextMenu, visible: false });
            updateSubtitlesList(); // Force re-render
        }
    };

    useEffect(() => {
        let mounted = true;
        if (videoRef.current && data?.url && typeof data.url === 'string') {
            videoRef.current.src = data.url;
            videoRef.current.play()
                .then(() => {
                    if (mounted) setIsPlaying(true);
                })
                .catch(() => {
                    if (mounted) setIsPlaying(false);
                });
        }
        return () => {
            mounted = false;
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [data]);

    // Listen for new tracks (e.g. uploaded ones)
    useEffect(() => {
        const videoEl = videoRef.current;
        if (videoEl) {
            const tracks = videoEl.textTracks;
            tracks.addEventListener('addtrack', updateSubtitlesList);
            tracks.addEventListener('removetrack', updateSubtitlesList);
            tracks.addEventListener('change', updateSubtitlesList); // Listen for mode changes
            return () => {
                tracks.removeEventListener('addtrack', updateSubtitlesList);
                tracks.removeEventListener('removetrack', updateSubtitlesList);
                tracks.removeEventListener('change', updateSubtitlesList);
            };
        }
    }, [videoRef.current]); // Re-run if ref changes (unlikely but safe)

    const skipForward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
        }
    };

    const skipBackward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeWindowId === 'video-player') {
                if (e.key === 'ArrowRight') {
                    skipForward();
                } else if (e.key === 'ArrowLeft') {
                    skipBackward();
                } else if (e.key === ' ') {
                    e.preventDefault();
                    togglePlay();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeWindowId, isPlaying]);

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };

    const handleMouseLeave = () => {
        if (isPlaying) {
            setShowControls(false);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const now = Date.now();
        const touch = e.changedTouches[0];
        const rect = containerRef.current?.getBoundingClientRect();

        if (!rect) return;

        const x = touch.clientX - rect.left;
        const width = rect.width;

        if (lastTapRef.current && (now - lastTapRef.current.time < 300)) {
            // Double tap detected
            if (x > width / 2) {
                skipForward();
            } else {
                skipBackward();
            }
            lastTapRef.current = null; // Reset
        } else {
            lastTapRef.current = { time: now, x };
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setShowControls(true); // Always show controls when paused
                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            } else {
                videoRef.current.play();
                // Start hiding timer when playing starts
                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                controlsTimeoutRef.current = setTimeout(() => {
                    setShowControls(false);
                }, 3000);
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            updateSubtitlesList();
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const seekTime = (parseFloat(e.target.value) / 100) * duration;
        if (videoRef.current) {
            videoRef.current.currentTime = seekTime;
            setProgress(parseFloat(e.target.value));
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!data?.url || typeof data.url !== 'string') {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <p>No video selected</p>
                <p style={{ fontSize: '12px' }}>Open a video from File Manager</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchEnd={handleTouchEnd}
            onContextMenu={handleContextMenu}
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#000',
                position: 'relative',
                overflow: 'hidden',
                cursor: showControls ? 'default' : 'none',
                isolation: 'isolate' // Create new stacking context
            }}
        >
            <video
                ref={videoRef}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    position: 'relative',
                    zIndex: 1,
                    transform: 'translateZ(0)',
                    filter: 'brightness(1)' // Force GPU composition to prevent hardware overlay
                }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                    setIsPlaying(false);
                    setShowControls(true);
                }}
            >
                {/* Tracks will be added here dynamically */}
            </video>

            {/* Hidden File Input for Subtitles */}
            <input
                type="file"
                ref={fileInputRef}
                accept=".srt,.vtt"
                style={{ display: 'none' }}
                onChange={handleUploadSubtitle}
            />

            {/* Context Menu */}
            {contextMenu.visible && (
                <div style={{
                    position: 'absolute',
                    top: contextMenu.y,
                    left: contextMenu.x,
                    background: 'rgba(30, 30, 30, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 0',
                    zIndex: 2147483647,
                    minWidth: '220px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }} onClick={(e) => e.stopPropagation()}>
                    <div
                        style={{ padding: '8px 16px', cursor: 'pointer', color: 'white', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={() => {
                            fileInputRef.current?.click();
                            setContextMenu({ ...contextMenu, visible: false });
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <span>📂</span> Upload Subtitle (.srt/.vtt)
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

                    <div style={{ padding: '8px 16px', color: '#aaa', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Subtitles</div>
                    <div
                        style={{ padding: '8px 16px', cursor: 'pointer', color: 'white', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        onClick={disableSubtitles}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <span>Off</span>
                    </div>
                    {availableSubtitles.map((track, index) => (
                        <div
                            key={index}
                            style={{ padding: '8px 16px', cursor: 'pointer', color: 'white', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            onClick={() => toggleSubtitle(index)}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                                {track.label || `Subtitle ${index + 1}`}
                            </span>
                            {track.mode === 'showing' && <span style={{ color: '#10b981' }}>✓</span>}
                        </div>
                    ))}

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                    <div style={{ padding: '8px 16px', color: '#aaa', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Audio Tracks</div>
                    <div
                        style={{ padding: '8px 16px', cursor: 'pointer', color: 'white', fontSize: '14px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        Default Audio (Browser)
                    </div>
                </div>
            )}

            {/* Controls Overlay */}
            <div style={{
                position: isFullscreen ? 'fixed' : 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', // Slightly darker for better visibility
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                opacity: showControls ? 1 : 0,
                transition: 'opacity 0.3s',
                pointerEvents: showControls ? 'auto' : 'none',
                zIndex: 2147483647,
                transform: 'translateZ(0)', // Force new stacking context
                backdropFilter: 'blur(0px)' // Hack to force composition
            }}>
                {/* Progress Bar */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress || 0}
                    onChange={handleSeek}
                    style={{
                        width: '100%',
                        height: '4px',
                        appearance: 'none',
                        background: `linear-gradient(to right, var(--accent-color) ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
                        borderRadius: '2px',
                        cursor: 'pointer'
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button onClick={skipBackward} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} title="-10s">
                                <RotateCcw size={20} />
                            </button>
                            <button onClick={skipForward} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} title="+10s">
                                <RotateCw size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                style={{ width: '80px', height: '4px' }}
                            />
                        </div>

                        <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                            {formatTime(progress / 100 * duration)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <SkipBack size={20} />
                        </button>
                        <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <SkipForward size={20} />
                        </button>
                        <button onClick={toggleFullscreen} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
