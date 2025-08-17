// Avatar Selection Handler for Love Island Game
class BombshellSelector {
    constructor() {
        this.selectedAvatar = null;
        this.bombshells = [];
        this.initialized = false;
    }

    async init() {
        if (this.initialized) {
            console.log('Bombshell Selector already initialized, skipping...');
            return;
        }
        
        console.log('Initializing Bombshell Selector...');
        
        // Clear any existing data
        this.bombshells = [];
        
        // Auto-discover images in the bombshells folder
        await this.discoverBombshells();
        
        // Build the UI
        this.buildGrid();
        
        // Setup event handlers
        this.setupEventHandlers();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        this.initialized = true;
    }

    async discoverBombshells() {
        // Check for Elle and Maddie
        const bombshellFiles = [
            'elle.png',
            'maddie.png'
        ];
        
        // Start fresh
        this.bombshells = [];
        
        for (const filename of bombshellFiles) {
            const path = `/public/assets/bombshells/${filename}`;
            
            // Check if the image exists by trying to load it
            const exists = await this.checkImageExists(path);
            if (exists) {
                const name = this.formatName(filename);
                
                // Check if already added (prevent duplicates)
                const alreadyExists = this.bombshells.some(b => b.filename === filename);
                if (!alreadyExists) {
                    this.bombshells.push({
                        name: name,
                        path: path,
                        filename: filename
                    });
                }
            }
        }
        
        // Fallback if no images found
        if (this.bombshells.length === 0) {
            this.bombshells.push({
                name: 'Elle (Fallback)',
                path: '/public/assets/avatars/silhouette.png',
                filename: 'fallback.png'
            });
        }
        
        console.log('BOMBSHELLS FOUND', this.bombshells.map(b => b.filename));
    }

    checkImageExists(path) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = path;
        });
    }

    formatName(filename) {
        // Remove extension
        let name = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '');
        
        // Replace underscores and dashes with spaces
        name = name.replace(/[_-]/g, ' ');
        
        // Capitalize first letter of each word
        name = name.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        
        return name;
    }

    buildGrid() {
        const grid = document.getElementById('bombshellGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        // Only build cards for unique bombshells
        console.log(`Building grid with ${this.bombshells.length} bombshells:`, this.bombshells.map(b => b.name));
        
        this.bombshells.forEach((bombshell, index) => {
            const card = document.createElement('div');
            card.className = 'bombshell-card';
            card.setAttribute('data-index', index);
            card.setAttribute('data-name', bombshell.name);
            card.setAttribute('data-path', bombshell.path);
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Select ${bombshell.name}`);
            
            const avatar = document.createElement('img');
            avatar.className = 'bombshell-avatar';
            avatar.src = bombshell.path;
            avatar.alt = bombshell.name;
            
            const name = document.createElement('div');
            name.className = 'bombshell-name';
            name.textContent = bombshell.name;
            
            card.appendChild(avatar);
            card.appendChild(name);
            
            // Click handler
            card.addEventListener('click', () => this.selectBombshell(index));
            
            // Keyboard handler for enter/space on focused card
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectBombshell(index);
                }
            });
            
            grid.appendChild(card);
        });
        
        // Focus first card
        const firstCard = grid.querySelector('.bombshell-card');
        if (firstCard) {
            firstCard.focus();
        }
    }

    selectBombshell(index) {
        const bombshell = this.bombshells[index];
        if (!bombshell) return;
        
        // Update selection state
        this.selectedAvatar = bombshell;
        
        // Update UI
        const cards = document.querySelectorAll('.bombshell-card');
        cards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        
        // Enable confirm button
        const confirmBtn = document.getElementById('bombshellConfirm');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.classList.add('enabled');
            confirmBtn.textContent = `Start as ${bombshell.name}`;
        }
        
        console.log('BOMBSHELL SELECTED', { name: bombshell.name, path: bombshell.path });
    }

    confirmSelection() {
        if (!this.selectedAvatar) return;
        
        // Save to localStorage
        localStorage.setItem('player.avatar.path', this.selectedAvatar.path);
        localStorage.setItem('player.avatar.name', this.selectedAvatar.name);
        localStorage.setItem('player.id', 'you');
        
        console.log('PLAYER AVATAR SET', {
            path: this.selectedAvatar.path,
            name: this.selectedAvatar.name,
            id: 'you'
        });
        
        // Create the avatar HUD immediately
        this.createInitialAvatarHUD();
        
        // Preload the avatar
        const img = new Image();
        img.src = this.selectedAvatar.path;
        
        // Navigate to episode view
        this.navigateToEpisode();
    }
    
    createInitialAvatarHUD() {
        const existingAvatar = document.getElementById('playerAvatarHUD');
        if (existingAvatar) existingAvatar.remove();
        
        const avatarHUD = document.createElement('div');
        avatarHUD.id = 'playerAvatarHUD';
        avatarHUD.className = 'player-avatar-hud';
        avatarHUD.innerHTML = `
            <img src="${this.selectedAvatar.path}" alt="${this.selectedAvatar.name}" class="player-avatar-img">
            <span class="player-avatar-name">${this.selectedAvatar.name}</span>
        `;
        
        document.body.appendChild(avatarHUD);
    }

    navigateToEpisode() {
        // Hide bombshell view
        const bombshellView = document.getElementById('bombshellView');
        if (bombshellView) {
            bombshellView.style.display = 'none';
        }
        
        // Show episode view
        const nextView = document.getElementById('nextView');
        if (nextView) {
            nextView.style.display = 'flex';
            document.body.classList.remove('bombshell-active');
            document.body.classList.add('next-active');
        }
        
        // Initialize episode dialog
        if (window.initEpisodeDialog) {
            window.initEpisodeDialog();
        }
    }

    setupEventHandlers() {
        // Confirm button
        const confirmBtn = document.getElementById('bombshellConfirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmSelection());
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only handle if bombshell view is visible
            const bombshellView = document.getElementById('bombshellView');
            if (!bombshellView || bombshellView.style.display === 'none') return;
            
            const cards = Array.from(document.querySelectorAll('.bombshell-card'));
            const focusedCard = document.activeElement;
            const currentIndex = cards.indexOf(focusedCard);
            
            if (currentIndex === -1) return;
            
            let newIndex = currentIndex;
            
            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    newIndex = (currentIndex + 1) % cards.length;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    newIndex = (currentIndex - 1 + cards.length) % cards.length;
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    // Move down in grid
                    const cols = Math.floor(cards[0].parentElement.offsetWidth / cards[0].offsetWidth);
                    newIndex = Math.min(currentIndex + cols, cards.length - 1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    // Move up in grid
                    const colsUp = Math.floor(cards[0].parentElement.offsetWidth / cards[0].offsetWidth);
                    newIndex = Math.max(currentIndex - colsUp, 0);
                    break;
            }
            
            if (newIndex !== currentIndex && cards[newIndex]) {
                cards[newIndex].focus();
            }
        });
    }

    show() {
        const bombshellView = document.getElementById('bombshellView');
        if (bombshellView) {
            bombshellView.style.display = 'flex';
            document.body.classList.add('bombshell-active');
        }
    }
}

// Initialize when called
window.initBombshellSelector = async function() {
    console.log('initBombshellSelector called');
    if (!window.bombshellSelector) {
        console.log('Creating new BombshellSelector instance');
        window.bombshellSelector = new BombshellSelector();
    } else {
        console.log('Using existing BombshellSelector instance');
    }
    await window.bombshellSelector.init();
    window.bombshellSelector.show();
};

// Check if player has already selected an avatar
window.checkPlayerAvatar = function() {
    const avatarPath = localStorage.getItem('player.avatar.path');
    const avatarName = localStorage.getItem('player.avatar.name');
    
    if (avatarPath && avatarName) {
        // Player has already selected, skip to episode
        console.log('Player avatar already selected:', avatarName);
        return true;
    }
    return false;
};
