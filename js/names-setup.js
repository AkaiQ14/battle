// Import Firebase GameService
import { GameService } from './gameService.js';


// Game state
let gameState = {
  player1: { name: '', abilities: [], selectedCards: [] },
  player2: { name: '', abilities: [], selectedCards: [] },
  rounds: 11,
  challenge: 11, // التحدي (عدد النقاط المطلوبة للفوز)
  advancedMode: false,
  currentStep: 1
};

// Load existing data if available
document.addEventListener('DOMContentLoaded', function() {
  // Clear all previous game data when starting new game
  clearAllPreviousGameData();
  
  // فحص وحماية بيانات لوحة المتصدرين
  checkLeaderboardData();
  
  loadExistingData();
  setupEventListeners();
  validateForm();
});

// Function to clear all previous game data
function clearAllPreviousGameData() {
  // Clear game ended flags
  localStorage.removeItem('gameEnded');
  localStorage.removeItem('gameEndedTimestamp');
  
  // Clear game progress and setup data
  localStorage.removeItem('gameSetupProgress');
  localStorage.removeItem('cardGameSetup');
  localStorage.removeItem('battleStarted');
  
  // Clear player arrangement data
  localStorage.removeItem('player1ArrangementCompleted');
  localStorage.removeItem('player2ArrangementCompleted');
  localStorage.removeItem('player1CardArrangement');
  localStorage.removeItem('player2CardArrangement');
  localStorage.removeItem('player1SessionId');
  localStorage.removeItem('player2SessionId');
  localStorage.removeItem('player1ArrangementPending');
  localStorage.removeItem('player2ArrangementPending');
  
  // Clear battle data
  localStorage.removeItem('currentCards');
  localStorage.removeItem('playerHealth');
  localStorage.removeItem('currentRound');
  
  // Clear ability requests
  localStorage.removeItem('abilityRequests');
  
  // Clear card selection data
  localStorage.removeItem('gameCardSelection');
  
  // Clear session data
  localStorage.removeItem('currentGameSessionId');
  
  console.log('All previous game data cleared for new game');
}

function loadExistingData() {
  // Since we cleared gameSetupProgress, we start fresh
  // But we keep the saved abilities in localStorage
  document.getElementById('player1Name').value = '';
  document.getElementById('player2Name').value = '';
  document.getElementById('roundsCount').value = '11';
  
  // Initialize checkbox state
  const checkbox = document.getElementById('checkbox');
  const wrapper = document.getElementById('advancedMode');
  checkbox.classList.remove('checked');
  wrapper.classList.remove('checked');
}

function setupEventListeners() {
  const player1Input = document.getElementById('player1Name');
  const player2Input = document.getElementById('player2Name');
  const roundsSelect = document.getElementById('roundsCount');
  const advancedModeWrapper = document.getElementById('advancedMode');
  const checkbox = document.getElementById('checkbox');
  
  player1Input.addEventListener('input', validateForm);
  player2Input.addEventListener('input', validateForm);
  roundsSelect.addEventListener('change', function() {
    const selectedRounds = parseInt(this.value);
    gameState.rounds = selectedRounds;
    gameState.challenge = selectedRounds; // التحدي يساوي عدد الجولات
    validateForm();
  });
  
  advancedModeWrapper.addEventListener('click', function() {
    gameState.advancedMode = !gameState.advancedMode;
    
    if (gameState.advancedMode) {
      checkbox.classList.add('checked');
      advancedModeWrapper.classList.add('checked');
    } else {
      checkbox.classList.remove('checked');
      advancedModeWrapper.classList.remove('checked');
    }
  });
  
  // Enter key navigation
  player1Input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') player2Input.focus();
  });
  
  player2Input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !document.getElementById('nextBtn').disabled) {
      nextStep();
    }
  });
}

function validateForm() {
  const player1Name = document.getElementById('player1Name').value.trim();
  const player2Name = document.getElementById('player2Name').value.trim();
  
  const nextBtn = document.getElementById('nextBtn');
  const isValid = player1Name.length >= 2 && 
                 player2Name.length >= 2 && 
                 player1Name !== player2Name;
  
  nextBtn.disabled = !isValid;
}

function saveProgress() {
  gameState.player1.name = document.getElementById('player1Name').value.trim();
  gameState.player2.name = document.getElementById('player2Name').value.trim();
  const selectedRounds = parseInt(document.getElementById('roundsCount').value);
  gameState.rounds = selectedRounds;
  gameState.challenge = selectedRounds; // التحدي يساوي عدد الجولات
  
  // حفظ إعدادات التحدي
  gameState.advancedMode = document.getElementById('advancedMode').style.background === 'rgb(40, 167, 69)';
  
  // Also save player names in the old format for compatibility
  gameState.player1Name = gameState.player1.name;
  gameState.player2Name = gameState.player2.name;
  
  localStorage.setItem('gameSetupProgress', JSON.stringify(gameState));
}

async function nextStep() {
  const player1Name = document.getElementById('player1Name').value.trim();
  const player2Name = document.getElementById('player2Name').value.trim();
  const rounds = parseInt(document.getElementById('roundsCount').value);
  
  // التحقق من صحة البيانات
  if (player1Name.length < 2 || player2Name.length < 2) {
    alert('يجب أن يكون اسم كل لاعب حرفين على الأقل');
    return;
  }
  
  if (player1Name === player2Name) {
    alert('يجب أن يكون اسم اللاعبين مختلفين');
    return;
  }
  
  try {
    // إظهار loading
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = true;
    nextBtn.textContent = 'جاري إنشاء اللعبة...';
    
    // إنشاء لعبة في Firebase
    const gameId = await GameService.createGame(player1Name, player2Name, rounds);
    
    // حفظ معرف اللعبة
    sessionStorage.setItem('currentGameId', gameId);
    
    // حفظ البيانات المحلية للتوافق
    saveProgress();
    
    // الانتقال للصفحة التالية
    window.location.href = 'abilities-setup.html';
    
  } catch (error) {
    console.error('Error creating game:', error);
    alert('حدث خطأ في إنشاء اللعبة: ' + error.message);
    
    // إعادة تفعيل الزر
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = false;
    nextBtn.textContent = 'متابعة';
  }
}

// Show leaderboard
function showLeaderboard() {
  console.log('showLeaderboard called');
  const leaderboard = getLeaderboard();
  console.log('Leaderboard data:', leaderboard);
  
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(139, 21, 56, 0.98), 
      rgba(45, 45, 45, 0.98), 
      rgba(25, 25, 25, 0.98)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: "Cairo", sans-serif;
    padding: 0;
    backdrop-filter: blur(15px);
    box-shadow: inset 0 0 100px rgba(255, 215, 0, 0.1);
  `;
  
  overlay.innerHTML = `
    <style>
      @keyframes borderGlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes patternMove {
        0% { transform: translateX(-20px); }
        100% { transform: translateX(20px); }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .leaderboard-row {
        animation: fadeInUp 0.6s ease-out;
      }
      
      .leaderboard-row:nth-child(1) { animation-delay: 0.1s; }
      .leaderboard-row:nth-child(2) { animation-delay: 0.2s; }
      .leaderboard-row:nth-child(3) { animation-delay: 0.3s; }
      .leaderboard-row:nth-child(4) { animation-delay: 0.4s; }
      .leaderboard-row:nth-child(5) { animation-delay: 0.5s; }
    </style>
    <div style="
      background: linear-gradient(135deg, 
        #2d2d2d 0%, 
        #1a1a1a 50%, 
        #0d0d0d 100%
      );
      color: white;
      width: 96vw;
      height: 96vh;
      border-radius: 25px;
      overflow: hidden;
      font-family: 'Cairo', sans-serif;
      box-shadow: 
        0 25px 80px rgba(0, 0, 0, 0.7),
        0 0 0 1px rgba(255, 215, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      border: 3px solid transparent;
      background-clip: padding-box;
      position: relative;
      display: flex;
      flex-direction: column;
    ">
      <!-- Golden Border Effect -->
      <div style="
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        background: linear-gradient(45deg, 
          #FFD700, #FFA500, #FF8C00, #FFD700, 
          #FFA500, #FF8C00, #FFD700
        );
        border-radius: 25px;
        z-index: -1;
        animation: borderGlow 3s linear infinite;
      "></div>
      <!-- Header -->
      <div style="
        background: linear-gradient(135deg, 
          #FFD700 0%, 
          #FFA500 50%, 
          #FF8C00 100%
        );
        color: #000;
      padding: 30px;
      text-align: center;
        border-bottom: 4px solid #FF6B00;
        position: relative;
        overflow: hidden;
        box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
      ">
        <!-- Animated Background Pattern -->
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.1) 10px,
            rgba(255, 255, 255, 0.1) 20px
          );
          animation: patternMove 10s linear infinite;
        "></div>
        
        <h2 style="
          margin: 0; 
          font-size: 32px; 
          font-weight: 900; 
          text-shadow: 
            2px 2px 4px rgba(0,0,0,0.3),
            0 0 20px rgba(255, 255, 255, 0.5);
          position: relative;
          z-index: 1;
          letter-spacing: 2px;
        ">
          🏆 لوحة المتصدرين 🏆
        </h2>
        
        <div style="
          margin-top: 10px;
          font-size: 14px;
          font-weight: 600;
          opacity: 0.8;
          position: relative;
          z-index: 1;
        ">
          LEADERBOARD
        </div>
      </div>
      
      <!-- Controls Section -->
          <div style="
        background: #1a1a1a;
        padding: 20px;
        border-bottom: 2px solid #444;
        display: flex;
        gap: 20px;
        align-items: center;
        flex-wrap: wrap;
      ">
        <!-- Add New Player -->
        <div style="flex: 1; min-width: 300px;">
          <h3 style="color: #FFD700; margin: 0 0 10px 0; font-size: 16px;">إضافة لاعب جديد (اختياري)</h3>
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="text" id="newPlayerName" placeholder="اسم اللاعب" style="
              flex: 1;
              padding: 12px 15px;
              border: 2px solid #444;
              border-radius: 8px;
              background: #2d2d2d;
              color: white;
              font-family: 'Cairo', sans-serif;
              font-size: 14px;
              outline: none;
              transition: border-color 0.3s;
            " onfocus="this.style.borderColor='#FFD700'" onblur="this.style.borderColor='#444'">
            <button onclick="addNewPlayer()" style="
              background: linear-gradient(135deg, #4CAF50, #45a049);
              color: white;
              border: none;
              border-radius: 8px;
              padding: 12px 20px;
              font-size: 14px;
              font-weight: bold;
              cursor: pointer;
              font-family: 'Cairo', sans-serif;
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              إضافة
            </button>
          </div>
        </div>
        
        <!-- Search Player -->
        <div style="flex: 1; min-width: 300px;">
          <h3 style="color: #FFD700; margin: 0 0 10px 0; font-size: 16px;">ابحث عن لاعب</h3>
          <div style="position: relative;">
            <input type="text" id="searchPlayer" placeholder="اكتب اسم اللاعب..." style="
              width: 100%;
              padding: 12px 40px 12px 15px;
              border: 2px solid #444;
              border-radius: 8px;
              background: #2d2d2d;
              color: white;
              font-family: 'Cairo', sans-serif;
              font-size: 14px;
              outline: none;
              transition: border-color 0.3s;
            " onfocus="this.style.borderColor='#FFD700'" onblur="this.style.borderColor='#444'" oninput="searchPlayers()">
            <span onclick="clearSearch()" style="
              position: absolute;
              right: 15px;
              top: 50%;
              transform: translateY(-50%);
              color: #f44336;
              cursor: pointer;
              font-size: 18px;
              font-weight: bold;
            ">✕</span>
          </div>
        </div>
        
        <!-- Save Changes Button -->
        <div>
          <button onclick="saveAllChanges()" style="
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #000;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            font-family: 'Cairo', sans-serif;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            💾 حفظ كل التعديلات
          </button>
            </div>
          </div>
      
      <!-- Table Container -->
      <div style="flex: 1; overflow-y: auto; padding: 0;">
        <table style="
          width: 100%;
          border-collapse: collapse;
          background: #2d2d2d;
          color: white;
          font-size: 14px;
        ">
          <thead style="position: sticky; top: 0; z-index: 10;">
            <tr style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d);">
              <th style="padding: 15px 10px; text-align: center; border-bottom: 2px solid #FFD700; color: #FFD700; font-weight: bold;">#</th>
              <th style="padding: 15px 10px; text-align: right; border-bottom: 2px solid #FFD700; color: #FFD700; font-weight: bold;">اسم اللاعب</th>
              <th style="padding: 15px 10px; text-align: center; border-bottom: 2px solid #FFD700; color: #FFD700; font-weight: bold;">عدد المباريات</th>
              <th style="padding: 15px 10px; text-align: center; border-bottom: 2px solid #FFD700; color: #FFD700; font-weight: bold;">فاز</th>
              <th style="padding: 15px 10px; text-align: center; border-bottom: 2px solid #FFD700; color: #FFD700; font-weight: bold;">خسر</th>
              <th style="padding: 15px 10px; text-align: center; border-bottom: 2px solid #FFD700; color: #FFD700; font-weight: bold;">نسبة الفوز</th>
              <th style="padding: 15px 10px; text-align: center; border-bottom: 2px solid #FFD700; color: #FFD700; font-weight: bold;">نقاط</th>
              <th style="padding: 15px 10px; text-align: center; border-bottom: 2px solid #FFD700; color: #FFD700; font-weight: bold;">التحكم</th>
            </tr>
          </thead>
          <tbody id="leaderboardTableBody">
            ${leaderboard.length === 0 ? 
              '<tr><td colspan="8" style="padding: 40px; text-align: center; color: #ccc; font-size: 18px;">لا توجد نتائج بعد. ابدأ اللعب!</td></tr>' :
              leaderboard.map((player, index) => `
                <tr class="leaderboard-row" style="
                  border-bottom: 1px solid #444; 
                  transition: all 0.3s ease;
                  position: relative;
                  overflow: hidden;
                " onmouseover="
                  this.style.backgroundColor='rgba(255, 215, 0, 0.1)';
                  this.style.transform='translateX(5px)';
                  this.style.boxShadow='0 5px 15px rgba(255, 215, 0, 0.2)';
                " onmouseout="
                  this.style.backgroundColor='transparent';
                  this.style.transform='translateX(0)';
                  this.style.boxShadow='none';
                ">
                  <td style="padding: 15px 10px; text-align: center; font-weight: bold; color: #FFD700;">${index + 1}</td>
                  <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 16px;">${player.name}</td>
                  <td style="padding: 15px 10px; text-align: center;">${player.games || 0}</td>
                  <td style="padding: 15px 10px; text-align: center; color: #4CAF50; font-weight: bold;">${player.wins || 0}</td>
                  <td style="padding: 15px 10px; text-align: center; color: #f44336; font-weight: bold;">${player.losses || 0}</td>
                  <td style="padding: 15px 10px; text-align: center; font-weight: bold;">${player.winRate || 0}%</td>
                  <td style="padding: 15px 10px; text-align: center; color: #FFD700; font-weight: bold; font-size: 16px;">${player.points || 0}</td>
                  <td style="padding: 15px 10px; text-align: center;">
                    <div style="display: flex; gap: 8px; justify-content: center; align-items: center; flex-wrap: wrap;">
                      <button onclick="addPointToPlayer('${player.name}')" style="
                        background: linear-gradient(135deg, #4CAF50, #45a049);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        padding: 10px 18px;
                        font-size: 13px;
                        font-weight: 800;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                        position: relative;
                        overflow: hidden;
                      " onmouseover="
                        this.style.transform='scale(1.15) translateY(-2px)';
                        this.style.boxShadow='0 8px 25px rgba(76, 175, 80, 0.5)';
                      " onmouseout="
                        this.style.transform='scale(1) translateY(0)';
                        this.style.boxShadow='0 4px 15px rgba(76, 175, 80, 0.3)';
                      ">+ 1 نقطة</button>
                      <button onclick="removePointFromPlayer('${player.name}')" style="
                        background: linear-gradient(135deg, #f44336, #d32f2f);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        padding: 10px 18px;
                        font-size: 13px;
                        font-weight: 800;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                        position: relative;
                        overflow: hidden;
                      " onmouseover="
                        this.style.transform='scale(1.15) translateY(-2px)';
                        this.style.boxShadow='0 8px 25px rgba(244, 67, 54, 0.5)';
                      " onmouseout="
                        this.style.transform='scale(1) translateY(0)';
                        this.style.boxShadow='0 4px 15px rgba(244, 67, 54, 0.3)';
                      ">- 1 -</button>
                      <button onclick="deletePlayer('${player.name}')" style="
                        background: linear-gradient(135deg, #666, #555);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        padding: 10px 18px;
                        font-size: 13px;
                        font-weight: 800;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(102, 102, 102, 0.3);
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                        position: relative;
                        overflow: hidden;
                      " onmouseover="
                        this.style.transform='scale(1.15) translateY(-2px)';
                        this.style.boxShadow='0 8px 25px rgba(102, 102, 102, 0.5)';
                      " onmouseout="
                        this.style.transform='scale(1) translateY(0)';
                        this.style.boxShadow='0 4px 15px rgba(102, 102, 102, 0.3)';
                      ">حذف 🗑️</button>
                    </div>
                  </td>
                </tr>
              `).join('')
            }
          </tbody>
        </table>
      </div>
      
      <!-- Footer -->
      <div style="
        background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
        padding: 25px;
        text-align: center;
        border-top: 3px solid #FFD700;
        box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.3);
      ">
        <button id="closeLeaderboardBtn" style="
          background: linear-gradient(135deg, #ff4757, #ff3742);
          color: white;
          border: none;
          border-radius: 15px;
          padding: 18px 35px;
          font-size: 18px;
          font-weight: 800;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        " onmouseover="this.style.transform='scale(1.08)'; this.style.boxShadow='0 12px 35px rgba(255, 71, 87, 0.6)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 8px 25px rgba(255, 71, 87, 0.4)'">
          ✕ إغلاق النافذة
        </button>
      </div>
    </div>
  `;
  
  // إضافة event listener لزر الإغلاق
  setTimeout(() => {
    const closeBtn = document.getElementById('closeLeaderboardBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        overlay.remove();
      });
    }
  }, 100);
  
  // إضافة إمكانية إغلاق النافذة بالضغط على الخلفية
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  
  // إضافة تأثير الظهور
  overlay.style.opacity = '0';
  overlay.style.transform = 'scale(0.8)';
  
  document.body.appendChild(overlay);
  
  // تأثير الظهور السلس
  setTimeout(() => {
    overlay.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    overlay.style.opacity = '1';
    overlay.style.transform = 'scale(1)';
  }, 10);
}

// Get leaderboard data
function getLeaderboard() {
  const leaderboardData = localStorage.getItem('leaderboard');
  if (!leaderboardData) {
    // إرجاع مصفوفة فارغة - لا توجد بيانات وهمية
    return [];
  }
  
  const players = JSON.parse(leaderboardData);
  return players.sort((a, b) => {
    // Sort by points first, then by win rate, then by wins
    if (b.points !== a.points) return b.points - a.points;
    if (b.winRate !== a.winRate) return b.winRate - a.winRate;
    return b.wins - a.wins;
  });
}

// Add point to player
function addPointToPlayer(playerName) {
  const leaderboardData = localStorage.getItem('leaderboard');
  if (!leaderboardData) return;
  
  const players = JSON.parse(leaderboardData);
  let player = players.find(p => p.name === playerName);
  
  if (!player) {
    player = { name: playerName, wins: 0, losses: 0, games: 0, points: 0, winRate: 0 };
    players.push(player);
  }
  
  // إضافة نقطة
  player.points = (player.points || 0) + 1;
  
  // إضافة فوز (لأنه فاز في المباراة)
  player.wins = (player.wins || 0) + 1;
  player.games = (player.games || 0) + 1;
  
  // حساب معدل الفوز
  player.winRate = Math.round((player.wins / player.games) * 100);
  
  saveLeaderboardData(players); // Use backup system
  showLeaderboard(); // Refresh the leaderboard
  
  console.log(`تم إضافة نقطة للاعب ${playerName} في لوحة المتصدرين`);
  console.log(`إحصائيات ${playerName}: ${player.wins} فوز، ${player.losses} خسارة، ${player.games} مباراة، ${player.points} نقطة، ${player.winRate}% معدل فوز`);
}

// Remove point from player
function removePointFromPlayer(playerName) {
  const leaderboardData = localStorage.getItem('leaderboard');
  if (!leaderboardData) return;
  
  const players = JSON.parse(leaderboardData);
  const player = players.find(p => p.name === playerName);
  
  if (player) {
    // إزالة نقطة
    player.points = Math.max(0, (player.points || 0) - 1);
    
    // إزالة فوز (إذا كان لديه فوز)
    if (player.wins > 0) {
      player.wins = player.wins - 1;
      player.games = Math.max(0, (player.games || 0) - 1);
      
      // إعادة حساب معدل الفوز
      if (player.games > 0) {
        player.winRate = Math.round((player.wins / player.games) * 100);
      } else {
        player.winRate = 0;
      }
    }
    
    saveLeaderboardData(players); // Use backup system
    showLeaderboard(); // Refresh the leaderboard
    
    console.log(`تم إزالة نقطة من اللاعب ${playerName} في لوحة المتصدرين`);
    console.log(`إحصائيات ${playerName}: ${player.wins} فوز، ${player.losses} خسارة، ${player.games} مباراة، ${player.points} نقطة، ${player.winRate}% معدل فوز`);
  }
}

// Delete player
function deletePlayer(playerName) {
  if (confirm(`هل أنت متأكد من حذف اللاعب "${playerName}"؟`)) {
    const leaderboardData = localStorage.getItem('leaderboard');
    if (!leaderboardData) return;
    
    const players = JSON.parse(leaderboardData);
    const filteredPlayers = players.filter(p => p.name !== playerName);
    saveLeaderboardData(filteredPlayers); // Use backup system
    showLeaderboard(); // Refresh the leaderboard
  }
}

// Add game result to leaderboard
function addGameResult(winnerName, loserName) {
  // التحقق من تفعيل التحدي - يجب أن يكون مفعل لإضافة النتائج
  const gameSetup = localStorage.getItem('gameSetupProgress');
  if (!gameSetup) {
    console.log('لا توجد بيانات إعدادات - لن يتم احتساب المباراة في لوحة المتصدرين');
    return;
  }
  
  const setup = JSON.parse(gameSetup);
  if (!setup.advancedMode) {
    console.log('التحدي غير مفعل - لن يتم احتساب المباراة في لوحة المتصدرين');
    return;
  }
  
  const leaderboardData = localStorage.getItem('leaderboard');
  let players = leaderboardData ? JSON.parse(leaderboardData) : [];
  
  // إضافة أو تحديث الفائز
  let winner = players.find(p => p.name === winnerName);
  if (!winner) {
    winner = { name: winnerName, wins: 0, losses: 0, games: 0, points: 0, winRate: 0 };
    players.push(winner);
    console.log(`تم إضافة لاعب جديد للوحة المتصدرين: ${winnerName}`);
  }
  winner.wins++;
  winner.games++;
  winner.winRate = Math.round((winner.wins / winner.games) * 100);
  
  // إضافة أو تحديث الخاسر
  let loser = players.find(p => p.name === loserName);
  if (!loser) {
    loser = { name: loserName, wins: 0, losses: 0, games: 0, points: 0, winRate: 0 };
    players.push(loser);
    console.log(`تم إضافة لاعب جديد للوحة المتصدرين: ${loserName}`);
  }
  loser.losses++;
  loser.games++;
  loser.winRate = Math.round((loser.wins / loser.games) * 100);
  
  // حفظ البيانات مع نسخة احتياطية
  saveLeaderboardData(players);
  
  console.log(`تم إضافة نتيجة المباراة: ${winnerName} فاز على ${loserName}`);
  console.log(`إحصائيات ${winnerName}: ${winner.wins} فوز، ${winner.losses} خسارة، ${winner.games} مباراة`);
  console.log(`إحصائيات ${loserName}: ${loser.wins} فوز، ${loser.losses} خسارة، ${loser.games} مباراة`);
}

// Save leaderboard data with backup
function saveLeaderboardData(players) {
  try {
    // حفظ البيانات الأساسية
    localStorage.setItem('leaderboard', JSON.stringify(players));
    
    // إنشاء نسخة احتياطية
    localStorage.setItem('leaderboard_backup', JSON.stringify(players));
    
    // إنشاء نسخة احتياطية إضافية مع timestamp
    const timestamp = new Date().toISOString();
    localStorage.setItem(`leaderboard_backup_${timestamp}`, JSON.stringify(players));
    
    console.log('تم حفظ بيانات لوحة المتصدرين مع النسخ الاحتياطية');
  } catch (error) {
    console.error('Error saving leaderboard data:', error);
  }
}

// Restore leaderboard data from backup
function restoreLeaderboardData() {
  try {
    // محاولة استعادة من النسخة الاحتياطية الأساسية
    const backupData = localStorage.getItem('leaderboard_backup');
    if (backupData) {
      localStorage.setItem('leaderboard', backupData);
      console.log('تم استعادة بيانات لوحة المتصدرين من النسخة الاحتياطية');
      return true;
    }
    
    // محاولة استعادة من أحدث نسخة احتياطية مع timestamp
    const keys = Object.keys(localStorage).filter(key => key.startsWith('leaderboard_backup_'));
    if (keys.length > 0) {
      // ترتيب المفاتيح حسب التاريخ (الأحدث أولاً)
      keys.sort((a, b) => b.localeCompare(a));
      const latestBackup = localStorage.getItem(keys[0]);
      if (latestBackup) {
        localStorage.setItem('leaderboard', latestBackup);
        console.log('تم استعادة بيانات لوحة المتصدرين من أحدث نسخة احتياطية');
        return true;
      }
    }
    
    console.log('لم يتم العثور على نسخ احتياطية لاستعادة البيانات');
    return false;
  } catch (error) {
    console.error('Error restoring leaderboard data:', error);
    return false;
  }
}

// Check and restore leaderboard data on load
function checkLeaderboardData() {
  const leaderboardData = localStorage.getItem('leaderboard');
  if (!leaderboardData || leaderboardData === '[]') {
    console.log('بيانات لوحة المتصدرين مفقودة، محاولة الاستعادة...');
    restoreLeaderboardData();
  }
}

// Add new player
function addNewPlayer() {
  const playerNameInput = document.getElementById('newPlayerName');
  const playerName = playerNameInput.value.trim();
  
  if (!playerName) {
    alert('يرجى إدخال اسم اللاعب');
    return;
  }
  
  if (playerName.length < 2) {
    alert('اسم اللاعب يجب أن يكون حرفين على الأقل');
    return;
  }
  
  const leaderboardData = localStorage.getItem('leaderboard');
  let players = leaderboardData ? JSON.parse(leaderboardData) : [];
  
  // التحقق من وجود اللاعب
  if (players.find(p => p.name === playerName)) {
    alert('اللاعب موجود بالفعل في القائمة');
    return;
  }
  
  // إضافة اللاعب الجديد
  const newPlayer = {
    name: playerName,
    wins: 0,
    losses: 0,
    games: 0,
    points: 0,
    winRate: 0
  };
  
  players.push(newPlayer);
  saveLeaderboardData(players);
  
  // مسح حقل الإدخال
  playerNameInput.value = '';
  
  // إعادة عرض القائمة
  showLeaderboard();
  
  console.log(`تم إضافة اللاعب الجديد: ${playerName}`);
}

// Search players
function searchPlayers() {
  const searchTerm = document.getElementById('searchPlayer').value.toLowerCase();
  const tableBody = document.getElementById('leaderboardTableBody');
  
  if (!tableBody) return;
  
  const rows = tableBody.querySelectorAll('tr');
  
  rows.forEach(row => {
    const playerNameCell = row.querySelector('td:nth-child(2)');
    if (playerNameCell) {
      const playerName = playerNameCell.textContent.toLowerCase();
      if (playerName.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });
}

// Clear search
function clearSearch() {
  const searchInput = document.getElementById('searchPlayer');
  searchInput.value = '';
  searchPlayers();
}

// Save all changes
function saveAllChanges() {
  // البيانات محفوظة تلقائياً عند كل تعديل
  alert('تم حفظ جميع التعديلات بنجاح!');
}

// Make functions available globally
window.nextStep = nextStep;
window.saveProgress = saveProgress;
window.showLeaderboard = showLeaderboard;
window.addPointToPlayer = addPointToPlayer;
window.removePointFromPlayer = removePointFromPlayer;
window.deletePlayer = deletePlayer;
window.addGameResult = addGameResult;
window.saveLeaderboardData = saveLeaderboardData;
window.restoreLeaderboardData = restoreLeaderboardData;
window.checkLeaderboardData = checkLeaderboardData;
window.addNewPlayer = addNewPlayer;
window.searchPlayers = searchPlayers;
window.clearSearch = clearSearch;
window.saveAllChanges = saveAllChanges;
