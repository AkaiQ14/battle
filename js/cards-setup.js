// Import Firebase GameService
import { GameService } from './gameService.js';


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
    }
    generateRandomCards();
  }
}

// Generate random cards for each player
function generateRandomCards() {
  // Common cards (85% of total)
  const commonCards = [
    'cards/Stark-card.png',
    'cards/Todoroki.png',
    'cards/CartTitan-card.png',
    'cards/Monspeet-card.png',
    'cards/Rika-card.png',
    'cards/ace.png',
    'cards/Shizuku-card.png',
    'cards/zetsu.png',
    'cards/Overhaul-card.png',
    'cards/Atsuya-card.png',
    'cards/Yoo-Jinho-card.png',
    'cards/Gin-freecss-card.png',
    'cards/Hantengu-card.png',
    'cards/Lily-card.png',
    'cards/Gordon-card.png',
    'cards/Charllotte-card.png',
    'cards/Min-Byung-Gyu-card.png',
    'cards/KiSui-card.png',
    'cards/Iron-card.png',
    'cards/Hawk-card.png',
    'cards/bartolomeo-card.png',
    'cards/WarHammerTitan-card.png',
    'cards/Luck.png',
    'cards/Elfaria Albis.png',
    'cards/Haschwalth-card.png',
    'cards/Hisagi-card.png',
    'cards/Elizabeth.png',
    'cards/MeiMei-card.png',
    'cards/Okabe-card.png',
    'cards/Renpa-card.png',
    'cards/Vengeance.png',
    'cards/Pariston-card.png',
    'cards/franklin_card.png',
    'cards/MouBu-card.png',
    'cards/Android18-card.png',
    'cards/hinata.png',
    'cards/laxus.png',
    'cards/Videl-card.webp',
    'cards/Momo-hinamori-card.webp',
    'cards/cardo20ppsd.webp',
    'cards/Krilin-card.webp',
    'cards/HakuKi-card.webp',
    'cards/ArmorTitan-card.webp',
    'cards/Nachttt.webp',
    'cards/Tosen-card.webp',
    // New common cards
    'cards/geten.webp',
    'cards/alex20armstrong.webp',
    'cards/Shinpei-card.webp',
    'cards/Friezaaa.webp',
    'cards/MetalBat-card.webp',
    'cards/VanAugur-card.webp',
    'cards/Zamasuuu.webp',
    'cards/Mayuri-card.webp',
    'cards/ColossialTitan-card.webp',
    'cards/Igris-card.webp',
    'cards/Runge-card.webp',
    'cards/Mina-card.webp',
    'cards/takuma-card.webp',
    'cards/lyonvastia.webp',
    'cards/Shinji-card.webp',
    'cards/Shigaraki.webp',
    'cards/konohamaru.webp',
    'cards/Kenzo-card.webp',
    'cards/fubuki.webp',
    'cards/Jirobo.webp',
    'cards/RaiDokingdom.webp',
    'cards/silverfullbuster.webp',
    'cards/Langriiss.webp',
    'cards/Panda-card.webp',
    'cards/pizarro.webp',
    'cards/Mezo-card.webp',
    'cards/Senritsu-card.webp',
    'cards/Merlin-card.webp',
    'cards/Queen-card.webp',
    'cards/Btakuya-card.png',
    'cards/sai.png',
    'cards/crocus-card.png',
    'cards/kurenai.png',
    'cards/Mahoraga.png',
    'cards/Inosuke-card.png',
    'cards/KeiSha-card.png',
    'cards/brook.png',
    'cards/Ur.png',
    'cards/Kurogiri-card.png',
    'cards/Alluka-card.png',
    'cards/Ban-card.png',
    'cards/konan.png',
    'cards/dazai-card.png',
    'cards/Karaku-card.png',
    'cards/Inumaki-card.png',
    'cards/Raditzz.png',
    'cards/Lucci-card.png',
    'cards/Bisky-card.png',
    'cards/Orihime-card.png',
    'cards/Isaac mcdougal.png',
    'cards/ino.png',
    'cards/Eso-card.png',
    'cards/Genthru-card.png',
    'cards/Roy Mustang.png',
    'cards/Stain-card.png',
    'cards/Zagred-card.png',
    'cards/BeastKing-card.png',
    'cards/rin.png',
    'cards/kota izumi.png',
    'cards/Lille-baroo-card.png'
  ];
  
  // Epic cards (part of 15% with Legendary)
  const epicCards = [
    'cards/minato.png',
    'cards/ShouHeiKun-card .png',
    'cards/KudoShinichi-card.png',
    'cards/Ichibe-card.png',
    'cards/Endeavor.png',
    'cards/Tier Harribel.png',
    'cards/Crocodile.png',
    'cards/Nana-card.png',
    'cards/Vegapunk-crad.webp',
    'cards/Go-Gunhee-card.webp',
    'cards/Nami.webp',
    'cards/Hachigen-card.png',
    'cards/Senjumaru-card.png',
    'cards/Arthur-card.png',
    'cards/Lemillion-card.png',
    'cards/Fuegoleonn .png',
    'cards/Itchigo-card .png',
    'cards/Kaito-card .png',
    'cards/DragonBB-67-card.png',
    'cards/Kuma-card.png',
    'cards/YujiroHanma-card.png',
    'cards/Dabi-card.png'
  ];
  
  // Legendary cards (part of 15% with Epic)
  const legendaryCards = [
    'cards/law.webm',
    'cards/Vegetto.webm',
    'cards/madara.webm',
    'cards/NietroCard.webm',
    'cards/aizen.webm',
    'cards/Hawks.webm',
    'cards/AllForOneCard.webm',
    'cards/ErenCard.webm',
    'cards/LuffyGear5Card.webm',
    'cards/joker.webm',
    'cards/AyanokojiCard.webm',
    'cards/UmibozoCard.webm',
    'cards/MeruemCard.webm',
    'cards/SilverCard.webm',
    'cards/Akai.webm',
    'cards/ShanksCard.webm',
    // New legendary cards
    'cards/shikamaru.webm',
    'cards/Goku UI.webm'
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
  
  // Select cards based on distribution
  const selectedCommon = shuffledCommon.slice(0, commonCount);
  const selectedEpicLegendary = shuffledEpicLegendary.slice(0, epicLegendaryCount);
  
  // Combine and shuffle all selected cards
  const allSelectedCards = [...selectedCommon, ...selectedEpicLegendary].sort(() => Math.random() - 0.5);
  
  // Ensure positions 14 and 10 (0-indexed: 13 and 9) always get strong cards
  const strongCards = [...epicCards, ...legendaryCards];
  const shuffledStrong = [...strongCards].sort(() => Math.random() - 0.5);
  
  // Replace cards at positions 9 and 13 with strong cards
  if (allSelectedCards.length > 13) {
    allSelectedCards[9] = shuffledStrong[0] || allSelectedCards[9]; // Position 10
    allSelectedCards[13] = shuffledStrong[1] || allSelectedCards[13]; // Position 14
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
      // Both players have selected their cards - redirect to final setup page
      window.location.href = 'final-setup.html';
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
  const currentPlayerText = document.getElementById('currentPlayerText');
  const continueSection = document.getElementById('continueSection');
  const continueBtn = document.getElementById('continueBtn');
  
  // Update player name without selection count
  const playerName = currentPlayerData.name || (gameState.currentPlayer === 'player1' ? 'اللاعب الأول' : 'اللاعب الثاني');
  const cardsNeeded = gameState.rounds;
  currentPlayerText.textContent = `${playerName} اختر ${cardsNeeded} كرت`;
  
  // Show continue button when current player has required cards
  if (currentPlayerData.selectedCards.length === cardsNeeded) {
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
