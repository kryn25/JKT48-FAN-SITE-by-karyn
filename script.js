// WARNA PER TEAM
(function () {
  const path = window.location.pathname;

  if (path.includes('/dream/')) {
    document.body.setAttribute('data-team', 'dream');
  } else if (path.includes('/love/')) {
    document.body.setAttribute('data-team', 'love');
  } else if (path.includes('/passion/')) {
    document.body.setAttribute('data-team', 'passion');
  }
})();

// Navbar mengecil dan border merah muncul saat scroll
const navbarEl = document.querySelector('.navbar');
let navbarScrollTicking = false;

window.addEventListener('scroll', function() {
  if (navbarScrollTicking) return;
  navbarScrollTicking = true;

  requestAnimationFrame(function () {
    if (window.scrollY > 50) {
      navbarEl.classList.add('scrolled');
    } else {
      navbarEl.classList.remove('scrolled');
    }
    navbarScrollTicking = false;
  });
});

const cards = document.querySelectorAll('.news-card');

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, index) {
        if (entry.isIntersecting) {
            setTimeout(function() {
                entry.target.classList.add('visible');
            }, index * 150);
        }
    });
}, {threshold: 0.1});

cards.forEach(function(card) {
    observer.observe(card);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// NOTIFIKASI CUSTOM //
let notifTimeout;
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  if (!notification) return;

  const notifIcon = notification.querySelector('.notif-icon');
  const notifMessage = document.getElementById('notifMessage');

  notification.classList.remove('success', 'error');
  notification.classList.add(type);

  if (notifIcon) {
    notifIcon.textContent = type === 'success' ? '✓' : '⨉';
  }
  if (notifMessage) {
    notifMessage.textContent = message;
  }

  notification.classList.add('show');

  clearTimeout(notifTimeout);
  notifTimeout = setTimeout(function () {
    notification.classList.remove('show');
  }, 3000);
}

// Simpan notifikasi yang baru muncul setelah pindah halaman
function setFlashNotification(message, type) {
  sessionStorage.setItem('jkt48_flash_notif', JSON.stringify({ message, type}));
}

// Cek tiap halaman
document.addEventListener('DOMContentLoaded', function () {
  const flash = sessionStorage.getItem('jkt48_flash_notif');
  if (flash) {
    sessionStorage.removeItem('jkt48_flash_notif');
    const data = JSON.parse(flash);
    showNotification(data.message, data.type);
  }
});

// AUTH SYSTEM (LOGIN & SIGN UP)
document.addEventListener('DOMContentLoaded', function() {

  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeLoginBtn = document.getElementById('closeBtn');
  const loginForm = document.querySelector('.login-form');

  // === PERBAIKAN: signupModal (bukan singupModal) ===
  const signupModal = document.getElementById('signupModal');
  const closeSignupBtn = document.getElementById('closeSignupBtn');
  const signupForm = document.querySelector('.signup-form');
  
  const currentUser = localStorage.getItem('jkt48_user');
  if (currentUser) {
    updateNavbarLoggedIn(currentUser);
  }

  // === LOGIN MODAL ===
  if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Kalau sudah login, arahkan ke halaman profil bukan buka modal login
      const loggedInUser = localStorage.getItem('jkt48_user');
      if (loggedInUser) {
        window.location.href = 'profile.html';
        return;
      }

      loginModal.classList.add('active');
    });

    closeLoginBtn.addEventListener('click', () => {
      loginModal.classList.remove('active');
      // === PERBAIKAN: requestFullscreen -> reset ===
      if (loginForm) loginForm.reset();
    });

    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.classList.remove('active');
        if (loginForm) loginForm.reset();
      }
    });
  }

  // === SIGN UP MODAL ===
  if (signupModal && closeSignupBtn) {
    closeSignupBtn.addEventListener('click', () => {
      signupModal.classList.remove('active');
      // === PERBAIKAN: requestFullscreen -> reset ===
      if (signupForm) signupForm.reset();
    });

    signupModal.addEventListener('click', (e) => {
      if (e.target === signupModal) {
        signupModal.classList.remove('active');
        if (signupForm) signupForm.reset();
      }
    });

    // Link ke Login dari Sign-up
    const toLoginLink = document.getElementById('toLoginLink');
    if (toLoginLink) {
      toLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
      });
    }
  }

  // === LINK KE SIGN UP DARI LOGIN ===
  const toSignupFromLogin = document.getElementById('toSignupFromLogin');
  if (toSignupFromLogin && signupModal) {
    toSignupFromLogin.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.classList.remove('active');
      signupModal.classList.add('active');
    });
  }

  // TOGGLE LIHAT/SEMBUNYIKAN PASSWORD
  document.querySelectorAll('.toggle-password').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const input = toggle.previousElementSibling;
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🔐';
      } else {
        input.type = 'password';
        toggle.textContent = '🔒';
      }
    });
  });

  // === SIGN UP FUNCTION ===
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('signupUsername').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;

      if (username.length < 3) {
        showNotification('Username minimal 3 karakter!', 'error');
        return;
      }

      if (password.length < 6) {
        showNotification('Password minimal 6 karakter!', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showNotification('Password tidak cocok!', 'error');
        return;
      }

      // Simpan ke localStorage
      const userData = { username, email, password, joinDate: new Date().toISOString() };
      localStorage.setItem('jkt48_user_' + username, JSON.stringify(userData));

      showNotification('Daftar berhasil! Silakan login.', 'success');
      signupForm.reset();
      signupModal.classList.remove('active');
      loginModal.classList.add('active');
    });
  }

  // === LOGIN FUNCTION ===
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('1. Submit ke-trigger');
      
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
      console.log('2. Username:', username, '| Password:', password);
      
      const savedUser = localStorage.getItem('jkt48_user_' + username);
      console.log('3. Data akun ditemukan?', savedUser);
      
      if (!savedUser) {
        showNotification('Username belum terdaftar!', 'error');
        return;
      }
      
      const userData = JSON.parse(savedUser);
      
      if (userData.password !== password) {
        showNotification('Password salah!', 'error');
        return;
      }
      
      localStorage.setItem('jkt48_user', username);
      setFlashNotification('Login berhasil! Selamat datang, ' + username, 'success');
      window.location.href = 'profile.html';
    });
  }

  // === UPDATE NAVBAR ===
  function updateNavbarLoggedIn(username) {
    if (loginBtn) {
      loginBtn.textContent = username;
      loginBtn.classList.add('logged-in');
      
    }
  }
});

// Carousel member
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const cardWidth = 240;

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', function() {
    track.scrollBy({left: -cardWidth, behavior: 'smooth'});
  });

  nextBtn.addEventListener('click', function() {
    track.scrollBy({left: cardWidth, behavior: 'smooth'});
  });
}

// Active link saat scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
let activeLinkTicking = false;

window.addEventListener('scroll', function() {
  if (activeLinkTicking) return;
  activeLinkTicking = true;

  requestAnimationFrame(function () {
  let current = '';

  sections.forEach(function(section) {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(function(link) {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });

  activeLinkTicking = false;
  });
});

// Loading screen
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    setTimeout(function() {
        loader.classList.add('hidden');
    }, 1200);
});

// === HALAMAN PROFIL (profile.html) ===
document.addEventListener('DOMContentLoaded', function () {
  const profileUsernameEl = document.getElementById('profileUsername');

  // Kode ini hanya jalan kalau elemen profile ada di halaman (profile.html)
  if (!profileUsernameEl) return;

  const currentUsername = localStorage.getItem('jkt48_user');

  // Kalau belum login tapi coba akses profile.html langsung ke beranda
  if (!currentUsername) {
    window.location.href = 'index.html';
    return;
  }

  const savedUser = localStorage.getItem('jkt48_user_' + currentUsername);
  const userData = savedUser ? JSON.parse(savedUser) : null;

  profileUsernameEl.textContent = currentUsername;

  const profileEmailEl = document.getElementById('profileEmail');
  if (profileEmailEl) {
    profileEmailEl.textContent = userData && userData.email ? userData.email : '-';
  }

  const profileAvatarEl = document.getElementById('profileAvatar');
  if (profileAvatarEl) {
    profileAvatarEl.textContent = currentUsername.charAt(0).toUpperCase();
  }

  const profileLogoutBtn = document.getElementById('profileLogoutBtn');
  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('jkt48_user');
      setFlashNotification('Logout berhasil!', 'success');
      window.location.href = 'index.html';
    });
  }
});

// Preset warna avatar
const avatarPresets = [
  ['#E4145C', '#F2994A'],
  ['#7C5CFC', '#E4145C'],
  ['#2DD4BF', '#7C5CFC'],
  ['#F2994A', '#2DD4BF']
];

// Warna badge per team
const teamBadgeColor = {
  dream: { bg: '#FCE4EE', text: '#93123F', label: 'Fan team dream' },
  love: { bg: '#FDE8E4', text: '#B5351D', label: 'Fan team love' },
  passion: { bg: '#FFF1DA', text: '#A15A0A', label: 'Fan team passion' }
};

document.addEventListener('DOMContentLoaded', function () {
  const editProfileBtn = document.getElementById('editProfileBtn');
  if (!editProfileBtn) return; // hanya jalan di profile.html

  const editProfileModal = document.getElementById('editProfileModal');
  // === PERBAIKAN: id asli di HTML huruf kecil semua ("closeeditProfileBtn"), bukan "closeEditProfileBtn" ===
  const closeEditProfileBtn = document.getElementById('closeeditProfileBtn');
  const bioInput = document.getElementById('bioInput');
  const avatarColorPicker = document.getElementById('avatarColorPicker');
  const avatarPreview = document.getElementById('avatarPreview');
  const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  const avatarFileInput = document.getElementById('avatarFileInput');
  // === PERBAIKAN: HTML sekarang pakai search box + saran, bukan <select id="oshiSelect"> lagi ===
  const oshiSearchInput = document.getElementById('oshiSearchInput');
  const oshiSuggestions = document.getElementById('oshiSuggestions');
  const oshiSelectedPreview = document.getElementById('oshiSelectedPreview');
  const saveProfileTabBtn = document.getElementById('saveProfileTabBtn');

  const currentUsername = localStorage.getItem('jkt48_user');
  if (!currentUsername) return;

  const userKey = 'jkt48_user_' + currentUsername;

  function getUserData() {
    const raw = localStorage.getItem(userKey);
    return raw ? JSON.parse(raw) : {};
  }

  function saveUserData(data) {
    localStorage.setItem(userKey, JSON.stringify(data));
  }

  // state sementara selagi modal terbuka, baru dipermanenkan saat klik "Simpan perubahan"
  let draftAvatarPhoto = null;
  let draftAvatarColorIndex = 0;
  let draftOshiName = '';

  // ===== render swatch warna avatar (dibuat sekali saat halaman dimuat) =====
  avatarPresets.forEach(function (colors, i) {
    const swatch = document.createElement('div');
    swatch.className = 'avatar-color-swatch';
    swatch.style.background = 'linear-gradient(135deg, ' + colors[0] + ', ' + colors[1] + ')';
    swatch.dataset.index = i;
    swatch.addEventListener('click', function () {
      draftAvatarColorIndex = i;
      draftAvatarPhoto = null; // pilih warna = batalkan foto yang lagi dipakai
      avatarFileInput.value = '';
      document.querySelectorAll('.avatar-color-swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      renderAvatarPreview();
    });
    avatarColorPicker.appendChild(swatch);
  });

  // ===== preview avatar di dalam modal (foto kalau ada, kalau tidak pakai warna + inisial) =====
  function renderAvatarPreview() {
    if (draftAvatarPhoto) {
      avatarPreview.style.background = 'url(' + draftAvatarPhoto + ') center/cover';
      avatarPreview.textContent = '';
      removePhotoBtn.style.display = 'inline-block';
    } else {
      avatarPreview.style.background = 'linear-gradient(135deg, ' + avatarPresets[draftAvatarColorIndex][0] + ', ' + avatarPresets[draftAvatarColorIndex][1] + ')';
      avatarPreview.textContent = currentUsername.charAt(0).toUpperCase();
      removePhotoBtn.style.display = 'none';
    }
  }

  // ===== upload / hapus foto =====
  uploadPhotoBtn.addEventListener('click', function () {
    avatarFileInput.click();
  });

  avatarFileInput.addEventListener('change', function () {
    const file = avatarFileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      draftAvatarPhoto = e.target.result;
      renderAvatarPreview();
    };
    reader.readAsDataURL(file);
  });

  removePhotoBtn.addEventListener('click', function () {
    draftAvatarPhoto = null;
    avatarFileInput.value = '';
    renderAvatarPreview();
  });

  // ===== cari & pilih oshi =====
  function renderOshiSuggestions(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      oshiSuggestions.classList.remove('show');
      oshiSuggestions.innerHTML = '';
      return;
    }

    const matches = memberData.filter(function (m) {
      return m.name.toLowerCase().includes(q);
    }).slice(0, 6);

    if (matches.length === 0) {
      oshiSuggestions.innerHTML = '<div class="oshi-suggestion-empty">Nama member tidak ketemu. Coba ketik ulang persis nama lengkapnya sesuai halaman Member.</div>';
    } else {
      oshiSuggestions.innerHTML = matches.map(function (m) {
        return '<div class="oshi-suggestion-item" data-name="' + m.name + '">' +
          '<div class="oshi-suggestion-photo" style="background-image:url(' + m.photo + ')"></div>' +
          '<div>' +
            '<p class="oshi-suggestion-name">' + m.name + '</p>' +
            '<p class="oshi-suggestion-team">Team ' + m.team.charAt(0).toUpperCase() + m.team.slice(1) + '</p>' +
          '</div>' +
        '</div>';
      }).join('');
    }
    oshiSuggestions.classList.add('show');
  }

  function selectOshi(name) {
    const member = memberData.find(function (m) { return m.name === name; });
    if (!member) return;

    draftOshiName = member.name;
    oshiSearchInput.value = member.name;
    oshiSuggestions.classList.remove('show');
    oshiSuggestions.innerHTML = '';

    oshiSelectedPreview.style.display = 'flex';
    oshiSelectedPreview.href = member.link;
    oshiSelectedPreview.innerHTML =
      '<div class="oshi-suggestion-photo" style="background-image:url(' + member.photo + ')"></div>' +
      '<span>Lihat profil ' + member.name + ' →</span>';
  }

  oshiSearchInput.addEventListener('input', function () {
    draftOshiName = oshiSearchInput.value.trim(); // tetap tersimpan walau belum cocok member manapun (nama manual)
    renderOshiSuggestions(oshiSearchInput.value);
    oshiSelectedPreview.style.display = 'none';
  });

  oshiSearchInput.addEventListener('focus', function () {
    if (oshiSearchInput.value) renderOshiSuggestions(oshiSearchInput.value);
  });

  oshiSuggestions.addEventListener('click', function (e) {
    const item = e.target.closest('.oshi-suggestion-item');
    if (!item) return;
    selectOshi(item.dataset.name);
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.oshi-search-wrapper')) {
      oshiSuggestions.classList.remove('show');
    }
  });

  // ===== render tampilan profil publik (avatar, oshi box, bio, stat) =====
  function renderProfileExtras() {
    const userData = getUserData();
    const avatarEl = document.getElementById('profileAvatar');

    if (avatarEl) {
      if (userData.avatarPhoto) {
        avatarEl.style.background = 'url(' + userData.avatarPhoto + ') center/cover';
        avatarEl.textContent = '';
      } else {
        const colorIndex = userData.avatarColorIndex || 0;
        avatarEl.style.background = 'linear-gradient(135deg, ' + avatarPresets[colorIndex][0] + ', ' + avatarPresets[colorIndex][1] + ')';
        avatarEl.textContent = currentUsername.charAt(0).toUpperCase();
      }
    }

    const oshimenBox = document.getElementById('oshimenBox');
    const oshimenName = document.getElementById('oshimenName');
    const oshimenPhoto = document.getElementById('oshimenPhoto');
    const profileBadge = document.getElementById('profileBadge');

    if (userData.oshi) {
      const member = memberData.find(function (m) { return m.name === userData.oshi; });

      if (oshimenBox) oshimenBox.style.display = 'flex';
      if (oshimenName) {
        oshimenName.textContent = userData.oshi + (member ? ' · Team ' + member.team.charAt(0).toUpperCase() + member.team.slice(1) : '');
      }
      if (oshimenPhoto && member) oshimenPhoto.style.backgroundImage = 'url(' + member.photo + ')';

      if (profileBadge) {
        const badge = member ? teamBadgeColor[member.team] : null;
        if (badge) {
          profileBadge.textContent = badge.label;
          profileBadge.style.background = badge.bg;
          profileBadge.style.color = badge.text;
        }
      }
    } else {
      if (oshimenBox) oshimenBox.style.display = 'none';
      if (profileBadge) {
        profileBadge.textContent = 'Fan JKT48';
        profileBadge.style.background = '#FCE4EE';
        profileBadge.style.color = '#93123F';
      }
    }

    const profileBio = document.getElementById('profileBio');
    if (profileBio) {
      profileBio.textContent = userData.bio || 'Belum ada bio. Klik "Edit profil" buat nambahin!';
    }

    const statDays = document.getElementById('statDays');
    const statYear = document.getElementById('statYear');
    const statLevel = document.getElementById('statLevel');

    if (userData.joinDate) {
      const days = Math.floor((new Date() - new Date(userData.joinDate)) / (1000 * 60 * 60 * 24));
      if (statDays) statDays.textContent = days;
      if (statYear) statYear.textContent = new Date(userData.joinDate).getFullYear();
      if (statLevel) statLevel.textContent = days > 180 ? '⭐⭐⭐' : days > 30 ? '⭐⭐' : '⭐';
    }
  }

  renderProfileExtras();

  // ===== switch tab "Profil" <-> "Akun & Keamanan" di sidebar modal =====
  const settingsTabBtns = document.querySelectorAll('.settings-tab-btn');
  const settingsPanels = document.querySelectorAll('.settings-panel');
  settingsTabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      settingsTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      settingsPanels.forEach(function (panel) {
        panel.classList.toggle('active', panel.dataset.panel === btn.dataset.tab);
      });
    });
  });

  // ===== buka modal: isi ulang semua field sesuai data yang tersimpan =====
  editProfileBtn.addEventListener('click', function () {
    const userData = getUserData();

    bioInput.value = userData.bio || '';

    draftAvatarPhoto = userData.avatarPhoto || null;
    draftAvatarColorIndex = userData.avatarColorIndex || 0;
    const swatches = document.querySelectorAll('.avatar-color-swatch');
    swatches.forEach(s => s.classList.remove('selected'));
    if (!draftAvatarPhoto && swatches[draftAvatarColorIndex]) {
      swatches[draftAvatarColorIndex].classList.add('selected');
    }
    renderAvatarPreview();

    draftOshiName = userData.oshi || '';
    oshiSearchInput.value = draftOshiName;
    const existingMember = memberData.find(function (m) { return m.name === draftOshiName; });
    if (existingMember) {
      oshiSelectedPreview.style.display = 'flex';
      oshiSelectedPreview.href = existingMember.link;
      oshiSelectedPreview.innerHTML =
        '<div class="oshi-suggestion-photo" style="background-image:url(' + existingMember.photo + ')"></div>' +
        '<span>Lihat profil ' + existingMember.name + ' →</span>';
    } else {
      oshiSelectedPreview.style.display = 'none';
    }

    const accountEmailInput = document.getElementById('accountEmailInput');
    if (accountEmailInput) accountEmailInput.value = userData.email || '';
    const currentPasswordInput = document.getElementById('currentPasswordInput');
    const newPasswordInput = document.getElementById('newPasswordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    if (currentPasswordInput) currentPasswordInput.value = '';
    if (newPasswordInput) newPasswordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';

    editProfileModal.classList.add('active');
  });

  closeEditProfileBtn.addEventListener('click', function () {
    editProfileModal.classList.remove('active');
  });

  editProfileModal.addEventListener('click', function (e) {
    if (e.target === editProfileModal) {
      editProfileModal.classList.remove('active');
    }
  });

  // === PERBAIKAN: sebelumnya listen ke "submit" pada form yang sudah tidak ada di HTML.
  // Sekarang tombolnya type="button", jadi listen langsung ke "click". ===
  saveProfileTabBtn.addEventListener('click', function () {
    const userData = getUserData();
    userData.bio = bioInput.value.trim();
    userData.oshi = draftOshiName;
    userData.avatarPhoto = draftAvatarPhoto || null;
    userData.avatarColorIndex = draftAvatarColorIndex;

    saveUserData(userData);
    renderProfileExtras();
    showNotification('Profil berhasil diperbarui!', 'success');
  });

  // ===== simpan tab "Akun & Keamanan" (baru, sebelumnya panel ini kosong) =====
  const saveAccountTabBtn = document.getElementById('saveAccountTabBtn');
  if (saveAccountTabBtn) {
    saveAccountTabBtn.addEventListener('click', function () {
      const userData = getUserData();
      const accountEmailInput = document.getElementById('accountEmailInput');
      const currentPasswordInput = document.getElementById('currentPasswordInput');
      const newPasswordInput = document.getElementById('newPasswordInput');
      const confirmPasswordInput = document.getElementById('confirmPasswordInput');

      if (accountEmailInput && accountEmailInput.value.trim()) {
        userData.email = accountEmailInput.value.trim();
      }

      if (newPasswordInput && newPasswordInput.value) {
        if (currentPasswordInput.value !== userData.password) {
          showNotification('Password saat ini salah!', 'error');
          return;
        }
        if (newPasswordInput.value.length < 6) {
          showNotification('Password baru minimal 6 karakter!', 'error');
          return;
        }
        if (newPasswordInput.value !== confirmPasswordInput.value) {
          showNotification('Konfirmasi password baru tidak cocok!', 'error');
          return;
        }
        userData.password = newPasswordInput.value;
      }

      saveUserData(userData);

      const profileEmailEl = document.getElementById('profileEmail');
      if (profileEmailEl) profileEmailEl.textContent = userData.email || '-';

      currentPasswordInput.value = '';
      newPasswordInput.value = '';
      confirmPasswordInput.value = '';

      showNotification('Akun berhasil diperbarui!', 'success');
    });
  }
});

// HALAMAN JADWAL (jadwal.html)
document.addEventListener('DOMContentLoaded', function () {
  const jadwalFrame = document.getElementById('jadwalFrame');
  const jadwalFallback = document.getElementById('jadwalFallback');

  if (!jadwalFrame || !jadwalFallback) return;

  let frameLoaded = false;

  jadwalFrame.addEventListener('load', function () {
    frameLoaded = true;
  });

  // kalo kena blockir website resmi -> tampilkan fallback
  setTimeout(function () {
    if (!frameLoaded) {
      jadwalFallback.classList.add('show');
    }
  }, 3000);
});

// DATA MEMBER (edit manual)
const memberData = [
  {
    name: "Adeline Wijaya",
    team: "dream",
    birthdate: "09-01",
    photo: "image/adeline.jpg",
    link: "dream/adeline.html",
  },
  {
    name: "Febriola Sinambela",
    team: "dream",
    birthdate: "02-26",
    photo: "image/febriola.jpg",
    link: "dream/febriola.html",
  },
  {
    name: "Freya Jayawardana",
    team: "dream",
    birthdate: "02-13",
    photo: "image/freya.jpg",
    link: "dream/freya.html",
  },
  {
    name: "Gabriela Abigail",
    team: "dream",
    birthdate: "08-07",
    photo: "image/gabriela.jpg",
    link: "dream/gabriela.html",
  },
  {
    name: "Gita Sekar Andarini",
    team: "dream",
    birthdate: "06-30",
    photo: "image/gita.jpg",
    link: "dream/gita.html",
  },
  {
    name: "greesella Adhalia",
    team: "dream",
    birthdate: "01-10",
    photo: "image/gressel.jpg",
    link: "dream/gressella.html",
  },
  {
    name: "Helisma Putri",
    team: "dream",
    birthdate: "06-15",
    photo: "image/helisma.jpg",
    link: "dream/helisma.html",
  },
  {
    name: "Jesslyn Elly",
    team: "dream",
    birthdate: "09-13",
    photo: "image/jesslyn.jpg",
    link: "dream/jesslyn.html",
  },
  {
    name: "Marsha Lenathea",
    team: "dream",
    birthdate: "01-09",
    photo: "image/marsha.jpg",
    link: "dream/marsha.html",
  },
  {
    name: "Nina Tutachia",
    team: "dream",
    birthdate: "10-16",
    photo: "image/nina.jpg",
    link: "dream/nina.html",
  },
  {
    name: "Oline Manuel",
    team: "dream",
    birthdate: "11-03",
    photo: "image/oline.jpg",
    link: "dream/oline.html",
  },
  {
    name: "Shabilqis Naila",
    team: "dream",
    birthdate: "09-01",
    photo: "image/shabilqis.jpg",
    link: "dream/shabilqis.html",
  },
  {
    name: "Anindya Ramadhani",
    team: "love",
    birthdate: "10-18",
    photo: "image/anin.jpg",
    link: "love/anindya.html", 
  },
  {
    name: "Aurellia",
    team: "love",
    birthdate: "10-29",
    photo: "image/lia.jpg",
    link: "love/aurellia.html", 
  },
  {
    name: "Aurhel Alana",
    team: "love",
    birthdate: "09-14",
    photo: "image/lana.jpg",
    link: "love/aurhel.html", 
  },
  {
    name: "Celline Thefani",
    team: "love",
    birthdate: "04-09",
    photo: "image/elin.jpg",
    link: "love/celline.html", 
  },
  {
    name: "Cynthia Yaputera",
    team: "love",
    birthdate: "11-22",
    photo: "image/cynthia.jpg",
    link: "love/cynthia.html", 
  },
  {
    name: "Fiony Alveria",
    team: "love",
    birthdate: "02-04",
    photo: "image/fiony.jpg",
    link: "love/fiony.html", 
  },
  {
    name: "Fritzy Rosmerian",
    team: "love",
    birthdate: "07-28",
    photo: "image/anin.jpg",
    link: "love/anindya.html", 
  },
  {
    name: "Grace Octaviani",
    team: "love",
    birthdate: "10-18",
    photo: "image/gracie.jpg",
    link: "love/grace.html", 
  },
  {
    name: "Hillary Abigail",
    team: "love",
    birthdate: "10-19",
    photo: "image/lily.jpg",
    link: "love/hillary.html", 
  },
  {
    name: "Indah cahya",
    team: "love",
    birthdate: "03-20",
    photo: "image/indah.jpg",
    link: "love/indah.html", 
  },
  {
    name: "Jazzlyn Trisha",
    team: "love",
    birthdate: "02-16",
    photo: "image/trisha.jpg",
    link: "love/jazzlyn.html", 
  },
  {
    name: "Michelle Alexandra",
    team: "love",
    birthdate: "04-22",
    photo: "image/michie.jpg",
    link: "love/michelle.html", 
  },
  {
    name: "Nayla Suji",
    team: "love",
    birthdate: "06-18",
    photo: "image/nayla.jpg",
    link: "love/nayla.html", 
  },
  {
    name: "Abigail Rachel",
    team: "passion",
    birthdate: "08-06",
    photo: "image/abgial.jpg",
    link: "passion/abigail.html",
  },
  {
    name: "Angelina Christy",
    team: "passion",
    birthdate: "12-05",
    photo: "image/christy.jpg",
    link: "passion/angelina.html",
  },
  {
    name: "Catherina Vallencia",
    team: "passion",
    birthdate: "08-21",
    photo: "image/erine.jpg",
    link: "passion/catherina.html",
  },
  {
    name: "Cornelia Vanisa",
    team: "passion",
    birthdate: "07-26",
    photo: "image/oniel.jpg",
    link: "passiong/cornelia.html",
  },
  {
    name: "Dena Natalia",
    team: "passion",
    birthdate: "12-16",
    photo: "image/dena.jpg",
    link: "passion/dena.html",
  },
  {
    name: "Desy Natalia",
    team: "passion",
    birthdate: "12-16",
    photo: "image/daisy.jpg",
    link: "passion/desy.html",
  },
  {
    name: "Jessica Chandra",
    team: "passion",
    birthdate: "09-23",
    photo: "image/jessica.jpg",
    link: "passion/jessica.html",
  },
  {
    name: "Kathrina Irene",
    team: "passion",
    birthdate: "07-26",
    photo: "image/katrina.jpg",
    link: "passion/kathrina.html",
  },
  {
    name: "Lulu Salsabila",
    team: "passion",
    birthdate: "08-23",
    photo: "image/lulu.jpg",
    link: "passion/lulu.html",
  },
  {
    name: "michelle Levia",
    team: "passion",
    birthdate: "01-24",
    photo: "image/levi.jpg",
    link: "passion/michelle.html",
  },
  {
    name: "Mutiara Azzahra",
    team: "passion",
    birthdate: "07-12",
    photo: "image/mutiara.jpg",
    link: "passion/mutiara.html",
  },
  {
    name: "Raisha Syifa",
    team: "passion",
    birthdate: "11-11",
    photo: "image/raisha.jpg",
    link: "passion/raisha.html",
  },
  {
    name: "Ribka Budiman",
    team: "passion",
    birthdate: "01-13",
    photo: "image/ribka.jpg",
    link: "passion/ribka.html",
  },
  {
    name: "Victoria Kimberly",
    team: "passion",
    birthdate: "03-06",
    photo: "image/kimberly.jpg",
    link: "passion/victoria.html",
  },
];

// RENDER ULANG TAHUN TIAP BULAN
document.addEventListener('DOMContentLoaded', function () {
  const birthdayGrid = document.getElementById('birthdayGrid');
  if (!birthdayGrid) return;

  const birthdayEmpty = document.getElementById('birthdayEmpty');
  const birthdayMonthLabel = document.getElementById('birthdayMonthLabel');
 
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
 
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
 
  if (birthdayMonthLabel) {
    birthdayMonthLabel.textContent = namaBulan[now.getMonth()];
  }
 
  const ulangTahunBulanIni = memberData
    .filter(function (m) {
      return parseInt(m.birthdate.split('-')[0], 10) === currentMonth;
    })
    .sort(function (a, b) {
      return parseInt(a.birthdate.split('-')[1], 10) - parseInt(b.birthdate.split('-')[1], 10);
    });
 
  if (ulangTahunBulanIni.length === 0) {
    if (birthdayEmpty) birthdayEmpty.style.display = 'block';
    return;
  }
 
  ulangTahunBulanIni.forEach(function (m) {
    const tanggal = parseInt(m.birthdate.split('-')[1], 10);
    const card = document.createElement('a');
    card.className = 'birthday-card';
    card.href = m.link;
    card.innerHTML =
      '<div class="birthday-photo" style="background-image: url(' + m.photo + ');"></div>' +
      '<h4>' + m.name + '</h4>' +
      '<span>Team ' + m.team.charAt(0).toUpperCase() + m.team.slice(1) + ' • ' + tanggal + ' ' + namaBulan[now.getMonth()] + '</span>';
    birthdayGrid.appendChild(card);
  });
});

// DATA BERITA (edit manual)
const beritaData = [
  {
    slug: "jadwal-theater-minggu-ini",
    tag: "Pengumuman",
    title: "Jadwal Theater Minggu Ini",
    date: "2026-07-20",
    excerpt: "Info lengkap jadwal penampilan minggu ini di JKT48 Theater.",
    content: "Jadwal show JKT48 Theater minggu ini sudah bisa dicek langsung di halaman <a href=\"jadwal.html\">Jadwal</a> pada situs ini. Pastikan kamu memantau setlist dan waktu tayang tiap show, karena bisa berubah sewaktu-waktu mengikuti pengumuman resmi.\n\nSelalu update jadwal secara berkala supaya tidak ketinggalan show favoritmu."
  },
  {
    slug: "mng-bulan-ini",
    tag: "Event",
    title: "MnG Bulan Ini",
    date: "2026-07-18",
    excerpt: "Daftarkan diri kamu untuk Meet and Greet bulan ini.",
    content: "Meet and Greet (MnG) bulan ini kembali digelar untuk member-member. Acara ini jadi kesempatan fans untuk bertemu langsung dan ngobrol santai dengan member favorit.\n\nCek jadwal dan cara pendaftaran lengkap lewat halaman Tiket di situs ini."
  },
  {
    slug: "personal-meet-and-greet-festival",
    tag: "Event",
    title: "Personal Meet and Greet Festival",
    date: "2026-07-15",
    excerpt: "Festival 2-shot spesial bareng member JKT48 hadir lagi tahun ini.",
    content: "Personal Meet and Greet Festival balik lagi dengan sesi 2-shot spesial bareng member-member JKT48. Acara ini biasanya jadi salah satu event paling ditunggu sepanjang tahun oleh para fans.\n\nPantau terus halaman ini untuk info lokasi dan tanggal pastinya."
  }
];

// RENDER BERITA 
document.addEventListener('DOMContentLoaded', function () {
  const previewGrid = document.getElementById('newsGrid');
  const fullGrid = document.getElementById('beritaFullGrid');
  const detailContainer = document.getElementById('beritaDetail');

  if (!previewGrid && !fullGrid && !detailContainer) return;

  const namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  function formatTanggal(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.getDate() + ' ' + namaBulan[d.getMonth()] + ' ' + d.getFullYear();
  }

  function buildCard(item) {
    const article = document.createElement('article');
    article.className = 'news-card';
    article.innerHTML =
      '<div class="news-img" style="background-image: url(' + (item.image || 'logo.jpg') + ');"></div>' +
      '<div class="news-body">' +
        '<span class="news-tag">' + item.tag + '</span>' +
        '<h3>' + item.title + '</h3>' +
        '<p>' + item.excerpt + '</p>' +
        '<a href="berita-detail.html?slug=' + item.slug + '">Baca selengkapnya ></a>' +
      '</div>';
    return article;
  }

  const sorted = beritaData.slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  if (previewGrid) {
    sorted.slice(0, 3).forEach(function (item) {
      const card = buildCard(item);
      previewGrid.appendChild(card);
      observer.observe(card);
    });
  }
 
  if (fullGrid) {
    sorted.forEach(function (item) {
      const card = buildCard(item);
      fullGrid.appendChild(card);
      observer.observe(card);
    });
  }

  // HALAMAN DETAIL BERITA
  if (detailContainer) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const item = beritaData.find(function (b) { return b.slug === slug; });

    if (!item) {
      detailContainer.innerHTML =
        '<p class="berita-not-found">Berita tidak ditemukan. <a href="berita.html">Kembali ke Berita</a></p>';
      return;
    }

    const paragraphs = item.content.split('\n\n').map(function (p) {
      return '<p>' + p + '</p>';
    }).join('');
 
    document.title = item.title + ' - JKT48 Fan Site';
 
    detailContainer.innerHTML =
      '<span class="news-tag">' + item.tag + '</span>' +
      '<h1>' + item.title + '</h1>' +
      '<p class="berita-detail-date">' + formatTanggal(item.date) + '</p>' +
      '<div class="berita-detail-img" style="background-image: url(' + (item.image || 'logo.jpg') + ');"></div>' +
      '<div class="berita-detail-content">' + paragraphs + '</div>' +
      '<a href="berita.html" class="btn-outline">← Kembali ke Berita</a>';
  }
});

// FEATURE: SEARCH, FILTER, SORT JKT48 MEMBER
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchMember");
  const filterTeam = document.getElementById("filterTeam");
  const sortSelect = document.getElementById("sortMember");
  const memberGrid = document.getElementById("memberGrid");

  if (memberGrid && searchInput && filterTeam && sortSelect) {
    const memberElements = Array.from(memberGrid.getElementsByClassName("member-link"));
    const STORAGE_KEY = "jkt48_member_filter_state";

    // PULIHKAN STATE
    function restroeFilterState() {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      
      try {
        const state = JSON.parse(saved);
        if (state.search !== undefined) searchInput.value = state.search;
        if (state.team !== undefined) filterTeam.value = state.team;
        if (state.sort !== undefined) sortSelect.value = state.sort;
      } catch (e) {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    // SIMPAN STATE SETIAP KALI BERUBAH
    function saveFilterState() {
      const state = {
        search: searchInput.value,
        team: filterTeam.value,
        sort: sortSelect.value
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function updateMemberDisplay() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const selectedTeam = filterTeam.value;
      const sortValue = sortSelect.value;

      memberElements.forEach(element => {
        const h3 = element.querySelector("h3");
        const span = element.querySelector("span");

        if (h3 && span) {
          const nameText = h3.textContent.toLowerCase();
          const teamText = span.textContent.trim();

          const matchesSearch = nameText.includes(searchTerm);
          const matchesTeam = (selectedTeam === "all") || (teamText === selectedTeam);

          if (matchesSearch && matchesTeam) {
            element.style.display = "block";
          } else {
            element.style.display = "none";
          }
        }
      });

      const sortedElements = memberElements.sort((a, b) => {
        const nameA = a.querySelector("h3") ? a.querySelector("h3").textContent.toLowerCase().trim() : "";
        const nameB = b.querySelector("h3") ? b.querySelector("h3").textContent.toLowerCase().trim() : "";
        
        if (sortValue === "a-z") {
          return nameA.localeCompare(nameB);
        } else if (sortValue === "z-a") {
          return nameB.localeCompare(nameA);
        }
        return 0;
      });

      sortedElements.forEach(element => memberGrid.appendChild(element));

      // simpan state tiap kali tampilan di update
      saveFilterState();
    }

    searchInput.addEventListener("input", updateMemberDisplay);
    filterTeam.addEventListener("change", updateMemberDisplay);
    sortSelect.addEventListener("change", updateMemberDisplay);

    // urutan penting: pulihkan sebelum render pertama
    restroeFilterState();
    updateMemberDisplay();
  }
});