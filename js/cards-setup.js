// Import Firebase GameService
import { GameService } from './gameService.js';

// Global variables to persist across page refreshes
if (!window.gameCardsGenerated) {
  window.gameCardsGenerated = false;
  window.gameCardsData = {
    player1Cards: [],
    player2Cards: []
  };
}

// Game state
let gameState = {
  currentPlayer: 'player1',
  player1: { name: '', selectedCards: [] },
  player2: { name: '', selectedCards: [] },
  rounds: 11,
  availableCards: [],
  player1Cards: [],
  player2Cards: []
};

// Load existing data
document.addEventListener('DOMContentLoaded', function() {
  loadExistingData();
  createCardsGrid();
  updateDisplay();
});

function loadExistingData() {
  const savedData = localStorage.getItem('gameSetupProgress');
  if (savedData) {
    const data = JSON.parse(savedData);
    gameState = { ...gameState, ...data };
    
    // Load player names from the correct format
    if (data.player1Name) {
      gameState.player1.name = data.player1Name;
    }
    if (data.player2Name) {
      gameState.player2.name = data.player2Name;
    }
    
    // Get rounds from setup data
    gameState.rounds = data.rounds || 11;
    
    // Initialize card selection based on rounds
    const cardsNeeded = gameState.rounds;
    
    if (gameState.player1.selectedCards.length < cardsNeeded) {
      gameState.currentPlayer = 'player1';
    } else if (gameState.player2.selectedCards.length < cardsNeeded) {
      gameState.currentPlayer = 'player2';
    }
    
    // Load saved card selection if available
    const savedCardSelection = localStorage.getItem('gameCardSelection');
    if (savedCardSelection) {
      const cardData = JSON.parse(savedCardSelection);
      gameState.player1Cards = cardData.player1Cards || [];
      gameState.player2Cards = cardData.player2Cards || [];
      
      // Set available cards for current player
      if (gameState.currentPlayer === 'player1') {
        gameState.availableCards = gameState.player1Cards;
      } else {
        gameState.availableCards = gameState.player2Cards;
      }
    } else {
      // Generate random cards if not already generated
      generateRandomCards();
    }
  } else {
    // Load rounds from setup data
    const setupData = localStorage.getItem('gameSetupProgress');
    if (setupData) {
      const setup = JSON.parse(setupData);
      gameState.rounds = setup.rounds || 11;
      
      // Load player names from setup data
      if (setup.player1Name) {
        gameState.player1.name = setup.player1Name;
        gameState.player1Name = setup.player1Name;
      }
      if (setup.player2Name) {
        gameState.player2.name = setup.player2Name;
        gameState.player2Name = setup.player2Name;
      }
    }
    generateRandomCards();
  }
}

// Generate random cards for each player (with persistence)
function generateRandomCards() {
  // Check if cards are already generated using global variables
  if (window.gameCardsGenerated && window.gameCardsData.player1Cards.length > 0) {
    console.log('🎴 Using existing generated cards from global variables');
    
    gameState.player1Cards = window.gameCardsData.player1Cards;
    gameState.player2Cards = window.gameCardsData.player2Cards;
    
    // Set available cards for current player
    if (gameState.currentPlayer === 'player1') {
      gameState.availableCards = gameState.player1Cards;
    } else {
      gameState.availableCards = gameState.player2Cards;
    }
    
    return; // Use existing cards, don't generate new ones
  }
  
  console.log('🎴 Generating new random cards');
  // Common cards (85% of total) - منظم حسب المجلد المرفق
  const commonCards = [
    // الكروت الشائعة الأصلية
    'images/Stark-card.png',
    'images/Todoroki.png',
    'images/CartTitan-card.png',
    'images/Monspeet-card.png',
    'images/Rika-card.png',
    'images/ace.png',
    'images/Shizuku-card.png',
    'images/zetsu.png',
    'images/Overhaul-card.png',
    'images/Atsuya-card.png',
    'images/Yoo-Jinho-card.png',
    'images/Gin-freecss-card.png',
    'images/Hantengu-card.png',
    'images/Lily-card.png',
    'images/Gordon-card.png',
    'images/Charllotte-card.png',
    'images/Min-Byung-Gyu-card.png',
    'images/KiSui-card.png',
    'images/Iron-card.png',
    'images/Hawk-card.png',
    'images/bartolomeo-card.png',
    'images/WarHammerTitan-card.png',
    'images/Luck.png',
    'images/Elfaria Albis.png',
    'images/Haschwalth-card.png',
    'images/Hisagi-card.png',
    'images/Elizabeth.png',
    'images/MeiMei-card.png',
    'images/Okabe-card.png',
    'images/Renpa-card.png',
    'images/Vengeance.png',
    'images/Pariston-card.png',
    'images/franklin_card.png',
    'images/MouBu-card.png',
    'images/Android18-card.png',
    'images/hinata.png',
    'images/laxus.png',
    'images/Videl-card.webp',
    'images/Momo-hinamori-card.webp',
    'images/cardo20ppsd.webp',
    'images/Krilin-card.webp',
    'images/HakuKi-card.webp',
    'images/ArmorTitan-card.webp',
    'images/Nachttt.webp',
    'images/Tosen-card.webp',
    
    // الكروت الشائعة الجديدة من مجلد Common
    'images/Kalluto-card.png',
    'images/GaiMou-card.png',
    'images/Paragusss.png',
    'images/Haruta jjk.png',
    'images/Akutagawa-card.png',
    'images/Vista-card.png',
    'images/Jozi jjk.png',
    'images/Frierennnnn.png',
    'images/Tank-card.png',
    'images/Oden-card.png',
    'images/Ippo-card.png',
    'images/Kingkaiii.png',
    'images/MouGou-card.png',
    'images/jugo.png',
    'images/ghiaccio.png',
    'images/cavendish-card.png',
    'images/Tenma-card.png',
    'images/Rojuro-card.png',
    'images/Miruku bnha.png',
    'images/Kukoshibo-card.png',
    'images/Ganju-card.png',
    'images/Runge-card.png',
    'images/Rhyaa.png',
    'images/Meleoron-card.png',
    'images/Kirach.png',
    'images/lyon vastia.png',
    'images/julius wistoria.png',
    'images/Asui-card.png',
    'images/Jack-card.png',
    'images/sting eucliffe.png',
    'images/edward elric.png',
    'images/Zeno kingdom.png',
    'images/Uvogin-card.png',
    'images/Shinobu-card.png',
    'images/suzuno.png',
    'images/caesar-card.png',
    'images/Shin-card.png',
    'images/lumiere silvamillion.png',
    'images/kimimaro.png',
    'images/Kyoga-card.png',
    'images/Knov-card.png',
    'images/Kaguraaaa.png',
    'images/Chopper-card.png',
    'images/Franky-card.png',
    'images/Nejire-card.png',
    'images/Kurapika-card.png',
    'images/zaratras.png',
    'images/Zohakuten.png',
    'images/Zeo Thorzeus.png',
    'images/Mina-card.png',
    'images/MetalBat-card.png',
    'images/Makio-card.png',
    'images/Galand-card.png',
    'images/DiamondJozu.webp',
    'images/Matsumoto-card.webp',
    'images/MomoYaorozu-card.webp',
    'images/Ishida-card.webp',
    'images/Yoruichi-card.webp',
    'images/esdeath.webp',
    'images/Jaw-card.webp',
    'images/FemaleTitan-card.webp',
    'images/Aizetsu-card.webp',
    'images/tenten.webp',
    'images/Gadjah.webp',
    'images/naobito-card.webp',
    'images/Gilthunder.png',
    'images/Mai-card.png',
    'images/Maki zenen.png',
    'images/Itadori-card.png',
    'images/Picollooo.png',
    'images/Noelll.png',
    'images/shino.png',
    'images/Kenzo-card.png',
    'images/Masamichi-card.png',
    'images/ShouBunKun-card.png',
    'images/Bardooock.png',
    'images/mahito-card.png',
    'images/poseidon.png',
    'images/geten.webp',
    'images/alex20armstrong.webp',
    'images/Shinpei-card.webp',
    'images/Friezaaa.webp',
    'images/VanAugur-card.webp',
    'images/Zamasuuu.webp',
    'images/Mayuri-card.webp',
    'images/Runge-card.webp',
    'images/takuma-card.webp',
    'images/Shinji-card.webp',
    'images/konohamaru.webp',
    'images/fubuki.webp',
    'images/Jirobo.webp',
    'images/RaiDokingdom.webp',
    'images/silverfullbuster.webp',
    'images/Langriiss.webp',
    'images/Panda-card.webp',
    'images/pizarro.webp',
    'images/Mezo-card.webp',
    'images/Senritsu-card.webp',
    'images/Merlin-card.webp',
    'images/Queen-card.webp',
    'images/Btakuya-card.png',
    'images/sai.png',
    'images/crocus-card.png',
    'images/kurenai.png',
    'images/Mahoraga.png',
    'images/Inosuke-card.png',
    'images/KeiSha-card.png',
    'images/brook.png',
    'images/Ur.png',
    'images/Kurogiri-card.png',
    'images/Alluka-card.png',
    'images/Ban-card.png',
    'images/konan.png',
    'images/dazai-card.png',
    'images/Karaku-card.png',
    'images/Inumaki-card.png',
    'images/Raditzz.png',
    'images/Lucci-card.png',
    'images/Bisky-card.png',
    'images/Orihime-card.png',
    'images/Isaac mcdougal.png',
    'images/ino.png',
    'images/Eso-card.png',
    'images/Genthru-card.png',
    'images/Roy Mustang.png',
    'images/Stain-card.png',
    'images/Zagred-card.png',
    'images/BeastKing-card.png',
    'images/rin.png',
    'images/kota izumi.png',
    'images/Lille-baroo-card.png',
    'images/tenten.webp'
  ];
  
  // Epic cards (part of 15% with Legendary) - منظم حسب المجلد المرفق
  const epicCards = [
    // الكروت الملحمية من مجلد Epic
    'images/nanami-card.png',
    'images/kenjaku-card.png',
    'images/Geto-card.png',
    'images/Yusaku.png',
    'images/Danteee.png',
    'images/Johan-card.png',
    'images/mansherry.png',
    'images/Teach-card.png',
    'images/tobirama.png',
    'images/BigM.webp',
    'images/Choi-jong-in-.webp',
    'images/judarr.webp',
    'images/Adult-gon-card.webp',
    'images/ColossialTitan-card.png',
    'images/gloxinia.png',
    'images/A4thRaikagee.png',
    'images/Igris-card.webp',
    'images/Queen-card.webp',
    'images/Mahoraga.png',
    'images/Ban-card.png',
    'images/dazai-card.png',
    'images/Orihime-card.png',
    'images/Zagred-card.png',
    'images/Lille-baroo-card.png',
    'images/minato.png',
    'images/ShouHeiKun-card .png',
    'images/KudoShinichi-card.png',
    'images/Ichibe-card.png',
    'images/Endeavor.png',
    'images/Tier Harribel.png',
    'images/Crocodile.png',
    'images/Nana-card.png',
    'images/Vegapunk-crad.webp',
    'images/Go-Gunhee-card.webp',
    'images/Nami.webp',
    'images/Hachigen-card.png',
    'images/Senjumaru-card.png',
    'images/Arthur-card.png',
    'images/Lemillion-card.png',
    'images/Fuegoleonn .png',
    'images/Itchigo-card .png',
    'images/Kaito-card .png',
    'images/DragonBB-67-card.png',
    'images/Kuma-card.png',
    'images/YujiroHanma-card.png',
    'images/Dabi-card.png',
    'images/fubukii.png',
    'images/gounji.png'
  ];
  
  // Legendary cards (part of 15% with Epic) - منظم حسب المجلد المرفق
  const legendaryCards = [
    // الكروت الأسطورية من مجلد Legendary
    'images/obito.webm',
    'images/whitebeard.webm',
    'images/SakamotoCard.webm',
    'images/GojoCard.webm',
    'images/Gogeta.webm',
    'images/Vegetto.webm',
    'images/Hawks.webm',
    'images/Goku UI.webm',
    'images/shikamaru.webm',
    'images/law.webm',
    'images/madara.webm',
    'images/NietroCard.webm',
    'images/aizen.webm',
    'images/AllForOneCard.webm',
    'images/ErenCard.webm',
    'images/LuffyGear5Card.webm',
    'images/joker.webm',
    'images/AyanokojiCard.webm',
    'images/UmibozoCard.webm',
    'images/MeruemCard.webm',
    'images/SilverCard.webm',
    'images/Akai.webm',
    'images/ShanksCard.webm'
  ];
  
  // Calculate distribution: 85% Common, 15% Epic+Legendary
  const totalCards = 40; // 20 per player
  const commonCount = Math.floor(totalCards * 0.85); // 34 cards
  const epicLegendaryCount = totalCards - commonCount; // 6 cards
  
  // Combine Epic and Legendary cards
  const epicLegendaryCards = [...epicCards, ...legendaryCards];
  
  // Shuffle all card pools
  const shuffledCommon = [...commonCards].sort(() => Math.random() - 0.5);
  const shuffledEpicLegendary = [...epicLegendaryCards].sort(() => Math.random() - 0.5);
  
  // Select cards based on distribution with no duplicates
  const selectedCards = [];
  const usedCards = new Set(); // Track used cards to prevent duplicates
  
  // Select common cards
  let commonSelected = 0;
  for (let card of shuffledCommon) {
    if (commonSelected >= commonCount) break;
    if (!usedCards.has(card)) {
      selectedCards.push(card);
      usedCards.add(card);
      commonSelected++;
    }
  }
  
  // Select epic and legendary cards
  let epicLegendarySelected = 0;
  for (let card of shuffledEpicLegendary) {
    if (epicLegendarySelected >= epicLegendaryCount) break;
    if (!usedCards.has(card)) {
      selectedCards.push(card);
      usedCards.add(card);
      epicLegendarySelected++;
    }
  }
  
  // Shuffle all selected cards
  const allSelectedCards = selectedCards.sort(() => Math.random() - 0.5);
  
  // ضمان ظهور بطاقة أسطورية في الموضع رقم 14 دائماً
  const shuffledLegendary = [...legendaryCards].sort(() => Math.random() - 0.5);
  
  // استبدال البطاقة في الموضع 13 (رقم 14) ببطاقة أسطورية
  if (allSelectedCards.length > 13) {
    for (let legendaryCard of shuffledLegendary) {
      if (!usedCards.has(legendaryCard)) {
        allSelectedCards[13] = legendaryCard; // الموضع 14 - بطاقة أسطورية فقط
        usedCards.add(legendaryCard);
        break;
      }
    }
  }
  
  // Distribute cards between players (20 each) - NO REPEATS
  gameState.player1Cards = allSelectedCards.slice(0, 20);
  gameState.player2Cards = allSelectedCards.slice(20, 40);
  
  // Set available cards for current player
  if (gameState.currentPlayer === 'player1') {
    gameState.availableCards = gameState.player1Cards;
  } else {
    gameState.availableCards = gameState.player2Cards;
  }
  
  // Save to localStorage (like order.js)
  try { 
    localStorage.setItem('player1StrategicPicks', JSON.stringify(gameState.player1Cards)); 
  } catch {}
  try { 
    localStorage.setItem('player2StrategicPicks', JSON.stringify(gameState.player2Cards)); 
  } catch {}
  
  // Save generated cards to global variables to prevent regeneration on page refresh
  window.gameCardsData.player1Cards = gameState.player1Cards;
  window.gameCardsData.player2Cards = gameState.player2Cards;
  window.gameCardsGenerated = true;
  console.log('💾 Saved generated cards to global variables');
  
  // Also save game setup data
  localStorage.setItem('gameSetupProgress', JSON.stringify({
    player1Name: gameState.player1Name,
    player2Name: gameState.player2Name,
    rounds: gameState.rounds
  }));
}

function createCardsGrid() {
  const grid = document.getElementById('cardsGrid');
  grid.innerHTML = '';
  
  // Use available cards for current player
  const cardsToShow = gameState.availableCards || [];
  
  // Create cards based on available cards
  cardsToShow.forEach((cardPath, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-number';
    cardDiv.textContent = index + 1;
    cardDiv.dataset.cardNumber = index + 1;
    cardDiv.dataset.cardPath = cardPath;
    cardDiv.onclick = () => selectCard(index + 1);
    
    const currentPlayerData = gameState[gameState.currentPlayer];
    if (currentPlayerData.selectedCards.includes(index + 1)) {
      cardDiv.classList.add('selected');
    }
    grid.appendChild(cardDiv);
  });
}

function selectCard(cardNumber) {
  const cardDiv = document.querySelector(`[data-card-number="${cardNumber}"]`);
  const currentPlayerData = gameState[gameState.currentPlayer];
  
  // Check if card is already selected
  if (currentPlayerData.selectedCards.includes(cardNumber)) {
    // Deselect card
    const index = currentPlayerData.selectedCards.indexOf(cardNumber);
    currentPlayerData.selectedCards.splice(index, 1);
    cardDiv.classList.remove('selected');
  } else {
    // Select card if less than required cards selected
    const cardsNeeded = gameState.rounds;
    if (currentPlayerData.selectedCards.length < cardsNeeded) {
      currentPlayerData.selectedCards.push(cardNumber);
      cardDiv.classList.add('selected');
    }
  }
  
  // Update display
  updateDisplay();
  saveProgress();
}

async function continueToNextPlayer() {
  const gameId = sessionStorage.getItem('currentGameId');
  const currentPlayerData = gameState[gameState.currentPlayer];
  const cardsNeeded = gameState.rounds;
  
  if (!gameId) {
    alert('لم يتم العثور على معرف اللعبة');
    return;
  }
  
  // Validate that current player has selected required cards
  if (currentPlayerData.selectedCards.length !== cardsNeeded) {
    alert(`يجب أن يختار ${currentPlayerData.name || 'اللاعب'} ${cardsNeeded} كرت بالضبط`);
    return;
  }
  
  try {
    // إظهار loading
    const continueBtn = document.getElementById('continueBtn');
    continueBtn.disabled = true;
    continueBtn.textContent = 'جاري حفظ البطاقات...';
    
    // حفظ البطاقات المختارة في Firebase
    const selectedCards = getSelectedCards();
    const playerNumber = gameState.currentPlayer === 'player1' ? 1 : 2;
    
    await GameService.savePlayerCards(gameId, playerNumber, selectedCards);
    
    // حفظ في localStorage للتوافق
    savePlayerCards();
    
    // Switch to next player
    if (gameState.currentPlayer === 'player1') {
      gameState.currentPlayer = 'player2';
      // Set available cards for player 2
      gameState.availableCards = gameState.player2Cards;
      
      // Update display and recreate grid for new player
      updateDisplay();
      createCardsGrid();
      saveProgress();
      
      // إعادة تفعيل الزر
      continueBtn.disabled = false;
      continueBtn.textContent = 'متابعة';
    } else {
      // Both players have selected their cards - redirect to swap deck selection
      window.location.href = 'swap-deck-selection.html';
    }
    
  } catch (error) {
    console.error('Error saving cards:', error);
    alert('حدث خطأ في حفظ البطاقات: ' + error.message);
    
    // إعادة تفعيل الزر
    const continueBtn = document.getElementById('continueBtn');
    continueBtn.disabled = false;
    continueBtn.textContent = 'متابعة';
  }
}

// إضافة دالة مساعدة للحصول على البطاقات المختارة
function getSelectedCards() {
  const currentPlayerData = gameState[gameState.currentPlayer];
  return currentPlayerData.selectedCards.map(cardNumber => {
    const cardIndex = cardNumber - 1;
    return gameState.availableCards[cardIndex];
  });
}

function savePlayerCards() {
  const currentPlayerData = gameState[gameState.currentPlayer];
  const playerKey = gameState.currentPlayer === 'player1' ? 'player1' : 'player2';
  const picksKey = `${playerKey}StrategicPicks`;
  
  // Convert selected card numbers to card paths (strings only)
  const selectedCardPaths = currentPlayerData.selectedCards.map(cardNumber => {
    const cardIndex = cardNumber - 1;
    return gameState.availableCards[cardIndex];
  });
  
  localStorage.setItem(picksKey, JSON.stringify(selectedCardPaths));
}

function updateDisplay() {
  const currentPlayerData = gameState[gameState.currentPlayer];
  const currentPlayerName = document.getElementById('currentPlayerName');
  const instructionText = document.getElementById('instructionText');
  const continueSection = document.getElementById('continueSection');
  const continueBtn = document.getElementById('continueBtn');
  
  // Update player name - try multiple sources for the name
  let playerName = currentPlayerData.name;
  
  // If no name in current player data, try the global player names
  if (!playerName) {
    if (gameState.currentPlayer === 'player1') {
      playerName = gameState.player1Name || 'اللاعب الأول';
    } else {
      playerName = gameState.player2Name || 'اللاعب الثاني';
    }
  }
  
  const cardsNeeded = gameState.rounds;
  const selectedCount = currentPlayerData.selectedCards.length;
  
  // Update the player name
  currentPlayerName.textContent = playerName;
  
  // Update the instruction text
  instructionText.textContent = `اختر ${cardsNeeded} كرت`;
  
  // Show continue button when current player has required cards
  if (selectedCount === cardsNeeded) {
    continueSection.style.display = 'block';
    continueBtn.textContent = 'متابعة';
  } else {
    continueSection.style.display = 'none';
  }
}

function saveProgress() {
  localStorage.setItem('gameSetupProgress', JSON.stringify(gameState));
  
  // Also save selected cards in the format expected by player-cards.js
  const currentPlayerData = gameState[gameState.currentPlayer];
  if (currentPlayerData.selectedCards.length > 0) {
    const playerKey = gameState.currentPlayer === 'player1' ? 'player1' : 'player2';
    const picksKey = `${playerKey}StrategicPicks`;
    
    // Convert selected card numbers to card paths (strings only)
    const selectedCardPaths = currentPlayerData.selectedCards.map(cardNumber => {
      const cardIndex = cardNumber - 1;
      return gameState.availableCards[cardIndex];
    });
    
    localStorage.setItem(picksKey, JSON.stringify(selectedCardPaths));
  }
}

// Make functions available globally
window.continueToNextPlayer = continueToNextPlayer;
window.saveProgress = saveProgress;
window.savePlayerCards = savePlayerCards;
