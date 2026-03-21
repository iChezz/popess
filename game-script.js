let peer = null;
let conn = null;
let gameId = null;
let playerName = '';
let isHost = false;
let myChoice = null;
let opponentChoice = null;
let myScore = 0;
let opponentScore = 0;
let gameActive = true;

// Ambil parameter URL
const urlParams = new URLSearchParams(window.location.search);
gameId = urlParams.get('id');

// Ambil data dari localStorage
playerName = localStorage.getItem('playerName');
isHost = localStorage.getItem('isHost') === 'true';

// Tampilkan Game ID
document.getElementById('gameId').textContent = gameId;
document.getElementById('player1Name').textContent = isHost ? playerName : 'Menunggu...';
document.getElementById('player2Name').textContent = isHost ? 'Menunggu...' : playerName;

// Inisialisasi PeerJS
function initPeer() {
    peer = new Peer(null, {
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true
    });
    
    peer.on('open', (id) => {
        console.log('Connected with ID:', id);
        
        if (isHost) {
            // Host menunggu koneksi
            console.log('Waiting for player to join...');
            peer.on('connection', (connection) => {
                conn = connection;
                setupConnection();
            });
        } else {
            // Client connect ke host
            conn = peer.connect(gameId);
            setupConnection();
        }
    });
    
    peer.on('error', (err) => {
        console.error('Peer error:', err);
        alert('Koneksi error. Pastikan game ID benar.');
    });
}

function setupConnection() {
    conn.on('open', () => {
        console.log('Connection established!');
        
        // Kirim nama pemain
        conn.send({
            type: 'playerInfo',
            name: playerName,
            isHost: isHost
        });
        
        document.getElementById('waitingMessage').style.display = 'none';
        enableChoices(true);
    });
    
    conn.on('data', (data) => {
        handleGameData(data);
    });
    
    conn.on('close', () => {
        alert('Pemain lain meninggalkan game!');
        enableChoices(false);
        document.getElementById('waitingMessage').textContent = 'Game berakhir. Kembali ke menu...';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
}

function handleGameData(data) {
    switch(data.type) {
        case 'playerInfo':
            // Update nama pemain lawan
            if (data.isHost !== isHost) {
                if (isHost) {
                    document.getElementById('player2Name').textContent = data.name;
                } else {
                    document.getElementById('player1Name').textContent = data.name;
                }
            }
            break;
            
        case 'choice':
            opponentChoice = data.choice;
            document.getElementById(isHost ? 'player2Choice' : 'player1Choice').textContent = getChoiceEmoji(data.choice);
            
            // Jika kedua pemain sudah memilih, tentukan pemenang
            if (myChoice && opponentChoice) {
                determineWinner();
            }
            break;
            
        case 'reset':
            // Reset untuk ronde berikutnya
            myChoice = null;
            opponentChoice = null;
            document.getElementById(isHost ? 'player1Choice' : 'player2Choice').textContent = '❓';
            document.getElementById(isHost ? 'player2Choice' : 'player1Choice').textContent = '❓';
            document.getElementById('gameResult').textContent = '';
            document.getElementById('gameResult').className = 'result-message';
            enableChoices(true);
            break;
    }
}

function getChoiceEmoji(choice) {
    switch(choice) {
        case 'rock': return '✊';
        case 'paper': return '📄';
        case 'scissors': return '✂️';
        default: return '❓';
    }
}

function determineWinner() {
    const result = getWinner(myChoice, opponentChoice);
    
    let resultText = '';
    let resultClass = '';
    
    if (result === 'win') {
        resultText = '🎉 KAMU MENANG! 🎉';
        resultClass = 'win';
        myScore++;
        document.getElementById(isHost ? 'player1Score' : 'player2Score').textContent = myScore;
    } else if (result === 'lose') {
        resultText = '😢 KAMU KALAH! 😢';
        resultClass = 'lose';
        opponentScore++;
        document.getElementById(isHost ? 'player2Score' : 'player1Score').textContent = opponentScore;
    } else {
        resultText = '🤝 SERI! 🤝';
        resultClass = 'draw';
    }
    
    document.getElementById('gameResult').textContent = resultText;
    document.getElementById('gameResult').className = `result-message ${resultClass}`;
    
    // Tambahkan ke riwayat
    addToHistory(myChoice, opponentChoice, result);
    
    enableChoices(false);
    
    // Reset untuk ronde berikutnya setelah 2 detik
    setTimeout(() => {
        myChoice = null;
        opponentChoice = null;
        document.getElementById(isHost ? 'player1Choice' : 'player2Choice').textContent = '❓';
        document.getElementById(isHost ? 'player2Choice' : 'player1Choice').textContent = '❓';
        document.getElementById('gameResult').textContent = '';
        document.getElementById('gameResult').className = 'result-message';
        enableChoices(true);
        
        // Kirim sinyal reset ke lawan
        if (conn) {
            conn.send({ type: 'reset' });
        }
    }, 2000);
}

function getWinner(choice1, choice2) {
    if (choice1 === choice2) return 'draw';
    
    if (
        (choice1 === 'rock' && choice2 === 'scissors') ||
        (choice1 === 'paper' && choice2 === 'rock') ||
        (choice1 === 'scissors' && choice2 === 'paper')
    ) {
        return 'win';
    }
    
    return 'lose';
}

function addToHistory(myChoice, opponentChoice, result) {
    const historyDiv = document.getElementById('historyList');
    const entry = document.createElement('div');
    entry.className = 'history-item';
    
    const myEmoji = getChoiceEmoji(myChoice);
    const oppEmoji = getChoiceEmoji(opponentChoice);
    const resultText = result === 'win' ? '✅ MENANG' : (result === 'lose' ? '❌ KALAH' : '🤝 SERI');
    
    entry.textContent = `${myEmoji} vs ${oppEmoji} - ${resultText}`;
    historyDiv.insertBefore(entry, historyDiv.firstChild);
    
    // Batasi riwayat 10 item
    while (historyDiv.children.length > 10) {
        historyDiv.removeChild(historyDiv.lastChild);
    }
}

function enableChoices(enabled) {
    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach(btn => {
        if (enabled) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    });
}

// Event listener untuk pilihan
document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (myChoice) {
            alert('Kamu sudah memilih!');
            return;
        }
        
        const choice = btn.dataset.choice;
        myChoice = choice;
        
        // Tampilkan pilihan di UI
        document.getElementById(isHost ? 'player1Choice' : 'player2Choice').textContent = getChoiceEmoji(choice);
        
        // Kirim pilihan ke lawan
        if (conn) {
            conn.send({
                type: 'choice',
                choice: choice
            });
        }
        
        enableChoices(false);
    });
});

// Copy Game ID
document.getElementById('copyId')?.addEventListener('click', () => {
    const gameId = document.getElementById('gameId').textContent;
    navigator.clipboard.writeText(gameId);
    alert('Game ID disalin!');
});

// Leave game
document.getElementById('leaveGame')?.addEventListener('click', () => {
    if (confirm('Yakin ingin keluar dari game?')) {
        if (conn) conn.close();
        if (peer) peer.destroy();
        window.location.href = 'index.html';
    }
});

// Inisialisasi
initPeer();