document.addEventListener('DOMContentLoaded', () => {
    // Initialize profile data
    const name = localStorage.getItem('userName') || '';
    const profilePic = localStorage.getItem('userAvatar') || 'https://via.placeholder.com/150?text=+';
    
    // Set profile picture
    const profilePicElements = document.querySelectorAll('.profile-pic, .large-profile-pic');
    profilePicElements.forEach(el => el.src = profilePic);
  
    // Set member date
    const memberSince = document.getElementById('memberSince');
    if (memberSince) {
      const joinDate = localStorage.getItem('joinDate') || new Date().toISOString();
      memberSince.textContent = new Date(joinDate).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    }
  
    // Handle profile picture upload
    const changePicBtn = document.querySelector('.change-pic-btn');
    if (changePicBtn) {
      changePicBtn.addEventListener('click', handleProfilePicUpload);
    }
  
    // Handle subscription changes
    initializeSubscription();
  
    // Handle profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', handleProfileUpdate);
    }
  
    // Handle password change
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
      passwordForm.addEventListener('submit', handlePasswordChange);
    }
  
    // Handle preferences
    initializePreferences();
  
    // Handle logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  
    // Initialize downloads
    updateDownloadsGrid();
  });
  
  function handleProfilePicUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target.result;
          document.querySelectorAll('.profile-pic, .large-profile-pic')
            .forEach(el => el.src = imageData);
          localStorage.setItem('userAvatar', imageData);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  }
  
  function initializeSubscription() {
    const planOptions = document.querySelectorAll('input[name="plan"]');
    const changePlanBtn = document.querySelector('.change-plan-btn');
    const currentPlan = document.getElementById('currentPlan');
    const planName = document.getElementById('planName');
    const planPrice = document.getElementById('planPrice');
    const renewalDate = document.getElementById('renewalDate');
  
    const plans = {
      'basic-monthly': { name: 'Basic Plan', price: '$8.99/month', badge: 'basic' },
      'standard-monthly': { name: 'Standard Plan', price: '$13.99/month', badge: 'standard' },
      'premium-yearly': { name: 'Premium Plan', price: '$179.99/year', badge: 'premium' }
    };
  
    // Set initial plan from storage
    const savedPlan = localStorage.getItem('subscriptionPlan') || 'basic-monthly';
    if (currentPlan) currentPlan.textContent = plans[savedPlan].name;
    if (planName) planName.textContent = plans[savedPlan].name;
    if (planPrice) planPrice.textContent = plans[savedPlan].price;
  
    // Set renewal date
    if (renewalDate) {
      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + (savedPlan.includes('yearly') ? 12 : 1));
      renewalDate.textContent = `Next billing date: ${nextBilling.toLocaleDateString()}`;
    }
  
    if (changePlanBtn) {
      changePlanBtn.addEventListener('click', () => {
        const selectedPlan = document.querySelector('input[name="plan"]:checked');
        if (selectedPlan && plans[selectedPlan.value]) {
          const plan = plans[selectedPlan.value];
          const nextBilling = new Date();
          nextBilling.setMonth(nextBilling.getMonth() + (selectedPlan.value.includes('yearly') ? 12 : 1));
          
          localStorage.setItem('subscriptionPlan', selectedPlan.value);
          
          if (planName) planName.textContent = plan.name;
          if (planPrice) planPrice.textContent = plan.price;
          if (renewalDate) {
            renewalDate.textContent = `Next billing date: ${nextBilling.toLocaleDateString()}`;
          }
          if (currentPlan) {
            currentPlan.textContent = plan.name;
            currentPlan.className = `subscription-badge ${plan.badge}`;
          }
          
          alert('Your subscription plan has been updated successfully!');
        }
      });
    }
  }
  
  function initializePreferences() {
    const preferences = document.querySelectorAll('.preference-item input');
    const savedPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
  
    preferences.forEach(pref => {
      const prefName = pref.closest('.preference-item').textContent.trim();
      pref.checked = savedPrefs[prefName] || false;
  
      pref.addEventListener('change', () => {
        const updatedPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        updatedPrefs[prefName] = pref.checked;
        localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
        alert(`${prefName} preference updated!`);
      });
    });
  }
  
  function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const profileData = Object.fromEntries(formData);
    
    localStorage.setItem('userName', profileData.name || '');
    localStorage.setItem('userEmail', profileData.email || '');
    localStorage.setItem('userLanguage', profileData.language || 'en');
    
    alert('Profile updated successfully!');
  }
  
  function handlePasswordChange(e) {
    e.preventDefault();
    const newPassword = e.target.querySelector('input[type="password"]:nth-child(2)').value;
    const confirmPassword = e.target.querySelector('input[type="password"]:nth-child(3)').value;
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // In a real app, this would call an API
    localStorage.setItem('passwordLastChanged', new Date().toISOString());
    alert('Password changed successfully!');
    document.querySelector('.change-password-modal').close();
  }
  
  function handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
      // Clear sensitive data but keep preferences
      const keysToKeep = ['userPreferences', 'language'];
      const prefsToKeep = {};
      
      keysToKeep.forEach(key => {
        prefsToKeep[key] = localStorage.getItem(key);
      });
      
      localStorage.clear();
      
      keysToKeep.forEach(key => {
        if (prefsToKeep[key]) localStorage.setItem(key, prefsToKeep[key]);
      });
      
      window.location.href = 'login.html';
    }
  }
  
  // Global functions for download management
  window.updateDownloadsGrid = function() {
    const downloads = JSON.parse(localStorage.getItem('movieDownloads') || '[]');
    const downloadsGrid = document.querySelector('.downloads-grid');
    if (!downloadsGrid) return;
    
    if (downloads.length === 0) {
      downloadsGrid.innerHTML = `
        <div class="empty-state">
          <p>No downloads yet</p>
          <a href="movies.html" class="browse-movies-btn">Browse Movies</a>
        </div>
      `;
      return;
    }
    
    downloadsGrid.innerHTML = downloads.map(download => `
      <div class="download-card" data-movie-id="${download.id}">
        <div class="download-card-content">
          <img src="${download.poster}" alt="${download.title}" class="download-poster">
          <div class="download-info">
            <h3 class="download-title">${download.title}</h3>
            <div class="download-metadata">
              ${download.genre} • ${download.size}
            </div>
            <div class="download-progress-bar">
              <div class="download-progress" style="width: ${download.progress}%"></div>
            </div>
            <div class="download-actions">
              ${download.progress === 100 ? `
                <button class="download-action-btn" onclick="playDownload('${download.id}')">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M8 5v14l11-7z" fill="currentColor"/>
                  </svg>
                  Play
                </button>
              ` : `
                <button class="download-action-btn" onclick="pauseDownload('${download.id}')">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
                  </svg>
                  ${download.paused ? 'Resume' : 'Pause'}
                </button>
              `}
              <button class="download-action-btn delete-download" onclick="deleteDownload('${download.id}')">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  };
  
  // Start download progress simulation
  let downloadInterval = setInterval(() => {
    const downloads = JSON.parse(localStorage.getItem('movieDownloads') || '[]');
    let updated = false;
    
    downloads.forEach(download => {
      if (!download.paused && download.progress < 100) {
        download.progress += Math.random() * 10;
        if (download.progress > 100) download.progress = 100;
        updated = true;
      }
    });
  
    if (updated) {
      localStorage.setItem('movieDownloads', JSON.stringify(downloads));
      updateDownloadsGrid();
    }
  }, 2000);
  
  window.playDownload = (movieId) => {
    const downloads = JSON.parse(localStorage.getItem('movieDownloads') || '[]');
    const movie = downloads.find(d => d.id === movieId);
    if (movie) {
      window.location.href = `movies.html?play=${encodeURIComponent(movie.title)}`;
    }
  };
  
  window.pauseDownload = (movieId) => {
    const downloads = JSON.parse(localStorage.getItem('movieDownloads') || '[]');
    const download = downloads.find(d => d.id === movieId);
    if (download) {
      download.paused = !download.paused;
      localStorage.setItem('movieDownloads', JSON.stringify(downloads));
      updateDownloadsGrid();
    }
  };
  
  window.deleteDownload = (movieId) => {
    if (confirm('Are you sure you want to delete this download?')) {
      const downloads = JSON.parse(localStorage.getItem('movieDownloads') || '[]');
      const updatedDownloads = downloads.filter(d => d.id !== movieId);
      localStorage.setItem('movieDownloads', JSON.stringify(updatedDownloads));
      updateDownloadsGrid();
    }
  };
  
  // Cleanup on page unload
  window.addEventListener('unload', () => {
    clearInterval(downloadInterval);
  });