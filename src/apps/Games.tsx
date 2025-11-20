

// Import game images
import freefire from '../assets/games/freefire.jpg';
import brawlhalla from '../assets/games/brawlhalla.jpg';
import genshin from '../assets/games/genshin.jpg';
import gtav from '../assets/games/gtav.jpg';
import starrail from '../assets/games/starrail.jpg';
import wuwa from '../assets/games/wuwa.jpg';

export const Games = () => {
    const games = [
        { name: 'GTA V : ONLINE', platform: 'PC', image: gtav },
        { name: 'Free Fire', platform: 'Mobile/PC', image: freefire },
        { name: 'Genshin Impact', platform: 'Mobile/PC', image: genshin },
        { name: 'Wuthering Waves', platform: 'Mobile/PC', image: wuwa },
        { name: 'Honkai Star Rail', platform: 'Mobile/PC', image: starrail },
        { name: 'Brawlhalla', platform: 'Mobile/PC', image: brawlhalla },
    ];

    return (
        <div style={{ padding: '20px', color: 'white', height: '100%', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Games I Play</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {games.map((game, index) => (
                    <div key={index} style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ height: '120px', overflow: 'hidden' }}>
                            <img src={game.image} alt={game.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '16px' }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.name}</h3>
                            <p style={{ fontSize: '12px', color: '#a0a0a0' }}>{game.platform}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
