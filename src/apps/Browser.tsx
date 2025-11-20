import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search, ExternalLink, Shield, ShieldAlert } from 'lucide-react';

export const Browser = () => {
    const [history, setHistory] = useState<string[]>(['https://www.google.com/webhp?igu=1']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputUrl, setInputUrl] = useState('https://www.google.com');
    const [iframeKey, setIframeKey] = useState(0);
    const [useProxy, setUseProxy] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const currentUrl = history[currentIndex];

    // Update input when history changes
    useEffect(() => {
        let displayUrl = currentUrl;
        // Clean up proxy url for display
        if (displayUrl.includes('api.allorigins.win/raw?url=')) {
            displayUrl = displayUrl.replace('https://api.allorigins.win/raw?url=', '');
        }
        setInputUrl(displayUrl);
    }, [currentIndex, history, currentUrl]);

    const processUrl = (url: string, shouldProxy: boolean) => {
        let target = url;

        // 1. Handle missing protocol
        if (!target.startsWith('http')) {
            if (target.includes('.') && !target.includes(' ')) {
                target = 'https://' + target;
            } else {
                target = `https://www.google.com/search?q=${encodeURIComponent(target)}&igu=1`;
                return target;
            }
        }

        // 2. Smart URL Conversions
        if (target.includes('youtube.com/watch?v=')) {
            target = target.replace('watch?v=', 'embed/');
        } else if (target.includes('youtu.be/')) {
            const id = target.split('youtu.be/')[1];
            target = `https://www.youtube.com/embed/${id}`;
        }

        // 3. Proxy Injection
        if (shouldProxy && !target.includes('api.allorigins.win')) {
            target = 'https://api.allorigins.win/raw?url=' + target;
        }

        return target;
    };

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        const processed = processUrl(inputUrl, useProxy);

        const newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(processed);
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
        setIframeKey(k => k + 1);
    };

    const toggleProxy = () => {
        const newProxyState = !useProxy;
        setUseProxy(newProxyState);

        // Get current "clean" url
        let cleanUrl = currentUrl;
        if (cleanUrl.includes('api.allorigins.win/raw?url=')) {
            cleanUrl = cleanUrl.replace('https://api.allorigins.win/raw?url=', '');
        }

        // Reprocess with new state
        const newUrl = processUrl(cleanUrl, newProxyState);

        const newHistory = [...history];
        newHistory[currentIndex] = newUrl;
        setHistory(newHistory);
        setIframeKey(k => k + 1);
    };

    const goBack = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const goForward = () => {
        if (currentIndex < history.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const reload = () => {
        setIframeKey(k => k + 1);
    };

    const openExternal = () => {
        let urlToOpen = currentUrl;
        if (urlToOpen.includes('api.allorigins.win')) {
            urlToOpen = urlToOpen.replace('https://api.allorigins.win/raw?url=', '');
        }
        window.open(urlToOpen, '_blank');
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1e1e1e', color: '#e0e0e0' }}>
            {/* Address Bar */}
            <div style={{
                padding: '8px 16px',
                background: '#2c2c2c',
                borderBottom: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <NavButton onClick={goBack} disabled={currentIndex === 0} icon={<ArrowLeft size={18} />} />
                    <NavButton onClick={goForward} disabled={currentIndex === history.length - 1} icon={<ArrowRight size={18} />} />
                    <NavButton onClick={reload} icon={<RotateCw size={18} />} />
                </div>

                <form onSubmit={handleNavigate} style={{ flex: 1, display: 'flex', gap: '8px' }}>
                    <div style={{
                        flex: 1,
                        background: '#1a1a1a',
                        borderRadius: '20px',
                        padding: '6px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid #333',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                        <Search size={14} color="#666" />
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '14px',
                                color: '#e0e0e0'
                            }}
                            placeholder="Search Google or type a URL"
                        />
                    </div>
                </form>

                <button
                    onClick={toggleProxy}
                    title={useProxy ? "Disable AllOrigins Proxy" : "Enable AllOrigins Proxy"}
                    style={{
                        background: useProxy ? 'rgba(0, 216, 255, 0.2)' : 'transparent',
                        border: 'none',
                        color: useProxy ? '#00d8ff' : '#a0a0a0',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {useProxy ? <Shield size={18} /> : <ShieldAlert size={18} />}
                </button>

                <button
                    onClick={openExternal}
                    title="Open in new tab"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#a0a0a0',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <ExternalLink size={18} />
                </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, position: 'relative', background: 'white' }}>
                <iframe
                    ref={iframeRef}
                    key={iframeKey}
                    src={currentUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Browser"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-downloads"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />

                {/* Info Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '4px 12px',
                    background: '#2c2c2c',
                    color: '#888',
                    fontSize: '11px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #333'
                }}>
                    <span>{useProxy ? 'Proxy: AllOrigins (May fix some sites)' : 'Proxy: OFF'}</span>
                    <span>⚠️ Address bar cannot sync with external sites</span>
                </div>
            </div>
        </div>
    );
};

const NavButton = ({ onClick, disabled, icon }: { onClick: () => void, disabled?: boolean, icon: React.ReactNode }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            background: 'transparent',
            border: 'none',
            color: disabled ? '#555' : '#a0a0a0',
            cursor: disabled ? 'default' : 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s'
        }}
    >
        {icon}
    </button>
);
