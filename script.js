let peer = null;

// Inisialisasi PeerJS dengan server gratis
function initPeer() {
    // Menggunakan PeerJS Cloud Server (gratis)
    peer = new Peer(null, {
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true
    });
    
    peer.on('open', (id) => {
        console.log('Peer ID:', id);
        localStorage.setItem('peerId', id);
    });
    
    peer.on('error', (err) => {
        console.error('Peer error:', err);
        alert('Koneksi error. Silakan refresh halaman.');
    });
}

// Buat game baru
document.getElementById('createGame')?.addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        alert('Masukkan nama kamu dulu!');
        return;
    }
    
    if (!peer) initPeer();
    
    peer.on('open', () => {
        const gameId = peer.id;
        localStorage.setItem('gameId', gameId);
        localStorage.setItem('playerName', playerName);
        localStorage.setItem('isHost', 'true');
        
        window.location.href = `game.html?id=${gameId}`;
    });
});

// Tampilkan form join
document.getElementById('joinGame')?.addEventListener('click', () => {
    const joinSection = document.getElementById('joinSection');
    if (joinSection.style.display === 'none') {
        joinSection.style.display = 'block';
    } else {
        joinSection.style.display = 'none';
    }
});

// Konfirmasi join
document.getElementById('confirmJoin')?.addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    const gameId = document.getElementById('gameIdInput').value.trim();
    
    if (!playerName) {
        alert('Masukkan nama kamu dulu!');
        return;
    }
    
    if (!gameId) {
        alert('Masukkan Game ID!');
        return;
    }
    
    if (!peer) initPeer();
    
    peer.on('open', () => {
        localStorage.setItem('gameId', gameId);
        localStorage.setItem('playerName', playerName);
        localStorage.setItem('isHost', 'false');
        
        window.location.href = `game.html?id=${gameId}`;
    });
});

// Inisialisasi saat halaman dimuat
initPeer();