function createAdElement() {
  const adDiv = document.createElement('div');
  adDiv.className = 'ad-container';
  adDiv.style.cssText = 'text-align: center; margin: 2rem auto;';
  
  const script1 = document.createElement('script');
  script1.text = `atOptions = { 'key' : 'fc060e57d227b6f66e31129f9d13870a', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };`;
  adDiv.appendChild(script1);
  
  const script2 = document.createElement('script');
  script2.src = 'https://www.highperformanceformat.com/fc060e57d227b6f66e31129f9d13870a/invoke.js';
  adDiv.appendChild(script2);
  
  return adDiv;
}

document.addEventListener('DOMContentLoaded', () => {
  const contentDiv = document.getElementById('content');
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('get');

  if (key) {
    fetch('./index.json')
      .then(response => {
        if (!response.ok) throw new Error('Gagal mengambil data');
        return response.json();
      })
      .then(data => {
        const item = data.find(game => game.key === key);
        if (item) {
          renderDetail(item);
        } else {
          renderError(`Key "${key}" tidak ditemukan.`);
        }
      })
      .catch(error => {
        console.error(error);
        renderError('Terjadi kesalahan saat memuat data. Pastikan file index.json tersedia.');
      });
  } else {
    renderLandingPage();
  }

  function renderLandingPage() {
    contentDiv.innerHTML = `
      <div class="landing">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-badge">
            🎮 Premium Game Mods
          </div>
          <h1 class="hero-title">
            Design confidently.<br>
            Play fearlessly.
          </h1>
          <p class="hero-description">
            Popess is a premium game mod platform that takes the guesswork out of gaming 
            by providing verified mods with unlimited features.
          </p>
          <div class="hero-buttons">
            <a href="#" class="btn-primary" onclick="alert('Hubungi admin untuk mendapatkan key akses')">Get started</a>
          </div>
        </div>

        <!-- Unlimited Features Section -->
        <div class="unlimited-section">
          <h2 class="section-title">Unlimited Features</h2>
          <p class="section-subtitle">Experience gaming without limits</p>
          <div class="unlimited-grid">
            <div class="unlimited-card">
              <div class="unlimited-icon">💰</div>
              <h3>Unlimited Coins</h3>
              <p>Get unlimited in-game currency and resources</p>
            </div>
            <div class="unlimited-card">
              <div class="unlimited-icon">🔓</div>
              <h3>Unlocked Items</h3>
              <p>Access all premium items and characters</p>
            </div>
            <div class="unlimited-card">
              <div class="unlimited-icon">✨</div>
              <h3>Premium Features</h3>
              <p>Enjoy all premium features for free</p>
            </div>
          </div>
        </div>

        <!-- Stats/Companies Section -->
        <div class="companies-section">
          <div class="companies-title">
            Trusted by gamers worldwide
          </div>
          <div class="companies-grid">
            <div class="company-item">🎮 50K+ Downloads</div>
            <div class="company-item">⭐ 4.9/5 Rating</div>
            <div class="company-item">🔥 1000+ Mods</div>
            <div class="company-item">🚀 24/7 Support</div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="features-section">
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h3>Verified Mods</h3>
              <p>All mods are tested and verified safe before release</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Fast Updates</h3>
              <p>Regular updates for latest game versions</p>
            </div>
            <div class="feature-card highlight-card">
              <div class="feature-icon">🛡️</div>
              <h3>Anti-Ban System</h3>
              <p>Advanced protection system to keep your account safe</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>All Platforms</h3>
              <p>Support for Android, iOS, and PC games</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💬</div>
              <h3>Community Support</h3>
              <p>Join our community of gamers and modders</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎁</div>
              <h3>Weekly Giveaways</h3>
              <p>Participate in weekly giveaways and events</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Tambahkan iklan setelah setiap section
    const hero = document.querySelector('.hero-section');
    if (hero) hero.insertAdjacentElement('afterend', createAdElement());

    const unlimited = document.querySelector('.unlimited-section');
    if (unlimited) unlimited.insertAdjacentElement('afterend', createAdElement());

    const companies = document.querySelector('.companies-section');
    if (companies) companies.insertAdjacentElement('afterend', createAdElement());

    const features = document.querySelector('.features-section');
    if (features) features.insertAdjacentElement('afterend', createAdElement());
  }

  function renderDetail(item) {
    const fiturArray = item.fitur.split(',').map(f => f.trim());
    
    const html = `
      <div class="detail-page">
        <div class="detail-card">
          <div class="detail-header">
            <h1>${escapeHtml(item.nama)}</h1>
            <div class="key-badge">🔑 Key: ${escapeHtml(item.key)}</div>
          </div>
          <div class="detail-body">
            <div class="info-item">
              <strong>📝 Deskripsi</strong>
              <p>${escapeHtml(item.deskripsi)}</p>
            </div>
            <div class="info-item">
              <strong>📌 Versi</strong>
              <p>${escapeHtml(item.versi)}</p>
            </div>
            <div class="info-item">
              <strong>✨ Fitur</strong>
              <div class="fitur-list">
                ${fiturArray.map(f => `<span class="fitur-tag">${escapeHtml(f)}</span>`).join('')}
              </div>
            </div>
            <a href="${escapeHtml(item.url)}" class="download-btn" target="_blank" rel="noopener noreferrer">
              🎮 Download Sekarang
            </a>
            <div style="text-align: center;">
              <a href="." class="back-link">← Kembali ke Beranda</a>
            </div>
          </div>
        </div>
      </div>
    `;
    contentDiv.innerHTML = html;

    // Tambahkan iklan setelah tombol download
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
      downloadBtn.insertAdjacentElement('afterend', createAdElement());
    }
  }

  function renderError(message) {
    contentDiv.innerHTML = `
      <div class="error-page">
        <div class="error-card">
          <div class="error-icon">😕</div>
          <h2>Key Tidak Valid</h2>
          <p>${escapeHtml(message)}</p>
          <a href="." class="error-btn">Kembali ke Beranda</a>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});