/* =========================================
   MUSIC PLAYER - Fixed Button on Right
========================================= */

// Create audio element
const audio = document.createElement('audio');
audio.src = 'https://cdn.chungdoi.com/music/yt-93e3a25c-64b.mp3';
audio.loop = true;
audio.preload = 'auto';
audio.style.display = 'none';
document.body.appendChild(audio);

// Create fixed music button
const musicBtn = document.createElement('button');
musicBtn.className = 'music-toggle paused';
musicBtn.setAttribute('aria-label', 'Toggle music');

// Icon (♫ symbol)
const icon = document.createElement('span');
icon.className = 'music-icon';
icon.textContent = '♫';
musicBtn.appendChild(icon);

// Wave bars
const waveBars = document.createElement('span');
waveBars.className = 'wave-bars';
for (let i = 0; i < 5; i++) {
    const bar = document.createElement('span');
    waveBars.appendChild(bar);
}
musicBtn.appendChild(waveBars);

document.body.appendChild(musicBtn);

// Music state
let isMusicPlaying = false;
let musicStarted = false;

// Function to start music
function startMusic() {
    if (!musicStarted) {
        audio.play().then(() => {
            musicBtn.className = 'music-toggle playing';
            isMusicPlaying = true;
            musicStarted = true;
        }).catch(() => {
            // Auto-play blocked, user will need to click the music button
            musicBtn.className = 'music-toggle paused';
            isMusicPlaying = false;
            musicStarted = true;
        });
    }
}


/* =========================================
   FLOATING HEARTS - More hearts like rain
========================================= */

(function createHearts() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;

    const heartSymbol = '♥';
    const colors = ['#c9a24a', '#7a1f26', '#ece4d8', '#a8323b', '#f5e6d3', '#d4a0a0'];
    const count = 60;

    // مسح أي قلوب موجودة قبل إضافة جديدة
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = heartSymbol;

        const left = Math.random() * 95 + 2.5;
        const size = 12 + Math.random() * 18;
        const duration = 8 + Math.random() * 10;
        const delay = Math.random() * 12;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const sway = (Math.random() - 0.5) * 50;

        heart.style.left = left + '%';
        heart.style.fontSize = size + 'px';
        heart.style.color = color;
        heart.style.animationDuration = duration + 's';
        heart.style.animationDelay = delay + 's';
        heart.style.setProperty('--sway', sway + 'px');

        container.appendChild(heart);
    }
})();

// Toggle music button
musicBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isMusicPlaying) {
        audio.pause();
        musicBtn.className = 'music-toggle paused';
        isMusicPlaying = false;
    } else {
        audio.play().then(() => {
            musicBtn.className = 'music-toggle playing';
            isMusicPlaying = true;
            musicStarted = true;
        }).catch(() => {
            musicBtn.className = 'music-toggle paused';
            isMusicPlaying = false;
        });
    }
});

// Update button when audio events fire
audio.addEventListener('play', () => {
    musicBtn.className = 'music-toggle playing';
    isMusicPlaying = true;
});

audio.addEventListener('pause', () => {
    musicBtn.className = 'music-toggle paused';
    isMusicPlaying = false;
});

audio.addEventListener('ended', () => {
    musicBtn.className = 'music-toggle paused';
    isMusicPlaying = false;
});


/* =========================================
   OPEN INVITATION - With Seal Burst Effect
========================================= */

const openingScreen = document.getElementById('openingScreen');
const openButton = document.getElementById('openButton');
const mainContent = document.getElementById('mainContent');
const waxSeal = document.querySelector('.wax-seal');
const envelopeWrapper = document.querySelector('.envelope-wrapper');

// Check if page was opened with ?open=1
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('open') === '1') {
    // Skip burst effect if already opened
    openingScreen.classList.add('hide');
    setTimeout(() => {
        openingScreen.classList.add('hide');
        mainContent.classList.add('show');
        updateCountdown();
        startMusic();

        setTimeout(() => {
            startAutoScroll();
        }, 500);

    },  800);
}

// Open button click
openButton.addEventListener('click', function(e) {
    e.preventDefault();

    // 1. Play burst sound
    playBurstSound();  // <--- اتأكد إن السطر ده موجود

    // 2. Trigger seal burst
    if (waxSeal) {
        waxSeal.classList.add('burst');
        createBurstHearts();
    }

    // 3. Add closing effect to envelope
    if (envelopeWrapper) {
        envelopeWrapper.classList.add('closing');
    }

    // ◄━━━ هنا نتحكم في شفافية القصر بعد الفتح
    document.body.style.setProperty('--palace-opacity', '0.15');

    // 4. After burst animation, show main content and start music
    setTimeout(() => {
        openingScreen.classList.add('hide');
        mainContent.classList.add('show');
        updateCountdown();
        startMusic();

        // يبدأ الـ Auto Scroll مباشرة بعد ظهور الصفحة
        startAutoScroll();
    }, 800);
});

/* =========================================
   BURST SOUND - Magical explosion sound
========================================= */

// Create audio element for burst sound
const burstAudio = document.createElement('audio');
burstAudio.src = 'music/shidenbeatsmusic-sound-effect-twinklesparkle-115095.mp3';
burstAudio.preload = 'auto';
burstAudio.style.display = 'none';
document.body.appendChild(burstAudio);

function playBurstSound() {
    // أعد تحميل الصوت عشان يشتغل كل مرة
    burstAudio.currentTime = 0;
    burstAudio.play().catch(() => {
        // لو فشل، استخدم Web Audio API
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioCtx.currentTime;
            
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.connect(gain1);
            gain1.connect(audioCtx.destination);
            osc1.frequency.setValueAtTime(1200, now);
            osc1.frequency.exponentialRampToValueAtTime(800, now + 0.15);
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc1.start(now);
            osc1.stop(now + 0.3);
            
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.frequency.setValueAtTime(1600, now + 0.1);
            osc2.frequency.exponentialRampToValueAtTime(1000, now + 0.25);
            gain2.gain.setValueAtTime(0.2, now + 0.1);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc2.start(now + 0.1);
            osc2.stop(now + 0.4);
            
        } catch (e) {
            console.log('Sound fallback failed');
        }
    });
}

/* =========================================
   BURST HEARTS - Create flying hearts from seal
========================================= */

function createBurstHearts() {
    // Get seal position
    const seal = document.querySelector('.wax-seal');
    if (!seal) return;

    const sealRect = seal.getBoundingClientRect();
    const centerX = sealRect.left + sealRect.width / 2;
    const centerY = sealRect.top + sealRect.height / 2;

    const heartColors = ['#c9a24a', '#7a1f26', '#ece4d8', '#a8323b', '#f5e6d3', '#e8c8c8', '#ff6b6b'];
    const heartSymbol = '♥';
    const count = 24;

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'burst-heart';
        heart.textContent = heartSymbol;

        // Random direction
        const angle = Math.random() * Math.PI * 2;

        // Calculate random positions for smooth path
        const dx1 = Math.cos(angle) * (50 + Math.random() * 100);
        const dy1 = Math.sin(angle) * (50 + Math.random() * 100) - 80;

        const dx2 = Math.cos(angle + (Math.random() - 0.5) * 0.8) * (150 + Math.random() * 180);
        const dy2 = Math.sin(angle + (Math.random() - 0.5) * 0.8) * (150 + Math.random() * 180) - 120;

        const dx3 = Math.cos(angle + (Math.random() - 0.5) * 0.6) * (250 + Math.random() * 150);
        const dy3 = Math.sin(angle + (Math.random() - 0.5) * 0.6) * (250 + Math.random() * 150) - 100;

        const dx4 = Math.cos(angle + (Math.random() - 0.5) * 0.4) * (350 + Math.random() * 200);
        const dy4 = Math.sin(angle + (Math.random() - 0.5) * 0.4) * (350 + Math.random() * 200) - 80;

        const rot1 = (Math.random() - 0.5) * 60;
        const rot2 = (Math.random() - 0.5) * 120;
        const rot3 = (Math.random() - 0.5) * 180;
        const rot4 = (Math.random() - 0.5) * 240;

        const size = 14 + Math.random() * 22;
        const color = heartColors[Math.floor(Math.random() * heartColors.length)];

        // Set styles
        heart.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            z-index: 9999;
            pointer-events: none;
            font-size: ${size}px;
            color: ${color};
            opacity: 0;
            animation: none;
            --dx1: ${dx1}px;
            --dy1: ${dy1}px;
            --dx2: ${dx2}px;
            --dy2: ${dy2}px;
            --dx3: ${dx3}px;
            --dy3: ${dy3}px;
            --dx4: ${dx4}px;
            --dy4: ${dy4}px;
            --rot1: ${rot1}deg;
            --rot2: ${rot2}deg;
            --rot3: ${rot3}deg;
            --rot4: ${rot4}deg;
            animation: burst-fly ${0.8 + Math.random() * 0.6}s ease-out forwards;
            animation-delay: ${Math.random() * 0.2}s;
        `;

        document.body.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 1800);
    }
}

/* =========================================
   COUNTDOWN (يحدث العنصر الجديد)
========================================= */

const weddingDate = new Date('September 12, 2026 19:00:00');

function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    // لو التاريخ فات
    if (diff <= 0) {
        const displayEl = document.getElementById('countdownDisplay');
        if (displayEl) {
            displayEl.textContent = '00 days 00 hours 00 min 00 sec';
        }
        return;
    }

    // حساب الأيام والساعات والدقائق والثواني
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    // تحديث النص في الكارت الجديد
    const displayEl = document.getElementById('countdownDisplay');
    if (displayEl) {
        displayEl.textContent = `${days} days ${hours} hours ${minutes} min ${seconds} sec`;
    }
}

// ابدأ العداد فوراً وحدثه كل ثانية
updateCountdown();
setInterval(updateCountdown, 1000);


/* =========================================
   GALLERY - 3D Carousel
========================================= */

const track = document.getElementById('galleryTrack');
const cards = track ? track.querySelectorAll('.gallery-card') : [];
const dotsContainer = document.getElementById('galleryDots');
let currentIndex = 0;
const total = cards.length;

if (cards.length > 0) {
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(index) {
        currentIndex = index;
        const positions = ['center', 'right', 'right-far', 'right-far', 'left-far', 'left-far', 'left'];

        cards.forEach((card, i) => {
            const posIndex = (i - currentIndex + total) % total;
            card.className = 'gallery-card';
            card.classList.add(positions[posIndex] || 'center');
        });

        document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    document.getElementById('galleryPrev')?.addEventListener('click', () => {
        goTo((currentIndex - 1 + total) % total);
    });

    document.getElementById('galleryNext')?.addEventListener('click', () => {
        goTo((currentIndex + 1) % total);
    });

    goTo(0);
}


// =========================================
// GUESTBOOK → GOOGLE SHEET
// =========================================

const guestbookForm =
    document.getElementById('guestbookForm');

if (guestbookForm) {

    guestbookForm.addEventListener(
        'submit',
        async function (e) {

            e.preventDefault();
            e.stopPropagation();


            const name =
                document
                    .getElementById('guestName')
                    .value
                    .trim();

            const wish =
                document
                    .getElementById('guestWish')
                    .value
                    .trim();


            if (!name || !wish) {

                alert(
                    'Please enter your name and wish.'
                );

                return;

            }


            const sendButton =
                guestbookForm.querySelector(
                    '.send-wish-btn'
                );


            if (sendButton) {

                sendButton.disabled = true;

                sendButton.textContent =
                    'Sending...';

            }


            // التاريخ والوقت
            const now = new Date();

            const date =
                now.toLocaleDateString('en-GB');

            const time =
                now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });


            // البيانات
            const data = {

                guestId: guestId,

                name: name,

                date: date,

                time: time,

                wish: wish

            };


            try {

                await fetch(
                    GOOGLE_SHEET_URL,
                    {
                        method: 'POST',

                        mode: 'no-cors',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


                // عرض الرسالة في الموقع
                const container =
                    document.getElementById(
                        'guestbookMessages'
                    );

                if (container) {

                    const msg =
                        document.createElement('div');

                    msg.className =
                        'message';

                    msg.innerHTML = `
                        <div class="message-header">
                            <span class="message-name">
                                ${escapeHtml(name)}
                            </span>

                            <span class="message-date">
                                ${date}, ${time}
                            </span>
                        </div>

                        <p class="message-text">
                            ${escapeHtml(wish)}
                        </p>
                    `;

                    container.prepend(msg);

                }


                // Reset
                guestbookForm.reset();


                if (sendButton) {

                    sendButton.disabled = false;

                    sendButton.textContent =
                        'SEND WISHES';

                }


                showWishThankYou(
                    `Thank you ${name}! ❤️ Your beautiful wishes mean so much to us! 🎉`
                );


            } catch (error) {

                console.error(
                    'Wish Error:',
                    error
                );


                if (sendButton) {

                    sendButton.disabled = false;

                    sendButton.textContent =
                        'SEND WISHES';

                }


                alert(
                    'Something went wrong. Please try again.'
                );

            }

        }
    );

}

/* =========================================================
   WISH THANK YOU MESSAGE
========================================================= */

function showWishThankYou(message) {

    const thankYou =
        document.getElementById('wishThankYou');

    const thankYouText =
        document.getElementById('wishThankYouText');

    if (!thankYou) return;

    if (thankYouText) {
        thankYouText.textContent = message;
    }

    thankYou.classList.add('active');

    setTimeout(() => {

        thankYou.classList.remove('active');

    }, 3000);
}

/* =========================================================
   AI WISH - SUGGESTIONS MODAL
========================================================= */

const aiWishBtn = document.getElementById('aiWishBtn');

const wishSuggestionsModal =
    document.getElementById('wishSuggestionsModal');

const wishSuggestionsList =
    document.getElementById('wishSuggestionsList');

const wishSuggestionsClose =
    document.getElementById('wishSuggestionsClose');

const wishSuggestionsCloseBottom =
    document.getElementById('wishSuggestionsCloseBottom');

const guestWish =
    document.getElementById('guestWish');


/* Wishes */

const wishes = [

    'May your love keep blossoming and growing stronger with each passing day.',

    'Wishing you both a lifetime overflowing with love and happiness.',

    'Wishing you little angels soon to fill your home with joy.',

    'Wishing you two a lifetime of closeness, love, and sharing every part of life.',

    'May your new home always be full of joy and laughter.'

];


/* Open Modal */

if (aiWishBtn) {

    aiWishBtn.addEventListener('click', function (e) {

        e.preventDefault();
        e.stopPropagation();

        renderWishSuggestions();

        wishSuggestionsModal.classList.add('active');

    });

}


/* Show Wishes */

function renderWishSuggestions() {

    if (!wishSuggestionsList) return;

    wishSuggestionsList.innerHTML = '';

    wishes.forEach(function (wish) {

        const wishButton =
            document.createElement('button');

        wishButton.type = 'button';

        wishButton.className =
            'wish-suggestion';

        wishButton.textContent = wish;


        /* Select Wish */

        wishButton.addEventListener('click', function () {

            if (guestWish) {

                guestWish.value = wish;

                /* خلي الـ textarea يبدأ من أول الكلام */
                guestWish.scrollTop = 0;

                /* اقفل النافذة */
                closeWishSuggestions();

                /* خلي الـ textarea واضح */
                guestWish.focus();

            }

        });


        wishSuggestionsList.appendChild(wishButton);

    });

}


/* Close Modal */

function closeWishSuggestions() {

    if (!wishSuggestionsModal) return;

    wishSuggestionsModal.classList.remove('active');

}


/* Close - X */

if (wishSuggestionsClose) {

    wishSuggestionsClose.addEventListener(
        'click',
        closeWishSuggestions
    );

}


/* Close - Bottom Button */

if (wishSuggestionsCloseBottom) {

    wishSuggestionsCloseBottom.addEventListener(
        'click',
        closeWishSuggestions
    );

}


/* Click Outside */

if (wishSuggestionsModal) {

    wishSuggestionsModal.addEventListener(
        'click',
        function (e) {

            if (
                e.target.classList.contains(
                    'wish-suggestions-overlay'
                )
            ) {

                closeWishSuggestions();

            }

        }
    );

}


/* ESC */

document.addEventListener(
    'keydown',
    function (e) {

        if (
            e.key === 'Escape' &&
            wishSuggestionsModal &&
            wishSuggestionsModal.classList.contains('active')
        ) {

            closeWishSuggestions();

        }

    }
);


/* =========================================
   ADD TO CALENDAR
========================================= */

const addCalendarBtn = document.getElementById('addCalendarBtn');
if (addCalendarBtn) {
    addCalendarBtn.addEventListener('click', function() {
        const url = 'https://www.google.com/calendar/render?action=TEMPLATE&' +
            'text=Mohamed%20Atef%20%26%20Hasnaa%20Mahmoud%27s%20Wedding&' +
            'dates=20260912T160000Z/20260912T180000Z&' +
            'ctz=Africa/Cairo&' +
            'details=Join%20us%20to%20celebrate%20the%20wedding%20of%20Mohamed%20%26%20Hasnaa&' +
            'location=Ramage%20hotel%20(%20La%20Reine)';

        window.open(url, '_blank');
    });
}


/* =========================================
   RSVP
========================================= */

const rsvpBtn = document.getElementById('rsvpBtn');
if (rsvpBtn) {
    rsvpBtn.addEventListener('click', function() {
        const name = prompt('Please enter your name:');
        if (name && name.trim()) {
            const attending = confirm(`Hi ${name.trim()}, will you be attending the wedding?`);
            if (attending) {
                alert(`Thank you ${name.trim()}! We look forward to celebrating with you! 🎉`);
            } else {
                alert(`We'll miss you ${name.trim()}! Thank you for letting us know.`);
            }
        }
    });
}

// =========================================
// GUEST ID
// =========================================

let guestId = localStorage.getItem('weddingGuestId');

if (!guestId) {

    guestId =
        'GUEST-' +
        Date.now().toString(36) +
        '-' +
        Math.random().toString(36).substring(2, 8);

    localStorage.setItem(
        'weddingGuestId',
        guestId
    );

}


/* =========================================
   AUTO-PLAY GALLERY (تقليب تلقائي)
========================================= */

let autoPlayInterval;

function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    // يتقلب كل 4 ثواني
    autoPlayInterval = setInterval(() => {
        const nextBtn = document.getElementById('galleryNext');
        if (nextBtn) nextBtn.click();
    }, 1000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// تشغيل التلقائي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // نبدأ التقليب بعد ثانية ونص عشان الصفحة تثبت
    setTimeout(startAutoPlay, 1000);
});

// لو المستخدم دوس على الأسهم، نوقف التلقائي مؤقتاً وبعدين نرجعه
const prevBtn = document.getElementById('galleryPrev');
const nextBtn = document.getElementById('galleryNext');

if (prevBtn && nextBtn) {
    const restartAutoPlay = () => {
        stopAutoPlay();
        setTimeout(startAutoPlay, 2000); // يرجع بعد 5 ثواني من ضغطة المستخدم
    };
    
    prevBtn.addEventListener('click', restartAutoPlay);
    nextBtn.addEventListener('click', restartAutoPlay);
}


/* =========================================
   AUTO SCROLL - START / PAUSE / RESUME
========================================= */

let autoScrollActive = false;
let autoScrollPaused = false;
let autoScrollAnimation = null;

function startAutoScroll() {
    autoScrollActive = true;
    autoScrollPaused = false;

    cancelAnimationFrame(autoScrollAnimation);

    function scrollStep() {
        if (!autoScrollActive) return;

        if (!autoScrollPaused) {

            // سرعة الـ Scroll
            window.scrollBy(0, 1);

            // التأكد من الوصول لآخر الصفحة
            const currentPosition = window.scrollY + window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;

            if (currentPosition >= pageHeight - 1) {
                window.scrollTo(0, pageHeight - window.innerHeight);
                autoScrollActive = false;
                return;
            }
        }

        autoScrollAnimation = requestAnimationFrame(scrollStep);
    }

    scrollStep();
}

function toggleAutoScroll() {

    if (!autoScrollActive) {
        startAutoScroll();
        return;
    }

    autoScrollPaused = !autoScrollPaused;
}

/* =========================================
CLICK / TOUCH TO PAUSE OR RESUME
========================================= */

function shouldPauseAutoScroll(e) {

    // زر الموسيقى: لا توقف الـ Auto Scroll
    if (e.target.closest('.music-toggle')) {
        return false;
    }

    // الخريطة: توقف الـ Auto Scroll عند التفاعل معها
    if (e.target.closest('.map-container')) {
        return true;
    }

    // الفورم: لا توقف الـ Auto Scroll
    if (e.target.closest('form')) {
        return false;
    }

    // أي Button آخر في الصفحة
    if (e.target.closest('button')) {
        return true;
    }

    return false;
}


document.addEventListener('pointerdown', function(e) {

    // زر الموسيقى: سيب الـ Auto Scroll شغال
    if (e.target.closest('.music-toggle')) return;

    // الخريطة: أوقف الـ Auto Scroll
    if (e.target.closest('.map-container')) {
        if (autoScrollActive) {
            autoScrollPaused = true;
        }
        return;
    }

    // الفورم: لا تعمل Pause
    if (e.target.closest('form')) return;

    // أي Button
    if (shouldPauseAutoScroll(e)) {
        autoScrollPaused = true;
        return;
    }

    // الضغط على أي مكان عادي
    toggleAutoScroll();

}, { passive: true });


/* Touch على الموبايل */

document.addEventListener('touchstart', function(e) {

    // زر الموسيقى: سيب الـ Auto Scroll شغال
    if (e.target.closest('.music-toggle')) return;

    // الخريطة: أوقف الـ Auto Scroll
    if (e.target.closest('.map-container')) {
        if (autoScrollActive) {
            autoScrollPaused = true;
        }
        return;
    }

    // الفورم: لا تعمل Pause
    if (e.target.closest('form')) return;

    // أي Button
    if (shouldPauseAutoScroll(e)) {
        autoScrollPaused = true;
        return;
    }

    // الضغط على أي مكان عادي
    toggleAutoScroll();

}, { passive: true });

/* =========================================================
   RSVP MODAL + GOOGLE SHEETS
========================================================= */

const confirmAttendanceBtn =
    document.getElementById('confirmAttendanceBtn');

const rsvpModal =
    document.getElementById('rsvpModal');

const rsvpClose =
    document.getElementById('rsvpClose');

const rsvpOverlay =
    document.querySelector('.rsvp-overlay');

const rsvpName =
    document.getElementById('rsvpName');

const rsvpSubmit =
    document.getElementById('rsvpSubmit');

const attendanceOptions =
    document.querySelectorAll('.attendance-option');


let selectedAttendance = null;


/* =========================================================
   GOOGLE SHEETS URL
========================================================= */

const GOOGLE_SHEET_URL =
    'https://script.google.com/macros/s/AKfycbyKMpISLGd68QEffbW0FPlVO4t3BI3-yETPfVnGSin-QIaNXYj-JBH080Ej-3c7D-A/exec';


/* =========================================================
   OPEN MODAL
========================================================= */

if (confirmAttendanceBtn) {

    confirmAttendanceBtn.addEventListener('click', function (e) {

        e.preventDefault();
        e.stopPropagation();

        // وقف الـ Auto Scroll
        if (autoScrollActive) {
            autoScrollPaused = true;
        }

        rsvpModal.classList.add('active');

        // Focus على الاسم
        setTimeout(() => {
            rsvpName.focus();
        }, 300);

    });

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeRsvpModal() {

    rsvpModal.classList.remove('active');

}


/* Close X */

if (rsvpClose) {

    rsvpClose.addEventListener('click', function (e) {

        e.preventDefault();
        e.stopPropagation();

        closeRsvpModal();

    });

}


/* Click outside */

if (rsvpOverlay) {

    rsvpOverlay.addEventListener('click', function () {

        closeRsvpModal();

    });

}


/* =========================================================
   ATTENDANCE SELECTION
========================================================= */

attendanceOptions.forEach(option => {

    option.addEventListener('click', function (e) {

        e.preventDefault();
        e.stopPropagation();

        // إزالة الاختيار القديم
        attendanceOptions.forEach(item => {
            item.classList.remove('selected');
        });

        // تحديد الاختيار الجديد
        this.classList.add('selected');

        selectedAttendance =
            this.dataset.attendance;

        checkRsvpForm();

    });

});


/* =========================================================
   CHECK FORM
========================================================= */

function checkRsvpForm() {

    const nameFilled =
        rsvpName.value.trim().length > 0;

    const attendanceSelected =
        selectedAttendance !== null;

    rsvpSubmit.disabled =
        !(nameFilled && attendanceSelected);

}


/* تحديث الزر أثناء الكتابة */

if (rsvpName) {

    rsvpName.addEventListener('input', function () {

        checkRsvpForm();

    });

}


/* =========================================================
   SUBMIT RSVP
========================================================= */

if (rsvpSubmit) {

    rsvpSubmit.addEventListener('click', async function (e) {

        e.preventDefault();
        e.stopPropagation();

        const name = rsvpName.value.trim();

        if (!name || !selectedAttendance) {
            return;
        }

        /* منع الضغط مرتين */
        rsvpSubmit.disabled = true;
        rsvpSubmit.textContent = 'Sending...';

        /* التاريخ والوقت */
        const now = new Date();

        const date = now.toLocaleDateString('en-GB');

        const time = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        /* البيانات */
        const data = {
            guestId: guestId,
            name: name,
            date: date,
            time: time,
            attendance: selectedAttendance
        };

        try {

            await fetch(
                GOOGLE_SHEET_URL,
                {
                    method: 'POST',

                    mode: 'no-cors',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(data)
                }
            );

            /* نجاح */
            rsvpSubmit.textContent = 'Confirmed ✓';

            setTimeout(() => {

                /* قفل الـ Modal */
                closeRsvpModal();

                /* رسالة الشكر داخل الموقع */
                if (selectedAttendance === 'Yes') {

                    showRsvpThankYou(
                        `Thank you ${name}! ❤️ We look forward to celebrating with you! 🎉`
                    );

                } else {

                    showRsvpThankYou(
                        `Thank you ${name} for letting us know. ❤️`
                    );

                }

                /* Reset */
                rsvpName.value = '';

                selectedAttendance = null;

                attendanceOptions.forEach(option => {
                    option.classList.remove('selected');
                });

                rsvpSubmit.textContent = 'Confirm';

                checkRsvpForm();

            }, 700);

        } catch (error) {

            console.error('RSVP Error:', error);

            rsvpSubmit.disabled = false;

            rsvpSubmit.textContent = 'Confirm';

            /* رسالة خطأ داخل الموقع بدل alert */
            showRsvpThankYou(
                'Something went wrong. Please try again.'
            );

        }

    });

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener('keydown', function (e) {

    if (e.key === 'Escape') {

        if (
            rsvpModal &&
            rsvpModal.classList.contains('active')
        ) {

            closeRsvpModal();

        }

    }

});


/* =========================================================
   RSVP THANK YOU MESSAGE
========================================================= */

function showRsvpThankYou(message) {

    const thankYou =
        document.getElementById('rsvpThankYou');

    const thankYouText =
        document.getElementById('rsvpThankYouText');

    if (!thankYou) return;

    if (thankYouText) {
        thankYouText.textContent = message;
    }

    thankYou.classList.add('active');

    setTimeout(() => {

        thankYou.classList.remove('active');

    }, 3000);

}