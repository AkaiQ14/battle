// Import Firebase GameService
import { GameService } from './gameService.js';


// ========== Extract Parameters ==========
const params = new URLSearchParams(window.location.search);
const gameId = params.get("gameId");
const player = params.get("player");
let playerName = "اللاعب";

let currentPlayer = player === "2" ? 2 : 1;
let rounds = 11; // Default rounds

// Define player parameter for abilities
const playerParam = player === "2" ? "player2" : "player1";

// Define storage keys
const PICKS_LOCAL_KEY = `${playerParam}Picks`;
const ORDER_LOCAL_KEY = `${playerParam}Order`;

const instruction = document.getElementById("instruction");
const grid = document.getElementById("cardGrid");
const continueBtn = document.getElementById("continueBtn");

// Abilities (self)
const abilitiesWrap = document.getElementById("playerAbilities");
const abilityStatus = document.getElementById("abilityStatus");

// Opponent abilities (view-only)
const oppPanel = document.getElementById("opponentAbilitiesPanel");
const oppWrap = document.getElementById("opponentAbilities");

// Update instruction with real player name
if (instruction) {
  instruction.innerText = `اللاعب ${playerName || 'اللاعب'} رتب بطاقاتك`;
}

let picks = [];
let submittedOrder = null;
let opponentName = "الخصم";

// Initialize card manager
let cardManager = null;

// ===== Ability state =====
let myAbilities = [];                 // authoritative list for this player (objects: {text, used})
const tempUsed = new Set();           // optimistic, per-request (text)

/* ================== Helpers ================== */
function createMedia(url, className, onClick) {
  // Use card manager if available, otherwise fallback to original method
  if (cardManager) {
    return cardManager.createMediaElement(url, className, onClick);
  }
  
  const isWebm = /\.webm(\?|#|$)/i.test(url);
  if (isWebm) {
    const vid = document.createElement("video");
    vid.src = url;
    vid.autoplay = true;
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.className = className;
    vid.style.width = "100%";
    vid.style.height = "100%";
    vid.style.objectFit = "contain";
    vid.style.borderRadius = "12px";
    vid.style.display = "block";
    if (onClick) vid.onclick = onClick;
    return vid;
  } else {
    const img = document.createElement("img");
    img.src = url;
    img.className = className;
    img.alt = "Card Image";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.borderRadius = "12px";
    img.style.display = "block";
    if (onClick) img.onclick = onClick;
    return img;
  }
}

// Normalize to [{text, used}]
function normalizeAbilityList(arr) {
  const list = Array.isArray(arr) ? arr : [];
  return list
    .map(a => {
      if (typeof a === "string") return { text: a.trim(), used: false };
      if (a && typeof a === "object") {
        return { text: String(a.text || "").trim(), used: !!a.used };
      }
      return null;
    })
    .filter(Boolean)
    .filter(a => a.text);
}

function hideOpponentPanel() {
  if (oppPanel) {
    oppPanel.classList.add("hidden");
    oppWrap.innerHTML = "";
  }
}

function renderBadges(container, abilities, { clickable = false, onClick } = {}) {
  if (!container) return;
  
  container.innerHTML = "";
  const list = Array.isArray(abilities) ? abilities : [];

  list.forEach(ab => {
    // Fix the object display issue
    const abilityText = typeof ab === 'string' ? ab : (ab.text || ab);
    const isUsed = typeof ab === 'object' ? !!ab.used : false;
    
    const el = document.createElement(clickable ? "button" : "span");
    el.textContent = abilityText;

    el.className =
      "px-3 py-1 rounded-lg font-bold border " +
      (clickable
        ? (isUsed
            ? "bg-gray-500/60 text-black/60 border-gray-600 cursor-not-allowed"
            : "bg-yellow-400 hover:bg-yellow-300 text-black border-yellow-500")
        : "bg-gray-400/70 text-black border-gray-500");

    if (clickable) {
      if (isUsed) {
        el.disabled = true;
        el.setAttribute("aria-disabled", "true");
      } else if (onClick) {
        el.onclick = (e) => {
          e.preventDefault();
          console.log('Ability clicked:', abilityText);
          onClick(abilityText);
        };
        // Add touch events for mobile
        el.addEventListener('touchstart', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Ability touched:', abilityText);
          onClick(abilityText);
        }, { passive: false });
        
        // Add click events for desktop
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Ability clicked:', abilityText);
          onClick(abilityText);
        });
      }
    }

    container.appendChild(el);
  });
}

/* ================== Load Game Data from Firebase ================== */
async function loadGameData() {
  if (!gameId) {
    console.error('No game ID found');
    alert('لم يتم العثور على معرف اللعبة');
    return;
  }
  
  try {
    // إظهار loading
    if (instruction) {
      instruction.textContent = 'جاري تحميل بيانات اللعبة...';
    }
    
    // مسح البيانات القديمة إذا كانت من لعبة مختلفة
    const currentGameId = localStorage.getItem('currentGameId');
    if (currentGameId && currentGameId !== gameId) {
      clearOldGameData();
    }
    
    // جلب البيانات من Firebase
    const gameData = await GameService.getGame(gameId);
    const playerData = gameData[`player${player}`];
    
    // تحديث المتغيرات
    picks = playerData.cards || [];
    myAbilities = normalizeAbilityList(playerData.abilities || []);
    playerName = playerData.name || "اللاعب";
    rounds = gameData.rounds || 11;
    
    // تحديث النص
    if (instruction) {
      instruction.textContent = `اللاعب ${playerName} رتب بطاقاتك`;
    }
    
    console.log('Loaded data:', { playerName, picks: picks.length, myAbilities: myAbilities.length, rounds });
    
    // عرض البيانات
    renderCards(picks);
    renderAbilities(myAbilities);
    
    // الاستماع للتغييرات في الوقت الفعلي
    GameService.listenToGame(gameId, (updatedData) => {
      updateGameData(updatedData);
    });
    
    console.log('Game data loaded successfully:', { playerName, picks: picks.length, myAbilities: myAbilities.length, rounds });
    
  } catch (error) {
    console.error('Error loading game data:', error);
    alert('حدث خطأ في تحميل بيانات اللعبة: ' + error.message);
    
    // إعادة تفعيل الزر في حالة الخطأ
    if (continueBtn) {
      continueBtn.disabled = false;
      continueBtn.textContent = 'متابعة';
    }
  }
}

// Update game data from Firebase
function updateGameData(gameData) {
  const playerData = gameData[`player${player}`];
  
  // تحديث rounds
  if (gameData.rounds) {
    rounds = gameData.rounds;
  }
  
  // تحديث اسم اللاعب
  if (playerData.name) {
    playerName = playerData.name;
    if (instruction) {
      instruction.textContent = `اللاعب ${playerName} رتب بطاقاتك`;
    }
  }
  
  // تحديث القدرات مع المزامنة الفورية
  if (playerData.abilities) {
    const normalizedAbilities = normalizeAbilityList(playerData.abilities);
    
    // تحديث حالة الاستخدام من Firebase
    if (playerData.usedAbilities) {
      const usedSet = new Set(playerData.usedAbilities);
      myAbilities = normalizedAbilities.map(ability => ({
        ...ability,
        used: usedSet.has(ability.text) || tempUsed.has(ability.text)
      }));
    } else {
      myAbilities = normalizedAbilities;
    }
    
    renderAbilities(myAbilities);
  }
  
  // تحديث البطاقات مع المزامنة الفورية
  if (playerData.cards) {
    picks = playerData.cards;
    
    // التحقق من وجود ترتيب مرسل في Firebase أولاً
    if (playerData.cardOrder && playerData.cardOrder.length === picks.length) {
      submittedOrder = playerData.cardOrder.slice();
      hideOpponentPanel();
      renderCards(submittedOrder, submittedOrder);
      
      // تحديث localStorage للمزامنة المحلية
      localStorage.setItem(ORDER_LOCAL_KEY, JSON.stringify(submittedOrder));
      
      // تحديث حالة الزر
      if (continueBtn) {
        continueBtn.disabled = true;
        continueBtn.textContent = '✅ تم إرسال الترتيب';
      }
    } else {
      // التحقق من localStorage كبديل
      const savedOrder = JSON.parse(localStorage.getItem(ORDER_LOCAL_KEY) || "[]");
      const currentGameId = localStorage.getItem('currentGameId');
      
      if (currentGameId && gameId && currentGameId === gameId && 
          savedOrder && savedOrder.length === picks.length) {
        submittedOrder = savedOrder.slice();
        hideOpponentPanel();
        renderCards(submittedOrder, submittedOrder);
      } else {
        submittedOrder = null;
        renderCards(picks, null);
        loadOpponentAbilities();
        
        // إعادة تعيين الزر
        if (continueBtn) {
          continueBtn.disabled = false;
          continueBtn.textContent = 'متابعة';
        }
      }
    }
  }
  
  console.log('Game data updated with real-time sync:', { playerData, rounds, playerName });
}

// Render abilities
function renderAbilities(abilities) {
  if (!abilitiesWrap) return;
  
  // Normalize abilities to the correct format
  const normalizedAbilities = normalizeAbilityList(abilities);
  
  // Use renderBadges for consistent UI
  renderBadges(abilitiesWrap, normalizedAbilities, { 
    clickable: true, 
    onClick: requestUseAbility 
  });
  
  // Update myAbilities to match the normalized format
  myAbilities = normalizedAbilities;
}

/* ================== Initialize Card Manager ================== */
function initializeCardManager() {
  // Wait for card manager to be available
  if (typeof window.cardManager !== 'undefined') {
    cardManager = window.cardManager;
    loadGameData(); // Use Firebase instead of loadPlayerCards
  } else {
    // Wait a bit and try again
    setTimeout(initializeCardManager, 100);
  }
}

function loadPlayerCards() {
  if (!cardManager) {
    console.error('Card manager not available');
    return;
  }

  // Try to load from localStorage first (like order.js)
  const localPicks = JSON.parse(localStorage.getItem(PICKS_LOCAL_KEY) || "[]");
  picks = Array.isArray(localPicks) ? localPicks : [];

  // Get rounds from game setup and limit cards accordingly
  const gameSetup = localStorage.getItem('gameSetupProgress');
  if (gameSetup) {
    try {
      const setupData = JSON.parse(gameSetup);
      const rounds = setupData.rounds || 11;
      
      // Take only the number of cards needed for the rounds
      if (picks.length > rounds) {
        picks = picks.slice(0, rounds);
        console.log(`Limited to ${rounds} cards for game rounds`);
      }
    } catch (e) {
      console.error('Error parsing game setup:', e);
    }
  }

  // Check if we have a submitted order for the CURRENT game
  const savedOrder = JSON.parse(localStorage.getItem(ORDER_LOCAL_KEY) || "[]");
  const currentGameId = localStorage.getItem('currentGameId');
  
  // Also check for StrategicOrdered format (for compatibility with card.js)
  const strategicOrder = JSON.parse(localStorage.getItem(`${playerParam}StrategicOrdered`) || "[]");
  
  // Use the most recent order available
  let orderToUse = null;
  if (currentGameId && gameId && currentGameId === gameId && 
      Array.isArray(savedOrder) && savedOrder.length === picks.length) {
    orderToUse = savedOrder;
  } else if (Array.isArray(strategicOrder) && strategicOrder.length === picks.length) {
    orderToUse = strategicOrder;
  }
  
  if (orderToUse) {
    submittedOrder = orderToUse.slice();
    picks = orderToUse.slice(); // Update picks to match the ordered arrangement
    console.log('Loaded existing order:', submittedOrder);
  } else {
    submittedOrder = null;
    // Clear old order if it's from a different game
    if (currentGameId !== gameId) {
      localStorage.removeItem(ORDER_LOCAL_KEY);
    }
  }

  if (!picks.length) {
    grid.innerHTML = `<p class="text-red-500 text-lg">لم يتم العثور على بطاقات لهذا اللاعب.</p>`;
    return;
  }

  if (submittedOrder && submittedOrder.length === picks.length) {
    hideOpponentPanel();
    console.log('Rendering submitted order on load:', submittedOrder);
    console.log('Picks on load:', picks);
    console.log('Submitted order length:', submittedOrder.length);
    console.log('Picks length:', picks.length);
    renderCards(submittedOrder, submittedOrder);
    // تحديث حالة الزر عند وجود ترتيب مرسل
    if (continueBtn) {
      continueBtn.disabled = true;
      continueBtn.textContent = '✅ تم إرسال الترتيب';
    }
  } else {
    // Ensure picks is valid before rendering
    if (Array.isArray(picks) && picks.length > 0) {
      renderCards(picks, null);
    } else {
      console.warn('No valid picks found, showing empty state');
      if (grid) {
        grid.innerHTML = '<p class="text-red-500 text-lg">لم يتم العثور على بطاقات صالحة.</p>';
      }
    }
    // Show opponent abilities if not submitted
    loadOpponentAbilities();
    // إعادة تعيين الزر عند عدم وجود ترتيب مرسل
    if (continueBtn) {
      continueBtn.disabled = false;
      continueBtn.textContent = 'متابعة';
    }
  }
  
  // Load player abilities
  loadPlayerAbilities();
}

/* ================== Abilities (self) ================== */

// Load abilities from localStorage
function loadPlayerAbilities() {
  const abilitiesKey = `${playerParam}Abilities`;
  const savedAbilities = localStorage.getItem(abilitiesKey);
  
  console.log('Loading abilities from localStorage:', { abilitiesKey, savedAbilities });
  
  if (savedAbilities) {
    try {
      const abilities = JSON.parse(savedAbilities);
      console.log('Parsed abilities:', abilities);
      
      // Always reset abilities to unused state for new game
      // Only check for used abilities if we're in the middle of a game
      const currentRound = parseInt(localStorage.getItem('currentRound') || '0');
      let usedSet = new Set();
      
      // Always load used abilities (both from game and from host control)
      const usedAbilitiesKey = `${playerParam}UsedAbilities`;
      const usedAbilities = JSON.parse(localStorage.getItem(usedAbilitiesKey) || '[]');
      usedSet = new Set(usedAbilities);
      
      if (currentRound > 0) {
        console.log(`Loading used abilities for round ${currentRound}:`, Array.from(usedSet));
      } else {
        console.log('Loading used abilities (including host-controlled):', Array.from(usedSet));
      }
      
      myAbilities = abilities.map(ability => {
        const text = typeof ability === 'string' ? ability : (ability.text || ability);
        // Check if it's used in game OR temporarily used (pending request) OR used by host
        const isUsedInGame = currentRound > 0 && usedSet.has(text);
        const isTemporarilyUsed = tempUsed.has(text);
        const isUsedByHost = usedSet.has(text); // Always check if used by host regardless of round
        const isUsed = isUsedInGame || isTemporarilyUsed || isUsedByHost;
        return { 
          text, 
          used: isUsed
        };
      });
      
      console.log(`Loaded ${myAbilities.length} abilities, ${myAbilities.filter(a => a.used).length} used`);
      
      // Force immediate UI update
      if (abilitiesWrap) {
        abilitiesWrap.innerHTML = ''; // Clear first
        renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
      }
      if (abilityStatus) {
        abilityStatus.textContent = "اضغط على القدرة لطلب استخدامها.";
      }
      console.log('Loaded abilities:', myAbilities);
      
      // Force a small delay to ensure DOM is updated
      setTimeout(() => {
        if (abilitiesWrap && abilitiesWrap.children.length === 0) {
          console.log('Re-rendering abilities after delay...');
          renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
        }
      }, 100);
      
      // Check for any pending requests immediately after loading
      setTimeout(checkAbilityRequests, 100);
      
      // Also check for pending requests in localStorage to maintain disabled state
      setTimeout(() => {
        const requests = JSON.parse(localStorage.getItem('abilityRequests') || '[]');
        const myPendingRequests = requests.filter(req => 
          req.playerParam === playerParam && req.status === 'pending'
        );
        
        if (myPendingRequests.length > 0) {
          myPendingRequests.forEach(request => {
            tempUsed.add(request.abilityText);
            myAbilities = myAbilities.map(a =>
              a.text === request.abilityText ? { ...a, used: true } : a
            );
          });
          
          if (abilitiesWrap) {
            renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
          }
          
          if (abilityStatus) {
            abilityStatus.textContent = "⏳ في انتظار موافقة المستضيف...";
          }
          
          console.log(`Restored ${myPendingRequests.length} pending ability requests`);
        }
      }, 200);
    } catch (e) {
      console.error('Error loading abilities:', e);
      if (abilityStatus) {
        abilityStatus.textContent = "خطأ في تحميل القدرات.";
      }
    }
  } else {
    // Try to load abilities from gameSetupProgress as fallback
    console.log('No abilities found in localStorage, trying gameSetupProgress...');
    const gameSetup = localStorage.getItem('gameSetupProgress');
    if (gameSetup) {
      try {
        const setupData = JSON.parse(gameSetup);
        const playerKey = playerParam === 'player1' ? 'player1' : 'player2';
        const playerData = setupData[playerKey];
        
        if (playerData && playerData.abilities) {
          console.log('Found abilities in gameSetupProgress:', playerData.abilities);
          myAbilities = normalizeAbilityList(playerData.abilities);
          
          if (abilitiesWrap) {
            abilitiesWrap.innerHTML = '';
            renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
          }
          if (abilityStatus) {
            abilityStatus.textContent = "اضغط على القدرة لطلب استخدامها.";
          }
          
          // Force a small delay to ensure DOM is updated
          setTimeout(() => {
            if (abilitiesWrap && abilitiesWrap.children.length === 0) {
              console.log('Re-rendering abilities from gameSetupProgress after delay...');
              renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
            }
          }, 100);
          
          return;
        }
      } catch (e) {
        console.error('Error parsing gameSetupProgress:', e);
      }
    }
    
    if (abilityStatus) {
      abilityStatus.textContent = "لا توجد قدرات متاحة حالياً.";
    }
  }
}

// Load opponent abilities
function loadOpponentAbilities() {
  const opponentParam = playerParam === 'player1' ? 'player2' : 'player1';
  const opponentAbilitiesKey = `${opponentParam}Abilities`;
  const savedAbilities = localStorage.getItem(opponentAbilitiesKey);
  
  if (savedAbilities) {
    try {
      const abilities = JSON.parse(savedAbilities);
      
      // Only check for used abilities if we're in the middle of a game
      const currentRound = parseInt(localStorage.getItem('currentRound') || '0');
      let usedSet = new Set();
      
      // Only load used abilities if we're actually in a game (round > 0)
      if (currentRound > 0) {
        const usedAbilitiesKey = `${opponentParam}UsedAbilities`;
        const usedAbilities = JSON.parse(localStorage.getItem(usedAbilitiesKey) || '[]');
        usedSet = new Set(usedAbilities);
      }
      
      const opponentAbilities = abilities.map(ability => {
        const text = typeof ability === 'string' ? ability : (ability.text || ability);
        // Only mark as used if we're in a game and it's actually been used
        const isUsed = currentRound > 0 && usedSet.has(text);
        return { 
          text, 
          used: isUsed
        };
      });
      
      if (oppWrap) {
        oppWrap.innerHTML = ''; // Clear first
        renderBadges(oppWrap, opponentAbilities, { clickable: false });
      }
      
      // Show opponent panel if not submitted
      if (oppPanel && !submittedOrder) {
        oppPanel.classList.remove("hidden");
      }
      
      console.log('Loaded opponent abilities:', opponentAbilities);
    } catch (e) {
      console.error('Error loading opponent abilities:', e);
    }
  }
}

// Initialize abilities when page loads
setTimeout(() => {
  loadPlayerAbilities();
  loadOpponentAbilities();
}, 100);

// Check for ability updates every 2 seconds
setInterval(() => {
  loadPlayerAbilities();
  loadOpponentAbilities();
  checkAbilityRequests();
}, 2000);

// Simple storage change listener like order.js
window.addEventListener('storage', function(e) {
  if (e.key && e.key.includes('Abilities')) {
    console.log(`Storage change detected: ${e.key}`);
    loadPlayerAbilities();
    loadOpponentAbilities();
  }
  if (e.key === 'abilityRequests') {
    checkAbilityRequests();
  }
});

// Listen for ability toggle events from host
window.addEventListener('abilityToggled', function(e) {
  try {
    const { playerParam: changedPlayerParam, abilityText, isUsed } = e.detail;
    console.log(`Ability toggled: ${abilityText} for ${changedPlayerParam}, isUsed: ${isUsed}`);

    if (changedPlayerParam === playerParam) {
      // ✅ مزامنة فورية
      forceImmediateAbilitySync(changedPlayerParam, abilityText, isUsed);
    }

    loadOpponentAbilities();
  } catch (error) {
    console.error('Error handling ability toggle event:', error);
  }
});

// Listen for postMessage from host
window.addEventListener('message', function(e) {
  try {
    if (e.data && e.data.type === 'ABILITY_TOGGLED') {
      const { playerParam: changedPlayerParam, abilityText, isUsed } = e.data;
      console.log(`PostMessage: Ability toggled: ${abilityText} for ${changedPlayerParam}, isUsed: ${isUsed}`);
      
      // Check if this change affects the current player
      if (changedPlayerParam === playerParam) {
        console.log(`Updating abilities for current player: ${playerParam}`);
        
        // Update myAbilities
        if (myAbilities) {
          myAbilities.forEach(ability => {
            if (ability.text === abilityText) {
              ability.used = isUsed;
            }
          });
        }
        
        // Update tempUsed
        if (isUsed) {
          tempUsed.add(abilityText);
        } else {
          tempUsed.delete(abilityText);
        }
        
        // Force immediate re-render
        loadPlayerAbilities();
        console.log(`Abilities updated for ${playerParam}`);
      }
      
      // Always re-render opponent abilities
      loadOpponentAbilities();
    }
  } catch (error) {
    console.error('Error handling postMessage:', error);
  }
});

// ✅ فور وصول أي تحديث من المضيف، أعد تحميل القدرات مباشرة
function forceImmediateAbilitySync(playerParam, abilityText, isUsed) {
  try {
    // حدّث القدرات الخاصة بي
    if (myAbilities) {
      myAbilities.forEach(ability => {
        if (ability.text === abilityText) {
          ability.used = isUsed;
        }
      });
    }

    // حدّث الحالة المؤقتة
    if (isUsed) {
      tempUsed.add(abilityText);
    } else {
      tempUsed.delete(abilityText);
    }

    // أعد رسم القدرات فوراً
    if (abilitiesWrap) {
      renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
    }
    loadOpponentAbilities();
    console.log(`🔄 فوراً: تم تحديث القدرة ${abilityText} (${isUsed ? "مستخدمة" : "متاحة"})`);
  } catch (err) {
    console.error("Error in forceImmediateAbilitySync:", err);
  }
}


// Check for ability request responses
function checkAbilityRequests() {
  try {
    const requests = JSON.parse(localStorage.getItem('abilityRequests') || '[]');
    const myRequests = requests.filter(req => req.playerParam === playerParam);
    
    if (myRequests.length === 0) {
      // No pending requests, reset status
      if (abilityStatus && !myAbilities.some(a => a.used)) {
        abilityStatus.textContent = "اضغط على القدرة لطلب استخدامها.";
      }
      return;
    }
    
    myRequests.forEach(request => {
      if (request.status === 'approved') {
        // Ability was approved by host - keep it disabled permanently
        if (abilityStatus) {
          abilityStatus.textContent = "✅ تم قبول الطلب من المستضيف.";
        }
        
        // Mark as permanently used
        const usedAbilitiesKey = `${playerParam}UsedAbilities`;
        const usedAbilities = JSON.parse(localStorage.getItem(usedAbilitiesKey) || '[]');
        if (!usedAbilities.includes(request.abilityText)) {
          usedAbilities.push(request.abilityText);
          localStorage.setItem(usedAbilitiesKey, JSON.stringify(usedAbilities));
        }
        
        // Keep ability disabled (already disabled from request)
        // Update abilities display to show permanent disabled state
        myAbilities = (myAbilities || []).map(a =>
          a.text === request.abilityText ? { ...a, used: true } : a
        );
        
        // Also update the player-specific abilities list
        const playerAbilitiesKey = `${playerParam}Abilities`;
        const playerAbilities = JSON.parse(localStorage.getItem(playerAbilitiesKey) || '[]');
        playerAbilities.forEach(ability => {
          const abilityText = typeof ability === 'string' ? ability : ability.text;
          if (abilityText === request.abilityText) {
            if (typeof ability === 'object') {
              ability.used = true;
            }
          }
        });
        localStorage.setItem(playerAbilitiesKey, JSON.stringify(playerAbilities));
        
        // Update global abilities lists
        const globalAbilitiesKey = playerParam === 'player1' ? 'P1_ABILITIES_KEY' : 'P2_ABILITIES_KEY';
        const globalAbilities = JSON.parse(localStorage.getItem(globalAbilitiesKey) || '[]');
        globalAbilities.forEach(ability => {
          if (ability.text === request.abilityText) {
            ability.used = true;
          }
        });
        localStorage.setItem(globalAbilitiesKey, JSON.stringify(globalAbilities));
        
        if (abilitiesWrap) {
          renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
        }
        
        // Remove the request
        const updatedRequests = requests.filter(req => req.id !== request.id);
        localStorage.setItem('abilityRequests', JSON.stringify(updatedRequests));
        
        console.log(`Ability ${request.abilityText} approved and permanently disabled for ${playerParam}`);
        
      } else if (request.status === 'rejected') {
        // Ability was rejected by host - re-enable it
        if (abilityStatus) {
          abilityStatus.textContent = "❌ تم رفض الطلب من المستضيف.";
        }
        
        // Remove from temp used and re-enable
        tempUsed.delete(request.abilityText);
        
        // Update abilities display to show enabled state
        myAbilities = (myAbilities || []).map(a =>
          a.text === request.abilityText ? { ...a, used: false } : a
        );
        
        if (abilitiesWrap) {
          renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
        }
        
        // Remove the request
        const updatedRequests = requests.filter(req => req.id !== request.id);
        localStorage.setItem('abilityRequests', JSON.stringify(updatedRequests));
        
        console.log(`Ability ${request.abilityText} rejected and re-enabled for ${playerParam}`);
      }
    });
  } catch (e) {
    console.error('Error checking ability requests:', e);
  }
}

async function requestUseAbility(abilityText) {
  // Check if ability is already used
  const isAlreadyUsed = myAbilities.find(a => a.text === abilityText)?.used;
  if (isAlreadyUsed) {
    console.log(`Ability ${abilityText} is already used`);
    return;
  }
  
  // Immediately disable the ability and mark as pending
  tempUsed.add(abilityText);
  myAbilities = (myAbilities || []).map(a =>
    a.text === abilityText ? { ...a, used: true } : a
  );
  
  // Update UI immediately to show disabled state
  if (abilitiesWrap) {
    renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
  }
  
  console.log(`Ability ${abilityText} disabled immediately - UI updated`);
  
  if (abilityStatus) {
    abilityStatus.textContent = "تم إرسال طلب استخدام القدرة…";
  }
  
  // Save ability usage to Firebase with real-time sync
  if (gameId) {
    try {
      await GameService.saveAbilityUsage(gameId, player, abilityText, true);
      console.log('Ability usage saved to Firebase with real-time sync');
      
      if (abilityStatus) {
        abilityStatus.textContent = "✅ تم حفظ استخدام القدرة في السيرفر";
      }
    } catch (e) {
      console.warn('Firebase ability save failed:', e);
      if (abilityStatus) {
        abilityStatus.textContent = "⚠️ تم حفظ الطلب محلياً فقط";
      }
    }
  }
  
  // Create ability request (fallback)
  const requestId = `${playerParam}_${Date.now()}`;
  const request = {
    id: requestId,
    playerName: playerName,
    playerParam: playerParam,
    abilityText: abilityText,
    timestamp: Date.now(),
    status: 'pending'
  };
  
  // Save request to localStorage
  try {
    const requests = JSON.parse(localStorage.getItem('abilityRequests') || '[]');
    requests.push(request);
    localStorage.setItem('abilityRequests', JSON.stringify(requests));
    
    // Trigger storage event for host page
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'abilityRequests',
      newValue: localStorage.getItem('abilityRequests'),
      oldValue: localStorage.getItem('abilityRequests'),
      storageArea: localStorage
    }));
    
    console.log('Ability request sent:', request);
  } catch (e) {
    console.error('Error saving ability request:', e);
  }
  
  // Show pending status
  if (abilityStatus) {
    abilityStatus.textContent = "⏳ في انتظار موافقة المستضيف...";
  }
  
  console.log(`Ability ${abilityText} disabled immediately and marked as pending for ${playerParam}`);
}

/* ================== Mobile Detection ================== */
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/* ================== Cards UI ================== */
function renderCards(pickList, lockedOrder = null) {
  if (!grid) return;
  
  grid.innerHTML = "";

  const display = (Array.isArray(lockedOrder) && lockedOrder.length === pickList.length)
    ? lockedOrder
    : pickList;
    
  console.log('Rendering cards:', { pickList, lockedOrder, display, isMobile });

  // Add safety check to prevent forEach error
  if (!Array.isArray(display) || display.length === 0) {
    console.warn('No cards to display:', { pickList, lockedOrder, display });
    return;
  }

  display.forEach((url, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "flex flex-col items-center space-y-2 card-wrapper";
    wrapper.setAttribute('data-index', index);
    wrapper.setAttribute('data-url', url);
    
    console.log(`Card ${index + 1}: ${url}`);

    const media = createMedia(url, "w-36 h-48 object-contain rounded shadow cursor-pointer");
    
    // Position indicator for mobile (always show)
    const positionIndicator = document.createElement("div");
    positionIndicator.className = "w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm position-indicator";
    positionIndicator.textContent = index + 1;

    const select = document.createElement("select");
    select.className = "w-24 p-1 rounded bg-gray-800 text-white text-center text-lg orderSelect";
    // Always show dropdown for both mobile and desktop

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- الترتيب --";
    select.appendChild(defaultOption);

    for (let j = 1; j <= pickList.length; j++) {
      const option = document.createElement("option");
      option.value = j;
      option.textContent = j;
      select.appendChild(option);
    }

    if (Array.isArray(lockedOrder) && lockedOrder.length === pickList.length) {
      // Find the position of this card in the locked order
      const orderIndex = lockedOrder.findIndex(u => u === url);
      console.log(`Card ${url} found at position ${orderIndex + 1} in locked order`);
      if (orderIndex >= 0) {
        select.value = String(orderIndex + 1);
        select.disabled = true;
        positionIndicator.textContent = orderIndex + 1;
        positionIndicator.className = "w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm position-indicator";
        
        // Add visual confirmation for submitted order
        wrapper.style.border = "2px solid #10b981";
        wrapper.style.borderRadius = "12px";
        wrapper.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
      }
    } else {
      // Enhanced mobile touch interaction
      select.onchange = () => {
        const allSelects = document.querySelectorAll(".orderSelect");
        const values = Array.from(allSelects).map((s) => s.value);
        const unique = new Set(values.filter(Boolean));
        
        // Update position indicator immediately
        const selectedValue = parseInt(select.value);
        console.log(`Card ${index + 1} selected position: ${selectedValue}`);
        if (selectedValue && selectedValue >= 1 && selectedValue <= pickList.length) {
          positionIndicator.textContent = selectedValue;
          positionIndicator.className = "w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-sm position-indicator";
        } else {
          positionIndicator.textContent = index + 1;
          positionIndicator.className = "w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm position-indicator";
        }
        
        if (continueBtn) {
          continueBtn.classList.toggle("hidden", unique.size !== pickList.length);
          continueBtn.disabled = unique.size !== pickList.length;
        }
      };
      
      // Add touch events for better mobile interaction
      if (isMobile) {
        select.addEventListener('touchstart', (e) => {
          e.stopPropagation();
          // Add visual feedback
          wrapper.style.transform = 'scale(1.02)';
          wrapper.style.transition = 'transform 0.1s ease';
        });
        
        select.addEventListener('touchend', (e) => {
          e.stopPropagation();
          // Remove visual feedback
          wrapper.style.transform = 'scale(1)';
        });
        
        // Add click event for better compatibility
        select.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    }

    wrapper.appendChild(media);
    wrapper.appendChild(positionIndicator);
    wrapper.appendChild(select);
    grid.appendChild(wrapper);
  });

  // Add mobile instructions for number selection (only once)
  if (isMobile && !Array.isArray(lockedOrder) && !document.querySelector('.mobile-instructions')) {
    const instructions = document.createElement("div");
    instructions.className = "mobile-instructions w-full text-center text-yellow-300 text-sm mb-4 p-2 bg-black/30 rounded";
    instructions.innerHTML = "📱 اختر ترتيب كل بطاقة من القائمة المنسدلة | تأكد من اختيار ترتيب مختلف لكل بطاقة | الرقم الأزرق يظهر الترتيب الحالي";
    grid.parentNode.insertBefore(instructions, grid);
  }
  
  // Add success message for submitted order
  if (Array.isArray(lockedOrder) && lockedOrder.length === pickList.length && !document.querySelector('.order-success-message')) {
    const successMessage = document.createElement("div");
    successMessage.className = "order-success-message w-full text-center text-green-400 text-lg mb-4 p-3 bg-green-900/30 rounded border border-green-500";
    successMessage.innerHTML = "✅ تم إرسال ترتيب البطاقات بنجاح! البطاقات مرتبة حسب اختيارك";
    grid.parentNode.insertBefore(successMessage, grid);
  }

  if (continueBtn) {
    if (Array.isArray(lockedOrder) && lockedOrder.length === pickList.length) {
      continueBtn.classList.remove("hidden");
      continueBtn.disabled = true;
      continueBtn.textContent = "✅ تم إرسال الترتيب";
      
      // إخفاء التعليمات المتنقلة عند عرض البطاقات المرتبة
      const mobileInstructions = document.querySelector('.mobile-instructions');
      if (mobileInstructions) {
        mobileInstructions.remove();
      }
    } else {
      continueBtn.classList.add("hidden");
      continueBtn.disabled = false;
      continueBtn.textContent = "متابعة";
    }
  }
}

/* ================== Mobile Number Selection ================== */
function checkArrangementComplete() {
  if (continueBtn) {
    continueBtn.classList.remove("hidden");
    continueBtn.disabled = false;
    continueBtn.textContent = "متابعة";
  }
}

/* ================== Submit Ordered Picks ================== */
async function submitPicks() {
  if (!picks.length) return;

  if (Array.isArray(submittedOrder) && submittedOrder.length === picks.length) {
    return;
  }

  // Process ordering based on device type
  let ordered = [];
  
  if (isMobile) {
    // For mobile, use dropdown selection (same as desktop for consistency)
    const dropdowns = document.querySelectorAll(".orderSelect");
    const values = dropdowns.length
      ? Array.from(dropdowns).map((s) => parseInt(s.value, 10))
      : [];

    const inRange = values.every(v => Number.isInteger(v) && v >= 1 && v <= picks.length);
    if (!inRange || new Set(values).size !== picks.length) {
      alert("يرجى ترتيب كل البطاقات بدون تكرار وضمن النطاق الصحيح.");
      return;
    }

    // Create ordered array based on dropdown selections
    ordered = new Array(picks.length);
    for (let i = 0; i < values.length; i++) {
      const orderIndex = values[i] - 1;
      ordered[orderIndex] = picks[i];
      console.log(`Card ${i + 1} (${picks[i]}) placed at position ${orderIndex + 1}`);
    }
    console.log('Final ordered array:', ordered);
  } else {
    // For desktop dropdown selection, validate and process dropdowns
    const dropdowns = document.querySelectorAll(".orderSelect");
    const values = dropdowns.length
      ? Array.from(dropdowns).map((s) => parseInt(s.value, 10))
      : [];

    const inRange = values.every(v => Number.isInteger(v) && v >= 1 && v <= picks.length);
    if (!inRange || new Set(values).size !== picks.length) {
      alert("يرجى ترتيب كل البطاقات بدون تكرار وضمن النطاق الصحيح.");
      return;
    }

    ordered = new Array(picks.length);
    for (let i = 0; i < values.length; i++) {
      const orderIndex = values[i] - 1;
      ordered[orderIndex] = picks[i];
      console.log(`Card ${i + 1} (${picks[i]}) placed at position ${orderIndex + 1}`);
    }
    console.log('Final ordered array (desktop):', ordered);
  }

  try {
    // إظهار loading
    if (continueBtn) {
      continueBtn.disabled = true;
      continueBtn.textContent = 'جاري إرسال الترتيب...';
    }
    
    // Store submitted order in localStorage (following order.js pattern)
    localStorage.setItem(ORDER_LOCAL_KEY, JSON.stringify(ordered));
    
    // Store card arrangement for final-setup.html to detect (following order.js pattern)
    const playerKey = currentPlayer === 1 ? 'player1' : 'player2';
    localStorage.setItem(`${playerKey}CardArrangement`, JSON.stringify(ordered));
    localStorage.setItem(`${playerKey}ArrangementCompleted`, 'true');
    
    // Also store in the format expected by final-setup.html
    const currentGameSetup = JSON.parse(localStorage.getItem('gameSetupProgress') || '{}');
    const updatedGameSetup = {
      ...currentGameSetup,
      [playerKey]: {
        ...currentGameSetup[playerKey],
        selectedCards: ordered,
        arrangementCompleted: true
      }
    };
    localStorage.setItem('gameSetupProgress', JSON.stringify(updatedGameSetup));
    
    // Store in gameState format as well
    const currentGameState = JSON.parse(localStorage.getItem('gameState') || '{}');
    const updatedGameState = {
      ...currentGameState,
      [playerKey]: {
        ...currentGameState[playerKey],
        selectedCards: ordered,
        arrangementCompleted: true
      }
    };
    localStorage.setItem('gameState', JSON.stringify(updatedGameState));
    
    // Store in StrategicOrdered format (for compatibility with card.js)
    localStorage.setItem(`${playerParam}StrategicOrdered`, JSON.stringify(ordered));
    
    // Dispatch custom event for host to listen (following order.js pattern)
    window.dispatchEvent(new CustomEvent('orderSubmitted', { 
      detail: { gameId, playerName, ordered } 
    }));
    
    // Save to Firebase with real-time sync if gameId is available
    if (gameId) {
      try {
        await GameService.saveCardOrderRealtime(gameId, player, ordered);
        localStorage.setItem('currentGameId', gameId);
        console.log('Card order saved to Firebase with real-time sync');
      } catch (e) {
        console.warn('Firebase save failed, but localStorage saved:', e);
      }
    }
    
    // Update submittedOrder immediately (like order.js)
    submittedOrder = ordered.slice();
    
    hideOpponentPanel();
    
    // Re-render cards immediately with submitted order (like order.js)
    // Ensure the order is displayed correctly
    console.log('Rendering submitted order:', submittedOrder);
    console.log('Submitted order length:', submittedOrder.length);
    console.log('Picks length:', picks.length);
    renderCards(submittedOrder, submittedOrder);
    
    // Update button state (like order.js)
    if (continueBtn) {
      continueBtn.disabled = true;
      continueBtn.textContent = '✅ تم إرسال الترتيب';
      continueBtn.classList.remove('hidden');
    }
    
    // Hide mobile instructions after submission
    const mobileInstructions = document.querySelector('.mobile-instructions');
    if (mobileInstructions) {
      mobileInstructions.remove();
    }
    
    // Show success message
    console.log('Order submitted successfully:', ordered);
    console.log('Submitted order length:', submittedOrder.length);
    console.log('Picks length:', picks.length);
    
    // Force a small delay to ensure UI updates
    setTimeout(() => {
      console.log('Final verification - submitted order:', submittedOrder);
      console.log('Final verification - picks:', picks);
    }, 100);
    
    // Success - no alert message needed
    
  } catch (error) {
    console.error('Error saving card order:', error);
    alert('حدث خطأ في حفظ ترتيب البطاقات: ' + error.message);
    
    // إعادة تفعيل الزر
    if (continueBtn) {
      continueBtn.disabled = false;
      continueBtn.textContent = 'متابعة';
    }
  }
}

window.submitPicks = submitPicks;

/* ================== Order.js Command Integration ================== */
// Function to be called from host page (card.html) following order.js pattern
window.arrangeCards = function(playerParam, gameId, playerName) {
  console.log(`Arranging cards for ${playerParam} in game ${gameId}`);
  
  // Update current player info
  if (playerParam === 'player1' || playerParam === 'player2') {
    currentPlayer = playerParam === 'player2' ? 2 : 1;
    window.playerParam = playerParam;
    window.gameId = gameId;
    window.playerName = playerName;
    
    // Update instruction
    if (instruction) {
      instruction.textContent = `اللاعب ${playerName} رتب بطاقاتك`;
    }
    
    // Reload cards with new parameters
    loadPlayerCards();
  }
};

// Function to check arrangement status (for host monitoring)
window.getArrangementStatus = function() {
  return {
    isArranged: Array.isArray(submittedOrder) && submittedOrder.length === picks.length,
    order: submittedOrder,
    playerParam: playerParam,
    gameId: gameId,
    playerName: playerName
  };
};

// Function to reset arrangement (for new games)
window.resetArrangement = function() {
  submittedOrder = null;
  picks = [];
  if (grid) {
    grid.innerHTML = '';
  }
  if (continueBtn) {
    continueBtn.classList.add('hidden');
    continueBtn.disabled = true;
    continueBtn.textContent = 'متابعة';
  }
  
  // Clear localStorage
  localStorage.removeItem(ORDER_LOCAL_KEY);
  localStorage.removeItem(`${playerParam}StrategicOrdered`);
  localStorage.removeItem(`${playerParam}CardArrangement`);
  localStorage.removeItem(`${playerParam}ArrangementCompleted`);
  
  console.log('Arrangement reset for', playerParam);
};

// Clear used abilities for new game
function clearUsedAbilities() {
  try {
    // Clear used abilities for both players
    localStorage.removeItem('player1UsedAbilities');
    localStorage.removeItem('player2UsedAbilities');
    localStorage.removeItem('usedAbilities');
    localStorage.removeItem('abilityRequests');
    
    // Reset ability usage in abilities lists
    const player1Abilities = JSON.parse(localStorage.getItem('player1Abilities') || '[]');
    const player2Abilities = JSON.parse(localStorage.getItem('player2Abilities') || '[]');
    
    // Reset used state for all abilities
    player1Abilities.forEach(ability => {
      if (typeof ability === 'object' && ability.used !== undefined) {
        ability.used = false;
      }
    });
    player2Abilities.forEach(ability => {
      if (typeof ability === 'object' && ability.used !== undefined) {
        ability.used = false;
      }
    });
    
    // Save updated abilities
    localStorage.setItem('player1Abilities', JSON.stringify(player1Abilities));
    localStorage.setItem('player2Abilities', JSON.stringify(player2Abilities));
    
    // Reload abilities
    loadPlayerAbilities();
    loadOpponentAbilities();
  } catch (error) {
    console.error('Error clearing used abilities:', error);
  }
}

// Clear old game data when starting a new game
function clearOldGameData() {
  try {
    // Clear old card orders
    localStorage.removeItem('player1Order');
    localStorage.removeItem('player2Order');
    
    // Clear old game ID
    localStorage.removeItem('currentGameId');
    
    // Reset submitted order
    submittedOrder = null;
    
    console.log('Cleared old game data');
  } catch (error) {
    console.error('Error clearing old game data:', error);
  }
}

// Initialize card manager when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeCardManager();
  
  // Check for ability requests every 1 second for faster response
  setInterval(checkAbilityRequests, 1000);
  
  // Listen for storage changes
  window.addEventListener('storage', function(e) {
    if (e.key === 'abilityRequests') {
      checkAbilityRequests();
    } else if (e.key && e.key.endsWith('UsedAbilities')) {
      // Handle ability usage changes from host
      const playerParamFromKey = e.key.replace('UsedAbilities', '');
      if (playerParamFromKey === playerParam) {
        console.log(`Received ability usage change via storage: ${e.key}`);
        
        // Reload abilities to sync with host changes
        setTimeout(() => {
          console.log('Reloading abilities due to host changes...');
          loadPlayerAbilities();
        }, 100);
      }
    }
  });
  
  // Listen for custom events
  window.addEventListener('forceAbilitySync', function() {
    checkAbilityRequests();
  });
  
  // Listen for ability toggle events from host
  window.addEventListener('abilityToggled', function(event) {
    const { playerParam: eventPlayerParam, abilityText, isUsed } = event.detail;
    
    // Only process if it's for this player
    if (eventPlayerParam === playerParam) {
      console.log(`Received ability toggle from host: ${abilityText} = ${isUsed}`);
      
      // Update local abilities
      if (myAbilities) {
        myAbilities.forEach(ability => {
          if (ability.text === abilityText) {
            ability.used = isUsed;
          }
        });
      }
      
      // Update temp used set
      if (isUsed) {
        tempUsed.add(abilityText);
      } else {
        tempUsed.delete(abilityText);
      }
      
      // Also update the used abilities in localStorage to match host
      const usedAbilitiesKey = `${playerParam}UsedAbilities`;
      const usedAbilities = JSON.parse(localStorage.getItem(usedAbilitiesKey) || '[]');
      
      if (isUsed) {
        if (!usedAbilities.includes(abilityText)) {
          usedAbilities.push(abilityText);
        }
      } else {
        const filteredAbilities = usedAbilities.filter(ability => ability !== abilityText);
        usedAbilities.length = 0;
        usedAbilities.push(...filteredAbilities);
      }
      
      localStorage.setItem(usedAbilitiesKey, JSON.stringify(usedAbilities));
      
      // Update UI immediately
      if (abilitiesWrap) {
        renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
      }
      
      // Update status message
      if (abilityStatus) {
        if (isUsed) {
          abilityStatus.textContent = `✅ تم تفعيل ${abilityText} من قبل المضيف`;
        } else {
          abilityStatus.textContent = `🔄 تم إلغاء تفعيل ${abilityText} من قبل المضيف`;
        }
        
        // Reset status after 3 seconds
        setTimeout(() => {
          if (abilityStatus) {
            abilityStatus.textContent = "اضغط على القدرة لطلب استخدامها.";
          }
        }, 3000);
      }
    }
  });
  
  // Listen for postMessage from host
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'ABILITY_TOGGLED') {
      const { playerParam: eventPlayerParam, abilityText, isUsed } = event.data;
      
      // Only process if it's for this player
      if (eventPlayerParam === playerParam) {
        console.log(`Received ability toggle via postMessage: ${abilityText} = ${isUsed}`);
        
        // Update local abilities
        if (myAbilities) {
          myAbilities.forEach(ability => {
            if (ability.text === abilityText) {
              ability.used = isUsed;
            }
          });
        }
        
        // Update temp used set
        if (isUsed) {
          tempUsed.add(abilityText);
        } else {
          tempUsed.delete(abilityText);
        }
        
        // Also update the used abilities in localStorage to match host
        const usedAbilitiesKey = `${playerParam}UsedAbilities`;
        const usedAbilities = JSON.parse(localStorage.getItem(usedAbilitiesKey) || '[]');
        
        if (isUsed) {
          if (!usedAbilities.includes(abilityText)) {
            usedAbilities.push(abilityText);
          }
        } else {
          const filteredAbilities = usedAbilities.filter(ability => ability !== abilityText);
          usedAbilities.length = 0;
          usedAbilities.push(...filteredAbilities);
        }
        
        localStorage.setItem(usedAbilitiesKey, JSON.stringify(usedAbilities));
        
        // Update UI immediately
        if (abilitiesWrap) {
          renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
        }
        
        // Update status message
        if (abilityStatus) {
          if (isUsed) {
            abilityStatus.textContent = `✅ تم تفعيل ${abilityText} من قبل المضيف`;
          } else {
            abilityStatus.textContent = `🔄 تم إلغاء تفعيل ${abilityText} من قبل المضيف`;
          }
          
          // Reset status after 3 seconds
          setTimeout(() => {
            if (abilityStatus) {
              abilityStatus.textContent = "اضغط على القدرة لطلب استخدامها.";
            }
          }, 3000);
        }
      }
    }
  });
  
  // Also check immediately on load
  setTimeout(checkAbilityRequests, 500);
  
  // Force immediate ability sync on page load
  setTimeout(() => {
    if (myAbilities && abilitiesWrap) {
      renderBadges(abilitiesWrap, myAbilities, { clickable: true, onClick: requestUseAbility });
      console.log('Forced ability UI refresh on page load');
    }
  }, 1000);
});

// ✅ مزامنة فورية لتغييرات ترتيب البطاقات والاختيارات
window.addEventListener('storage', function(e) {
  try {
    if (e.key === ORDER_LOCAL_KEY || e.key === PICKS_LOCAL_KEY) {
      console.log(`🔄 فوراً: تغيير في ${e.key}, إعادة تحميل البطاقات`);
      loadPlayerCards();
    }
  } catch (err) {
    console.error("Error in immediate picks/order sync:", err);
  }
});

// ✅ استقبال رسائل مباشرة للترتيب (لو المضيف أرسلها)
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'ORDER_UPDATED') {
    console.log("🔄 استلام ترتيب جديد عبر postMessage:", e.data);
    loadPlayerCards();
  }
  if (e.data && e.data.type === 'PICKS_UPDATED') {
    console.log("🔄 استلام اختيارات جديدة عبر postMessage:", e.data);
    loadPlayerCards();
  }
});

// Make functions available globally
window.submitPicks = submitPicks;
window.clearOldGameData = clearOldGameData;
window.clearUsedAbilities = clearUsedAbilities;
