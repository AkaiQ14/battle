// Card Manager for Netlify compatibility
class CardManager {
  constructor() {
    this.cardDatabase = {
      common: [],
      epic: [],
      legendary: []
    };
    this.initializeCardDatabase();
  }

  // Initialize card database with all available cards
  initializeCardDatabase() {
    // All cards are now in a single 'cards' directory
    // Common cards (80% of total)
    this.cardDatabase.common = [
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

    // Epic cards (15% of total)
    this.cardDatabase.epic = [
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

    // Legendary cards (5% of total)
    this.cardDatabase.legendary = [
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
  }

  // Generate random cards for a player
  generateRandomCards(totalCards = 20) {
    const commonCount = Math.floor(totalCards * 0.85); // 85% common
    const epicLegendaryCount = totalCards - commonCount; // 15% epic+legendary

    const selectedCards = [];

    // Select common cards
    const shuffledCommon = [...this.cardDatabase.common].sort(() => Math.random() - 0.5);
    selectedCards.push(...shuffledCommon.slice(0, commonCount));

    // Select epic and legendary cards (combined 15%)
    const epicLegendaryCards = [...this.cardDatabase.epic, ...this.cardDatabase.legendary];
    const shuffledEpicLegendary = [...epicLegendaryCards].sort(() => Math.random() - 0.5);
    selectedCards.push(...shuffledEpicLegendary.slice(0, epicLegendaryCount));

    // Shuffle final selection
    const shuffledCards = selectedCards.sort(() => Math.random() - 0.5);
    
    // Ensure positions 14 and 10 (0-indexed: 13 and 9) always get strong cards
    const strongCards = [...this.cardDatabase.epic, ...this.cardDatabase.legendary];
    const shuffledStrong = [...strongCards].sort(() => Math.random() - 0.5);
    
    // Replace cards at positions 9 and 13 with strong cards
    if (shuffledCards.length > 13) {
      shuffledCards[9] = shuffledStrong[0] || shuffledCards[9]; // Position 10
      shuffledCards[13] = shuffledStrong[1] || shuffledCards[13]; // Position 14
    }
    
    return shuffledCards;
  }

  // Create media element (image or video)
  createMediaElement(url, className, onClick) {
    // Use the URL as-is since all cards are in the cards/ directory
    const isWebm = /\.webm(\?|#|$)/i.test(url);
    
    if (isWebm) {
      const video = document.createElement("video");
      video.src = url;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.className = className;
      if (onClick) video.onclick = onClick;
      return video;
    } else {
      const img = document.createElement("img");
      img.src = url;
      img.className = className;
      if (onClick) img.onclick = onClick;
      return img;
    }
  }

  // Validate card path and return corrected path
  validateCardPath(path) {
    if (!path || typeof path !== 'string') {
      return null;
    }

    // Convert old paths to new cards/ directory structure
    let correctedPath = path;
    
    // Remove any CARD/ prefix
    correctedPath = correctedPath.replace(/^CARD\//, '');
    
    // Convert old directory structure to new cards/ structure
    if (correctedPath.startsWith('Common/')) {
      correctedPath = correctedPath.replace('Common/', 'cards/');
    } else if (correctedPath.startsWith('Epic/')) {
      correctedPath = correctedPath.replace('Epic/', 'cards/');
    } else if (correctedPath.startsWith('Legendray/')) {
      correctedPath = correctedPath.replace('Legendray/', 'cards/');
    } else if (!correctedPath.startsWith('cards/') && !correctedPath.startsWith('http')) {
      // If it doesn't start with cards/ and isn't a full URL, add cards/ prefix
      correctedPath = 'cards/' + correctedPath;
    }
    
    // Fix common naming inconsistencies
    correctedPath = correctedPath
      .replace(/-card\.(png|webp|webm)/g, '.$1')
      .replace(/_card\.(png|webp|webm)/g, '.$1')
      .replace(/cardo20ppsd\.webp/g, 'cardo20ppsd.webp')
      .replace(/Vegapunk-crad\.webp/g, 'Vegapunk-crad.webp');

    return correctedPath;
  }

  // Clear old localStorage data
  clearOldData() {
    try {
      // Clear old card data that might have wrong paths
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('StrategicPicks') || key.includes('StrategicOrdered')) {
          localStorage.removeItem(key);
          console.log('Cleared old data:', key);
        }
      });
    } catch (e) {
      console.error('Error clearing old data:', e);
    }
  }

  // Load cards from localStorage with fallback
  loadPlayerCards(playerParam) {
    const PICKS_LOCAL_KEY = `${playerParam}StrategicPicks`;
    
    try {
      // Try to load from localStorage first
      const savedPicks = JSON.parse(localStorage.getItem(PICKS_LOCAL_KEY) || '[]');
      
      if (Array.isArray(savedPicks) && savedPicks.length > 0) {
        const cards = savedPicks.map(card => {
          if (typeof card === 'string') {
            return this.validateCardPath(card);
          }
          if (card && card.src) {
            return this.validateCardPath(card.src);
          }
          return null;
        }).filter(Boolean);
        
        if (cards.length > 0) {
          console.log('Loaded cards from localStorage:', cards);
          return cards;
        }
      }
    } catch (e) {
      console.error('Error loading cards from localStorage:', e);
    }

    // Fallback: generate random cards
    console.log('Generating random cards as fallback');
    return this.generateRandomCards(20);
  }

  // Save cards to localStorage
  savePlayerCards(playerParam, cards) {
    const PICKS_LOCAL_KEY = `${playerParam}StrategicPicks`;
    
    try {
      localStorage.setItem(PICKS_LOCAL_KEY, JSON.stringify(cards));
      console.log('Saved cards to localStorage:', cards);
    } catch (e) {
      console.error('Error saving cards to localStorage:', e);
    }
  }

  // Get all available cards by category
  getAllCardsByCategory(category) {
    return this.cardDatabase[category] || [];
  }

  // Get all available cards
  getAllCards() {
    return [
      ...this.cardDatabase.common,
      ...this.cardDatabase.epic,
      ...this.cardDatabase.legendary
    ];
  }
}

// Create global instance
window.cardManager = new CardManager();