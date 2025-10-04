/**
 * 🎴 Swap Deck System V2 - Final Solution
 * 
 * Features:
 * - Cards persist across page refreshes
 * - No localStorage dependency for card generation
 * - Simple and reliable implementation
 */

class SwapDeckSystem {
  constructor() {
    this.currentPlayer = null;
    this.selectedCardIndex = -1;
    this.isInitialized = false;
    
    // Use global variables to persist across page refreshes
    if (!window.swapDeckCardsGenerated) {
      window.swapDeckCardsGenerated = false;
      window.swapDeckCardsData = {
        player1: { cards: [], used: false },
        player2: { cards: [], used: false }
      };
      window.swapDeckUsageData = { player1: false, player2: false };
    }
    
    // Initialize system
    this.init();
  }

  /**
   * Initialize the swap deck system
   */
  init() {
    try {
      console.log('🎴 Initializing Swap Deck System V2...');
      console.log('🎴 DOM elements check:', {
        btn1: !!document.getElementById('swapDeckBtn1'),
        btn2: !!document.getElementById('swapDeckBtn2'),
        modal: !!document.getElementById('swapDeckModal')
      });
      
      // Initialize global variables
      if (!window.swapDeckCardsGenerated) {
        window.swapDeckCardsGenerated = false;
      }
      if (!window.swapDeckCardsData) {
        window.swapDeckCardsData = {
          player1: { cards: [], used: false },
          player2: { cards: [], used: false }
        };
      }
      if (!window.swapDeckUsageData) {
        window.swapDeckUsageData = { player1: false, player2: false };
      }
      
      // Load available cards
      this.loadAvailableCards();
      
      // Load swap deck cards from localStorage (set by swap-deck-selection.html)
      this.loadSwapDeckCards();
      
      // Only generate from StrategicPicks if no swap deck cards exist at all
      if (!window.swapDeckCardsData.player1.cards.length && !window.swapDeckCardsData.player2.cards.length) {
        console.log('🎴 No swap deck cards found, generating from StrategicPicks as fallback...');
        this.loadCardsFromSetup();
      }
      
      // Check if this is a new game and reset usage data
      this.checkForNewGame();
      
      // Load usage data from localStorage
      this.loadUsageData();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Update button states
      this.updateButtonStates();
      
      this.isInitialized = true;
      console.log('✅ Swap Deck System V2 initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing Swap Deck System:', error);
    }
  }

  /**
   * Check if this is a new game and reset usage data
   */
  checkForNewGame() {
    try {
      console.log('🎴 Checking for new game...');
      
      // Check if current round is 0 (new game)
      const currentRound = parseInt(localStorage.getItem('currentRound') || '0');
      const gameSetupProgress = localStorage.getItem('gameSetupProgress');
      const gameStatus = localStorage.getItem('gameStatus');
      
      console.log('🎴 Game state check:', {
        currentRound,
        gameSetupProgress: gameSetupProgress ? 'exists' : 'not found',
        gameStatus
      });
      
      // Only reset if it's truly a new game (round 0 AND no game setup progress)
      // Don't reset if game just ended (gameStatus === 'finished')
      if (currentRound === 0 && !gameSetupProgress && gameStatus !== 'finished') {
        console.log('🎴 New game detected (round 0 + no setup) - resetting swap deck usage data');
        window.swapDeckUsageData = { player1: false, player2: false };
        localStorage.removeItem('swapDeckUsageData');
        
        // Also reset swap deck cards data
        window.swapDeckCardsGenerated = false;
        window.swapDeckCardsData = {
          player1: { cards: [], used: false },
          player2: { cards: [], used: false }
        };
        
        console.log('✅ Reset swap deck data for new game');
      } else {
        console.log('🎴 Continuing existing game or game just ended - preserving swap deck usage data');
      }
    } catch (error) {
      console.error('❌ Error checking for new game:', error);
    }
  }

  /**
   * Load usage data from localStorage
   */
  loadUsageData() {
    try {
      console.log('🎴 Loading swap deck usage data from localStorage...');
      
      const usageData = localStorage.getItem('swapDeckUsageData');
      if (usageData) {
        const data = JSON.parse(usageData);
        window.swapDeckUsageData = data;
        console.log('✅ Loaded swap deck usage data:', data);
        console.log('🎴 Player1 used:', data.player1, 'Player2 used:', data.player2);
      } else {
        // Initialize with default values
        window.swapDeckUsageData = { player1: false, player2: false };
        console.log('✅ Initialized swap deck usage data with defaults');
      }
      
      // Double-check: if we're in a new game, force reset
      const currentRound = parseInt(localStorage.getItem('currentRound') || '0');
      const gameSetupProgress = localStorage.getItem('gameSetupProgress');
      const gameStatus = localStorage.getItem('gameStatus');
      
      // Only reset if it's truly a new game (round 0 AND no game setup progress AND not finished)
      if (currentRound === 0 && !gameSetupProgress && gameStatus !== 'finished') {
        console.log('🎴 New game detected in loadUsageData - forcing reset');
        window.swapDeckUsageData = { player1: false, player2: false };
        localStorage.removeItem('swapDeckUsageData');
        console.log('✅ Forced reset of swap deck usage data');
      }
      
    } catch (error) {
      console.error('❌ Error loading usage data:', error);
      window.swapDeckUsageData = { player1: false, player2: false };
    }
  }

  /**
   * Force reset swap deck system (for debugging)
   */
  forceReset() {
    try {
      console.log('🔄 Force resetting swap deck system...');
      
      // Reset global variables
      window.swapDeckUsageData = { player1: false, player2: false };
      window.swapDeckCardsGenerated = false;
      window.swapDeckCardsData = {
        player1: { cards: [], used: false },
        player2: { cards: [], used: false }
      };
      
      // Clear localStorage
      localStorage.removeItem('swapDeckUsageData');
      localStorage.removeItem('swapDeckData');
      
      // Update button states
      this.updateButtonStates();
      
      console.log('✅ Swap deck system force reset completed');
      
    } catch (error) {
      console.error('❌ Error force resetting swap deck system:', error);
    }
  }

  /**
   * Reset for new game (called when starting a new game)
   */
  resetForNewGame() {
    try {
      console.log('🔄 Resetting swap deck system for new game...');
      
      // Reset global variables
      window.swapDeckUsageData = { player1: false, player2: false };
      window.swapDeckCardsGenerated = false;
      window.swapDeckCardsData = {
        player1: { cards: [], used: false },
        player2: { cards: [], used: false }
      };
      
      // Clear localStorage
      localStorage.removeItem('swapDeckUsageData');
      localStorage.removeItem('swapDeckData');
      
      // Update button states
      this.updateButtonStates();
      
      console.log('✅ Swap deck system reset for new game completed');
      
    } catch (error) {
      console.error('❌ Error resetting swap deck system for new game:', error);
    }
  }

  /**
   * Load swap deck cards from localStorage
   */
  loadSwapDeckCards() {
    try {
      console.log('🎴 Loading swap deck cards from localStorage...');
      
      // Try to load from localStorage first
      const swapDeckData = localStorage.getItem('swapDeckData');
      if (swapDeckData) {
        const data = JSON.parse(swapDeckData);
        window.swapDeckCardsData = data;
        window.swapDeckCardsGenerated = true;
        console.log('✅ Loaded swap deck cards from localStorage:', data);
        return;
      }
      
      // Try to load individual player cards from swap-deck-selection.html
      const player1Cards = JSON.parse(localStorage.getItem('player1SwapDeckCards') || '[]');
      const player2Cards = JSON.parse(localStorage.getItem('player2SwapDeckCards') || '[]');
      
      if (player1Cards.length > 0 && player2Cards.length > 0) {
        window.swapDeckCardsData = {
          player1: { cards: player1Cards, used: false },
          player2: { cards: player2Cards, used: false }
        };
        window.swapDeckCardsGenerated = true;
        console.log('✅ Loaded swap deck cards from swap-deck-selection.html:', { player1Cards, player2Cards });
        return;
      }
      
      // If no swap deck cards found, try to get from swap-deck-selection.html
      console.log('🎴 No swap deck cards found, trying to load from swap-deck-selection.html...');
      this.loadCardsFromSetup();
      
    } catch (error) {
      console.error('❌ Error loading swap deck cards:', error);
    }
  }

  /**
   * Load cards from swap-deck-selection.html (selected swap deck cards)
   */
  loadCardsFromSetup() {
    try {
      console.log('🎴 Loading cards from swap-deck-selection.html...');
      
      // Get player swap deck cards (set by swap-deck-selection.html)
      const player1SwapCards = JSON.parse(localStorage.getItem('player1SwapDeckCards') || '[]');
      const player2SwapCards = JSON.parse(localStorage.getItem('player2SwapDeckCards') || '[]');
      
      console.log('🎴 Swap deck cards found:', { 
        player1: player1SwapCards.length, 
        player2: player2SwapCards.length 
      });
      
      if (player1SwapCards.length > 0 && player2SwapCards.length > 0) {
        // Use the selected swap deck cards from swap-deck-selection.html
        window.swapDeckCardsData = {
          player1: { cards: player1SwapCards, used: false },
          player2: { cards: player2SwapCards, used: false }
        };
        window.swapDeckCardsGenerated = true;
        
        console.log('✅ Created swap deck cards from swap-deck-selection:', {
          player1: window.swapDeckCardsData.player1.cards,
          player2: window.swapDeckCardsData.player2.cards
        });
        
        // Save to localStorage for persistence
        localStorage.setItem('swapDeckData', JSON.stringify(window.swapDeckCardsData));
        console.log('✅ Saved swap deck cards to localStorage');
        
      } else {
        console.log('⚠️ No swap deck cards found, using fallback cards');
        this.generateFallbackCards();
      }
      
    } catch (error) {
      console.error('❌ Error loading cards from swap-deck-selection:', error);
      this.generateFallbackCards();
    }
  }

  /**
   * Load all available cards
   */
  loadAvailableCards() {
    try {
      this.availableCards = [
        "images/ShanksCard.webm", "images/Akai.webm", "images/madara.webm", "images/Nana-card.png", "images/Vengeance.png",
        "images/Crocodile.png", "images/MeiMei-card.png", "images/Elizabeth.png", "images/ace.png", "images/Adult-gon-card.webp",
        "images/Arthur-card.png", "images/Ban-card.png", "images/BigM.webp", "images/Choi-jong-in-.webp", "images/ColossialTitan-card.png",
        "images/Dabi-card.png", "images/Danteee.png", "images/dazai-card.png", "images/DragonBB-67-card.png", "images/Endeavor.png",
        "images/Fuegoleonn .png", "images/Geto-card.png", "images/gloxinia.png", "images/Go-Gunhee-card.webp", "images/Hachigen-card.png",
        "images/Ichibe-card.png", "images/Igris-card.webp", "images/Itchigo-card .png", "images/Johan-card.png", "images/judarr.webp",
        "images/Kaito-card .png", "images/kenjaku-card.png", "images/KudoShinichi-card.png", "images/Kuma-card.png", "images/Lemillion-card.png",
        "images/Lille-baroo-card.png", "images/Mahoraga.png", "images/mansherry.png", "images/minato.png", "images/Nami.webp",
        "images/Orihime-card.png", "images/Queen-card.webp", "images/Senjumaru-card.png", "images/ShouHeiKun-card .png", "images/Teach-card.png",
        "images/Tier Harribel.png", "images/tobirama.png", "images/Vegapunk-crad.webp", "images/YujiroHanma-card.png", "images/Yusaku.png",
        "images/Zagred-card.png", "images/fubuki.webp"
      ];
      
      console.log(`✅ Loaded ${this.availableCards.length} available cards`);
      
    } catch (error) {
      console.error('❌ Error loading available cards:', error);
      this.availableCards = [];
    }
  }

  /**
   * Generate swap deck cards for both players - REMOVED
   * Cards will be generated externally
   */

  /**
   * Generate fallback cards if external generation fails
   */
  generateFallbackCards() {
    try {
      console.log('🎴 Generating fallback swap deck cards...');
      
      // Initialize global variables
      if (!window.swapDeckCardsData) {
        window.swapDeckCardsData = {
          player1: { cards: [], used: false },
          player2: { cards: [], used: false }
        };
      }
      if (!window.swapDeckUsageData) {
        window.swapDeckUsageData = { player1: false, player2: false };
      }
      
      // Get all available cards from multiple sources
      let player1Cards = [];
      let player2Cards = [];
      
      // Try localStorage first
      try {
        player1Cards = JSON.parse(localStorage.getItem('player1StrategicPicks') || '[]');
        player2Cards = JSON.parse(localStorage.getItem('player2StrategicPicks') || '[]');
        console.log('📋 Found cards in localStorage:', { player1: player1Cards.length, player2: player2Cards.length });
      } catch (e) {
        console.warn('⚠️ Error parsing localStorage cards:', e);
      }
      
      // If no cards in localStorage, try global variables
      if (!player1Cards.length && window.gameCardsData) {
        player1Cards = window.gameCardsData.player1Cards || [];
        player2Cards = window.gameCardsData.player2Cards || [];
        console.log('📋 Found cards in global variables:', { player1: player1Cards.length, player2: player2Cards.length });
      }
      
      // If still no cards, use available cards from this.availableCards
      if (!player1Cards.length && !player2Cards.length) {
        console.log('📋 Using available cards from system');
        const allAvailableCards = this.availableCards || [];
        const shuffled = [...allAvailableCards].sort(() => 0.5 - Math.random());
        player1Cards = shuffled.slice(0, 10);
        player2Cards = shuffled.slice(10, 20);
      }
      
      const allCards = [...player1Cards, ...player2Cards];
      console.log('📋 Total cards available:', allCards.length);
      
      // Remove duplicates
      const uniqueCards = [...new Set(allCards)];
      console.log('📋 Unique cards after deduplication:', uniqueCards.length);
      
      // Generate 3 random cards for each player (avoiding their selected cards)
      const player1SwapCards = this.generateRandomCardsForPlayer('player1', player1Cards, uniqueCards);
      const player2SwapCards = this.generateRandomCardsForPlayer('player2', player2Cards, uniqueCards);
      
      // Store in global variables
      window.swapDeckCardsData.player1.cards = player1SwapCards;
      window.swapDeckCardsData.player2.cards = player2SwapCards;
      window.swapDeckCardsGenerated = true;
      
      console.log('✅ Fallback swap deck cards generated:', {
        player1: player1SwapCards,
        player2: player2SwapCards
      });
      
    } catch (error) {
      console.error('❌ Error generating fallback cards:', error);
    }
  }
  
  /**
   * Generate random cards for a specific player
   */
  generateRandomCardsForPlayer(playerKey, playerCards, allCards) {
    try {
      console.log(`🎴 Generating cards for ${playerKey}:`, { playerCards: playerCards.length, allCards: allCards.length });
      
      // Filter out cards that the player already has
      const availableForSwap = allCards.filter(card => !playerCards.includes(card));
      console.log(`🎴 Available for swap: ${availableForSwap.length} cards`);
      
      // If not enough cards available, use all cards
      const cardsToUse = availableForSwap.length >= 3 ? availableForSwap : allCards;
      console.log(`🎴 Using ${cardsToUse.length} cards for generation`);
      
      // Shuffle and pick 3 random cards
      const shuffled = [...cardsToUse].sort(() => 0.5 - Math.random());
      const result = shuffled.slice(0, 3);
      
      console.log(`✅ Generated ${result.length} cards for ${playerKey}:`, result);
      return result;
      
    } catch (error) {
      console.error('❌ Error generating random cards for player:', error);
      return [];
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    try {
      // Bind functions to the instance
      window.openSwapDeckModal = (playerParam) => this.openSwapDeckModal(playerParam);
      window.closeSwapDeckModal = () => this.closeSwapDeckModal();
      window.confirmSwap = () => this.confirmSwap();
      
      // Add click event listeners to buttons
      const btn1 = document.getElementById('swapDeckBtn1');
      const btn2 = document.getElementById('swapDeckBtn2');
      
      if (btn1) {
        btn1.addEventListener('click', () => {
          console.log('🎴 Button 1 clicked (left side - player2)');
          this.openSwapDeckModal('player2');
        });
      }
      
      if (btn2) {
        btn2.addEventListener('click', () => {
          console.log('🎴 Button 2 clicked (right side - player1)');
          this.openSwapDeckModal('player1');
        });
      }
      
      console.log('✅ Event listeners setup completed');
      
    } catch (error) {
      console.error('❌ Error setting up event listeners:', error);
    }
  }

  /**
   * Force refresh button states from localStorage
   * This is called when we need to ensure buttons reflect the latest state
   */
  forceRefreshButtonStates() {
    try {
      console.log('🎴 Force refreshing button states...');
      
      // Reload usage data from localStorage
      this.loadUsageData();
      
      // Update button states
      this.updateButtonStates();
      
      console.log('✅ Button states force refreshed');
      
    } catch (error) {
      console.error('❌ Error force refreshing button states:', error);
    }
  }

  /**
   * Update button states
   */
  updateButtonStates() {
    try {
      console.log('🎴 Updating button states...');
      
      // ✅ Read usage data directly from localStorage to ensure we have the latest data
      const usageData = JSON.parse(localStorage.getItem('swapDeckUsageData') || '{}');
      console.log('🎴 Usage data from localStorage:', usageData);
      
      // Update global variable with latest data
      window.swapDeckUsageData = usageData;
      
      const btn1 = document.getElementById('swapDeckBtn1');
      const btn2 = document.getElementById('swapDeckBtn2');
      
      if (btn1) {
        // btn1 controls player2 (left side)
        const isDisabled = usageData.player2 || false;
        btn1.disabled = isDisabled;
        btn1.classList.toggle('disabled', isDisabled);
        
        console.log(`🎴 Button 1 (player2) - disabled: ${isDisabled}`);
        
        // Update button text and styling
        if (isDisabled) {
          btn1.textContent = 'مستخدم';
          btn1.title = 'تم استخدام دكة البدلاء مسبقاً';
          btn1.style.backgroundColor = '#666666';
          btn1.style.color = '#999999';
          btn1.style.cursor = 'not-allowed';
        } else {
          btn1.textContent = 'دكة البدلاء';
          btn1.title = 'انقر لفتح دكة البدلاء';
          btn1.style.backgroundColor = '';
          btn1.style.color = '';
          btn1.style.cursor = 'pointer';
        }
      }
      
      if (btn2) {
        // btn2 controls player1 (right side)
        const isDisabled = usageData.player1 || false;
        btn2.disabled = isDisabled;
        btn2.classList.toggle('disabled', isDisabled);
        
        console.log(`🎴 Button 2 (player1) - disabled: ${isDisabled}`);
        
        // Update button text and styling
        if (isDisabled) {
          btn2.textContent = 'مستخدم';
          btn2.title = 'تم استخدام دكة البدلاء مسبقاً';
          btn2.style.backgroundColor = '#666666';
          btn2.style.color = '#999999';
          btn2.style.cursor = 'not-allowed';
        } else {
          btn2.textContent = 'دكة البدلاء';
          btn2.title = 'انقر لفتح دكة البدلاء';
          btn2.style.backgroundColor = '';
          btn2.style.color = '';
          btn2.style.cursor = 'pointer';
        }
      }
      
    } catch (error) {
      console.error('❌ Error updating button states:', error);
    }
  }

  /**
   * Open swap deck modal
   */
  openSwapDeckModal(playerParam) {
    try {
      console.log(`🎴 Opening swap deck modal for ${playerParam}`);
      console.log('🎴 Current swap deck usage:', window.swapDeckUsageData);
      console.log('🎴 Current swap deck cards:', window.swapDeckCardsData);
      
      // Reset UI state first
      this.selectedCardIndex = -1;
      
      // Reset number buttons
      const numberButtons = document.querySelectorAll('.card-number-btn');
      numberButtons.forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Hide selected card display
      const selectedCardDisplay = document.getElementById('selectedCardDisplay');
      if (selectedCardDisplay) {
        selectedCardDisplay.style.display = 'none';
      }
      
      // Reset confirm button
      const confirmBtnReset = document.getElementById('confirmSwapBtn');
      if (confirmBtnReset) {
        confirmBtnReset.disabled = true;
      }
      
      // Check if player has already used swap deck
      if (window.swapDeckUsageData[playerParam]) {
        console.log(`⚠️ Player ${playerParam} has already used swap deck`);
        this.showToast('⚠️ تم استخدام دكة البدلاء مسبقاً لهذا اللاعب');
        return;
      }
      
      // Ensure swap deck cards are available
      if (!window.swapDeckCardsData[playerParam]?.cards?.length) {
        console.log(`🎴 No swap cards for ${playerParam}, loading from swap-deck-selection...`);
        this.loadCardsFromSetup();
        
        // Check again after loading
        if (!window.swapDeckCardsData[playerParam]?.cards?.length) {
          console.error(`❌ Still no swap cards for ${playerParam}`);
          this.showToast('❌ لا توجد بطاقات متاحة لدكة البدلاء - يرجى العودة لصفحة اختيار دكة البدلاء');
          return;
        }
      }
      
      // Set current player
      this.currentPlayer = playerParam;
      
      // Get modal elements
      const modal = document.getElementById('swapDeckModal');
      const title = document.getElementById('swapDeckTitle');
      const currentCardDisplay = document.getElementById('currentCardDisplay');
      const swapCardsNumbers = document.getElementById('swapCardsNumbers');
      const confirmBtn = document.getElementById('confirmSwapBtn');
      
      console.log('🎴 Modal elements:', {
        modal: !!modal,
        title: !!title,
        currentCardDisplay: !!currentCardDisplay,
        swapCardsNumbers: !!swapCardsNumbers,
        confirmBtn: !!confirmBtn
      });
      
      if (!modal || !title || !currentCardDisplay || !swapCardsNumbers || !confirmBtn) {
        console.error('❌ Modal elements not found');
        return;
      }
      
      // Update title
      const playerName = playerParam === 'player1' ? 
        (localStorage.getItem('player1') || 'اللاعب الأول') : 
        (localStorage.getItem('player2') || 'اللاعب الثاني');
      title.textContent = `دكة البدلاء - ${playerName}`;
      
      // Show current card
      this.showCurrentCard(currentCardDisplay);
      
      // Show card numbers
      this.showCardNumbers(swapCardsNumbers, confirmBtn);
      
      // Show modal
      modal.classList.add('active');
      
      console.log(`✅ Swap deck modal opened for ${playerParam}`);
      
    } catch (error) {
      console.error('❌ Error opening swap deck modal:', error);
    }
  }

  /**
   * Close swap deck modal
   */
  closeSwapDeckModal() {
    try {
      const modal = document.getElementById('swapDeckModal');
      if (modal) {
        modal.classList.remove('active');
        
        // Reset all UI elements
        this.currentPlayer = null;
        this.selectedCardIndex = -1;
        
        // Reset number buttons
        const numberButtons = document.querySelectorAll('.card-number-btn');
        numberButtons.forEach(btn => {
          btn.classList.remove('selected');
        });
        
        // Hide selected card display
        const selectedCardDisplay = document.getElementById('selectedCardDisplay');
        if (selectedCardDisplay) {
          selectedCardDisplay.style.display = 'none';
        }
        
        // Reset confirm button
        const confirmBtn = document.getElementById('confirmSwapBtn');
        if (confirmBtn) {
          confirmBtn.disabled = true;
        }
        
        console.log('✅ Swap deck modal closed and UI reset');
      }
    } catch (error) {
      console.error('❌ Error closing swap deck modal:', error);
    }
  }

  /**
   * Get current card source from page element
   */
  getCurrentCardSrc(playerParam) {
    try {
      const cardElementId = playerParam === 'player1' ? 'rightCard' : 'leftCard';
      const cardElement = document.getElementById(cardElementId);
      
      console.log(`🎴 Getting current card for ${playerParam}:`, {
        cardElementId,
        cardElementFound: !!cardElement
      });
      
      if (cardElement) {
        const existingMedia = cardElement.querySelector('.card-media, img, video');
        
        if (existingMedia) {
          const src = existingMedia.src || existingMedia.getAttribute('src');
          console.log(`✅ Found media element with src: ${src}`);
          return src;
        } else {
          console.log('⚠️ No media element found in card');
        }
      } else {
        console.log('⚠️ Card element not found');
      }
      
      // Fallback to localStorage - try strategic picks first
      const playerKey = playerParam === 'player1' ? 'player1' : 'player2';
      const strategicPicksKey = `${playerKey}StrategicPicks`;
      const strategicPicks = JSON.parse(localStorage.getItem(strategicPicksKey) || '[]');
      
      if (strategicPicks.length > 0) {
        console.log(`🎴 Strategic picks fallback: ${strategicPicks[0]}`);
        return strategicPicks[0];
      }
      
      // Try old key for compatibility
      const localStorageSrc = localStorage.getItem(`${playerParam}CurrentCard`);
      console.log(`🎴 localStorage fallback: ${localStorageSrc}`);
      return localStorageSrc;
      
    } catch (error) {
      console.error('❌ Error getting current card src:', error);
      return null;
    }
  }

  /**
   * Show current card
   */
  showCurrentCard(container) {
    try {
      if (!this.currentPlayer) return;
      
      console.log(`🎴 Showing current card for ${this.currentPlayer}`);
      
      // Get current card source
      const currentCardSrc = this.getCurrentCardSrc(this.currentPlayer);
      
      if (currentCardSrc) {
        const media = this.createMedia(currentCardSrc);
        container.innerHTML = '';
        container.appendChild(media);
        console.log(`✅ Current card displayed: ${currentCardSrc}`);
      } else {
        container.innerHTML = '<div class="no-card">لا توجد بطاقة حالية</div>';
        console.log('⚠️ No current card found');
      }
      
    } catch (error) {
      console.error('❌ Error showing current card:', error);
      container.innerHTML = '<div class="no-card">خطأ في تحميل البطاقة الحالية</div>';
    }
  }

  /**
   * Show card numbers (1, 2, 3) for selection
   */
  showCardNumbers(container, confirmBtn) {
    try {
      container.innerHTML = '';
      this.selectedCardIndex = -1;
      confirmBtn.disabled = true;
      
      // Get swap deck cards for current player
      let swapCards = window.swapDeckCardsData[this.currentPlayer]?.cards || [];
      
      console.log(`🎴 Getting swap cards for ${this.currentPlayer}:`, swapCards);
      console.log('🎴 Global swap deck data:', window.swapDeckCardsData);
      
      // If no swap cards found, try to load them from swap-deck-selection.html
      if (!swapCards.length) {
        console.log('🎴 No swap cards found, trying to load from swap-deck-selection.html...');
        this.loadCardsFromSetup();
        swapCards = window.swapDeckCardsData[this.currentPlayer]?.cards || [];
        console.log('🎴 After loading:', swapCards);
      }
      
      if (!swapCards.length) {
        console.error('❌ No swap cards available for', this.currentPlayer);
        container.innerHTML = '<p style="color: #ff6b6b; text-align: center;">لا توجد بطاقات متاحة - يرجى العودة لصفحة اختيار دكة البدلاء</p>';
        return;
      }
      
      // Create number buttons based on available cards (should be exactly 3)
      const numCards = Math.min(swapCards.length, 3);
      for (let i = 1; i <= numCards; i++) {
        const numberBtn = document.createElement('button');
        numberBtn.className = 'card-number-btn';
        numberBtn.textContent = i;
        numberBtn.dataset.index = i - 1; // 0-based index
        
        // Add click handler
        numberBtn.addEventListener('click', () => {
          this.selectCardNumber(container, i - 1, confirmBtn);
        });
        
        container.appendChild(numberBtn);
      }
      
      console.log(`✅ Created ${numCards} number buttons for selected swap deck cards`);
      
    } catch (error) {
      console.error('❌ Error showing card numbers:', error);
      container.innerHTML = '<div class="error">خطأ في تحميل أرقام البطاقات</div>';
    }
  }

  /**
   * Select a card number and show the corresponding card
   */
  selectCardNumber(container, index, confirmBtn) {
    try {
      // Remove previous selection
      container.querySelectorAll('.card-number-btn').forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Select current number
      const selectedBtn = container.querySelector(`[data-index="${index}"]`);
      if (selectedBtn) {
        selectedBtn.classList.add('selected');
        this.selectedCardIndex = index;
        confirmBtn.disabled = false;
        
        // Show the selected card
        this.showSelectedCard(index);
        
        console.log(`✅ Selected card number ${index + 1}`);
      }
      
    } catch (error) {
      console.error('❌ Error selecting card number:', error);
    }
  }

  /**
   * Show the selected card preview
   */
  showSelectedCard(cardIndex) {
    try {
      const selectedCardDisplay = document.getElementById('selectedCardDisplay');
      const selectedCardPreview = document.getElementById('selectedCardPreview');
      
      if (!selectedCardDisplay || !selectedCardPreview) {
        console.error('❌ Selected card display elements not found');
        return;
      }
      
      // Get swap deck cards for current player
      const swapCards = window.swapDeckCardsData[this.currentPlayer]?.cards || [];
      
      if (!swapCards.length || cardIndex >= swapCards.length) {
        console.error('❌ No swap cards available or invalid index');
        selectedCardDisplay.style.display = 'none';
        return;
      }
      
      // Get the selected card from swap deck data
      const selectedCardSrc = swapCards[cardIndex];
      
      if (selectedCardSrc) {
        // Create media element
        const media = this.createMedia(selectedCardSrc);
        selectedCardPreview.innerHTML = '';
        selectedCardPreview.appendChild(media);
        
        // Show the display
        selectedCardDisplay.style.display = 'block';
        
        console.log(`✅ Showing selected card: ${selectedCardSrc}`);
      }
      
    } catch (error) {
      console.error('❌ Error showing selected card:', error);
    }
  }

  /**
   * Confirm swap
   */
  confirmSwap() {
    try {
      console.log('🎴 Confirming swap...');
      
      if (!this.currentPlayer || this.selectedCardIndex === -1) {
        this.showToast('⚠️ يرجى اختيار رقم البطاقة للتبديل');
        return;
      }
      
      // Get swap deck cards for current player
      const swapCards = window.swapDeckCardsData[this.currentPlayer]?.cards || [];
      
      if (!swapCards.length || this.selectedCardIndex >= swapCards.length) {
        this.showToast('❌ خطأ في اختيار البطاقة');
        return;
      }
      
      // Get the selected card from swap deck data
      const newCardSrc = swapCards[this.selectedCardIndex];
      
      if (!newCardSrc) {
        this.showToast('❌ خطأ في اختيار البطاقة');
        return;
      }
      
      // Perform the swap
      this.performSwap(this.currentPlayer, newCardSrc);
      
      // Mark as used
      window.swapDeckUsageData[this.currentPlayer] = true;
      
      // Save usage data to localStorage
      localStorage.setItem('swapDeckUsageData', JSON.stringify(window.swapDeckUsageData));
      console.log('✅ Saved swap deck usage data:', window.swapDeckUsageData);
      
      // Update button states
      this.updateButtonStates();
      
      // Close modal
      this.closeSwapDeckModal();
      
      // Show success message
      const playerName = this.currentPlayer === 'player1' ? 
        (localStorage.getItem('player1') || 'اللاعب الأول') : 
        (localStorage.getItem('player2') || 'اللاعب الثاني');
      
      this.showToast(`✅ تم تبديل البطاقة بنجاح للاعب ${playerName}`);
      
    } catch (error) {
      console.error('❌ Error confirming swap:', error);
    }
  }

  /**
   * Perform the actual swap
   */
  performSwap(playerParam, newCardSrc) {
    try {
      // Save new card to localStorage with the correct key
      const playerKey = playerParam === 'player1' ? 'player1' : 'player2';
      const strategicPicksKey = `${playerKey}StrategicPicks`;
      
      // Get current strategic picks
      const currentPicks = JSON.parse(localStorage.getItem(strategicPicksKey) || '[]');
      
      // Update the current round card with the new one
      const currentRound = parseInt(localStorage.getItem('currentRound') || '0');
      if (currentPicks.length > currentRound) {
        currentPicks[currentRound] = newCardSrc;
        localStorage.setItem(strategicPicksKey, JSON.stringify(currentPicks));
        console.log(`✅ Updated strategic picks for ${playerParam} round ${currentRound}:`, currentPicks);
      }
      
      // Also update StrategicOrdered if it exists
      const strategicOrderedKey = `${playerKey}StrategicOrdered`;
      const strategicOrdered = JSON.parse(localStorage.getItem(strategicOrderedKey) || '[]');
      if (strategicOrdered.length > currentRound) {
        strategicOrdered[currentRound] = newCardSrc;
        localStorage.setItem(strategicOrderedKey, JSON.stringify(strategicOrdered));
        console.log(`✅ Updated strategic ordered for ${playerParam} round ${currentRound}:`, strategicOrdered);
      }
      
      // Also update gameCardSelection if it exists
      const gameCardSelection = JSON.parse(localStorage.getItem('gameCardSelection') || '{}');
      if (gameCardSelection[`${playerKey}Cards`] && gameCardSelection[`${playerKey}Cards`].length > currentRound) {
        gameCardSelection[`${playerKey}Cards`][currentRound] = newCardSrc;
        localStorage.setItem('gameCardSelection', JSON.stringify(gameCardSelection));
        console.log(`✅ Updated gameCardSelection for ${playerParam} round ${currentRound}:`, gameCardSelection);
      }
      
      // Also save to the old key for compatibility
      localStorage.setItem(`${playerParam}CurrentCard`, newCardSrc);
      
      // Save the swapped card for this specific round for history display
      const swapRoundKey = `${playerKey}SwapRound${currentRound}`;
      localStorage.setItem(swapRoundKey, newCardSrc);
      console.log(`✅ Saved swapped card for round ${currentRound}: ${swapRoundKey} = ${newCardSrc}`);
      
      // Also save to a more specific key for debugging
      const debugKey = `debug_${playerKey}_round_${currentRound}_swapped`;
      localStorage.setItem(debugKey, newCardSrc);
      console.log(`🔍 Debug: Also saved to ${debugKey} = ${newCardSrc}`);
      
      // Update the card display on the page
      const cardElement = document.getElementById(playerParam === 'player1' ? 'rightCard' : 'leftCard');
      if (cardElement) {
        const media = this.createMedia(newCardSrc);
        cardElement.innerHTML = '';
        cardElement.appendChild(media);
      }
      
      // Force reload of card data to ensure consistency
      if (typeof refreshCardData === 'function') {
        refreshCardData();
        console.log('🔄 Forced card data refresh after swap');
      }
      
      console.log(`✅ Swapped card for ${playerParam}: ${newCardSrc}`);
      
    } catch (error) {
      console.error('❌ Error performing swap:', error);
    }
  }

  /**
   * Create media element (image or video)
   */
  createMedia(src) {
    const media = document.createElement(src.includes('.webm') ? 'video' : 'img');
    media.src = src;
    media.className = 'card-media';
    
    if (src.includes('.webm')) {
      media.autoplay = true;
      media.loop = true;
      media.muted = true;
    }
    
    return media;
  }

  /**
   * Show toast message
   */
  showToast(message) {
    try {
      // Create toast element
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        border: 2px solid #32c675;
        font-family: "Cairo", sans-serif;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      document.body.appendChild(toast);
      
      // Show toast
      setTimeout(() => {
        toast.style.opacity = '1';
      }, 100);
      
      // Hide toast
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error showing toast:', error);
    }
  }

  /**
   * Reset swap deck system (for new games)
   */
  resetSwapDeckSystem() {
    try {
      // Reset global variables
      window.swapDeckCardsGenerated = false;
      window.swapDeckCardsData = {
        player1: { cards: [], used: false },
        player2: { cards: [], used: false }
      };
      window.swapDeckUsageData = { player1: false, player2: false };
      
      // Update button states
      this.updateButtonStates();
      
      console.log('🔄 Swap deck system reset for new game');
      
    } catch (error) {
      console.error('❌ Error resetting swap deck system:', error);
    }
  }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add a small delay to ensure all elements are loaded
  setTimeout(() => {
    // Force reset if we're in round 0 (new game) AND it's truly a new game
    const currentRound = parseInt(localStorage.getItem('currentRound') || '0');
    const gameSetupProgress = localStorage.getItem('gameSetupProgress');
    const gameStatus = localStorage.getItem('gameStatus');
    
    if (currentRound === 0 && !gameSetupProgress && gameStatus !== 'finished') {
      console.log('🎴 Round 0 detected (new game) - clearing swap deck usage data');
      localStorage.removeItem('swapDeckUsageData');
    }
    
    window.swapDeckSystem = new SwapDeckSystem();
    
    // Make force reset available globally for debugging
    window.resetSwapDeckSystem = function() {
      if (window.swapDeckSystem) {
        window.swapDeckSystem.forceReset();
      }
    };
    
    // Make reset for new game available globally
    window.resetSwapDeckForNewGame = function() {
      if (window.swapDeckSystem) {
        window.swapDeckSystem.resetForNewGame();
      }
    };
    
    console.log('🎴 Swap Deck System initialized. Use resetSwapDeckSystem() to force reset if needed.');
  }, 100);
});