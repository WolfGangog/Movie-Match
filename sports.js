document.addEventListener('DOMContentLoaded', () => {
  // Handle profile menu and logout
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
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
    });
  }

  // Update profile picture if available
  const profilePic = localStorage.getItem('userAvatar');
  if (profilePic) {
    const profilePicElements = document.querySelectorAll('.profile-pic');
    profilePicElements.forEach(el => el.src = profilePic);
  }

  // Handle search functionality
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const matchCards = document.querySelectorAll('.match-card');
      
      matchCards.forEach(card => {
        const title = card.querySelector('.team-name').textContent.toLowerCase();
        const competition = card.querySelector('.competition-badge').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || competition.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 808 Live Stream configuration
  const STREAM_BASE_URL = 'https://808live.com/embed';
  const API_KEY = 'your_808_live_api_key'; // Replace with actual API key

  const liveMatches = [
    {
      id: 1,
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      score: "2 - 1",
      time: "65'",
      competition: "Premier League",
      homeTeamShort: "MUN",
      awayTeamShort: "LIV",
      streamId: "808_12345" // 808 Live stream ID
    },
    {
      id: 2,
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      score: "1 - 2",
      time: "80'",
      competition: "La Liga",
      homeTeamShort: "BAR",
      awayTeamShort: "RMA",
      streamId: "808_12346"
    },
    {
      id: 3,
      homeTeam: "Juventus",
      awayTeam: "AC Milan",
      score: "0 - 0",
      time: "45'",
      competition: "Serie A",
      homeTeamShort: "JUV",
      awayTeamShort: "MIL",
      streamId: "808_12347"
    },
    {
      id: 4,
      homeTeam: "Bayern Munich",
      awayTeam: "Borussia Dortmund",
      score: "2 - 1",
      time: "60'",
      competition: "Bundesliga",
      homeTeamShort: "BAY",
      awayTeamShort: "DOR",
      streamId: "808_12348"
    },
    {
      id: 5,
      homeTeam: "Paris Saint-Germain",
      awayTeam: "Olympique de Marseille",
      score: "1 - 1",
      time: "70'",
      competition: "Ligue 1",
      homeTeamShort: "PSG",
      awayTeamShort: "MAR",
      streamId: "808_12349"
    }
  ];

  const upcomingMatches = [
    {
      id: 6,
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      date: "2024-03-20",
      time: "20:00",
      competition: "Premier League",
      homeTeamShort: "ARS",
      awayTeamShort: "CHE"
    },
    {
      id: 7,
      homeTeam: "Atletico Madrid",
      awayTeam: "Sevilla",
      date: "2024-03-21",
      time: "21:00",
      competition: "La Liga",
      homeTeamShort: "ATM",
      awayTeamShort: "SEV"
    },
    {
      id: 8,
      homeTeam: "Inter Milan",
      awayTeam: "Napoli",
      date: "2024-03-22",
      time: "19:00",
      competition: "Serie A",
      homeTeamShort: "INT",
      awayTeamShort: "NAP"
    },
    {
      id: 9,
      homeTeam: "RB Leipzig",
      awayTeam: "Eintracht Frankfurt",
      date: "2024-03-23",
      time: "18:00",
      competition: "Bundesliga",
      homeTeamShort: "RBL",
      awayTeamShort: "SGE"
    },
    {
      id: 10,
      homeTeam: "Lyon",
      awayTeam: "Monaco",
      date: "2024-03-24",
      time: "20:00",
      competition: "Ligue 1",
      homeTeamShort: "LYO",
      awayTeamShort: "MON"
    }
  ];

  function createMatchCard(match, isLive = false) {
    const formattedDate = isLive ? match.time : 
      new Date(`${match.date} ${match.time}`).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

    return `
      <div class="match-card" data-match-id="${match.id}" ${isLive ? `data-stream-id="${match.streamId}"` : ''}>
        <div class="match-header">
          <div class="competition-badge">${match.competition}</div>
          ${isLive ? '<div class="live-indicator">LIVE</div>' : ''}
        </div>
        <div class="match-teams">
          <div class="team">
            <div class="team-logo">${match.homeTeamShort}</div>
            <span class="team-name">${match.homeTeam}</span>
          </div>
          <div class="score">${isLive ? match.score : 'VS'}</div>
          <div class="team">
            <div class="team-logo">${match.awayTeamShort}</div>
            <span class="team-name">${match.awayTeam}</span>
          </div>
        </div>
        <div class="match-status">
          ${isLive ? `${match.time} Minutes Played` : formattedDate}
        </div>
        ${isLive ? `
          <div class="stream-link">
            <svg viewBox="0 0 24 24">
              <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12z" fill="currentColor"/>
            </svg>
            Watch on 808 Live
          </div>
        ` : ''}
      </div>
    `;
  }

  // Stream player functionality
  const streamDialog = document.querySelector('.stream-player-dialog');
  const streamFrame = document.getElementById('streamFrame');
  const streamTitle = document.getElementById('streamTitle');
  const closeStreamBtn = document.querySelector('.close-stream');
  const qualityBtns = document.querySelectorAll('.quality-btn');

  function openStream(match) {
    const streamUrl = `${STREAM_BASE_URL}/${match.streamId}?api_key=${API_KEY}`;
    streamFrame.src = streamUrl;
    streamTitle.textContent = `${match.homeTeam} vs ${match.awayTeam}`;
    streamDialog.showModal();

    // Simulate viewer count updates
    updateViewerCount();
  }

  function closeStream() {
    streamFrame.src = '';
    streamDialog.close();
  }

  function updateViewerCount() {
    const viewerCount = document.getElementById('viewerCount');
    setInterval(() => {
      const count = Math.floor(Math.random() * 10000) + 5000;
      viewerCount.textContent = `${count.toLocaleString()} viewers`;
    }, 5000);
  }

  function renderMatches() {
    const liveMatchesContainer = document.getElementById('liveMatches');
    const upcomingMatchesContainer = document.getElementById('upcomingMatches');
    
    // Clear existing content
    liveMatchesContainer.innerHTML = '';
    upcomingMatchesContainer.innerHTML = '';

    // Render live matches
    liveMatches.forEach(match => {
      liveMatchesContainer.innerHTML += createMatchCard(match, true);
    });

    // Get selected competition filter
    const selectedCompetition = document.getElementById('competitionFilter').value;

    // Filter and render upcoming matches
    const filteredUpcoming = selectedCompetition === 'all' 
      ? upcomingMatches 
      : upcomingMatches.filter(match => match.competition === selectedCompetition);

    filteredUpcoming.forEach(match => {
      upcomingMatchesContainer.innerHTML += createMatchCard(match);
    });
  }

  // Add event listener for competition filter
  document.getElementById('competitionFilter').addEventListener('change', renderMatches);

  // Event Listeners
  document.addEventListener('click', (e) => {
    const matchCard = e.target.closest('.match-card');
    if (matchCard && matchCard.dataset.streamId) {
      const match = liveMatches.find(m => m.id === parseInt(matchCard.dataset.matchId));
      if (match) openStream(match);
    } else if (matchCard) {
      const matchId = matchCard.dataset.matchId;
      // In a real application, this would navigate to a detailed match view
      console.log(`Navigating to match details for match ID: ${matchId}`);
    }
  });

  closeStreamBtn.addEventListener('click', closeStream);

  qualityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      qualityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // In a real implementation, you would switch stream quality here
    });
  });

  // Initial render
  renderMatches();

  // Update match times periodically
  setInterval(() => {
    liveMatches.forEach(match => {
      const currentTime = parseInt(match.time.replace("'", ''));
      match.time = `${(currentTime + 1) % 90}'`;
    });
    renderMatches();
  }, 60000);
});