// Landing Screen Handler
// This file manages the new landing screen and navigation to NextView

class LandingHandler {
    constructor() {
        this.initialized = false;
        this.keyboardHandler = null;
    }
    
    cleanup() {
        // Clean up any event listeners
        this.initialized = false;
        this.keyboardHandler = null;
    }
    
    init() {
        // Allow re-initialization after reset
        this.initialized = false;
        
        console.log('LANDING READY — bg=/public/assets/backgrounds/Newbackground.png');
        
        // Check if Newbackground.png exists
        const testImg = new Image();
        testImg.onerror = () => {
            console.log('ERROR: /public/assets/backgrounds/Newbackground.png not found');
            console.log('Tried path: /public/assets/backgrounds/Newbackground.png');
            console.log('Using fallback background from existing assets');
        };
        testImg.onload = () => {
            console.log('SUCCESS: Background loaded from /public/assets/backgrounds/Newbackground.png');
        };
        testImg.src = '/public/assets/backgrounds/Newbackground.png';
        
        // Show landing view
        this.showLandingView();
        
        // Setup keyboard navigation
        this.setupKeyboardSupport();
        
        this.initialized = true;
    }
    
    showLandingView() {
        // Hide game container
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.style.display = 'none';
        }
        
        // Show landing view
        const landingView = document.getElementById('landingView');
        if (landingView) {
            landingView.style.display = 'flex';
            document.body.classList.add('landing-active');
        }
    }
    
    setupKeyboardSupport() {
        const ctaButton = document.getElementById('landingCTA');
        if (!ctaButton) return;
        
        // Remove any existing listeners
        const newButton = ctaButton.cloneNode(true);
        ctaButton.parentNode.replaceChild(newButton, ctaButton);
        
        // Add keyboard support
        newButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.navigateToNext();
            }
        });
        
        // Add click handler
        newButton.addEventListener('click', () => {
            this.navigateToNext();
        });
    }
    
    navigateToNext() {
        console.log('CTA CLICKED — navigating to NextView');
        
        // Animate button
        const ctaButton = document.getElementById('landingCTA');
        if (ctaButton) {
            ctaButton.style.transform = 'scale(0.95)';
            ctaButton.style.opacity = '0.8';
        }
        
        // Navigate after animation
        setTimeout(() => {
            this.showNextView();
        }, 200);
    }
    
    showNextView() {
        // Check if player has already selected an avatar
        if (window.checkPlayerAvatar && window.checkPlayerAvatar()) {
            // Player already has avatar, go directly to episode
            this.navigateToEpisode();
        } else {
            // Show bombshell selector
            this.navigateToBombshellSelector();
        }
    }
    
    navigateToBombshellSelector() {
        console.log('Navigating to Choose Your Bombshell...');
        
        // Hide landing view
        const landingView = document.getElementById('landingView');
        if (landingView) {
            landingView.style.display = 'none';
        }
        
        // Initialize and show bombshell selector
        if (window.initBombshellSelector) {
            window.initBombshellSelector();
        }
    }
    
    navigateToEpisode() {
        console.log('NEXTVIEW READY (episode)');
        
        // Hide landing view
        const landingView = document.getElementById('landingView');
        if (landingView) {
            landingView.style.display = 'none';
        }
        
        // Create avatar HUD if player already has one
        this.createAvatarHUDIfExists();
        
        // Show next view
        const nextView = document.getElementById('nextView');
        if (nextView) {
            nextView.style.display = 'flex';
            document.body.classList.remove('landing-active');
            document.body.classList.add('next-active');
        }
        
        // Initialize episode dialog
        if (window.initEpisodeDialog) {
            window.initEpisodeDialog();
        }
    }
    
    createAvatarHUDIfExists() {
        const avatarPath = localStorage.getItem('player.avatar.path');
        const avatarName = localStorage.getItem('player.avatar.name');
        
        if (avatarPath && avatarName) {
            const existingAvatar = document.getElementById('playerAvatarHUD');
            if (existingAvatar) existingAvatar.remove();
            
            const avatarHUD = document.createElement('div');
            avatarHUD.id = 'playerAvatarHUD';
            avatarHUD.className = 'player-avatar-hud';
            avatarHUD.innerHTML = `
                <img src="${avatarPath}" alt="${avatarName}" class="player-avatar-img">
                <span class="player-avatar-name">${avatarName}</span>
            `;
            
            document.body.appendChild(avatarHUD);
        }
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    window.landingHandler = new LandingHandler();
    window.landingHandler.init();
});

// Make navigateToNext available globally for onclick handler
window.navigateToNext = () => {
    if (window.landingHandler) {
        window.landingHandler.navigateToNext();
    }
};

// Make navigateToBombshellSelector available globally for redirection
window.navigateToBombshellSelector = () => {
    if (window.landingHandler) {
        window.landingHandler.navigateToBombshellSelector();
    }
};
