document.addEventListener('DOMContentLoaded', () => {
  const userEmail = localStorage.getItem('userEmail');
  const trialEndDate = new Date(localStorage.getItem('trialEndDate'));
  const currentDate = new Date();

  if (!userEmail || currentDate >= trialEndDate) {
    alert('You need to sign up or your trial has ended. Please sign up or provide payment information.');
    window.location.href = 'signup.html';
  }

  // Handle sticky navbar
  const nav = document.querySelector('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  // Only handle email signup if on home page
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const emailForm = document.querySelector('.email-signup');
    if (emailForm) {
      const emailInput = emailForm.querySelector('input');
      const submitButton = emailForm.querySelector('button');

      submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailInput.value;

        if (!email || !email.includes('@') || !email.includes('.')) {
          emailInput.style.borderColor = '#ff4444';
          emailInput.setAttribute('placeholder', 'Please enter a valid email');
          return;
        }

        // Simulate form submission
        emailInput.value = '';
        emailInput.setAttribute('placeholder', 'Thanks for signing up!');
        emailInput.style.borderColor = '#2ecc71';
      });
    }
  }

  // Initialize video player functionality if on movies page
  if (window.location.pathname.includes('movies.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const playMovie = urlParams.get('play');
    if (playMovie) {
      openVideoPlayer(playMovie);
    }
  }

  // Initialize profile functionality if on profile page
  if (window.location.pathname.includes('profile.html')) {
    initializeProfile();
  }

  // Initialize sports functionality if on sports page
  if (window.location.pathname.includes('sports.html')) {
    initializeSports();
  }

  // Only create TV static if TV screen exists
  const tvScreen = document.querySelector('.tv-screen');
  if (tvScreen) {
    createTVStatic();
  }
});

function createTVStatic() {
  const tvScreen = document.querySelector('.tv-screen');
  if (!tvScreen) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = tvScreen.offsetWidth || 300;
  canvas.height = tvScreen.offsetHeight || 200;

  function animate() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.floor(Math.random() * 25);
      data[i] = noise;     // red
      data[i + 1] = noise; // green
      data[i + 2] = noise; // blue
      data[i + 3] = 255;   // alpha
    }

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(animate);
  }

  tvScreen.appendChild(canvas);
  animate();
}

function initializeProfile() {
  // Load stored profile data
  const storedName = localStorage.getItem('userName') || '';
  const storedPlan = localStorage.getItem('userPlan') || 'basic';
  const storedAvatar = localStorage.getItem('userAvatar');

  const nameElement = document.querySelector('.editable-name');
  if (nameElement) {
    nameElement.textContent = storedName;
    nameElement.addEventListener('blur', () => {
      localStorage.setItem('userName', nameElement.textContent);
    });
  }

  // Set avatar if stored
  if (storedAvatar) {
    const avatarElements = document.querySelectorAll('.profile-pic, .large-profile-pic');
    avatarElements.forEach(el => el.src = storedAvatar);
  }

  // Initialize downloads section
  updateDownloadsGrid();
}

function initializeSports() {
  // Initialize 808 Live connection and stream status
  const apiKey = localStorage.getItem('808LiveApiKey');
  if (!apiKey) {
    console.warn('808 Live API key not configured');
  }

  // Update viewer counts periodically
  setInterval(updateViewerCounts, 5000);
}

function updateViewerCounts() {
  const streamStats = document.querySelectorAll('.stream-status');
  streamStats.forEach(stat => {
    const count = Math.floor(Math.random() * 10000) + 5000;
    const viewers = stat.querySelector('.viewer-count');
    if (viewers) {
      viewers.textContent = count.toLocaleString();
    }
  });
}

function updateDownloadsGrid() {
  // This function is not defined in the plan or current code, 
  // so you may need to implement it according to your requirements.
}

function openVideoPlayer(playMovie) {
  // This function is not defined in the plan or current code, 
  // so you may need to implement it according to your requirements.
}

// Global error handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error('Error: ', msg, url, lineNo, columnNo, error);
  // Could implement error reporting service here
  return false;
};

// Export functions for other modules
window.initializeProfile = initializeProfile;
window.initializeSports = initializeSports;
window.createTVStatic = createTVStatic;