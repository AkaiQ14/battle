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

// Store fixed swap cards for each player (generated once per game)
let fixedSwapCards = {
  player1: null,
  player2: null
};

// Store confirmed swap cards for each player (separate for each player)
let confirmedSwapCards = {
  player1: null,
  player2: null
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

// Load fixed swap cards from localStorage
function loadFixedSwapCards() {
  try {
    const saved = localStorage.getItem('fixedSwapCards');
    if (saved) {
      fixedSwapCards = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading fixed swap cards:', error);
  }
}

// Save fixed swap cards to localStorage
function saveFixedSwapCards() {
  try {
    localStorage.setItem('fixedSwapCards', JSON.stringify(fixedSwapCards));
  } catch (error) {
    console.error('Error saving fixed swap cards:', error);
  }
}

// Load confirmed swap cards from localStorage
function loadConfirmedSwapCards() {
  try {
    const saved = localStorage.getItem('confirmedSwapCards');
    if (saved) {
      confirmedSwapCards = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading confirmed swap cards:', error);
  }
}

// Save confirmed swap cards to localStorage
function saveConfirmedSwapCards() {
  try {
    localStorage.setItem('confirmedSwapCards', JSON.stringify(confirmedSwapCards));
  } catch (error) {
    console.error('Error saving confirmed swap cards:', error);
  }
}

// Get all available cards from the images directory
function getAllAvailableCards() {
  const allCards = [
    "images/ShanksCard.webm", "images/Akai.webm", "images/madara.webm", "images/Nana-card.png", "images/Vengeance.png",
    "images/Crocodile.png", "images/MeiMei-card.png", "images/Elizabeth.png", "images/ace.png", "images/Adult-gon-card.webp",
    "images/aizen.webm", "images/Aizetsu-card.webp", "images/Akutagawa-card.png", "images/alex20armstrong.webp", "images/AllForOneCard.webm",
    "images/Alluka-card.png", "images/Android18-card.png", "images/ArmorTitan-card.webp", "images/Arthur-card.png", "images/Asui-card.png",
    "images/Atsuya-card.png", "images/AyanokojiCard.webm", "images/Ban-card.png", "images/Bardooock.png", "images/bartolomeo-card.png",
    "images/BeastKing-card.png", "images/BigM.webp", "images/Bisky-card.png", "images/brook.png", "images/Btakuya-card.png",
    "images/caesar-card.png", "images/cardo20ppsd.webp", "images/CartTitan-card.png", "images/cavendish-card.png", "images/Charllotte-card.png",
    "images/Choi-jong-in-.webp", "images/Chopper-card.png", "images/ColossialTitan-card.png", "images/Dabi-card.png", "images/Danteee.png",
    "images/dazai-card.png", "images/DiamondJozu.webp", "images/DragonBB-67-card.png", "images/edward elric.png", "images/Elfaria Albis.png",
    "images/Endeavor.png", "images/ErenCard.webm", "images/esdeath.webp", "images/Eso-card.png", "images/FemaleTitan-card.webp",
    "images/franklin_card.png", "images/Franky-card.png", "images/Frierennnnn.png", "images/Friezaaa.webp", "images/fubuki.webp",
    "images/Fuegoleonn .png", "images/Gadjah.webp", "images/GaiMou-card.png", "images/Galand-card.png", "images/Ganju-card.png",
    "images/Genthru-card.png", "images/geten.webp", "images/Geto-card.png", "images/ghiaccio.png", "images/Gilthunder.png",
    "images/Gin-freecss-card.png", "images/gloxinia.png", "images/Go-Gunhee-card.webm", "images/Gogeta.webm", "images/GojoCard.webm",
    "images/Goku UI.webm", "images/Gordon-card.png", "images/Hachigen-card.png", "images/HakuKi-card.webp", "images/Hantengu-card.png",
    "images/Haruta jjk.png", "images/Haschwalth-card.png", "images/Hawk-card.png", "images/Hawks.webm", "images/hinata.png",
    "images/Hisagi-card.png", "images/Ichibe-card.png", "images/Igris-card.webp", "images/ino.png", "images/Inosuke-card.png",
    "images/Inumaki-card.png", "images/Ippo-card.png", "images/Iron-card.png", "images/Isaac mcdougal.png", "images/Ishida-card.webp",
    "images/Itadori-card.png", "images/Itchigo-card .png", "images/Jack-card.png", "images/Jaw-card.webp", "images/Jirobo.webp",
    "images/Johan-card.png", "images/joker.webm", "images/Jozi jjk.png", "images/judarr.webp", "images/jugo.png",
    "images/julius wistoria.png", "images/Kaguraaaa.png", "images/Kaito-card .png", "images/Kalluto-card.png", "images/Karaku-card.png",
    "images/KeiSha-card.png", "images/kenjaku-card.png", "images/Kenzo-card.png", "images/kimimaro.png", "images/Kingkaiii.png",
    "images/Kirach.png", "images/KiSui-card.png", "images/Knov-card.png", "images/konan.png", "images/konohamaru.webp",
    "images/kota izumi.png", "images/Krilin-card.webp", "images/KudoShinichi-card.png", "images/Kukoshibo-card.png", "images/Kuma-card.png",
    "images/Kurapika-card.png", "images/kurenai.png", "images/Kurogiri-card.png", "images/Kyoga-card.png", "images/Langriiss.webp",
    "images/law.webm", "images/laxus.png", "images/Lemillion-card.png", "images/Lille-baroo-card.png", "images/Lily-card.png",
    "images/Lucci-card.png", "images/Luck.png", "images/LuffyGear5Card.webm", "images/lumiere silvamillion.png", "images/lyon vastia.png",
    "images/obito.webm", "images/mahito-card.png", "images/Mahoraga.png", "images/Mai-card.png", "images/Maki zenen.png",
    "images/Makio-card.png", "images/mansherry.png", "images/Masamichi-card.png", "images/Matsumoto-card.webp", "images/Mayuri-card.webp",
    "images/MeiMei-card.png", "images/Meleoron-card.png", "images/Merlin-card.webp", "images/MeruemCard.webm", "images/MetalBat-card.png",
    "images/Mezo-card.webp", "images/Min-Byung-Gyu-card.png", "images/Mina-card.png", "images/minato.png", "images/Miruku bnha.png",
    "images/Momo-hinamori-card.webp", "images/MomoYaorozu-card.webp", "images/Monspeet-card.png", "images/MouBu-card.png", "images/MouGou-card.png",
    "images/Nachttt.webp", "images/Nami.webp", "images/Nana-card.png", "images/nanami-card.png", "images/naobito-card.webp",
    "images/Nejire-card.png", "images/NietroCard.webm", "images/Noelll.png", "images/Oden-card.png", "images/Okabe-card.png",
    "images/Orihime-card.png", "images/Overhaul-card.png", "images/Panda-card.webp", "images/Paragusss.png", "images/Pariston-card.png",
    "images/Picollooo.png", "images/pizarro.webp", "images/poseidon.png", "images/Queen-card.webp", "images/Raditzz.png",
    "images/RaiDo%20kingdom.webp", "images/RaiDokingdom.webp", "images/Renpa-card.png", "images/Rhyaa.png", "images/Rika-card.png",
    "images/rin.png", "images/Rojuro-card.png", "images/Roy Mustang.png", "images/Runge-card.png", "images/Runge-card.webp",
    "images/sai.png", "images/SakamotoCard.webm", "images/Senjumaru-card.png", "images/Senritsu-card.webp", "images/ShanksCard.webm",
    "images/shikamaru.webm", "images/Shin-card.png", "images/Shinji-card.webp", "images/shino.png", "images/Shinobu-card.png",
    "images/Shinpei-card.webp", "images/Shizuku-card.png", "images/ShouBunKun-card.png", "images/ShouHeiKun-card .png", "images/silver%20fullbuster.webp",
    "images/SilverCard.webm", "images/silverfullbuster.webp", "images/Stain-card.png", "images/Stark-card.png", "images/sting eucliffe.png",
    "images/suzuno.png", "images/takuma-card.webp", "images/Tank-card.png", "images/Teach-card.png", "images/Tenma-card.png",
    "images/tenten.webp", "images/Tier Harribel.png", "images/tobirama.png", "images/Todoroki.png", "images/Tosen-card.webp",
    "images/UmibozoCard.webm", "images/Ur.png", "images/Uvogin-card.png", "images/VanAugur-card.webp", "images/Vegapunk-crad.webp",
    "images/Vegetto.webm", "images/Vengeance.png", "images/Videl-card.webp", "images/Vista-card.png", "images/WarHammerTitan-card.png",
    "images/whitebeard.webm", "images/Yoo-Jinho-card.png", "images/Yoruichi-card.webp", "images/YujiroHanma-card.png", "images/Yusaku.png",
    "images/Zagred-card.png", "images/Zamasuuu.webm", "images/zaratras.png", "images/Zeno kingdom.png", "images/Zeo Thorzeus.png",
    "images/zetsu.png", "images/Zohakuten.png"
  ];
  
  return allCards;
}

// Generate 3 random cards for swap deck (excluding player's current cards)
function generateSwapCards(playerParam) {
  // Check if we already have fixed cards for this player
  if (fixedSwapCards[playerParam]) {
    return fixedSwapCards[playerParam];
  }
  
  const allCards = getAllAvailableCards();
  
  // Get player picks from localStorage
  const playerPicksKey = playerParam === 'player1' ? 'player1StrategicPicks' : 'player2StrategicPicks';
  const playerCards = JSON.parse(localStorage.getItem(playerPicksKey) || '[]');
  
  // Filter out cards that the player already has
  const availableCards = allCards.filter(card => !playerCards.includes(card));
  
  // Shuffle and pick 3 random cards
  const shuffled = availableCards.sort(() => 0.5 - Math.random());
  const selectedCards = shuffled.slice(0, 3);
  
  // Store the fixed cards for this player
  fixedSwapCards[playerParam] = selectedCards;
  saveFixedSwapCards();
  
  return selectedCards;
}


// Make functions globally available immediately
window.openSwapDeckModal = function(playerParam) {
  console.log('🎯 openSwapDeckModal called with:', playerParam);
  
  // Get player names from localStorage
  const player1Name = localStorage.getItem('player1') || 'اللاعب الأول';
  const player2Name = localStorage.getItem('player2') || 'اللاعب الثاني';
  const playerName = playerParam === 'player1' ? player1Name : player2Name;
  
  console.log('Player names:', { player1Name, player2Name, playerName });
  
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
  
  // Update title
  title.textContent = `دكة البدلاء - ${playerName}`;
  
  // Show current card (the card that will be replaced)
  // Get current round
  const currentRound = parseInt(localStorage.getItem('currentRound') || '0');
  
  // Try multiple sources for player picks
  let currentCardSrc = null;
  
  // Try StrategicPicks first
  const strategicPicksKey = playerParam === 'player1' ? 'player1StrategicPicks' : 'player2StrategicPicks';
  const strategicPicks = JSON.parse(localStorage.getItem(strategicPicksKey) || '[]');
  if (strategicPicks[currentRound]) {
    currentCardSrc = strategicPicks[currentRound];
  }
  
  // Try StrategicOrdered if StrategicPicks is empty
  let strategicOrderedData = [];
  if (!currentCardSrc) {
    const strategicOrderedKey = playerParam === 'player1' ? 'player1StrategicOrdered' : 'player2StrategicOrdered';
    strategicOrderedData = JSON.parse(localStorage.getItem(strategicOrderedKey) || '[]');
    if (strategicOrderedData[currentRound]) {
      currentCardSrc = strategicOrderedData[currentRound];
    }
  }
  
  // Try gameCardSelection if still no card
  let playerCardsKey = '';
  let gameCardSelection = {};
  if (!currentCardSrc) {
    gameCardSelection = JSON.parse(localStorage.getItem('gameCardSelection') || '{}');
    playerCardsKey = playerParam === 'player1' ? 'player1Cards' : 'player2Cards';
    if (gameCardSelection[playerCardsKey] && gameCardSelection[playerCardsKey][currentRound]) {
      currentCardSrc = gameCardSelection[playerCardsKey][currentRound];
    }
  }
  
  // Try all localStorage keys that might contain card data
  if (!currentCardSrc) {
    const allKeys = Object.keys(localStorage);
    const cardKeys = allKeys.filter(key => 
      key.includes('player') && 
      (key.includes('Picks') || key.includes('Cards') || key.includes('Ordered'))
    );
    console.log('Available card keys in localStorage:', cardKeys);
    
    // Try each key
    for (const key of cardKeys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(data) && data[currentRound]) {
          console.log(`Found card in ${key}:`, data[currentRound]);
          currentCardSrc = data[currentRound];
          break;
        }
      } catch (e) {
        console.log(`Error parsing ${key}:`, e);
      }
    }
  }
  
  // Try picks object if still no card
  if (!currentCardSrc && typeof picks !== 'undefined') {
    const playerName = playerParam === 'player1' ? player1 : player2;
    if (picks[playerName] && picks[playerName][currentRound]) {
      currentCardSrc = picks[playerName][currentRound];
    }
  }
  
  // Debug: Log all available data
  console.log('Debug info:', {
    playerParam,
    currentRound,
    strategicPicks,
    strategicOrderedData,
    gameCardSelection,
    picks: typeof picks !== 'undefined' ? picks : 'undefined',
    player1: typeof player1 !== 'undefined' ? player1 : 'undefined',
    player2: typeof player2 !== 'undefined' ? player2 : 'undefined'
  });
  
  console.log('Current card search results:', {
    playerParam,
    currentRound,
    strategicPicks: strategicPicks[currentRound],
    strategicOrdered: strategicOrderedData[currentRound],
    gameCardSelection: gameCardSelection[playerCardsKey]?.[currentRound],
    finalCardSrc: currentCardSrc
  });
  
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
  
  // Check if there's a confirmed card for this player
  const confirmedCard = confirmedSwapCards[playerParam];
  
  // If there's a confirmed card, disable confirm button
  if (confirmedCard) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = "تم التأكيد";
  }
  
  swapCards.forEach((cardSrc, index) => {
    const cardOption = document.createElement("div");
    const isConfirmed = confirmedCard && confirmedCard.cardSrc === cardSrc;
    
    if (isConfirmed) {
      cardOption.className = "swap-card-option confirmed";
  // Show the confirmed card image
  const media = createMedia(cardSrc, "swap-card-media");
  if (media) {
    media.style.width = '100%';
    media.style.height = '120px';
    media.style.borderRadius = '12px';
    media.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    media.style.objectFit = 'contain';
    media.style.display = 'block';
    media.style.border = '2px solid #ffffff';
    cardOption.appendChild(media);
  }
    } else {
      cardOption.className = "swap-card-option number-only";
      // Add card number only
      const cardNumber = document.createElement("div");
      cardNumber.className = "swap-card-number";
      cardNumber.textContent = `${index + 1}`;
      cardOption.appendChild(cardNumber);
    }
    
    cardOption.dataset.cardSrc = cardSrc;
    cardOption.dataset.cardIndex = index;
    
    cardOption.onclick = () => {
      // Check if a card is already selected and confirmed
      const alreadySelected = swapCardsGrid.querySelector('.swap-card-option.confirmed');
      if (alreadySelected) {
        showToast("! تم اختيار البطاقة بالفعل", 'warning');
        return;
      }
      
      // Remove previous selection
      swapCardsGrid.querySelectorAll('.swap-card-option').forEach(opt => opt.classList.remove('selected'));
      
      // Select current card
      cardOption.classList.add('selected');
      
      // Enable confirm button
      confirmBtn.disabled = false;
      confirmBtn.style.pointerEvents = 'auto';
      confirmBtn.style.opacity = '1';
      
      // Card selected successfully
    };
    
    swapCardsGrid.appendChild(cardOption);
  });
  
  // Reset confirm button only if no confirmed card
  if (!confirmedCard) {
    confirmBtn.disabled = true;
  }
  
  // Store current player for confirm action
  modal.dataset.playerParam = playerParam;
  
  modal.classList.add("active");
  console.log('🎉 Modal opened successfully!');
};

window.closeSwapDeckModal = function() {
  const modal = document.getElementById("swapDeckModal");
  if (modal) {
    modal.classList.remove("active");
  }
};

window.confirmSwap = function() {
  console.log('🎯 confirmSwap called');
  
  try {
    // Get modal and check if it exists
    const modal = document.getElementById("swapDeckModal");
    if (!modal) {
      throw new Error('النافذة المنبثقة غير موجودة');
    }
    
    // Get player parameter
    const playerParam = modal.dataset.playerParam;
    if (!playerParam) {
      throw new Error('معامل اللاعب غير موجود');
    }
    
    // Get player names from localStorage
    const player1Name = localStorage.getItem('player1') || 'اللاعب الأول';
    const player2Name = localStorage.getItem('player2') || 'اللاعب الثاني';
    const playerName = playerParam === 'player1' ? player1Name : player2Name;
    
    console.log('Player info:', { playerParam, playerName });
    
    // Get selected card
    const selectedCard = modal.querySelector('.swap-card-option.selected');
    if (!selectedCard) {
      throw new Error('يرجى اختيار بطاقة أولاً');
    }
    
    // Get card source from selected card data
    const newCardSrc = selectedCard.dataset.cardSrc;
    if (!newCardSrc) {
      throw new Error('مصدر البطاقة غير موجود');
    }
    
    console.log('Selected card source:', newCardSrc);
    
    // Show the card image first
    selectedCard.classList.add('confirmed');
    selectedCard.classList.remove('number-only');
    
    // Hide number and show image
    const cardNumber = selectedCard.querySelector('.swap-card-number');
    if (cardNumber) {
      cardNumber.style.display = 'none';
    }
    
    // Clear existing media and create new one
    const existingMedia = selectedCard.querySelector('.swap-card-media');
    if (existingMedia) {
      existingMedia.remove();
    }
    
    // Create and show media element with proper styling
    const media = createMedia(newCardSrc, "swap-card-media");
    if (media) {
      media.style.width = '100%';
      media.style.height = '120px';
      media.style.borderRadius = '12px';
      media.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
      media.style.objectFit = 'contain';
      media.style.display = 'block';
      media.style.border = '2px solid #ffffff';
      selectedCard.appendChild(media);
    }
    
    // Save confirmed card for this player
    confirmedSwapCards[playerParam] = {
      cardSrc: newCardSrc,
      cardIndex: selectedCard.dataset.cardIndex
    };
    saveConfirmedSwapCards();
    
    // Disable all other cards
    const swapCardsGrid = document.getElementById("swapCardsGrid");
    if (swapCardsGrid) {
      swapCardsGrid.querySelectorAll('.swap-card-option:not(.confirmed)').forEach(card => {
        card.style.opacity = '0.5';
        card.style.pointerEvents = 'none';
      });
    }
    
    // Check if player has selected cards first
    const playerPicksKey = playerParam === 'player1' ? 'player1StrategicPicks' : 'player2StrategicPicks';
    let playerPicks = JSON.parse(localStorage.getItem(playerPicksKey) || '[]');
    
    console.log('Player picks:', { playerPicksKey, playerPicks, length: playerPicks ? playerPicks.length : 'undefined' });
    
    if (!playerPicks || playerPicks.length === 0) {
      // Create test data if no picks exist
      console.log('No player picks found, creating test data...');
      const testCards = [
        'images/ShanksCard.webm',
        'images/Akai.webm', 
        'images/madara.webm',
        'images/Nana-card.png',
        'images/ace.png'
      ];
      playerPicks = [...testCards];
      localStorage.setItem(playerPicksKey, JSON.stringify(playerPicks));
      console.log('Test data created:', playerPicks);
    }
    
    // Check current round
    let currentRound = parseInt(localStorage.getItem('currentRound') || '0');
    console.log('Current round:', currentRound);
    
    // Ensure current round is valid
    if (currentRound >= playerPicks.length) {
      currentRound = 0; // Reset to first round
      localStorage.setItem('currentRound', '0');
      console.log('Reset current round to 0');
    }
    
    // Check if card exists for current round
    if (!playerPicks[currentRound]) {
      // Create a default card if none exists
      playerPicks = [...playerPicks];
      playerPicks[currentRound] = 'images/ShanksCard.webm';
      localStorage.setItem(playerPicksKey, JSON.stringify(playerPicks));
      console.log('Created default card for round:', currentRound);
    }
    
    // Perform the swap
    console.log('Performing swap...');
    
    // Get old card
    const oldCardSrc = playerPicks[currentRound];
    console.log('Old card:', oldCardSrc);
    console.log('New card:', newCardSrc);
    console.log('Current round:', currentRound);
    console.log('Player picks before swap:', playerPicks);
    
    // Update the card
    playerPicks = [...playerPicks];
    playerPicks[currentRound] = newCardSrc;
    console.log('New card set:', newCardSrc);
    console.log('Player picks after swap:', playerPicks);
    
    // Save updated picks to localStorage
    localStorage.setItem(playerPicksKey, JSON.stringify(playerPicks));
    console.log('StrategicPicks updated:', playerPicks);
    
    // Update StrategicOrdered if it exists
    const strategicOrderedKey = `${playerParam}StrategicOrdered`;
    let strategicOrdered = JSON.parse(localStorage.getItem(strategicOrderedKey) || '[]');
    if (Array.isArray(strategicOrdered)) {
      strategicOrdered = [...strategicOrdered];
      strategicOrdered[currentRound] = newCardSrc;
      localStorage.setItem(strategicOrderedKey, JSON.stringify(strategicOrdered));
      console.log('StrategicOrdered updated:', strategicOrdered);
    }
    
    // Update gameCardSelection if it exists
    let gameCardSelection = JSON.parse(localStorage.getItem('gameCardSelection') || '{}');
    if (!gameCardSelection[`${playerParam}Cards`]) {
      gameCardSelection[`${playerParam}Cards`] = [];
    }
    gameCardSelection = {...gameCardSelection};
    gameCardSelection[`${playerParam}Cards`] = [...gameCardSelection[`${playerParam}Cards`]];
    gameCardSelection[`${playerParam}Cards`][currentRound] = newCardSrc;
    localStorage.setItem('gameCardSelection', JSON.stringify(gameCardSelection));
    console.log('gameCardSelection updated:', gameCardSelection);
    
    // Mark swap deck as used
    swapDeckUsed[playerParam] = true;
    saveSwapDeckUsage();
    console.log('Swap deck marked as used for:', playerParam);
    
    // Disable swap deck button
    const swapBtn = document.getElementById(`swapDeckBtn${playerParam === 'player1' ? '1' : '2'}`);
    if (swapBtn) {
      swapBtn.classList.add('disabled');
      swapBtn.disabled = true;
      swapBtn.textContent = 'مستخدمة';
      console.log('Swap button disabled for:', playerParam);
    }
    
    // Refresh the display immediately
    console.log('Refreshing display...');
    if (typeof renderVs === 'function') {
      renderVs();
      console.log('Display refreshed successfully');
    } else {
      console.log('renderVs function not found, skipping display refresh');
    }
    
    // Force immediate UI update
    setTimeout(() => {
      if (typeof renderVs === 'function') {
        renderVs();
        console.log('Display refreshed again for immediate update');
      }
      // Update swap deck buttons after UI refresh
      updateSwapDeckButtons();
    }, 100);
    
    // Close modal
    console.log('Closing modal...');
    closeSwapDeckModal();
    
    // Final UI update
    setTimeout(() => {
      updateSwapDeckButtons();
      console.log('Final swap deck buttons update completed');
    }, 200);
    
    console.log('Swap completed successfully!');
    
  } catch (error) {
    console.error('Error in confirmSwap:', error);
    alert('خطأ: ' + error.message);
  }
};

// Functions are now available globally


// performSwap function is now integrated into confirmSwap

// Update swap deck buttons state
function updateSwapDeckButtons() {
  console.log('Updating swap deck buttons...');
  console.log('Swap deck used state:', swapDeckUsed);
  
  const swapBtn1 = document.getElementById('swapDeckBtn1');
  const swapBtn2 = document.getElementById('swapDeckBtn2');
  
  if (swapBtn1) {
    if (swapDeckUsed.player1) {
      swapBtn1.classList.add('disabled');
      swapBtn1.disabled = true;
      swapBtn1.textContent = 'مستخدمة';
      console.log('Player 1 swap button disabled');
    } else {
      swapBtn1.classList.remove('disabled');
      swapBtn1.disabled = false;
      swapBtn1.textContent = 'دكة البدلاء';
      console.log('Player 1 swap button enabled');
    }
  }
  
  if (swapBtn2) {
    if (swapDeckUsed.player2) {
      swapBtn2.classList.add('disabled');
      swapBtn2.disabled = true;
      swapBtn2.textContent = 'مستخدمة';
      console.log('Player 2 swap button disabled');
    } else {
      swapBtn2.classList.remove('disabled');
      swapBtn2.disabled = false;
      swapBtn2.textContent = 'دكة البدلاء';
      console.log('Player 2 swap button enabled');
    }
  }
}

// Make swap deck functions globally available immediately
window.openSwapDeckModal = openSwapDeckModal;
window.closeSwapDeckModal = closeSwapDeckModal;
window.confirmSwap = confirmSwap;

// Test if functions are available
console.log('Global functions test:', {
  openSwapDeckModal: typeof window.openSwapDeckModal,
  closeSwapDeckModal: typeof window.closeSwapDeckModal,
  confirmSwap: typeof window.confirmSwap
});

// Test confirmSwap function
window.testConfirmSwap = function() {
  console.log('🧪 Testing confirmSwap function...');
  if (typeof window.confirmSwap === 'function') {
    console.log('✅ confirmSwap function is available');
    return true;
  } else {
    console.error('❌ confirmSwap function is NOT available');
    return false;
  }
};

// Test localStorage data
window.testLocalStorage = function() {
  console.log('🧪 Testing localStorage data...');
  const player1Picks = JSON.parse(localStorage.getItem('player1StrategicPicks') || '[]');
  const player2Picks = JSON.parse(localStorage.getItem('player2StrategicPicks') || '[]');
  const currentRound = parseInt(localStorage.getItem('currentRound') || '0');
  
  console.log('Player 1 picks:', player1Picks);
  console.log('Player 2 picks:', player2Picks);
  console.log('Current round:', currentRound);
  
  return {
    player1Picks: player1Picks,
    player2Picks: player2Picks,
    currentRound: currentRound
  };
};

// Create test data for both players
window.createTestData = function() {
  console.log('🧪 Creating test data...');
  const testCards = [
    'images/ShanksCard.webm',
    'images/Akai.webm', 
    'images/madara.webm',
    'images/Nana-card.png',
    'images/ace.png'
  ];
  
  localStorage.setItem('player1StrategicPicks', JSON.stringify(testCards));
  localStorage.setItem('player2StrategicPicks', JSON.stringify(testCards));
  localStorage.setItem('currentRound', '0');
  
  console.log('Test data created for both players');
  return testCards;
};

// Swap deck functions loaded and available

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
  // Fix card paths for Netlify compatibility
  let fixedUrl = url;
  if (fixedUrl && !fixedUrl.startsWith('http') && !fixedUrl.startsWith('images/')) {
    if (fixedUrl.startsWith('CARD/')) {
      fixedUrl = fixedUrl.replace('CARD/', 'images/');
    } else if (!fixedUrl.startsWith('images/')) {
      fixedUrl = 'images/' + fixedUrl;
    }
  }
  
  // Ensure the path is correct for images folder
  if (fixedUrl && !fixedUrl.startsWith('http') && !fixedUrl.startsWith('images/')) {
    fixedUrl = 'images/' + fixedUrl;
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
  
  // Load fixed swap cards
  loadFixedSwapCards();
  
  // Load confirmed swap cards
  loadConfirmedSwapCards();
  
  console.log('Swap deck usage loaded:', swapDeckUsed);
  console.log('Fixed swap cards loaded:', fixedSwapCards);
  console.log('Confirmed swap cards loaded:', confirmedSwapCards);
  
  // Update swap deck buttons state on page load
  updateSwapDeckButtons();
  
  // Clear used abilities for new game if current round is 0
  const currentRound = parseInt(localStorage.getItem('currentRound') || '0');
  if (currentRound === 0) {
    clearUsedAbilities();
    // Reset swap deck usage and fixed cards for new game
    swapDeckUsed = { player1: false, player2: false };
    fixedSwapCards = { player1: null, player2: null };
    confirmedSwapCards = { player1: null, player2: null };
    saveSwapDeckUsage();
    saveFixedSwapCards();
    saveConfirmedSwapCards();
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