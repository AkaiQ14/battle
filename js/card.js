// --- Game state ---
// ✅ نظام الملاحظات المحسن
// - مربع الملاحظات بسيط بدون أزرار مسح أو تسميات
// - المضيف يكتب ويمسح ملاحظات اللاعبين
// - لا يحدث أي تغيير في الملاحظات عند استخدام القدرات أبداً
// - كل لاعب يرى ملاحظاته فقط (لا تنتقل الملاحظات بين اللاعبين)
// - الملاحظات تُحفظ في localStorage وتبقى عبر الجولات
// - عند إعادة تحميل الصفحة تبقى الملاحظات محفوظة

// Load game data from gameSetupProgress with error handling
let gameSetupProgress = {};
try {
  gameSetupProgress = JSON.parse(localStorage.getItem("gameSetupProgress") || "{}");
} catch (error) {
  console.warn("Error parsing gameSetupProgress:", error);
  gameSetupProgress = {};
}

/* ---------------------- Swap Deck System - Early Definition ---------------------- */
// Track swap deck usage for each player
let swapDeckUsed = {
  player1: false,
  player2: false
};

// Load swap deck usage from localStorage
function loadSwapDeckUsage() {
  try {
    const saved = localStorage.getItem('swapDeckUsed');
    if (saved) {
      swapDeckUsed = JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Error loading swap deck usage:', error);
  }
}

// Save swap deck usage to localStorage
function saveSwapDeckUsage() {
  try {
    localStorage.setItem('swapDeckUsed', JSON.stringify(swapDeckUsed));
  } catch (error) {
    console.error('Error saving swap deck usage:', error);
  }
}

// Get all available cards from the cards directory
function getAllAvailableCards() {
  const allCards = [
    "cards/ShanksCard.webm", "cards/Akai.webm", "cards/madara.webm", "cards/Nana-card.png", "cards/Vengeance.png",
    "cards/Crocodile.png", "cards/MeiMei-card.png", "cards/Elizabeth.png", "cards/ace.png", "cards/Adult-gon-card.webp",
    "cards/aizen.webm", "cards/Aizetsu-card.webp", "cards/Akutagawa-card.png", "cards/alex20armstrong.webp", "cards/AllForOneCard.webm",
    "cards/Alluka-card.png", "cards/Android18-card.png", "cards/ArmorTitan-card.webp", "cards/Arthur-card.png", "cards/Asui-card.png",
    "cards/Atsuya-card.png", "cards/AyanokojiCard.webm", "cards/Ban-card.png", "cards/Bardooock.png", "cards/bartolomeo-card.png",
    "cards/BeastKing-card.png", "cards/BigM.webp", "cards/Bisky-card.png", "cards/brook.png", "cards/Btakuya-card.png",
    "cards/caesar-card.png", "cards/cardo20ppsd.webp", "cards/CartTitan-card.png", "cards/cavendish-card.png", "cards/Charllotte-card.png",
    "cards/Choi-jong-in-.webp", "cards/Chopper-card.png", "cards/ColossialTitan-card.png", "cards/Dabi-card.png", "cards/Danteee.png",
    "cards/dazai-card.png", "cards/DiamondJozu.webp", "cards/DragonBB-67-card.png", "cards/edward elric.png", "cards/Elfaria Albis.png",
    "cards/Endeavor.png", "cards/ErenCard.webm", "cards/esdeath.webp", "cards/Eso-card.png", "cards/FemaleTitan-card.webp",
    "cards/franklin_card.png", "cards/Franky-card.png", "cards/Frierennnnn.png", "cards/Friezaaa.webp", "cards/fubuki.webp",
    "cards/Fuegoleonn .png", "cards/Gadjah.webp", "cards/GaiMou-card.png", "cards/Galand-card.png", "cards/Ganju-card.png",
    "cards/Genthru-card.png", "cards/geten.webp", "cards/Geto-card.png", "cards/ghiaccio.png", "cards/Gilthunder.png",
    "cards/Gin-freecss-card.png", "cards/gloxinia.png", "cards/Go-Gunhee-card.webm", "cards/Gogeta.webm", "cards/GojoCard.webm",
    "cards/Goku UI.webm", "cards/Gordon-card.png", "cards/Hachigen-card.png", "cards/HakuKi-card.webp", "cards/Hantengu-card.png",
    "cards/Haruta jjk.png", "cards/Haschwalth-card.png", "cards/Hawk-card.png", "cards/Hawks.webm", "cards/hinata.png",
    "cards/Hisagi-card.png", "cards/Ichibe-card.png", "cards/Igris-card.webp", "cards/ino.png", "cards/Inosuke-card.png",
    "cards/Inumaki-card.png", "cards/Ippo-card.png", "cards/Iron-card.png", "cards/Isaac mcdougal.png", "cards/Ishida-card.webp",
    "cards/Itadori-card.png", "cards/Itchigo-card .png", "cards/Jack-card.png", "cards/Jaw-card.webp", "cards/Jirobo.webp",
    "cards/Johan-card.png", "cards/joker.webm", "cards/Jozi jjk.png", "cards/judarr.webp", "cards/jugo.png",
    "cards/julius wistoria.png", "cards/Kaguraaaa.png", "cards/Kaito-card .png", "cards/Kalluto-card.png", "cards/Karaku-card.png",
    "cards/KeiSha-card.png", "cards/kenjaku-card.png", "cards/Kenzo-card.png", "cards/kimimaro.png", "cards/Kingkaiii.png",
    "cards/Kirach.png", "cards/KiSui-card.png", "cards/Knov-card.png", "cards/konan.png", "cards/konohamaru.webp",
    "cards/kota izumi.png", "cards/Krilin-card.webp", "cards/KudoShinichi-card.png", "cards/Kukoshibo-card.png", "cards/Kuma-card.png",
    "cards/Kurapika-card.png", "cards/kurenai.png", "cards/Kurogiri-card.png", "cards/Kyoga-card.png", "cards/Langriiss.webp",
    "cards/law.webm", "cards/laxus.png", "cards/Lemillion-card.png", "cards/Lille-baroo-card.png", "cards/Lily-card.png",
    "cards/Lucci-card.png", "cards/Luck.png", "cards/LuffyGear5Card.webm", "cards/lumiere silvamillion.png", "cards/lyon vastia.png",
    "cards/obito.webm", "cards/mahito-card.png", "cards/Mahoraga.png", "cards/Mai-card.png", "cards/Maki zenen.png",
    "cards/Makio-card.png", "cards/mansherry.png", "cards/Masamichi-card.png", "cards/Matsumoto-card.webp", "cards/Mayuri-card.webp",
    "cards/MeiMei-card.png", "cards/Meleoron-card.png", "cards/Merlin-card.webp", "cards/MeruemCard.webm", "cards/MetalBat-card.png",
    "cards/Mezo-card.webp", "cards/Min-Byung-Gyu-card.png", "cards/Mina-card.png", "cards/minato.png", "cards/Miruku bnha.png",
    "cards/Momo-hinamori-card.webp", "cards/MomoYaorozu-card.webp", "cards/Monspeet-card.png", "cards/MouBu-card.png", "cards/MouGou-card.png",
    "cards/Nachttt.webp", "cards/Nami.webp", "cards/Nana-card.png", "cards/nanami-card.png", "cards/naobito-card.webp",
    "cards/Nejire-card.png", "cards/NietroCard.webm", "cards/Noelll.png", "cards/Oden-card.png", "cards/Okabe-card.png",
    "cards/Orihime-card.png", "cards/Overhaul-card.png", "cards/Panda-card.webp", "cards/Paragusss.png", "cards/Pariston-card.png",
    "cards/Picollooo.png", "cards/pizarro.webp", "cards/poseidon.png", "cards/Queen-card.webp", "cards/Raditzz.png",
    "cards/RaiDo%20kingdom.webp", "cards/RaiDokingdom.webp", "cards/Renpa-card.png", "cards/Rhyaa.png", "cards/Rika-card.png",
    "cards/rin.png", "cards/Rojuro-card.png", "cards/Roy Mustang.png", "cards/Runge-card.png", "cards/Runge-card.webp",
    "cards/sai.png", "cards/SakamotoCard.webm", "cards/Senjumaru-card.png", "cards/Senritsu-card.webp", "cards/ShanksCard.webm",
    "cards/shikamaru.webm", "cards/Shin-card.png", "cards/Shinji-card.webp", "cards/shino.png", "cards/Shinobu-card.png",
    "cards/Shinpei-card.webp", "cards/Shizuku-card.png", "cards/ShouBunKun-card.png", "cards/ShouHeiKun-card .png", "cards/silver%20fullbuster.webp",
    "cards/SilverCard.webm", "cards/silverfullbuster.webp", "cards/Stain-card.png", "cards/Stark-card.png", "cards/sting eucliffe.png",
    "cards/suzuno.png", "cards/takuma-card.webp", "cards/Tank-card.png", "cards/Teach-card.png", "cards/Tenma-card.png",
    "cards/tenten.webp", "cards/Tier Harribel.png", "cards/tobirama.png", "cards/Todoroki.png", "cards/Tosen-card.webp",
    "cards/UmibozoCard.webm", "cards/Ur.png", "cards/Uvogin-card.png", "cards/VanAugur-card.webp", "cards/Vegapunk-crad.webp",
    "cards/Vegetto.webm", "cards/Vengeance.png", "cards/Videl-card.webp", "cards/Vista-card.png", "cards/WarHammerTitan-card.png",
    "cards/whitebeard.webm", "cards/Yoo-Jinho-card.png", "cards/Yoruichi-card.webp", "cards/YujiroHanma-card.png", "cards/Yusaku.png",
    "cards/Zagred-card.png", "cards/Zamasuuu.webm", "cards/zaratras.png", "cards/Zeno kingdom.png", "cards/Zeo Thorzeus.png",
    "cards/zetsu.png", "cards/Zohakuten.png"
  ];
  
  return allCards;
}

// Generate 3 random cards for swap deck (excluding player's current cards)
function generateSwapCards(playerParam) {
  console.log('🎲 generateSwapCards called for:', playerParam);
  const allCards = getAllAvailableCards();
  const playerName = playerParam === 'player1' ? player1 : player2;
  const playerCards = picks[playerName] || [];
  
  console.log('Player cards:', playerCards);
  console.log('All cards count:', allCards.length);
  
  // Filter out cards that the player already has
  const availableCards = allCards.filter(card => !playerCards.includes(card));
  
  console.log('Available cards count:', availableCards.length);
  
  // Shuffle and pick 3 random cards
  const shuffled = availableCards.sort(() => 0.5 - Math.random());
  const selectedCards = shuffled.slice(0, 3);
  
  console.log('Selected swap cards:', selectedCards);
  return selectedCards;
}

// Open swap deck modal
function openSwapDeckModal(playerParam) {
  console.log('🎯 openSwapDeckModal called for:', playerParam);
  console.log('Current players:', { player1, player2 });
  console.log('Current round:', round);
  console.log('Swap deck usage:', swapDeckUsed);
  
  const playerName = playerParam === 'player1' ? player1 : player2;
  
  // Check if player has already used swap deck
  if (swapDeckUsed[playerParam]) {
    showToast(`! ${playerName} استخدم دكة البدلاء مسبقاً في هذه المعركة`, 'warning');
    return;
  }
  
  const modal = document.getElementById("swapDeckModal");
  const title = document.getElementById("swapDeckTitle");
  const currentCardDisplay = document.getElementById("currentCardDisplay");
  const swapCardsGrid = document.getElementById("swapCardsGrid");
  const confirmBtn = document.getElementById("confirmSwapBtn");
  
  console.log('Modal elements check:', {
    modal: !!modal,
    title: !!title,
    currentCardDisplay: !!currentCardDisplay,
    swapCardsGrid: !!swapCardsGrid,
    confirmBtn: !!confirmBtn
  });
  
  if (!modal || !title || !currentCardDisplay || !swapCardsGrid || !confirmBtn) {
    console.error('❌ Required modal elements not found');
    return;
  }
  
  console.log('✅ All modal elements found, proceeding...');
  
  // Update title
  title.textContent = `دكة البدلاء - ${playerName}`;
  
  // Show current card
  const currentCardSrc = picks[playerName]?.[round];
  if (currentCardSrc) {
    currentCardDisplay.innerHTML = "";
    currentCardDisplay.appendChild(createMedia(currentCardSrc, ""));
  } else {
    currentCardDisplay.innerHTML = '<div style="color: #ffed7a; font-size: 12px; display: flex; align-items: center; justify-content: center; height: 100%;">لا توجد بطاقة</div>';
  }
  
  // Generate and display 3 random swap cards
  const swapCards = generateSwapCards(playerParam);
  swapCardsGrid.innerHTML = "";
  
  // Store swap cards in modal data
  modal.dataset.swapCards = JSON.stringify(swapCards);
  
  swapCards.forEach((cardSrc, index) => {
    const cardOption = document.createElement("div");
    cardOption.className = "swap-card-option";
    cardOption.onclick = () => {
      // Remove previous selection
      swapCardsGrid.querySelectorAll('.swap-card-option').forEach(opt => opt.classList.remove('selected'));
      
      // Select current card
      cardOption.classList.add('selected');
      
      // Enable confirm button
      confirmBtn.disabled = false;
    };
    
    // Create media element
    const media = createMedia(cardSrc, "swap-card-media");
    cardOption.appendChild(media);
    
    // Add card number
    const cardNumber = document.createElement("div");
    cardNumber.className = "swap-card-number";
    cardNumber.textContent = `${index + 1}`;
    cardOption.appendChild(cardNumber);
    
    swapCardsGrid.appendChild(cardOption);
  });
  
  // Reset confirm button
  confirmBtn.disabled = true;
  
  // Store current player for confirm action
  modal.dataset.playerParam = playerParam;
  
  modal.classList.add("active");
  console.log('🎉 Modal opened successfully!');
}

// Close swap deck modal
function closeSwapDeckModal() {
  const modal = document.getElementById("swapDeckModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

// Confirm swap
function confirmSwap() {
  const modal = document.getElementById("swapDeckModal");
  const playerParam = modal.dataset.playerParam;
  const playerName = playerParam === 'player1' ? player1 : player2;
  
  const selectedCard = modal.querySelector('.swap-card-option.selected');
  if (!selectedCard) {
    showToast("! يرجى اختيار بطاقة للتبديل", 'error');
    return;
  }
  
  const selectedIndex = Array.from(modal.querySelectorAll('.swap-card-option')).indexOf(selectedCard);
  const swapCards = modal.dataset.swapCards ? JSON.parse(modal.dataset.swapCards) : generateSwapCards(playerParam);
  const newCardSrc = swapCards[selectedIndex];
  
  if (!newCardSrc) {
    showToast("! خطأ في اختيار البطاقة", 'error');
    return;
  }
  
  // Perform the swap
  if (picks[playerName] && picks[playerName][round]) {
    const oldCardSrc = picks[playerName][round];
    picks[playerName][round] = newCardSrc;
    
    // Save updated picks to localStorage
    try {
      // Update StrategicOrdered if it exists
      const strategicOrderedKey = `${playerParam}StrategicOrdered`;
      const strategicOrdered = JSON.parse(localStorage.getItem(strategicOrderedKey) || '[]');
      if (Array.isArray(strategicOrdered) && strategicOrdered[round]) {
        strategicOrdered[round] = newCardSrc;
        localStorage.setItem(strategicOrderedKey, JSON.stringify(strategicOrdered));
      }
      
      // Update StrategicPicks if it exists
      const strategicPicksKey = `${playerParam}StrategicPicks`;
      const strategicPicks = JSON.parse(localStorage.getItem(strategicPicksKey) || '[]');
      if (Array.isArray(strategicPicks) && strategicPicks[round]) {
        strategicPicks[round] = newCardSrc;
        localStorage.setItem(strategicPicksKey, JSON.stringify(strategicPicks));
      }
      
      // Update gameCardSelection if it exists
      const gameCardSelection = JSON.parse(localStorage.getItem('gameCardSelection') || '{}');
      if (gameCardSelection[`${playerParam}Cards`] && gameCardSelection[`${playerParam}Cards`][round]) {
        gameCardSelection[`${playerParam}Cards`][round] = newCardSrc;
        localStorage.setItem('gameCardSelection', JSON.stringify(gameCardSelection));
      }
      
      console.log(`تم تبديل البطاقة للاعب ${playerName}: ${oldCardSrc} -> ${newCardSrc}`);
      
      // Mark swap deck as used
      swapDeckUsed[playerParam] = true;
      saveSwapDeckUsage();
      
      // Disable swap deck button
      const swapBtn = document.getElementById(`swapDeckBtn${playerParam === 'player1' ? '1' : '2'}`);
      if (swapBtn) {
        swapBtn.classList.add('disabled');
        swapBtn.disabled = true;
        swapBtn.textContent = 'مستخدمة';
      }
      
      // Refresh the display
      renderVs();
      
      // Close modal
      closeSwapDeckModal();
      
      // Show success message
      showToast(`تم تبديل البطاقة بنجاح للاعب ${playerName}`, 'success');
      
    } catch (error) {
      console.error('Error saving swap:', error);
      showToast("! خطأ في حفظ التبديل", 'error');
    }
  } else {
    showToast("! خطأ في العثور على البطاقة الحالية", 'error');
  }
}

// Update swap deck buttons state
function updateSwapDeckButtons() {
  const swapBtn1 = document.getElementById('swapDeckBtn1');
  const swapBtn2 = document.getElementById('swapDeckBtn2');
  
  if (swapBtn1) {
    if (swapDeckUsed.player1) {
      swapBtn1.classList.add('disabled');
      swapBtn1.disabled = true;
      swapBtn1.textContent = 'مستخدمة';
    } else {
      swapBtn1.classList.remove('disabled');
      swapBtn1.disabled = false;
      swapBtn1.textContent = 'دكة البدلاء';
    }
  }
  
  if (swapBtn2) {
    if (swapDeckUsed.player2) {
      swapBtn2.classList.add('disabled');
      swapBtn2.disabled = true;
      swapBtn2.textContent = 'مستخدمة';
    } else {
      swapBtn2.classList.remove('disabled');
      swapBtn2.disabled = false;
      swapBtn2.textContent = 'دكة البدلاء';
    }
  }
}

// Make swap deck functions globally available immediately
window.openSwapDeckModal = openSwapDeckModal;
window.closeSwapDeckModal = closeSwapDeckModal;
window.confirmSwap = confirmSwap;

console.log('Swap deck functions loaded and available:', {
  openSwapDeckModal: typeof window.openSwapDeckModal,
  closeSwapDeckModal: typeof window.closeSwapDeckModal,
  confirmSwap: typeof window.confirmSwap
});

// Load round count from gameSetupProgress
let roundCount = 5;
let startingHP = 5;

try {
  if (gameSetupProgress.rounds) {
    roundCount = gameSetupProgress.rounds;
    startingHP = gameSetupProgress.rounds;
  } else if (localStorage.getItem("totalRounds")) {
    roundCount = parseInt(localStorage.getItem("totalRounds"));
    startingHP = parseInt(localStorage.getItem("totalRounds"));
  }
} catch (e) {
  console.error('Error loading round count:', e);
}

// Load player names from gameSetupProgress
let player1 = "لاعب 1";
let player2 = "لاعب 2";

try {
  if (gameSetupProgress.player1?.name) {
    player1 = gameSetupProgress.player1.name;
  } else if (gameSetupProgress.player1Name) {
    player1 = gameSetupProgress.player1Name;
  } else if (localStorage.getItem("player1")) {
    player1 = localStorage.getItem("player1");
  }
  
  if (gameSetupProgress.player2?.name) {
    player2 = gameSetupProgress.player2.name;
  } else if (gameSetupProgress.player2Name) {
    player2 = gameSetupProgress.player2Name;
  } else if (localStorage.getItem("player2")) {
    player2 = localStorage.getItem("player2");
  }
  
  console.log('Loaded player names:', { player1, player2 });
} catch (e) {
  console.error('Error loading player names:', e);
}

// Load round count first
let round = parseInt(localStorage.getItem("currentRound") || "0");

// Dynamic picks loading function
function loadPlayerPicks() {
  console.log('📋 loadPlayerPicks called');
  let picks = {};
  
  try {
    // First priority: Load from StrategicOrdered (final arrangement from player-cards.html)
    const player1Order = localStorage.getItem('player1StrategicOrdered');
    const player2Order = localStorage.getItem('player2StrategicOrdered');
    
    if (player1Order && player2Order) {
      try {
        const player1Ordered = JSON.parse(player1Order);
        const player2Ordered = JSON.parse(player2Order);
        
        if (Array.isArray(player1Ordered) && Array.isArray(player2Ordered) && 
            player1Ordered.length > 0 && player2Ordered.length > 0) {
          picks[player1] = [...player1Ordered];
          picks[player2] = [...player2Ordered];
          console.log('Loaded picks from StrategicOrdered:', { player1: picks[player1], player2: picks[player2] });
          return picks;
        }
      } catch (e) {
        console.warn('Error parsing StrategicOrdered:', e);
      }
    }
    
    // Second priority: Load from StrategicPicks (selected cards from cards-setup.js)
    const player1Picks = localStorage.getItem('player1StrategicPicks');
    const player2Picks = localStorage.getItem('player2StrategicPicks');
    
    if (player1Picks && player2Picks) {
      try {
        const player1Cards = JSON.parse(player1Picks);
        const player2Cards = JSON.parse(player2Picks);
        
        if (Array.isArray(player1Cards) && Array.isArray(player2Cards) && 
            player1Cards.length > 0 && player2Cards.length > 0) {
          picks[player1] = [...player1Cards];
          picks[player2] = [...player2Cards];
          console.log('Loaded picks from StrategicPicks:', { player1: picks[player1], player2: picks[player2] });
          return picks;
        }
      } catch (e) {
        console.warn('Error parsing StrategicPicks:', e);
      }
    }
    
    // Third priority: Load from gameCardSelection
    const cardSelection = localStorage.getItem('gameCardSelection');
    if (cardSelection) {
      try {
        const cardData = JSON.parse(cardSelection);
        if (cardData.player1Cards && cardData.player2Cards) {
          picks[player1] = [...cardData.player1Cards];
          picks[player2] = [...cardData.player2Cards];
          console.log('Loaded picks from gameCardSelection:', { player1: picks[player1], player2: picks[player2] });
          return picks;
        }
      } catch (e) {
        console.warn('Error parsing gameCardSelection:', e);
      }
    }
    
  } catch (error) {
    console.warn("Error loading picks:", error);
  }
  
  // Ensure picks has valid data for both players
  if (!picks[player1] || !Array.isArray(picks[player1]) || picks[player1].length === 0) {
    picks[player1] = ["cards/ShanksCard.webm", "cards/Akai.webm", "cards/madara.webm", "cards/Nana-card.png", "cards/Vengeance.png"];
    console.log('Using fallback cards for player1:', picks[player1]);
  }
  if (!picks[player2] || !Array.isArray(picks[player2]) || picks[player2].length === 0) {
    picks[player2] = ["cards/Akai.webm", "cards/ShanksCard.webm", "cards/Crocodile.png", "cards/MeiMei-card.png", "cards/Elizabeth.png"];
    console.log('Using fallback cards for player2:', picks[player2]);
  }
  
  console.log('📋 loadPlayerPicks result:', picks);
  return picks;
}

// Load picks dynamically
let picks = loadPlayerPicks();
console.log('📋 Initial picks loaded:', picks);
console.log('📋 Player names:', { player1, player2 });
console.log('📋 Current round:', round);
console.log('📋 Swap deck usage:', swapDeckUsed);
console.log('📋 Window functions available:', {
  openSwapDeckModal: typeof window.openSwapDeckModal,
  closeSwapDeckModal: typeof window.closeSwapDeckModal,
  confirmSwap: typeof window.confirmSwap
});

// Scores init/persist with error handling
let scores = {};
try {
  scores = JSON.parse(localStorage.getItem("scores") || "{}");
} catch (error) {
  console.warn("Error parsing scores:", error);
  scores = {};
}

if (Object.keys(scores).length === 0 || round === 0) {
  scores[player1] = startingHP;
  scores[player2] = startingHP;
}

// Storage keys
const P1_ABILITIES_KEY = "player1Abilities";
const P2_ABILITIES_KEY = "player2Abilities";
// ✅ مفتاح حفظ الملاحظات - تبقى محفوظة للجولات التالية
const NOTES_KEY = (name, roundNumber = null) => {
  const currentRound = roundNumber !== null ? roundNumber : round;
  return `notes:${name}:round${currentRound}`;
};
const USED_ABILITIES_KEY = "usedAbilities";
const ABILITY_REQUESTS_KEY = "abilityRequests";

// ---- UI roots ----
const roundTitle = document.querySelector(".topbar h1");
const leftName   = document.querySelector(".player-column .name");
const rightName  = document.querySelector(".right-panel .name");
const leftCard   = document.querySelector(".player-column .big-card");
const rightCard  = document.querySelector(".right-panel .big-card");
const leftNotes  = document.querySelector(".player-column .notes textarea");
const rightNotes = document.querySelector(".right-panel .notes textarea");

// Track shown notifications to avoid duplicates
let shownNotifications = new Set();

/* ---------------------- Toast ---------------------- */
function showToast(message, actions = []) {
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    position:fixed; left:50%; transform:translateX(-50%);
    bottom:18px; z-index:3000; background:#222; color:#fff;
    border:2px solid #ffffff; border-radius:12px; padding:10px 14px;
    box-shadow:0 8px 18px rgba(0,0,0,.35); font-weight:700;
    font-family:"Cairo",sans-serif;
  `;
  const msg = document.createElement("div");
  
  // Check if message starts with "!" and style it red
  if (message.startsWith("! ")) {
    const icon = document.createElement("span");
    icon.textContent = "!";
    icon.style.color = "#dc2626"; // Red color
    icon.style.fontWeight = "bold";
    icon.style.fontSize = "18px";
    
    const text = document.createElement("span");
    text.textContent = message.substring(2); // Remove "! " from the beginning
    
    msg.appendChild(icon);
    msg.appendChild(text);
  } else {
    msg.textContent = message;
  }
  
  msg.style.marginBottom = actions.length ? "8px" : "0";
  wrap.appendChild(msg);

  if (actions.length) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "8px";
    row.style.justifyContent = "flex-end";
    actions.forEach(a => {
      const b = document.createElement("button");
      b.textContent = a.label;
      
      // Set different colors based on button label
      let backgroundColor = "#16a34a"; // Default green for "قبول"
      if (a.label === "رفض") {
        backgroundColor = "#dc2626"; // Red for "رفض"
      }
      
      b.style.cssText = `
        padding:6px 10px; border-radius:10px; border:none;
        background:${backgroundColor}; color:#fff; font-weight:800; cursor:pointer;
        font-family:"Cairo",sans-serif;
      `;
      b.onclick = () => { a.onClick?.(); document.body.removeChild(wrap); };
      row.appendChild(b);
    });
    wrap.appendChild(row);
  }

  document.body.appendChild(wrap);
  if (!actions.length) setTimeout(() => wrap.remove(), 1800);
}

/* ---------------------- Abilities helpers ---------------------- */
function loadAbilities(key){ 
  try{ 
    const a=JSON.parse(localStorage.getItem(key)||"[]"); 
    return Array.isArray(a)?a:[] 
  }catch(error){ 
    console.warn(`Error loading abilities for ${key}:`, error);
    return [] 
  } 
}

// Load abilities from player-specific keys
function loadPlayerAbilities(playerParam) {
  try {
    const abilitiesKey = `${playerParam}Abilities`;
    const usedAbilitiesKey = `${playerParam}UsedAbilities`;
    
    const abilities = JSON.parse(localStorage.getItem(abilitiesKey) || '[]');
    const usedAbilities = JSON.parse(localStorage.getItem(usedAbilitiesKey) || '[]');
    const usedSet = new Set(usedAbilities);
    
    return abilities.map(ability => {
      const abilityText = typeof ability === 'string' ? ability : ability.text || ability;
      return {
        text: abilityText,
        used: usedSet.has(abilityText) || (typeof ability === 'object' && ability.used === true)
      };
    });
  } catch (e) {
    console.error(`Error loading player abilities for ${playerParam}:`, e);
    return [];
  }
}
function saveAbilities(key, arr){ 
  try {
    localStorage.setItem(key, JSON.stringify(arr)); 
  } catch(error) {
    console.error(`Error saving abilities for ${key}:`, error);
  }
}

function loadUsedAbilities(){
  try {
    const used = JSON.parse(localStorage.getItem(USED_ABILITIES_KEY) || "{}");
    return used;
  } catch(error) {
    console.warn("Error loading used abilities:", error);
    localStorage.removeItem(USED_ABILITIES_KEY);
    return {};
  }
}

function saveUsedAbilities(usedAbilities){
  try {
    localStorage.setItem(USED_ABILITIES_KEY, JSON.stringify(usedAbilities));
    
    // Also trigger storage event manually for cross-page sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: USED_ABILITIES_KEY,
      newValue: localStorage.getItem(USED_ABILITIES_KEY),
      oldValue: localStorage.getItem(USED_ABILITIES_KEY),
      storageArea: localStorage
    }));
  } catch(error) {
    console.error("Error saving used abilities:", error);
    try {
      localStorage.removeItem(USED_ABILITIES_KEY);
      localStorage.setItem(USED_ABILITIES_KEY, JSON.stringify(usedAbilities));
    } catch(clearError) {
      console.error("Error clearing and saving used abilities:", clearError);
    }
  }
}

function isAbilityUsed(abilityText){
  try {
    const usedAbilities = loadUsedAbilities();
    return usedAbilities[abilityText] === true;
  } catch(error) {
    console.error("Error checking ability usage:", error);
    return false;
  }
}

// Ability request system
function loadAbilityRequests(){
  try {
    const requests = JSON.parse(localStorage.getItem(ABILITY_REQUESTS_KEY) || "[]");
    return requests;
  } catch(error) {
    console.warn("Error loading ability requests:", error);
    localStorage.removeItem(ABILITY_REQUESTS_KEY);
    return [];
  }
}

function saveAbilityRequests(requests){
  try {
    localStorage.setItem(ABILITY_REQUESTS_KEY, JSON.stringify(requests));
  } catch(error) {
    console.error("Error saving ability requests:", error);
  }
}

function updateAbilityRequestStatus(requestId, status){
  try {
    const requests = loadAbilityRequests();
    const requestIndex = requests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
      requests[requestIndex].status = status;
      requests[requestIndex].resolvedAt = Date.now();
      saveAbilityRequests(requests);
      
      // Dispatch event to notify other pages
      window.dispatchEvent(new CustomEvent('abilityRequestUpdated', {
        detail: { requestId, status, request: requests[requestIndex] }
      }));
      
      // Also trigger storage event manually for cross-page sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: ABILITY_REQUESTS_KEY,
        newValue: localStorage.getItem(ABILITY_REQUESTS_KEY),
        oldValue: localStorage.getItem(ABILITY_REQUESTS_KEY),
        storageArea: localStorage
      }));
      
      return true;
    }
    return false;
  } catch(error) {
    console.error("Error updating ability request status:", error);
    return false;
  }
}

function getPendingRequests(){
  try {
    const requests = loadAbilityRequests();
    return requests.filter(req => req.status === 'pending');
  } catch(error) {
    console.error("Error getting pending requests:", error);
    return [];
  }
}

/* ---------------------- Media ---------------------- */
function createMedia(url, className){
  console.log('🖼️ createMedia called:', url, className);
  // Fix card paths for Netlify compatibility
  let fixedUrl = url;
  if (fixedUrl && !fixedUrl.startsWith('http') && !fixedUrl.startsWith('images/')) {
    if (fixedUrl.startsWith('CARD/')) {
      fixedUrl = fixedUrl.replace('CARD/', 'images/');
    } else if (!fixedUrl.startsWith('images/')) {
      fixedUrl = 'images/' + fixedUrl;
    }
  }
  
  const isWebm = /\.webm(\?|#|$)/i.test(fixedUrl || "");
  if (isWebm){
    const v=document.createElement("video");
    v.src=fixedUrl; 
    v.autoplay=true; 
    v.loop=true; 
    v.muted=true; 
    v.playsInline=true;
    v.style.width="100%"; 
    v.style.height="100%";
    v.style.objectFit="contain"; 
    v.style.borderRadius="12px";
    v.style.display="block";
    v.onerror = function() {
      console.error('Error loading video:', fixedUrl);
      this.style.display = 'none';
    };
    if (className) v.className=className;
    console.log('🎥 Video element created:', v.src);
    return v;
  } else {
    const img=document.createElement("img");
    img.src=fixedUrl;
    img.style.width="100%"; 
    img.style.height="100%";
    img.style.objectFit="contain"; 
    img.style.borderRadius="12px";
    img.style.display="block";
    img.onerror = function() {
      console.error('Error loading image:', fixedUrl);
      this.style.display = 'none';
    };
    if (className) img.className=className;
    console.log('🖼️ Image element created:', img.src);
    return img;
  }
}

/* ---------------------- VS section ---------------------- */
function renderVs(){
  // Update player names in HTML
  const leftPlayerName = document.getElementById('leftPlayerName');
  const rightPlayerName = document.getElementById('rightPlayerName');
  
  if (leftPlayerName) {
    leftPlayerName.textContent = player2;
  }
  if (rightPlayerName) {
    rightPlayerName.textContent = player1;
  }
  
  // Update legacy elements for compatibility
  if (leftName) {
    leftName.textContent = player2;
  }
  if (rightName) {
    rightName.textContent = player1;
  }

  if (leftCard) {
    leftCard.innerHTML = "";
    const leftCardSrc = picks?.[player2]?.[round];
    if (leftCardSrc) {
      leftCard.appendChild(createMedia(leftCardSrc, ""));
    } else {
      leftCard.innerHTML = '<div class="empty-hint">لا توجد بطاقة لهذه الجولة</div>';
    }
  }
  
  if (rightCard) {
    rightCard.innerHTML = "";
    const rightCardSrc = picks?.[player1]?.[round];
    if (rightCardSrc) {
      rightCard.appendChild(createMedia(rightCardSrc, ""));
    } else {
      rightCard.innerHTML = '<div class="empty-hint">لا توجد بطاقة لهذه الجولة</div>';
    }
  }

  // Update notes for current round
  updateNotesForRound();
}

// Update notes for current round
function updateNotesForRound() {
  const leftNotes = document.getElementById("player1Notes");
  const rightNotes = document.getElementById("player2Notes");
  
  if (!leftNotes || !rightNotes) {
    console.warn('Notes elements not found');
    return;
  }
  
  // Clear existing event listeners to prevent duplicates
  leftNotes.replaceWith(leftNotes.cloneNode(true));
  rightNotes.replaceWith(rightNotes.cloneNode(true));
  
  // Get fresh references after cloning
  const leftNotesNew = document.getElementById("player1Notes");
  const rightNotesNew = document.getElementById("player2Notes");
  
  // ✅ تحميل الملاحظات المحفوظة من localStorage
  try {
    const player1Notes = localStorage.getItem('notes:player1') || '';
    const player2Notes = localStorage.getItem('notes:player2') || '';
    
    leftNotesNew.value = player1Notes;
    rightNotesNew.value = player2Notes;
    
    console.log(`Notes loaded for round ${round + 1} from localStorage`);
  } catch (error) {
    console.error('Error loading notes from localStorage:', error);
    leftNotesNew.value = "";
    rightNotesNew.value = "";
  }
}

/* ---------------------- Previous cards ---------------------- */
function renderPrev(){
  const getPrev = (name)=> (Array.isArray(picks?.[name])?picks[name]:[]).filter((_,i)=>i<round);
  const leftRow  = document.getElementById("historyRowLeft");
  const rightRow = document.getElementById("historyRowRight");
  const leftLbl  = document.getElementById("historyLabelLeft");
  const rightLbl = document.getElementById("historyLabelRight");

  if (round <= 0){
    if (leftRow) leftRow.classList.add("history-hidden");
    if (rightRow) rightRow.classList.add("history-hidden");
    if (leftLbl) leftLbl.classList.add("history-hidden");
    if (rightLbl) rightLbl.classList.add("history-hidden");
    return;
  }
  
  if (leftRow) leftRow.classList.remove("history-hidden");
  if (rightRow) rightRow.classList.remove("history-hidden");
  if (leftLbl) leftLbl.classList.remove("history-hidden");
  if (rightLbl) rightLbl.classList.remove("history-hidden");

  if (leftRow) leftRow.innerHTML=""; 
  if (rightRow) rightRow.innerHTML="";
  
  // Show previous cards for player2 (left side)
  const player2Prev = getPrev(player2);
  if (player2Prev.length > 0 && leftRow) {
    player2Prev.forEach(src=>{
      const mini=document.createElement("div");
      mini.className="mini-card";
      mini.appendChild(createMedia(src,""));
      leftRow.appendChild(mini);
    });
  }
  
  // Show previous cards for player1 (right side)
  const player1Prev = getPrev(player1);
  if (player1Prev.length > 0 && rightRow) {
    player1Prev.forEach(src=>{
      const mini=document.createElement("div");
      mini.className="mini-card";
      mini.appendChild(createMedia(src,""));
      rightRow.appendChild(mini);
    });
  }
}

/* ---------------------- Abilities panels ---------------------- */
function abilityButton(text, onClick, isUsed = false){
  const b=document.createElement("button");
  b.className="btn";
  b.textContent=text;
  b.style.fontFamily = '"Cairo", sans-serif';     // ⬅ force Cairo on dynamic buttons
  b.onclick=onClick;
  
  // Add visual hint for clickable abilities
  b.title = isUsed ? "انقر لإلغاء تفعيل القدرة" : "انقر لتفعيل القدرة";
  b.style.cursor = "pointer";
  
  return b;
}

function renderAbilitiesPanel(key, container, fromName, toName){
  // Determine which player this is
  const playerParam = (fromName === player1) ? 'player1' : 'player2';
  
  // Load abilities from player-specific keys
  const abilities = loadPlayerAbilities(playerParam);
  
  // Clear container completely
  container.innerHTML = "";

  if (!abilities.length){
    const p=document.createElement("p");
    p.style.opacity=".7"; p.style.fontSize="12px"; p.textContent="لا توجد قدرات";
    p.style.fontFamily = '"Cairo", sans-serif';
    container.appendChild(p);
  } else {
    abilities.forEach((ab, idx)=>{
      const isUsed = ab.used;
      const displayText = isUsed ? `${ab.text} (مستخدمة)` : ab.text;
      
      const btn = abilityButton(displayText, ()=>{
        console.log(`Ability clicked: ${ab.text}, current state: ${isUsed}`);
        // Toggle ability usage for host
        const newUsedState = !isUsed;
        
        // Update used abilities for the specific player
        const usedAbilitiesKey = `${playerParam}UsedAbilities`;
        const usedAbilities = JSON.parse(localStorage.getItem(usedAbilitiesKey) || '[]');
        
        if (newUsedState) {
          // Add to used abilities
          if (!usedAbilities.includes(ab.text)) {
            usedAbilities.push(ab.text);
          }
        } else {
          // Remove from used abilities
          const filteredAbilities = usedAbilities.filter(ability => ability !== ab.text);
          usedAbilities.length = 0;
          usedAbilities.push(...filteredAbilities);
        }
        
        localStorage.setItem(usedAbilitiesKey, JSON.stringify(usedAbilities));
        
        // Update global used abilities
        const globalUsedAbilities = loadUsedAbilities();
        globalUsedAbilities[ab.text] = newUsedState;
        saveUsedAbilities(globalUsedAbilities);
        
        // Update abilities list
        const current = loadAbilities(key);
        if (current[idx]) {
          current[idx].used = newUsedState;
          saveAbilities(key, current);
        }
        
        // Force immediate update in current page
        setTimeout(() => renderPanels(), 100);
        
        // Force update in player pages by triggering a custom event
        window.dispatchEvent(new CustomEvent('abilityToggled', {
          detail: {
            playerParam: playerParam,
            abilityText: ab.text,
            isUsed: newUsedState
          }
        }));
        
        // Also trigger storage event for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', {
          key: `${playerParam}UsedAbilities`,
          newValue: localStorage.getItem(`${playerParam}UsedAbilities`),
          oldValue: localStorage.getItem(`${playerParam}UsedAbilities`),
          storageArea: localStorage
        }));
        
        // Also try postMessage to all possible windows
        try {
          const message = {
            type: 'ABILITY_TOGGLED',
            playerParam: playerParam,
            abilityText: ab.text,
            isUsed: newUsedState
          };
          
          // Send to parent window
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(message, '*');
          }
          
          // Send to opener window
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage(message, '*');
          }
          
          // Send to all frames
          for (let i = 0; i < window.frames.length; i++) {
            try {
              window.frames[i].postMessage(message, '*');
            } catch (e) {
              // Ignore cross-origin errors
            }
          }
        } catch (e) {
          console.error('Error sending postMessage:', e);
        }
        
        // Show enhanced toast notification
        const action = newUsedState ? "تم تعطيل" : "تم إعادة تفعيل";
        const icon = newUsedState ? "🔴" : "🟢";
        const playerName = fromName;
        
        console.log(`${icon} ${action} القدرة "${ab.text}" للاعب ${playerName}`);
        // showToast disabled - actions removed
        
        // Send notification to player directly
        const notification = {
          type: 'ability_toggle',
          playerParam: playerParam,
          abilityText: ab.text,
          isUsed: newUsedState,
          timestamp: Date.now(),
          fromHost: true
        };
        
        // Store notification with unique key to force change detection
        const notificationKey = `playerNotification_${Date.now()}`;
        localStorage.setItem(notificationKey, JSON.stringify(notification));
        localStorage.setItem('playerNotification', JSON.stringify(notification));
        
        // Also store in a way that player can detect
        const playerNotifications = JSON.parse(localStorage.getItem('allPlayerNotifications') || '[]');
        playerNotifications.push(notification);
        localStorage.setItem('allPlayerNotifications', JSON.stringify(playerNotifications));
        
        // Try BroadcastChannel if available
        try {
          if (window.broadcastChannel) {
            window.broadcastChannel.postMessage(notification);
          }
        } catch (e) {
          console.log('BroadcastChannel not available');
        }
        
        console.log(`📤 تم إرسال إشعار للاعب ${playerName}:`, notification);
      }, isUsed);
      
      // Update button appearance for used abilities
      if (isUsed) {
        btn.style.backgroundColor = "#666";
        btn.style.color = "#999";
      }
      
      // Add unique ID to prevent duplicates
      btn.id = `ability-${playerParam}-${idx}`;
      container.appendChild(btn);
    });
  }

  // Clear existing buttons to prevent duplicates
  const existingTransferBtn = container.querySelector('.transfer-btn');
  const existingAddBtn = container.querySelector('.add-ability-btn');
  if (existingTransferBtn) {
    existingTransferBtn.remove();
  }
  if (existingAddBtn) {
    existingAddBtn.remove();
  }
  
  // Create button container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "8px";
  buttonContainer.style.marginTop = "10px";
  
  // Create transfer button
  const transferBtn=document.createElement("button");
  transferBtn.className="btn transfer-btn";
  transferBtn.style.fontFamily = '"Cairo", sans-serif';
  transferBtn.style.flex = "1";
  transferBtn.textContent="نقل";
  transferBtn.onclick=()=>openTransferModal(key, fromName, toName);
  transferBtn.id = `transfer-${playerParam}`;
  
  // Create add ability button
  const addBtn=document.createElement("button");
  addBtn.className="btn add-ability-btn";
  addBtn.style.fontFamily = '"Cairo", sans-serif';
  addBtn.style.flex = "1";
  addBtn.textContent="إضافة";
  addBtn.onclick=()=>openAddAbilityModal(playerParam);
  addBtn.id = `add-${playerParam}`;
  
  buttonContainer.appendChild(transferBtn);
  buttonContainer.appendChild(addBtn);
  container.appendChild(buttonContainer);
}

function renderPanels(){
  try {
    const player1Container = document.getElementById("player1AbilitiesContainer");
    const player2Container = document.getElementById("player2AbilitiesContainer");
    const player1Title = document.getElementById("player1AbilitiesTitle");
    const player2Title = document.getElementById("player2AbilitiesTitle");
    
    // Update ability titles
    if (player1Title) {
      player1Title.textContent = `قدرات ${player1}`;
    }
    if (player2Title) {
      player2Title.textContent = `قدرات ${player2}`;
    }
    
    // Clear containers before re-rendering to prevent duplicates
    if (player1Container) {
      player1Container.innerHTML = '';
      renderAbilitiesPanel(P1_ABILITIES_KEY, player1Container, player1, player2);
    }
    if (player2Container) {
      player2Container.innerHTML = '';
      renderAbilitiesPanel(P2_ABILITIES_KEY, player2Container, player2, player1);
    }
    
    // ✅ لا نعيد تحميل الملاحظات عند تحديث القدرات - تبقى كما هي
    // updateNotesForRound(); // تم إزالة هذا السطر
    
    renderAbilityRequests();
  } catch(error) {
    console.error("Error rendering ability panels:", error);
  }
}

// Function to reload abilities dynamically
function reloadAbilitiesFromGameSetup() {
  try {
    console.log('Reloading abilities from game setup...');
    
    // First try to load from individual player ability keys (new system)
    const player1AbilitiesKey = 'player1Abilities';
    const player2AbilitiesKey = 'player2Abilities';
    
    let player1Abilities = [];
    let player2Abilities = [];
    
    // Load player 1 abilities
    if (localStorage.getItem(player1AbilitiesKey)) {
      try {
        const abilities = JSON.parse(localStorage.getItem(player1AbilitiesKey));
        if (Array.isArray(abilities)) {
          player1Abilities = abilities.map(ability => ({
            text: typeof ability === 'string' ? ability : ability.text || ability,
            used: false
          }));
          console.log('Loaded player1 abilities from new system:', player1Abilities);
        }
      } catch (e) {
        console.error('Error loading player1 abilities from new system:', e);
      }
    }
    
    // Load player 2 abilities
    if (localStorage.getItem(player2AbilitiesKey)) {
      try {
        const abilities = JSON.parse(localStorage.getItem(player2AbilitiesKey));
        if (Array.isArray(abilities)) {
          player2Abilities = abilities.map(ability => ({
            text: typeof ability === 'string' ? ability : ability.text || ability,
            used: false
          }));
          console.log('Loaded player2 abilities from new system:', player2Abilities);
        }
      } catch (e) {
        console.error('Error loading player2 abilities from new system:', e);
      }
    }
    
    // If we have abilities from new system, use them
    if (player1Abilities.length > 0 || player2Abilities.length > 0) {
      localStorage.setItem(P1_ABILITIES_KEY, JSON.stringify(player1Abilities));
      localStorage.setItem(P2_ABILITIES_KEY, JSON.stringify(player2Abilities));
      
      console.log('Abilities loaded from new system:', {
        player1: player1Abilities,
        player2: player2Abilities
      });
      
      // Re-render panels
      renderPanels();
      return true;
    }
    
    // Fallback: try to load from gameSetupProgress
    const gameSetup = localStorage.getItem('gameSetupProgress');
    if (gameSetup) {
      try {
        const gameData = JSON.parse(gameSetup);
        if (gameData.player1?.abilities && gameData.player2?.abilities) {
          const player1Abilities = gameData.player1.abilities.map(ability => ({
            text: ability,
            used: false
          }));
          const player2Abilities = gameData.player2.abilities.map(ability => ({
            text: ability,
            used: false
          }));
          
          localStorage.setItem(P1_ABILITIES_KEY, JSON.stringify(player1Abilities));
          localStorage.setItem(P2_ABILITIES_KEY, JSON.stringify(player2Abilities));
          
          console.log('Abilities reloaded from gameSetupProgress:', {
            player1: gameData.player1.abilities,
            player2: gameData.player2.abilities
          });
          
          // Re-render panels
          renderPanels();
          return true;
        }
      } catch (e) {
        console.error('Error reloading abilities from gameSetupProgress:', e);
      }
    }
    
    return false;
  } catch(error) {
    console.error("Error reloading abilities:", error);
    return false;
  }
}

// Render ability requests notifications
function renderAbilityRequests(){
  try {
    const requests = JSON.parse(localStorage.getItem('abilityRequests') || '[]');
    const pendingRequests = requests.filter(req => req.status === 'pending');
    
    if (pendingRequests.length === 0) return;
    
    pendingRequests.forEach(request => {
      if (!shownNotifications.has(request.id)) {
        shownNotifications.add(request.id);
        
        console.log(`! ${request.playerName} يطلب استخدام القدرة: «${request.abilityText}»`);
        // showToast disabled - actions removed
      }
    });
    
  } catch(error) {
    console.error("Error rendering ability requests:", error);
  }
}

// Force immediate sync between pages
function forceImmediateSync() {
  window.dispatchEvent(new CustomEvent('forceAbilitySync'));
  window.dispatchEvent(new CustomEvent('abilityUsageChanged'));
  
  setTimeout(() => {
    window.dispatchEvent(new StorageEvent('storage', {
      key: USED_ABILITIES_KEY,
      newValue: localStorage.getItem(USED_ABILITIES_KEY),
      oldValue: localStorage.getItem(USED_ABILITIES_KEY),
      storageArea: localStorage
    }));
  }, 10);
  
  setTimeout(() => {
    window.dispatchEvent(new StorageEvent('storage', {
      key: ABILITY_REQUESTS_KEY,
      newValue: localStorage.getItem(ABILITY_REQUESTS_KEY),
      oldValue: localStorage.getItem(ABILITY_REQUESTS_KEY),
      storageArea: localStorage
    }));
  }, 20);
  
  setTimeout(() => {
    window.dispatchEvent(new StorageEvent('storage', {
      key: P1_ABILITIES_KEY,
      newValue: localStorage.getItem(P1_ABILITIES_KEY),
      oldValue: localStorage.getItem(P1_ABILITIES_KEY),
      storageArea: localStorage
    }));
  }, 30);
  
  setTimeout(() => {
    window.dispatchEvent(new StorageEvent('storage', {
      key: P2_ABILITIES_KEY,
      newValue: localStorage.getItem(P2_ABILITIES_KEY),
      oldValue: localStorage.getItem(P2_ABILITIES_KEY),
      storageArea: localStorage
    }));
  }, 40);
  
  renderPanels();
  setTimeout(() => renderPanels(), 100);
  setTimeout(() => renderPanels(), 200);
}

// Approve ability request
function approveAbilityRequest(requestId){
  try {
    const requests = JSON.parse(localStorage.getItem('abilityRequests') || '[]');
    const request = requests.find(req => req.id === requestId);
    
    if (request) {
      // Update request status
      const updatedRequests = requests.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
      );
      localStorage.setItem('abilityRequests', JSON.stringify(updatedRequests));
      
      // Mark ability as permanently used for the requesting player
      const usedAbilitiesKey = `${request.playerParam}UsedAbilities`;
      const usedAbilities = JSON.parse(localStorage.getItem(usedAbilitiesKey) || '[]');
      if (!usedAbilities.includes(request.abilityText)) {
        usedAbilities.push(request.abilityText);
        localStorage.setItem(usedAbilitiesKey, JSON.stringify(usedAbilities));
      }
      
      // Update abilities only for the requesting player
      const requestingPlayerAbilities = loadAbilities(request.playerParam === 'player1' ? P1_ABILITIES_KEY : P2_ABILITIES_KEY);
      
      let abilityUpdated = false;
      requestingPlayerAbilities.forEach(ability => {
        if (ability.text === request.abilityText) {
          ability.used = true;
          abilityUpdated = true;
        }
      });
      
      if (abilityUpdated) {
        const abilitiesKey = request.playerParam === 'player1' ? P1_ABILITIES_KEY : P2_ABILITIES_KEY;
        saveAbilities(abilitiesKey, requestingPlayerAbilities);
      }
      
      // Also update the player-specific abilities list
      const playerAbilitiesKey = `${request.playerParam}Abilities`;
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
      const globalAbilitiesKey = request.playerParam === 'player1' ? 'P1_ABILITIES_KEY' : 'P2_ABILITIES_KEY';
      const globalAbilities = JSON.parse(localStorage.getItem(globalAbilitiesKey) || '[]');
      globalAbilities.forEach(ability => {
        if (ability.text === request.abilityText) {
          ability.used = true;
        }
      });
      localStorage.setItem(globalAbilitiesKey, JSON.stringify(globalAbilities));
      
      // Trigger storage event for player pages
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'abilityRequests',
        newValue: localStorage.getItem('abilityRequests'),
        oldValue: localStorage.getItem('abilityRequests'),
        storageArea: localStorage
      }));
      
      // Also trigger storage event for used abilities
      window.dispatchEvent(new StorageEvent('storage', {
        key: usedAbilitiesKey,
        newValue: localStorage.getItem(usedAbilitiesKey),
        oldValue: localStorage.getItem(usedAbilitiesKey),
        storageArea: localStorage
      }));
      
      renderPanels();
      setTimeout(() => renderPanels(), 50);
      setTimeout(() => renderPanels(), 100);
      
        console.log(`تمت الموافقة على استخدام ${request.abilityText} من ${request.playerName}`);
      
      shownNotifications.delete(requestId);
      
      console.log(`Approved ability: ${request.abilityText} for ${request.playerName}`);
    }
  } catch(error) {
    console.error("Error approving ability request:", error);
        console.log("حدث خطأ في الموافقة على الطلب");
  }
}

// Reject ability request
function rejectAbilityRequest(requestId){
  try {
    const requests = JSON.parse(localStorage.getItem('abilityRequests') || '[]');
    const request = requests.find(req => req.id === requestId);
    
    if (request) {
      // Update request status
      const updatedRequests = requests.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' } : req
      );
      localStorage.setItem('abilityRequests', JSON.stringify(updatedRequests));
      
      // Remove ability from used abilities for the requesting player
      const usedAbilitiesKey = `${request.playerParam}UsedAbilities`;
      const usedAbilities = JSON.parse(localStorage.getItem(usedAbilitiesKey) || '[]');
      const filteredAbilities = usedAbilities.filter(ability => ability !== request.abilityText);
      localStorage.setItem(usedAbilitiesKey, JSON.stringify(filteredAbilities));
      
      // Update abilities only for the requesting player
      const requestingPlayerAbilities = loadAbilities(request.playerParam === 'player1' ? P1_ABILITIES_KEY : P2_ABILITIES_KEY);
      
      let abilityUpdated = false;
      requestingPlayerAbilities.forEach(ability => {
        if (ability.text === request.abilityText) {
          ability.used = false;
          abilityUpdated = true;
        }
      });
      
      if (abilityUpdated) {
        const abilitiesKey = request.playerParam === 'player1' ? P1_ABILITIES_KEY : P2_ABILITIES_KEY;
        saveAbilities(abilitiesKey, requestingPlayerAbilities);
      }
      
      // Trigger storage event for player pages
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'abilityRequests',
        newValue: localStorage.getItem('abilityRequests'),
        oldValue: localStorage.getItem('abilityRequests'),
        storageArea: localStorage
      }));
      
      renderPanels();
      setTimeout(() => renderPanels(), 50);
      setTimeout(() => renderPanels(), 100);
      
        console.log(`تم رفض استخدام ${request.abilityText} من ${request.playerName}`);
      
      shownNotifications.delete(requestId);
      
      console.log(`Rejected ability: ${request.abilityText} for ${request.playerName}`);
    }
  } catch(error) {
    console.error("Error rejecting ability request:", error);
        console.log("حدث خطأ في رفض الطلب");
  }
}

// Restore ability (make it available again for requesting)
function restoreAbility(abilityText, playerName) {
  try {
    console.log(`Restoring ability: ${abilityText} for ${playerName}`);
    
    // Find the player parameter for this player name
    let playerParam = null;
    if (playerName === player1) {
      playerParam = 'player1';
    } else if (playerName === player2) {
      playerParam = 'player2';
    }
    
    if (playerParam) {
      // Remove from used abilities for the specific player
      const usedAbilitiesKey = `${playerParam}UsedAbilities`;
      const usedAbilities = JSON.parse(localStorage.getItem(usedAbilitiesKey) || '[]');
      const filteredAbilities = usedAbilities.filter(ability => ability !== abilityText);
      localStorage.setItem(usedAbilitiesKey, JSON.stringify(filteredAbilities));
    }
    
    // Update abilities only for the specific player
    if (playerParam) {
      const playerAbilities = loadAbilities(playerParam === 'player1' ? P1_ABILITIES_KEY : P2_ABILITIES_KEY);
      
      let abilityUpdated = false;
      playerAbilities.forEach(ability => {
        if (ability.text === abilityText) {
          ability.used = false;
          abilityUpdated = true;
        }
      });
      
      if (abilityUpdated) {
        const abilitiesKey = playerParam === 'player1' ? P1_ABILITIES_KEY : P2_ABILITIES_KEY;
        saveAbilities(abilitiesKey, playerAbilities);
      }
    }
    
    // Remove any pending requests for this ability
    const requests = JSON.parse(localStorage.getItem('abilityRequests') || '[]');
    const filteredRequests = requests.filter(req => 
      !(req.abilityText === abilityText && req.playerName === playerName)
    );
    localStorage.setItem('abilityRequests', JSON.stringify(filteredRequests));
    
    // Trigger storage event for player pages
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'abilityRequests',
      newValue: localStorage.getItem('abilityRequests'),
      oldValue: localStorage.getItem('abilityRequests'),
      storageArea: localStorage
    }));

    // ✅ إرسال إشعار مباشر للاعبين مثل toggle
    window.dispatchEvent(new CustomEvent('abilityToggled', {
      detail: {
        playerParam: playerParam,
        abilityText: abilityText,
        isUsed: false   // القدرة أصبحت غير مستخدمة (متاحة)
      }
    }));

    // ✅ إرسال postMessage للاعبين
    try {
      const message = {
        type: 'ABILITY_TOGGLED',
        playerParam: playerParam,
        abilityText: abilityText,
        isUsed: false
      };
      
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*');
      }
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(message, '*');
      }
      for (let i = 0; i < window.frames.length; i++) {
        try {
          window.frames[i].postMessage(message, '*');
        } catch (e) {}
      }
    } catch (e) {
      console.error('Error sending postMessage:', e);
    }

    renderPanels();
    setTimeout(() => renderPanels(), 50);
    setTimeout(() => renderPanels(), 100);
    
        console.log(`تم إعادة القدرة ${abilityText} لـ ${playerName}`);
    
    console.log(`Restored ability: ${abilityText} for ${playerName}`);
    return true;
  } catch(error) {
    console.error("Error restoring ability:", error);
        console.log("حدث خطأ في إعادة القدرة");
    return false;
  }
}

// Make functions globally available
window.approveAbilityRequest = approveAbilityRequest;
window.rejectAbilityRequest = rejectAbilityRequest;
window.restoreAbility = restoreAbility;
window.confirmResult = confirmResult;
window.confirmWinner = confirmWinner;
window.changeHealth = changeHealth;
window.saveNotes = saveNotes;
window.clearNotes = clearNotes;
window.showPreviousNotes = showPreviousNotes;
window.confirmTransfer = confirmTransfer;
window.closeTransferModal = closeTransferModal;
window.openTransferModal = openTransferModal;
window.openRestoreModal = openRestoreModal;



/* ---------------------- Transfer modal ---------------------- */
function openTransferModal(fromKey, fromName, toName){
  const list = loadAbilities(fromKey);
  const modal = document.getElementById("transferModal");
  const grid  = document.getElementById("abilityGrid");
  const title = document.getElementById("transferTitle");
  title.textContent = `اختر القدرة المراد نقلها إلى ${toName} (ستُزال منك)`;
  title.style.fontFamily = '"Cairo", sans-serif';

  grid.innerHTML="";
  if (!list.length){
    const p=document.createElement("p");
    p.style.color="#ffed7a"; p.textContent="لا توجد قدرات لنقلها.";
    p.style.fontFamily = '"Cairo", sans-serif';
    grid.appendChild(p);
  } else {
    list.forEach((ab, idx)=>{
      const opt=document.createElement("div");
      opt.className="ability-option";
      opt.style.fontFamily = '"Cairo", sans-serif';
      opt.textContent = ab.text;
      opt.onclick = ()=>{
        const sender = loadAbilities(fromKey);
        const moved  = sender.splice(idx,1)[0];
        saveAbilities(fromKey, sender);

        const toKey = (toName === player1) ? P1_ABILITIES_KEY : P2_ABILITIES_KEY;
        const receiver = loadAbilities(toKey);
        receiver.push({ text:moved.text, used:moved.used });
        saveAbilities(toKey, receiver);

        closeTransferModal();
        renderPanels();
        console.log(`تم نقل «${moved.text}» إلى ${toName}`);
      };
      grid.appendChild(opt);
    });
  }
  modal.classList.add("active");
}
function closeTransferModal(){ document.getElementById("transferModal").classList.remove("active"); }

function confirmTransfer(){
  // This function is called when the transfer modal is confirmed
  // The actual transfer logic is handled in openTransferModal
  closeTransferModal();
}

// Open restore ability modal
function openRestoreModal(key, fromName, usedAbilities){
  const modal = document.getElementById("transferModal");
  const grid  = document.getElementById("abilityGrid");
  const title = document.getElementById("transferTitle");
  title.textContent = `اختر القدرة المراد استعادتها لـ ${fromName}`;
  title.style.fontFamily = '"Cairo", sans-serif';

  grid.innerHTML="";
  if (!usedAbilities.length){
    const p=document.createElement("p");
    p.style.color="#ffed7a"; p.textContent="لا توجد قدرات مستخدمة لاستعادتها.";
    p.style.fontFamily = '"Cairo", sans-serif';
    grid.appendChild(p);
  } else {
    usedAbilities.forEach((ab, idx)=>{
      const opt=document.createElement("div");
      opt.className="ability-option";
      opt.style.fontFamily = '"Cairo", sans-serif';
      opt.textContent = ab.text;
      opt.onclick = ()=>{
        restoreAbility(ab.text, fromName);
        closeTransferModal();
        renderPanels();
        console.log(`تم استعادة «${ab.text}» لـ ${fromName}`);
      };
      grid.appendChild(opt);
    });
  }
  modal.classList.add("active");
}

/* ---------------------- Health controls ---------------------- */
function wireHealth(name, decEl, incEl, valueEl){
  if (!decEl || !incEl || !valueEl) {
    console.warn(`Missing elements for ${name} health controls`);
    return;
  }
  
  const clamp = (n)=>Math.max(0, Math.min(startingHP,n));
  const refresh = ()=>{ 
    valueEl.textContent=String(scores[name]); 
    valueEl.classList.toggle("red", scores[name] <= Math.ceil(startingHP/2)); 
  };

  // Store parent reference before replacing elements
  const parentEl = decEl.parentNode;
  
  // Clear existing listeners
  decEl.replaceWith(decEl.cloneNode(true));
  incEl.replaceWith(incEl.cloneNode(true));
  
  // Get fresh references using the stored parent
  const newDecEl = parentEl ? parentEl.querySelector(".round-btn:last-child") : null;
  const newIncEl = parentEl ? parentEl.querySelector(".round-btn:first-child") : null;
  
  // Add unique IDs to prevent conflicts
  if (newDecEl) newDecEl.id = `dec-${name}`;
  if (newIncEl) newIncEl.id = `inc-${name}`;
  
  if (newDecEl && newIncEl) {
    newDecEl.onclick = ()=>{ 
      console.log(`Decreasing health for ${name}`);
      scores[name]=clamp(scores[name]-1); 
      refresh(); 
      localStorage.setItem("scores", JSON.stringify(scores)); 
    };
    newIncEl.onclick = ()=>{ 
      console.log(`Increasing health for ${name}`);
      scores[name]=clamp(scores[name]+1); 
      refresh(); 
      localStorage.setItem("scores", JSON.stringify(scores)); 
    };
    console.log(`Health buttons wired for ${name}`);
  } else {
    console.warn(`Could not find health buttons for ${name}`);
  }
  
  refresh();
}

/* ---------------------- Round render ---------------------- */
function renderRound(){
  // Reload picks dynamically before rendering
  picks = loadPlayerPicks();
  
  roundTitle.textContent = `الجولة ${round + 1}`;
  renderVs();
  renderPrev();
  
  // ✅ تحميل الملاحظات مرة واحدة فقط عند بداية الجولة
  updateNotesForRound();
  
  renderPanels();

  // Wire health controls with proper event handling
  const player2DecBtn = document.querySelector(".player-column .round-btn:last-child");
  const player2IncBtn = document.querySelector(".player-column .round-btn:first-child");
  const player1DecBtn = document.querySelector(".right-panel .round-btn:last-child");
  const player1IncBtn = document.querySelector(".right-panel .round-btn:first-child");
  
  if (player2DecBtn && player2IncBtn) {
    wireHealth(player2, player2DecBtn, player2IncBtn, document.getElementById("health1"));
  }
  if (player1DecBtn && player1IncBtn) {
    wireHealth(player1, player1DecBtn, player1IncBtn, document.getElementById("health2"));
  }
  
  // Ensure confirm button is properly wired
  const confirmBtn = document.querySelector(".confirm");
  if (confirmBtn) {
    // Remove existing listeners to prevent duplicates
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    const newConfirmBtn = document.querySelector(".confirm");
    newConfirmBtn.onclick = confirmResult;
    newConfirmBtn.id = "confirm-result-btn";
    console.log('Confirm button wired successfully');
  } else {
    console.warn('Confirm button not found');
  }
  
  // Update swap deck buttons state
  updateSwapDeckButtons();
}

function confirmWinner(){
  localStorage.setItem("scores", JSON.stringify(scores));
  round++;
  localStorage.setItem("currentRound", round);

  const over = round >= roundCount || scores[player1] === 0 || scores[player2] === 0;
  if (over){
    localStorage.setItem("scores", JSON.stringify(scores));
    // ✅ لا نمسح ملاحظات الجولات السابقة - تبقى محفوظة لكل لاعب منفصل
    // ✅ لا نمسح الملاحظات نهائياً - تبقى محفوظة للجولات التالية
    localStorage.removeItem(USED_ABILITIES_KEY);
    localStorage.removeItem(ABILITY_REQUESTS_KEY);
    shownNotifications.clear();
    
    // Notify player views that game is over
    localStorage.setItem('gameStatus', 'finished');
    localStorage.setItem('gameUpdate', Date.now().toString());
    
    // Show winner
    const winner = scores[player1] > scores[player2] ? player1 : scores[player2] > scores[player1] ? player2 : "تعادل";
    console.log(`انتهت المعركة! الفائز: ${winner}`);
    
    // Reset for new battle
    localStorage.setItem('currentRound', '0');
    location.href="final-result.html";
  } else {
    // ✅ لا نمسح الملاحظات عند الانتقال للجولة التالية
    localStorage.removeItem(USED_ABILITIES_KEY);
    localStorage.removeItem(ABILITY_REQUESTS_KEY);
    shownNotifications.clear();
    
    // Notify player views of round update BEFORE reload
    console.log('Notifying player views of round update...');
    localStorage.setItem('gameStatus', 'active');
    localStorage.setItem('gameUpdate', Date.now().toString());
    localStorage.setItem('roundUpdate', Date.now().toString());
    
    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new CustomEvent('roundUpdated', {
      detail: { round, scores, player1, player2 }
    }));
    
    // Small delay to allow player views to receive the update
    setTimeout(() => {
      location.reload();
    }, 100);
  }
}

// Initialize game data if missing
function initializeGameData() {
  // First try to load from individual player ability keys (new system)
  const player1AbilitiesKey = 'player1Abilities';
  const player2AbilitiesKey = 'player2Abilities';
  
  let player1Abilities = [];
  let player2Abilities = [];
  
  // Load player 1 abilities
  if (localStorage.getItem(player1AbilitiesKey)) {
    try {
      const abilities = JSON.parse(localStorage.getItem(player1AbilitiesKey));
      if (Array.isArray(abilities)) {
        // Load used abilities for player 1
        const usedAbilities = JSON.parse(localStorage.getItem('player1UsedAbilities') || '[]');
        const usedSet = new Set(usedAbilities);
        
        player1Abilities = abilities.map(ability => {
          const abilityText = typeof ability === 'string' ? ability : ability.text || ability;
          return {
            text: abilityText,
            used: usedSet.has(abilityText) || (typeof ability === 'object' && ability.used === true)
          };
        });
        console.log('Loaded player1 abilities from new system:', player1Abilities);
      }
    } catch (e) {
      console.error('Error loading player1 abilities from new system:', e);
    }
  }
  
  // Load player 2 abilities
  if (localStorage.getItem(player2AbilitiesKey)) {
    try {
      const abilities = JSON.parse(localStorage.getItem(player2AbilitiesKey));
      if (Array.isArray(abilities)) {
        // Load used abilities for player 2
        const usedAbilities = JSON.parse(localStorage.getItem('player2UsedAbilities') || '[]');
        const usedSet = new Set(usedAbilities);
        
        player2Abilities = abilities.map(ability => {
          const abilityText = typeof ability === 'string' ? ability : ability.text || ability;
          return {
            text: abilityText,
            used: usedSet.has(abilityText) || (typeof ability === 'object' && ability.used === true)
          };
        });
        console.log('Loaded player2 abilities from new system:', player2Abilities);
      }
    } catch (e) {
      console.error('Error loading player2 abilities from new system:', e);
    }
  }
  
  // If we have abilities from new system, use them
  if (player1Abilities.length > 0 || player2Abilities.length > 0) {
    localStorage.setItem(P1_ABILITIES_KEY, JSON.stringify(player1Abilities));
    localStorage.setItem(P2_ABILITIES_KEY, JSON.stringify(player2Abilities));
    
    console.log('Abilities loaded from new system:', {
      player1: player1Abilities,
      player2: player2Abilities
    });
  } else {
    // Fallback: try to load from gameSetupProgress
    if (gameSetupProgress.player1?.abilities && gameSetupProgress.player2?.abilities) {
      const player1Abilities = gameSetupProgress.player1.abilities.map(ability => ({
        text: ability,
        used: false
      }));
      const player2Abilities = gameSetupProgress.player2.abilities.map(ability => ({
        text: ability,
        used: false
      }));
      
      localStorage.setItem(P1_ABILITIES_KEY, JSON.stringify(player1Abilities));
      localStorage.setItem(P2_ABILITIES_KEY, JSON.stringify(player2Abilities));
      
      console.log('Loaded abilities from gameSetupProgress:', {
        player1: gameSetupProgress.player1.abilities,
        player2: gameSetupProgress.player2.abilities
      });
    } else {
      // Set empty arrays if still no abilities found
      if (!localStorage.getItem(P1_ABILITIES_KEY)) {
        localStorage.setItem(P1_ABILITIES_KEY, JSON.stringify([]));
      }
      if (!localStorage.getItem(P2_ABILITIES_KEY)) {
        localStorage.setItem(P2_ABILITIES_KEY, JSON.stringify([]));
      }
    }
  }
  
  if (!gameSetupProgress.player1 || !gameSetupProgress.player2) {
    if (!localStorage.getItem("player1") || !localStorage.getItem("player2")) {
      localStorage.setItem("player1", "اكاي");
      localStorage.setItem("player2", "شانكس");
    }
    if (!localStorage.getItem("totalRounds")) {
      localStorage.setItem("totalRounds", "5");
    }
  }
  
  if (!scores[player1]) {
    scores[player1] = startingHP;
  }
  if (!scores[player2]) {
    scores[player2] = startingHP;
  }
  localStorage.setItem("scores", JSON.stringify(scores));
  
  if (!localStorage.getItem(USED_ABILITIES_KEY)) {
    localStorage.setItem(USED_ABILITIES_KEY, JSON.stringify({}));
  }
  
  if (!localStorage.getItem(ABILITY_REQUESTS_KEY)) {
    localStorage.setItem(ABILITY_REQUESTS_KEY, JSON.stringify([]));
  }
}

// Function to refresh card data dynamically
function refreshCardData() {
  console.log('Refreshing card data...');
  picks = loadPlayerPicks();
  console.log('Updated picks:', picks);
  renderRound();
}

// Initialize and render with error handling
try {
  console.log('Initializing game...');
  initializeGameData();
  
  // Load swap deck usage
  loadSwapDeckUsage();
  
  console.log('Swap deck usage loaded:', swapDeckUsed);
  
  // Clear used abilities for new game if current round is 0
  const currentRound = parseInt(localStorage.getItem('currentRound') || '0');
  if (currentRound === 0) {
    clearUsedAbilities();
    // Reset swap deck usage for new game
    swapDeckUsed = { player1: false, player2: false };
    saveSwapDeckUsage();
  }
  
  renderRound();
  
  // Listen for changes in used abilities from other pages
  window.addEventListener('storage', function(e) {
    if (e.key === USED_ABILITIES_KEY) {
      try {
        renderPanels();
      } catch(error) {
        console.error("Error re-rendering panels after storage change:", error);
      }
    }
    
    if (e.key === 'abilityRequests') {
      try {
        renderAbilityRequests();
        renderPanels();
      } catch(error) {
        console.error("Error re-rendering panels after ability requests change:", error);
      }
    }
    
    // Listen for gameSetupProgress changes to reload abilities and picks
    if (e.key === 'gameSetupProgress') {
      try {
        console.log('Game setup progress changed, reloading abilities and picks...');
        reloadAbilitiesFromGameSetup();
        
        // Reload gameSetupProgress and update picks
        gameSetupProgress = JSON.parse(localStorage.getItem("gameSetupProgress") || "{}");
        refreshCardData();
      } catch(error) {
        console.error("Error reloading abilities and picks after game setup change:", error);
      }
    }
    
    // Listen for player abilities changes
    if (e.key && (e.key.includes('Abilities') || e.key.includes('abilities'))) {
      try {
        console.log('Player abilities changed, reloading...');
        reloadAbilitiesFromGameSetup();
      } catch(error) {
        console.error("Error reloading abilities after player abilities change:", error);
      }
    }
    
    // Listen for ability usage changes
    if (e.key && e.key.includes('UsedAbilities')) {
      try {
        console.log('Ability usage changed, re-rendering panels...');
        renderPanels();
      } catch(error) {
        console.error("Error re-rendering panels after ability usage change:", error);
      }
    }
    
    // Listen for player abilities changes
    if (e.key && e.key.includes('Abilities')) {
      try {
        console.log('Player abilities changed, re-rendering panels...');
        renderPanels();
      } catch(error) {
        console.error("Error re-rendering panels after player abilities change:", error);
      }
    }
    
    // Listen for card arrangement changes
    if (e.key && (e.key.includes('CardArrangement') || e.key.includes('ArrangementCompleted'))) {
      try {
        console.log('Card arrangement changed, refreshing card data...');
        refreshCardData();
      } catch(error) {
        console.error("Error reloading picks after card arrangement change:", error);
      }
    }
    
    // Listen for Strategic order changes
    if (e.key && e.key.includes('StrategicOrdered')) {
      try {
        console.log('Strategic order changed, refreshing card data...');
        refreshCardData();
      } catch(error) {
        console.error("Error reloading picks after strategic order change:", error);
      }
    }
  });
  
  
  // Simple storage listener like result.js
  window.addEventListener('storage', function(e) {
    if (e.key && e.key.includes('Abilities')) {
      console.log(`Storage change detected: ${e.key}`);
      renderPanels();
    }
  });
  
  window.addEventListener('focus', function() {
    try {
      // Reload everything on focus
      console.log('Window focused, refreshing all data...');
      reloadAbilitiesFromGameSetup();
      refreshCardData();
      renderPanels();
    } catch(error) {
      console.error("Error re-rendering on focus:", error);
    }
  });
  
  // Listen for visibility changes
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      try {
        console.log('Tab visible, refreshing all data...');
        reloadAbilitiesFromGameSetup();
        refreshCardData();
        renderPanels();
      } catch(error) {
        console.error("Error re-rendering on visibility change:", error);
      }
    }
  });
  
  // Event listeners for ability system
  
  // Start ability request monitoring
  startAbilityRequestMonitoring();
  
  window.addEventListener('beforeunload', function() {
    shownNotifications.clear();
  });
  
} catch (error) {
  console.error("Error initializing game:", error);
    console.log("حدث خطأ في تحميل اللعبة. يرجى إعادة تحميل الصفحة.");
}

/* ---------------------- Confirm Result ---------------------- */
function confirmResult(){
  confirmWinner();
}

/* ---------------------- Health Controls ---------------------- */
function changeHealth(player, delta){
  try {
    const healthElement = document.getElementById(player === 'player1' ? 'health1' : 'health2');
    if (!healthElement) {
      console.error(`Health element not found for ${player}`);
      return;
    }
    
    const currentHealth = parseInt(healthElement.textContent) || 0;
    const newHealth = Math.max(0, Math.min(startingHP, currentHealth + delta));
    healthElement.textContent = newHealth;
    healthElement.classList.toggle("red", newHealth <= Math.ceil(startingHP/2));
    
    scores[player === 'player1' ? player1 : player2] = newHealth;
    localStorage.setItem("scores", JSON.stringify(scores));
  } catch(error) {
    console.error(`Error changing health for ${player}:`, error);
  }
}

/* ---------------------- Notes ---------------------- */
function saveNotes(player, value){
  // ✅ حفظ الملاحظات في localStorage لتكون دائمة
  try {
    const notesKey = `notes:${player}`;
    localStorage.setItem(notesKey, value);
    console.log(`Notes for ${player} saved: ${value}`);
  } catch (error) {
    console.error(`Error saving notes for ${player}:`, error);
  }
}

// مسح ملاحظات اللاعب
function clearNotes(player) {
  try {
    const notesElement = document.getElementById(player === 'player1' ? 'player1Notes' : 'player2Notes');
    
    if (notesElement) {
      notesElement.value = '';
      // مسح من localStorage أيضاً
      const notesKey = `notes:${player}`;
      localStorage.removeItem(notesKey);
      console.log(`تم مسح ملاحظات ${player} من المربع و localStorage`);
    }
  } catch(error) {
    console.error(`Error clearing notes for ${player}:`, error);
  }
}


// عرض ملاحظات الجولات السابقة
function showPreviousNotes(player) {
  try {
    const notesKey = `notes:${player}`;
    const notes = localStorage.getItem(notesKey) || '';
    
    if (notes.trim()) {
      console.log(`ملاحظات ${player}: ${notes}`);
    } else {
      console.log(`لا توجد ملاحظات محفوظة لـ ${player}`);
    }
  } catch(error) {
    console.error(`Error showing previous notes for ${player}:`, error);
  }
}

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
    
    // Re-render panels
    renderPanels();
  } catch (error) {
    console.error('Error clearing used abilities:', error);
  }
}

/* ================== Card Arrangement Commands ================== */
// Command to open player cards page for arrangement (following order.js pattern)
function openPlayerCardsForArrangement(playerParam, playerName) {
  try {
    // Get current game ID
    const gameId = localStorage.getItem('currentGameId') || 'default';
    
    // Generate the player cards URL
    const playerNumber = playerParam === 'player1' ? '1' : '2';
    const baseUrl = window.location.origin + window.location.pathname.replace('card.html', '');
    const playerCardsUrl = `${baseUrl}player-cards.html?gameId=${gameId}&player=${playerNumber}`;
    
    console.log(`Opening player cards for ${playerParam}: ${playerCardsUrl}`);
    
    // Open in new window/tab
    const newWindow = window.open(playerCardsUrl, `player-cards-${playerParam}`, 
      'width=800,height=600,scrollbars=yes,resizable=yes');
    
    if (!newWindow) {
      alert('تم منع النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.');
      return;
    }
    
    // Focus the new window
    newWindow.focus();
    
    // Store the window reference for monitoring
    window.playerCardsWindow = newWindow;
    
    // Start monitoring for arrangement completion
    startMonitoringArrangement(playerParam, playerName);
    
  } catch (error) {
    console.error('Error opening player cards:', error);
    alert('حدث خطأ في فتح صفحة ترتيب البطاقات: ' + error.message);
  }
}

// Monitor arrangement completion
function startMonitoringArrangement(playerParam, playerName) {
  const checkInterval = setInterval(() => {
    try {
      // Check if window is closed
      if (window.playerCardsWindow && window.playerCardsWindow.closed) {
        clearInterval(checkInterval);
        window.playerCardsWindow = null;
        return;
      }
      
      // Check for arrangement completion in localStorage
      const arrangementKey = `${playerParam}ArrangementCompleted`;
      const isCompleted = localStorage.getItem(arrangementKey) === 'true';
      
      if (isCompleted) {
        clearInterval(checkInterval);
        window.playerCardsWindow = null;
        
        // Refresh card data to show the new arrangement
        refreshCardData();
        
        // Show success message
        alert(`تم إكمال ترتيب البطاقات للاعب ${playerName} بنجاح!`);
        
        console.log(`Arrangement completed for ${playerParam}`);
      }
    } catch (error) {
      console.error('Error monitoring arrangement:', error);
    }
  }, 1000); // Check every second
}

// Command to check arrangement status
function checkArrangementStatus(playerParam) {
  const arrangementKey = `${playerParam}ArrangementCompleted`;
  const isCompleted = localStorage.getItem(arrangementKey) === 'true';
  const orderKey = `${playerParam}StrategicOrdered`;
  const order = JSON.parse(localStorage.getItem(orderKey) || '[]');
  
  return {
    isCompleted,
    order,
    playerParam
  };
}

// Command to reset arrangement (for new games)
function resetArrangement(playerParam) {
  try {
    localStorage.removeItem(`${playerParam}ArrangementCompleted`);
    localStorage.removeItem(`${playerParam}StrategicOrdered`);
    localStorage.removeItem(`${playerParam}CardArrangement`);
    
    console.log(`Arrangement reset for ${playerParam}`);
  } catch (error) {
    console.error('Error resetting arrangement:', error);
  }
}

// ================== Ability Request System ================== //
// Handle ability requests from players
function handleAbilityRequests() {
  try {
    const abilityRequests = JSON.parse(localStorage.getItem('abilityRequests') || '[]');
    const pendingRequests = abilityRequests.filter(req => req.status === 'pending');
    
    console.log('Checking ability requests:', { abilityRequests, pendingRequests });
    
    if (pendingRequests.length > 0) {
      console.log('Processing ability requests:', pendingRequests);
      
      // Check existing notifications to avoid duplicates
      const existingNotifications = document.querySelectorAll('[style*="position: fixed"][style*="bottom: 18px"]');
      const existingRequestIds = Array.from(existingNotifications).map(notif => 
        notif.getAttribute('data-request-id')
      ).filter(id => id);
      
      // Show notification for each pending request that doesn't have a notification yet
      pendingRequests.forEach(request => {
        if (!existingRequestIds.includes(request.id) && !lastProcessedRequests.has(request.id)) {
          console.log('Showing notification for request:', request);
          showAbilityRequestNotification(request);
          lastProcessedRequests.add(request.id);
        } else {
          console.log('Notification already exists or was processed for request:', request.id);
        }
      });
    }
  } catch (error) {
    console.error('Error handling ability requests:', error);
  }
}

// Show ability request notification (like result.js)
function showAbilityRequestNotification(request) {
  try {
    const playerName = request.playerName || request.player || 'اللاعب';
    const abilityText = request.abilityText || request.ability || 'القدرة';
    const message = `❗ ${playerName} يطلب استخدام القدرة: «${abilityText}»`;
    
    console.log('Creating notification:', { playerName, abilityText, message });
    
    // Create notification element (same style as result.js)
    const wrap = document.createElement("div");
    wrap.setAttribute('data-request-id', request.id || '');
    wrap.style.cssText = `
      position: fixed; left: 50%; transform: translateX(-50%);
      bottom: 18px; z-index: 3000; background: #222; color: #fff;
      border: 2px solid #f3c21a; border-radius: 12px; padding: 10px 14px;
      box-shadow: 0 8px 18px rgba(0,0,0,.35); font-weight: 700;
      font-family: "Cairo", sans-serif;
    `;
    
    const msg = document.createElement("div");
    msg.textContent = message;
    msg.style.marginBottom = "8px";
    wrap.appendChild(msg);
    
    // Create buttons row
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "8px";
    row.style.justifyContent = "flex-end";
    
    // Use Now button (green)
    const useBtn = document.createElement("button");
    useBtn.textContent = "استخدام الآن";
    useBtn.style.cssText = `
      padding: 6px 10px; border-radius: 10px; border: none;
      background: #16a34a; color: #fff; font-weight: 800; cursor: pointer;
      font-family: "Cairo", sans-serif;
    `;
    useBtn.onclick = () => {
      approveAbilityRequest(request.playerParam || 'player1', abilityText, request.id || '');
      if (wrap.parentNode) {
        wrap.parentNode.removeChild(wrap);
      }
    };
    row.appendChild(useBtn);
    
    // Close button (red)
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "إغلاق";
    closeBtn.style.cssText = `
      padding: 6px 10px; border-radius: 10px; border: none;
      background: #dc2626; color: #fff; font-weight: 800; cursor: pointer;
      font-family: "Cairo", sans-serif;
    `;
    closeBtn.onclick = () => {
      rejectAbilityRequest(request.playerParam || 'player1', abilityText, request.id || '');
      if (wrap.parentNode) {
        wrap.parentNode.removeChild(wrap);
      }
    };
    row.appendChild(closeBtn);
    
    wrap.appendChild(row);
    document.body.appendChild(wrap);
    console.log('Notification added to DOM');
    
    // Store reference for manual removal
    wrap._abilityNotification = true;
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
      if (wrap.parentNode) {
        wrap.parentNode.removeChild(wrap);
        console.log('Notification auto-removed');
      }
    }, 15000);
    
  } catch (error) {
    console.error('Error showing ability request notification:', error);
  }
}

// Approve ability request
function approveAbilityRequest(player, ability, requestId = null) {
  try {
    // Add to used abilities
    const usedAbilitiesKey = `${player}UsedAbilities`;
    const usedAbilities = JSON.parse(localStorage.getItem(usedAbilitiesKey) || '[]');
    usedAbilities.push(ability);
    localStorage.setItem(usedAbilitiesKey, JSON.stringify(usedAbilities));
    
    // Mark request as approved (by requestId if available, otherwise by player+ability)
    const abilityRequests = JSON.parse(localStorage.getItem('abilityRequests') || '[]');
    let requestIndex = -1;
    
    if (requestId) {
      requestIndex = abilityRequests.findIndex(req => req.id === requestId);
    } else {
      requestIndex = abilityRequests.findIndex(req => 
        req.player === player && req.ability === ability && req.status === 'pending'
      );
    }
    
    if (requestIndex !== -1) {
      abilityRequests[requestIndex].status = 'approved';
      localStorage.setItem('abilityRequests', JSON.stringify(abilityRequests));
      console.log('Request marked as approved:', abilityRequests[requestIndex]);
    }
    
    // Send approval to server
    if (requestId) {
      socket.emit("approveAbilityRequest", { gameID, requestId });
    }
    
    // Re-render panels
    renderPanels();
    
    // Remove all ability notifications
    removeAllAbilityNotifications();
    
    // Show success message (disabled)
    const playerName = player === 'player1' ? player1 : player2;
    console.log(`تم الموافقة على استخدام "${ability}" من ${playerName}`);
    
    console.log(`Ability request approved: ${player} - ${ability}`);
    
  } catch (error) {
    console.error('Error approving ability request:', error);
  }
}

// Reject ability request
function rejectAbilityRequest(player, ability, requestId = null) {
  try {
    // Mark request as rejected (by requestId if available, otherwise by player+ability)
    const abilityRequests = JSON.parse(localStorage.getItem('abilityRequests') || '[]');
    let requestIndex = -1;
    
    if (requestId) {
      requestIndex = abilityRequests.findIndex(req => req.id === requestId);
    } else {
      requestIndex = abilityRequests.findIndex(req => 
        req.player === player && req.ability === ability && req.status === 'pending'
      );
    }
    
    if (requestIndex !== -1) {
      abilityRequests[requestIndex].status = 'rejected';
      localStorage.setItem('abilityRequests', JSON.stringify(abilityRequests));
      console.log('Request marked as rejected:', abilityRequests[requestIndex]);
    }
    
    // Send rejection to server
    if (requestId) {
      socket.emit("rejectAbilityRequest", { gameID, requestId });
    }
    
    // Remove all ability notifications
    removeAllAbilityNotifications();
    
    // Show rejection message (disabled)
    const playerName = player === 'player1' ? player1 : player2;
    console.log(`تم رفض استخدام "${ability}" من ${playerName}`);
    
    console.log(`Ability request rejected: ${player} - ${ability}`);
    
  } catch (error) {
    console.error('Error rejecting ability request:', error);
  }
}

// Remove all ability request notifications
function removeAllAbilityNotifications() {
  try {
    // Find all notifications by their unique styling and custom property
    const notifications = document.querySelectorAll('[style*="position: fixed"][style*="bottom: 18px"]');
    notifications.forEach(notification => {
      if (notification._abilityNotification && notification.parentNode) {
        notification.parentNode.removeChild(notification);
        console.log('Removed ability notification');
      }
    });
  } catch (error) {
    console.error('Error removing notifications:', error);
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  console.log('🍞 showToast called:', message, type);
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    position:fixed; left:50%; transform:translateX(-50%);
    bottom:18px; z-index:3000; background:#222; color:#fff;
    border:2px solid #ffffff; border-radius:12px; padding:10px 14px;
    box-shadow:0 8px 18px rgba(0,0,0,.35); font-weight:700;
    font-family:"Cairo",sans-serif;
  `;
  
  const msg = document.createElement("div");
  
  // Check if message starts with "!" and style it red
  if (message.startsWith("! ")) {
    const icon = document.createElement("span");
    icon.textContent = "!";
    icon.style.color = "#dc2626"; // Red color
    icon.style.fontWeight = "bold";
    icon.style.fontSize = "18px";
    
    const text = document.createElement("span");
    text.textContent = message.substring(2); // Remove "! " from the beginning
    
    msg.appendChild(icon);
    msg.appendChild(text);
  } else {
    msg.textContent = message;
  }
  
  wrap.appendChild(msg);
  document.body.appendChild(wrap);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (wrap.parentNode) {
      wrap.parentNode.removeChild(wrap);
    }
  }, 3000);
  
  console.log('🍞 Toast notification created and added to DOM');
}

// Initialize BroadcastChannel if available
try {
  if (typeof BroadcastChannel !== 'undefined') {
    window.broadcastChannel = new BroadcastChannel('ability-updates');
  }
} catch (e) {
  console.log('BroadcastChannel not supported');
}

// Socket.IO initialization for host
const socket = io();
const gameID = 'default-game';

console.log('Host socket initialized:', socket);
socket.emit("joinGame", { gameID, role: "host" });
console.log('Host joined game:', gameID);

// Handle ability requests from players
socket.on("requestUseAbility", ({ gameID: g, playerName, abilityText, requestId }) => {
  console.log('Host received ability request:', { g, gameID, playerName, abilityText, requestId });
  
  if (g && g !== gameID) {
    console.log('Game ID mismatch, ignoring request');
    return;
  }
  
  console.log('Processing ability request:', { playerName, abilityText, requestId });
  
  // Show notification to host
  showAbilityRequestNotification({
    player: playerName,
    ability: abilityText,
    requestId: requestId
  });
});

// Start ability request monitoring
let lastProcessedRequests = new Set();
function startAbilityRequestMonitoring() {
  // Check for ability requests every 2 seconds
  setInterval(() => {
    handleAbilityRequests();
  }, 2000);
  
  // Also listen for storage events
  window.addEventListener('storage', function(e) {
    if (e.key === 'abilityRequests') {
      console.log('Storage event received for abilityRequests');
      handleAbilityRequests();
    }
  });
}

// Make commands available globally
window.openPlayerCardsForArrangement = openPlayerCardsForArrangement;
window.checkArrangementStatus = checkArrangementStatus;
window.resetArrangement = resetArrangement;
window.approveAbilityRequest = approveAbilityRequest;
window.rejectAbilityRequest = rejectAbilityRequest;
window.showToast = showToast;