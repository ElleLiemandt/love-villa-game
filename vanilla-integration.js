/**
 * Vanilla JS Integration for Single-Speaker Layout
 * 
 * This provides a bridge between the existing vanilla JS game system
 * and the new single-speaker TypeScript components.
 * 
 * Use this if you want to integrate the new layout without full React migration.
 */

class VanillaSingleSpeaker {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.currentIndex = 0;
        this.lines = [];
        this.onComplete = options.onComplete || (() => {});
        this.USE_SINGLE_SPEAKER = options.useSingleSpeaker !== false; // Default true
        
        this.setupKeyboardControls();
        this.setupStyles();
    }
    
    /**
     * Display dialogue lines using single-speaker layout
     * @param {Array} lines - Array of {id, speakerId, text, scene}
     */
    showDialogue(lines) {
        this.lines = lines;
        this.currentIndex = 0;
        
        if (this.USE_SINGLE_SPEAKER) {
            this.renderSingleSpeaker();
        } else {
            this.renderStackedBubbles(); // Fallback to old system
        }
    }
    
    renderSingleSpeaker() {
        if (!this.lines[this.currentIndex]) {
            this.onComplete();
            return;
        }
        
        const line = this.lines[this.currentIndex];
        const character = this.getCharacter(line.speakerId);
        
        // Set scene background
        this.setSceneBackground(line.scene);
        
        // Create single speaker HTML
        this.container.innerHTML = `
            <div class="single-speaker-layout">
                <div class="speaker-line-container">
                    <div class="speaker-avatar">
                        <div class="avatar-ring" style="border-color: ${character.color};">
                            <img src="/assets/avatars/${character.avatar}" 
                                 alt="${character.name}"
                                 class="avatar-image"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="avatar-fallback" style="display: none; background: ${character.color};">
                                ${character.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="speech-bubble">
                        <div class="bubble-tail"></div>
                        <div class="bubble-content">
                            <div class="speaker-name" style="color: ${character.color};">
                                ${character.name}
                            </div>
                            <div class="speech-text">
                                ${line.text}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="progress-indicator">
                    <span class="desktop-hint">Press Space or Enter to continue</span>
                    ${this.currentIndex + 1} / ${this.lines.length}
                </div>
            </div>
        `;
        
        // Add fade-in animation
        this.container.querySelector('.speaker-line-container').style.animation = 
            'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    }
    
    renderStackedBubbles() {
        // Preserve old stacked bubble rendering for rollback
        console.log('Using legacy stacked bubble layout');
        // ... existing bubble rendering logic ...
    }
    
    advanceLine() {
        if (this.currentIndex < this.lines.length - 1) {
            this.currentIndex++;
            this.renderSingleSpeaker();
        } else {
            this.onComplete();
        }
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.advanceLine();
            }
        });
    }
    
    setSceneBackground(scene) {
        const backgrounds = {
            'day': '/assets/backgrounds/villa_day.png',
            'gossip': '/assets/backgrounds/villa_day.png', 
            'night': '/assets/backgrounds/villa_night.png',
            'firepit': '/assets/backgrounds/villa_night.png'
        };
        
        document.body.style.backgroundImage = `url('${backgrounds[scene] || backgrounds.day}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }
    
    getCharacter(speakerId) {
        const characters = {
            ariana: { name: 'Ariana Madix', avatar: 'ariana.png', color: '#E91E63' },
            jana: { name: 'JaNa', avatar: 'jana.png', color: '#FF8C42' },
            nic: { name: 'Nic', avatar: 'nic.png', color: '#34495E' },
            leah: { name: 'Leah', avatar: 'leah.png', color: '#E2B547' },
            serena: { name: 'Serena', avatar: 'serena.png', color: '#FF6B9D' },
            huda: { name: 'Huda', avatar: 'huda.png', color: '#E67E22' },
            amaya: { name: 'Amaya', avatar: 'amaya.png', color: '#C8102E' },
            rob: { name: 'Rob', avatar: 'rob.png', color: '#2980B9' },
            olandria: { name: 'Olandria', avatar: 'olandria.png', color: '#8E44AD' }
        };
        
        return characters[speakerId] || characters.ariana;
    }
    
    setupStyles() {
        // Inject CSS for single-speaker layout
        const styles = `
            <style>
            .single-speaker-layout {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 3rem 1.5rem;
                position: relative;
            }
            
            .speaker-line-container {
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 1000px;
                margin: 0 auto;
                opacity: 0;
            }
            
            .speaker-avatar {
                flex-shrink: 0;
            }
            
            .avatar-ring {
                width: 64px;
                height: 64px;
                border: 3px solid #e91e63;
                border-radius: 50%;
                padding: 2px;
                background: white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .avatar-image {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }
            
            .avatar-fallback {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            }
            
            .speech-bubble {
                flex: 1;
                max-width: min(720px, 72vw);
                position: relative;
                margin-left: 12px;
            }
            
            .bubble-tail {
                position: absolute;
                left: -12px;
                top: 24px;
                width: 0;
                height: 0;
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
                border-right: 12px solid white;
            }
            
            .bubble-content {
                background: white;
                border-radius: 16px;
                padding: 1rem 1.5rem;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                border-left: 4px solid #e91e63;
            }
            
            .speaker-name {
                font-weight: bold;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 0.5rem;
            }
            
            .speech-text {
                color: #2c2c2c;
                line-height: 1.6;
                font-size: 1rem;
            }
            
            .progress-indicator {
                position: fixed;
                bottom: 1.5rem;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 25px;
                font-size: 0.875rem;
                backdrop-filter: blur(10px);
            }
            
            .desktop-hint {
                margin-right: 0.5rem;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(12px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @media (max-width: 768px) {
                .single-speaker-layout {
                    padding: 2rem 1rem;
                }
                
                .avatar-ring {
                    width: 56px;
                    height: 56px;
                }
                
                .desktop-hint {
                    display: none;
                }
                
                .speech-text {
                    font-size: 0.9rem;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Usage example:
// const speaker = new VanillaSingleSpeaker('dialogue-container', {
//     useSingleSpeaker: true,
//     onComplete: () => console.log('Dialogue finished!')
// });
// 
// speaker.showDialogue([
//     { id: '1', speakerId: 'ariana', text: 'Welcome to the villa!', scene: 'day' },
//     { id: '2', speakerId: 'jana', text: 'This is so exciting!', scene: 'day' }
// ]);

window.VanillaSingleSpeaker = VanillaSingleSpeaker;
