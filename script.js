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
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
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
      console.log('2. Username'. username, '| Password:', password);
      
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

window.addEventListener('scroll', function() {
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

  const oshiSelect = document.getElementById('oshiSelect');
  const editProfileModal = document.getElementById('editProfileModal');
  const closeEditProfileBtn = document.getElementById('closeEditProfileBtn');
  const editProfileForm = document.querySelector('.edit-profile-form');
  const bioInput = document.getElementById('bioInput');
  const avatarColorPicker = document.getElementById('avatarColorPicker');

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

  // Isi dropdown oshim dari memberData
  memberData.forEach(function (m) {
    const opt = document.createElement('option');
    opt.value = m.name;
    opt.textContent = m.name + ' (Team ' + m.team.charAt(0).toUpperCase() + m.team.slice(1) + ')';
    oshiSelect.appendChild(opt);
  });

  // Render swatch warna avatar
  avatarPresets.forEach(function (colors, i) {
    const swatch = document.createElement('div');
    swatch.className = 'avatar-color-swatch';
    swatch.style.background = 'linear-gradient(135deg, ' + colors[0] + ', ' + colors[1] + ')';
    swatch.dataset.index = i;
    swatch.addEventListener('click', function () {
      document.querySelectorAll('.avatar-color-swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
    });
    avatarColorPicker.appendChild(swatch);
  });

  function renderProfileExtras() {
    const userData = getUserData();

    const colorIndex = userData.avatarColorIndex || 0;
    const avatarEl = document.getElementById('profileAvatar');
    if (avatarEl) {
      avatarEl.style.background = 'linear-gradient(135deg, ' + avatarPresets[colorIndex][0] + ', ' + avatarPresets[colorIndex][1] + ')';
    }

    const oshiBox = document.getElementById('oshiBox');
    const oshiName = document.getElementById('oshiName');
    const oshiPhoto = document.getElementById('oshiPhoto');
    const profileBadge = document.getElementById('profileBadge');

    if (userData.oshi) {
      const member = memberData.find(m => m.name === userData.oshi);
      if (member) {
        oshiBox.style.display = 'flex';
        oshiName.textContent = member.name + ' · Team ' + member.team.charAt(0).toUpperCase() + member.team.slice(1);
        oshiPhoto.style.backgroundImage = 'url(' + member.photo + ')';

        const badge = teamBadgeColor[member.team];
        if (badge && profileBadge) {
          profileBadge.textContent = badge.label;
          profileBadge.style.background = badge.bg;
          profileBadge.style.color = badge.text;
        }
      }
    } else if (profileBadge) {
      profileBadge.textContent = 'Fan JKT48';
      profileBadge.style.background = '#FCE4EE';
      profileBadge.style.color = '#93123F';
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

  editProfileBtn.addEventListener('click', function () {
    const userData = getUserData();
    oshiSelect.value = userData.oshi || '';
    bioInput.value = userData.bio || '';

    const swatches = document.querySelectorAll('.avatar-color-swatch');
    swatches.forEach(s => s.classList.remove('selected'));
    const idx = userData.avatarColorIndex || 0;
    if (swatches[idx]) swatches[idx].classList.add('selected');

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

  editProfileForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const selectedSwatch = document.querySelector('.avatar-color-swatch.selected');
    const userData = getUserData();

    userData.oshi = oshiSelect.value;
    userData.bio = bioInput.value.trim();
    userData.avatarColorIndex = selectedSwatch ? parseInt(selectedSwatch.dataset.index) : 0;

    saveUserData(userData);
    editProfileModal.classList.remove('active');
    renderProfileExtras();
    showNotification('Profil berhasil diperbarui!', 'success');
  });
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
   name: "Alya Amanda",
    team: "love",
    birthdate: "08-26",
    photo: "image/alya.jpg",
    link: "love/alya.html", 
  },
  {
    name: "Abigail Rachel",
    team: "passion",
    birthdate: "08-06",
    photo: "image/abgial.jpg",
    link: "passion/abigail.html",
  },
  {
    name: "Cornelia Vanisa",
    team: "passion",
    birthdate: "07-26",
    photo: "image/oniel.jpg",
    link: "passiong/cornelia.html",
  }
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