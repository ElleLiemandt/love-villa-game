/**
 * Love Island USA: Villa Parody Game
 * A choose-your-own-adventure demo inspired by Seasons 6 & 7
 */

class LoveIslandGame {
    constructor() {
        this.gameState = {
            day: 1,
            love: 0,         // New love meter, starts at 0
            drama: 0,        // New drama meter, starts at 0
            flags: {},       // Narrative flags for branching
            currentScene: null,
            mathAnswer: null,
            mathCorrect: false,
            isDumped: false,
            vibeHints: [],
            screenState: 'LANDING'  // Screen state management
        };
        
        // Constants
        this.DRAMA_BOOT = 9; // Drama threshold for elimination
        
        this.currentMathProblem = null;
        this.debugMode = false; // Set to true to show meters
        
        // Single-line dialogue system
        this.currentDialogueSet = [];
        this.currentDialogueIndex = 0;
        this.keyboardListener = null;
        this.currentStepType = 'say'; // 'say' or 'ask'
        this.isInChoice = false;
        this.isInIntro = false; // Track if we're in the intro sequence
        
        // Story engine
        this.isInStory = false;
        this.currentStoryProgress = null;
        this.currentStorySteps = [];
        this.currentStoryStepIndex = 0;
        
        // Transition flag
        this.isTransitioning = false;
        
        // Initialize the game
        this.init();
        
        // Load saved meters from localStorage
        this.loadMeters();
    }
    
    init() {
        // Enable debug mode with URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        this.debugMode = urlParams.has('debug');
        
        if (this.debugMode) {
            document.getElementById('debugInfo').style.display = 'block';
            this.updateDebugInfo();
        }
        
        // Initialize avatar system
        this.initializeAvatars();
        
        // Set up meter HUD
        this.createMeterHUD();
        this.updateMeterHUD();
        
        // Initialize state machine
        this.initializeStateMachine();
        
        console.log('SINGLE-LINE STORY MODE ACTIVE');
    }
    
    initializeStateMachine() {
        // Show landing screen first
        this.gameState.screenState = 'LANDING';
        console.log('Initializing state machine, screenState:', this.gameState.screenState);
        console.log('Showing landing screen');
        // Don't render here - let landing.js handle it
        
        // Load and preload assets
        this.preloadAssets();
    }
    
    preloadAssets() {
        // Preload beach background
        const beachImg = new Image();
        beachImg.src = 'public/assets/avatars/Newbackground.png';
        
        // Villa background is set in CSS
        this.villaBackgroundPath = 'public/assets/backgrounds/villa_day.png';
        console.log('Assets preloaded');
    }
    
    renderCurrentScreen() {
        const { screenState } = this.gameState;
        console.log('renderCurrentScreen called with state:', screenState);
        
        switch (screenState) {
            case 'LANDING':
                this.renderLandingView();
                break;
            case 'INTRO':
                this.renderIntroView();
                break;
            case 'PLAY':
                this.renderPlayView();
                break;
            default:
                console.error('Unknown screen state:', screenState);
        }
    }
    
    // LANDING VIEW
    renderLandingView() {
        // Set body class for styling
        document.body.className = 'landing-active';
        
        // Hide all game screens
        this.hideAllScreens();
        
        // Show intro screen with landing styling
        const introScreen = document.getElementById('introScreen');
        if (introScreen) {
            introScreen.style.display = 'flex';
            // Background already set in CSS, no need to override
        }
        
        // Show villa enter button
        const villaBtn = document.getElementById('villaEnterBtn');
        if (villaBtn) {
            villaBtn.style.display = 'block';
            villaBtn.style.opacity = '1';
        }
        
        console.log('LANDING READY (newbackground)');
        console.log('Starting 5-second timer...');
        
        // Clear any existing timers
        if (this.landingTimer) {
            clearTimeout(this.landingTimer);
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        // Start countdown display
        let countdown = 5;
        const countdownText = document.getElementById('countdownText');
        if (countdownText) {
            countdownText.textContent = `Starting in ${countdown}...`;
            countdownText.style.display = 'block';
            
            // Update countdown every second
            this.countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    countdownText.textContent = `Starting in ${countdown}...`;
                } else {
                    countdownText.textContent = 'Welcome to Love Island...';
                }
            }, 1000);
        }
        
        // Auto-transition after 5 seconds
        this.landingTimer = setTimeout(() => {
            console.log('5 seconds elapsed - auto-transitioning to intro');
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
            this.transitionToIntro();
        }, 5000);
    }
    
    // Button click handler
    enterVilla() {
        // Prevent double-clicking
        if (this.isTransitioning) return;
        
        console.log('LANDING BUTTON CLICKED');
        if (!this.gameState) {
            console.error('Game state not initialized!');
            return;
        }
        this.transitionToIntro();
    }
    
    setupLandingKeyListener() {
        // Remove existing listeners
        this.removeAllKeyListeners();
        
        this.landingKeyListener = (event) => {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                this.transitionToIntro();
            }
        };
        document.addEventListener('keydown', this.landingKeyListener);
    }
    
    transitionToIntro() {
        // Set transition flag
        this.isTransitioning = true;
        
        // Clear landing timer and countdown if they exist
        if (this.landingTimer) {
            clearTimeout(this.landingTimer);
            this.landingTimer = null;
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        console.log('LANDING → INTRO');
        console.log('Current screenState before transition:', this.gameState.screenState);
        
        const villaBtn = document.getElementById('villaEnterBtn');
        const countdownText = document.getElementById('countdownText');
        const fadeOverlay = document.getElementById('introFadeOverlay');
        
        // Fade out button and countdown
        if (villaBtn) {
            villaBtn.style.opacity = '0';
            villaBtn.style.pointerEvents = 'none';
            console.log('Button faded out');
        }
        if (countdownText) {
            countdownText.style.opacity = '0';
        }
        
        // Activate fade overlay
        if (fadeOverlay) {
            fadeOverlay.classList.add('active');
            console.log('Fade overlay activated');
        }
        
        // Remove any key listeners
        this.removeAllKeyListeners();
        
        // After fade, switch to intro
        setTimeout(() => {
            console.log('Switching to INTRO state...');
            this.gameState.screenState = 'INTRO';
            console.log('New screenState:', this.gameState.screenState);
            this.renderCurrentScreen();
            this.isTransitioning = false;  // Clear transition flag
        }, 300);
    }
    
    // INTRO VIEW
    renderIntroView() {
        console.log('renderIntroView called');
        
        // Set body class for styling
        document.body.className = 'intro-active';
        
        // Hide landing screen completely
        const introScreen = document.getElementById('introScreen');
        if (introScreen) {
            introScreen.style.display = 'none';
            console.log('Landing screen hidden');
        }
        
        // Clear fade overlay
        const fadeOverlay = document.getElementById('introFadeOverlay');
        if (fadeOverlay) {
            fadeOverlay.classList.remove('active');
        }
        
        // Show reactions area and start Ariana's intro
        this.hideAllScreens();
        this.showElement('reactions');
        
        // Set up Ariana's intro script
        this.setupIntroScript();
        
        console.log('INTRO SCREEN READY');
    }
    
    setupIntroScript() {
        // Ariana's intro dialogue
        this.introSteps = [
            { speaker: 'ariana', text: "Welcome to the villa, babe! 🌴 I'm Ariana, your host — and trust me, this summer is going to get messy." },
            { speaker: 'ariana', text: "You'll be living with a colorful group of islanders, each with their own drama, secrets, and charm." }
        ];
        
        this.currentIntroIndex = 0;
        this.isInIntro = true;
        this.setupIntroKeyListener();
        this.renderCurrentIntroStep();
    }
    
    setupIntroKeyListener() {
        this.removeAllKeyListeners();
        
        this.introKeyListener = (event) => {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                this.advanceIntroStep();
            }
        };
        document.addEventListener('keydown', this.introKeyListener);
    }
    
    renderCurrentIntroStep() {
        const step = this.introSteps[this.currentIntroIndex];
        if (!step) return;
        
        const character = this.getCharacterInfo(step.speaker);
        
        // Render single line view
        const reactionsDiv = document.getElementById('reactions');
        if (reactionsDiv) {
            reactionsDiv.innerHTML = `
                <div class="single-line-container">
                    <div class="single-line-view" data-speaker="${step.speaker}">
                        <div class="speaker-avatar">
                            <div class="avatar-circle" style="border-color: ${character.accentColor};">
                                <img src="${character.avatarSrc}" 
                                     alt="${character.name}" 
                                     class="avatar-image"
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                <div class="avatar-fallback" 
                                     style="background: ${character.accentColor}; display: none;">
                                    ${character.name.charAt(0)}
                                </div>
                            </div>
                        </div>
                        <div class="speech-bubble">
                            <div class="bubble-content">${step.text}</div>
                            <div class="bubble-tail"></div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    advanceIntroStep() {
        this.currentIntroIndex++;
        
        if (this.currentIntroIndex >= this.introSteps.length) {
            // For now, just log that we've reached the end of the intro lines
            console.log('INTRO lines complete (staying in INTRO)');
            // Don't transition to PLAY yet - just stay in INTRO
        } else {
            this.renderCurrentIntroStep();
        }
    }
    
    preloadVillaBackground() {
        // Try to preload villa-bg-day.png, fallback to villa_day.png
        const villaImg = new Image();
        villaImg.onload = () => {
            console.log('Villa background preloaded: villa-bg-day.png');
            this.villaBackgroundPath = 'public/assets/villa-bg-day.png';
        };
        villaImg.onerror = () => {
            console.log('villa-bg-day.png not found, using fallback: villa_day.png');
            this.villaBackgroundPath = 'public/assets/backgrounds/villa_day.png';
            
            // Preload fallback
            const fallbackImg = new Image();
            fallbackImg.src = this.villaBackgroundPath;
        };
        villaImg.src = 'public/assets/villa-bg-day.png';
    }
    
    transitionToIntro() {
        console.log('LANDING → INTRO');
        
        const fadeOverlay = document.getElementById('introFadeOverlay');
        const spaceHint = document.getElementById('spaceHint');
        
        // Fade out the hint first
        if (spaceHint) {
            spaceHint.style.opacity = '0';
        }
        
        // Activate fade overlay
        if (fadeOverlay) {
            fadeOverlay.classList.add('active');
        }
        
        // Remove landing key listener
        if (this.landingKeyListener) {
            document.removeEventListener('keydown', this.landingKeyListener);
            this.landingKeyListener = null;
        }
        
        // Set up keyboard navigation for gameplay (but not active yet)
        this.setupKeyboardNavigation();
        
        // After fade completes, transition to intro sequence
        setTimeout(() => {
            // Remove the beach background (fade overlay)
            if (fadeOverlay) {
                fadeOverlay.classList.remove('active');
            }
            
            // Hide space hint
            if (spaceHint) {
                spaceHint.style.display = 'none';
            }
            
            console.log('INTRO START');
            
            // Start the Ariana + cast intro sequence
            this.showVillaIntro();
        }, 300);
    }
    
    // PLAY VIEW  
    renderPlayView() {
        // Set body class for villa background
        document.body.className = 'play-screen-active';
        
        // Add fallback class if using old villa background
        if (this.villaBackgroundPath && this.villaBackgroundPath.includes('villa_day.png')) {
            document.body.classList.add('fallback-bg');
        }
        
        // Hide intro screen (in case it's still visible)
        const introScreen = document.getElementById('introScreen');
        if (introScreen) {
            introScreen.style.display = 'none';
        }
        
        // Show game content
        this.hideAllScreens();
        this.showElement('reactions');
        
        // Make sure meters are visible
        this.updateMeterHUD();
        
        // Set up game keyboard navigation
        this.setupKeyboardNavigation();
        
        console.log('GAME START - Day 1 (no landing screen)');
        console.log('Villa background active');
        
        // Start Day 1 story
        this.startStory({ day: 1, stepId: this.getInitialStepIdForDay(1) });
    }
    
    // UTILITY FUNCTIONS
    removeAllKeyListeners() {
        if (this.landingKeyListener) {
            document.removeEventListener('keydown', this.landingKeyListener);
            this.landingKeyListener = null;
        }
        if (this.introKeyListener) {
            document.removeEventListener('keydown', this.introKeyListener);
            this.introKeyListener = null;
        }
        if (this.keyboardListener) {
            document.removeEventListener('keydown', this.keyboardListener);
            this.keyboardListener = null;
        }
        if (this.mathKeyListener) {
            document.removeEventListener('keydown', this.mathKeyListener);
            this.mathKeyListener = null;
        }
        if (this.introSequenceKeyListener) {
            document.removeEventListener('keydown', this.introSequenceKeyListener);
            this.introSequenceKeyListener = null;
        }
    }
    
    activateHeartCta() {
        console.log('HEART CTA activated → /play');
        
        const heartButton = document.getElementById('heartCta');
        const blurOverlay = document.getElementById('landingBlurOverlay');
        
        // Prevent multiple clicks
        if (heartButton.classList.contains('animating')) {
            return;
        }
        
        // Add animating class for zoom effect
        heartButton.classList.add('animating');
        
        // Activate blur overlay
        blurOverlay.classList.add('active');
        
        // After animation completes, navigate to play
        setTimeout(() => {
            // Remove landing class from body
            document.body.classList.remove('landing-active');
            
            // Start the game
            this.startGame();
        }, 600);
    }
    
    handleHeartKeydown(event) {
        // Handle Enter and Space key presses
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.activateHeartCta();
        }
    }
    
    toggleLandingMode() {
        const landingScreen = document.querySelector('.landing-screen');
        const legacyScreen = document.getElementById('legacyStartScreen');
        
        if (landingScreen.style.display === 'none') {
            landingScreen.style.display = 'flex';
            legacyScreen.style.display = 'none';
            document.body.classList.add('landing-active');
            console.log('Switched to Landing v2 mode');
        } else {
            landingScreen.style.display = 'none';
            legacyScreen.style.display = 'block';
            document.body.classList.remove('landing-active');
            console.log('Switched to Legacy start screen');
        }
    }
    
    // VILLA INTRODUCTION SEQUENCE
    showVillaIntro() {
        console.log('INTRO SEQUENCE START');
        
        // Hide all other UI elements
        document.getElementById('narratorSection').style.display = 'none';
        document.getElementById('sceneSection').style.display = 'none';
        document.getElementById('choices').style.display = 'none';
        document.getElementById('continueBtn').style.display = 'none';
        document.getElementById('vibeHint').style.display = 'none';
        document.getElementById('mathChallenge').style.display = 'none';
        
        // Set villa background
        this.setSceneBackground('day');
        
        // Ariana's introduction dialogue
        const introDialogue = [
            // Ariana's opening
            {
                type: 'say',
                id: 'intro_1',
                speakerId: 'ariana',
                text: 'Welcome to the villa, babe! 🌴 I\'m Ariana, your host — and trust me, this summer is going to get messy.'
            },
            {
                type: 'say', 
                id: 'intro_2',
                speakerId: 'ariana',
                text: 'You\'ll be living alongside a colorful group of islanders, each with their own drama, secrets, and charm.'
            },
            
            // Nic intro
            {
                type: 'say',
                id: 'nic_intro',
                speakerId: 'nic',
                text: 'Oi, you alright? Don\'t worry, I\'ll keep you entertained.'
            },
            {
                type: 'say',
                id: 'nic_comment',
                speakerId: 'ariana',
                text: 'That\'s Nic — cheeky, charming, but always stirring trouble.'
            },
            
            // Rob intro
            {
                type: 'say',
                id: 'rob_intro',
                speakerId: 'rob',
                text: 'I\'ll tell you straight — I came here to win love, not play games.'
            },
            {
                type: 'say',
                id: 'rob_comment',
                speakerId: 'ariana',
                text: 'That\'s Rob — competitive, direct, and not afraid to say what\'s on his mind.'
            },
            
            // Miguel intro
            {
                type: 'say',
                id: 'miguel_intro',
                speakerId: 'miguel',
                text: 'One smile from me and you\'ll forget the rest exist.'
            },
            {
                type: 'say',
                id: 'miguel_comment',
                speakerId: 'ariana',
                text: 'That\'s Miguel — smooth, confident, and maybe a little too used to getting what he wants.'
            },
            
            // Bryan intro
            {
                type: 'say',
                id: 'bryan_intro',
                speakerId: 'bryan',
                text: 'I\'ll treat you right — if you treat me the same.'
            },
            {
                type: 'say',
                id: 'bryan_comment',
                speakerId: 'ariana',
                text: 'That\'s Bryan — loyal at heart, but don\'t cross him or he\'ll remember.'
            },
            
            // Kenny intro
            {
                type: 'say',
                id: 'kenny_intro',
                speakerId: 'kenny',
                text: 'I\'m not here to make friends. Let\'s see how long you last.'
            },
            {
                type: 'say',
                id: 'kenny_comment',
                speakerId: 'ariana',
                text: 'And that\'s Kenny — our villain. He lives for drama and isn\'t here to play nice.'
            },
            
            // Leah intro
            {
                type: 'say',
                id: 'leah_intro',
                speakerId: 'leah',
                text: 'Hiya! I\'m here for real love, fingers crossed it\'s you 💕.'
            },
            {
                type: 'say',
                id: 'leah_comment',
                speakerId: 'ariana',
                text: 'Leah — kind, empathetic, loyal.'
            },
            
            // Serena intro
            {
                type: 'say',
                id: 'serena_intro',
                speakerId: 'serena',
                text: 'Finally, someone worth my time. Ready to sweep me off my feet?'
            },
            {
                type: 'say',
                id: 'serena_comment',
                speakerId: 'ariana',
                text: 'Serena — romantic, dreamy, dramatic.'
            },
            
            // Jana intro
            {
                type: 'say',
                id: 'jana_intro',
                speakerId: 'jana',
                text: 'Better keep up with me, babe. I don\'t wait around.'
            },
            {
                type: 'say',
                id: 'jana_comment',
                speakerId: 'ariana',
                text: 'Jana — bold, confident, fiery.'
            },
            
            // Amaya intro
            {
                type: 'say',
                id: 'amaya_intro',
                speakerId: 'amaya',
                text: 'Ooo, you\'ve got secrets… I\'ll find them 😉.'
            },
            {
                type: 'say',
                id: 'amaya_comment',
                speakerId: 'ariana',
                text: 'Amaya — gossip queen, playful, chaotic.'
            },
            
            // Olandria intro
            {
                type: 'say',
                id: 'olandria_intro',
                speakerId: 'olandria',
                text: 'You won\'t figure me out that quickly… but you can try.'
            },
            {
                type: 'say',
                id: 'olandria_comment',
                speakerId: 'ariana',
                text: 'Olandria — mysterious, witty, skeptical.'
            },
            
            // Huda intro
            {
                type: 'say',
                id: 'huda_intro',
                speakerId: 'huda',
                text: 'Hope you like nerdy jokes… because I\'ve got plenty.'
            },
            {
                type: 'say',
                id: 'huda_comment',
                speakerId: 'ariana',
                text: 'Huda — quirky, clever, oddball.'
            },
            
            // Ariana's wrap-up
            {
                type: 'say',
                id: 'intro_final_1',
                speakerId: 'ariana',
                text: 'Your job? To find romance, dodge drama, and survive the villa long enough to get your happy ending.'
            },
            {
                type: 'say',
                id: 'intro_final_2',
                speakerId: 'ariana',
                text: 'Careful though — not every choice leads to love. Some might send you packing.'
            },
            {
                type: 'say',
                id: 'intro_final_3',
                speakerId: 'ariana',
                text: 'Alright — enough talk. Let\'s step into Day 1 and see who you\'ll meet first…'
            }
        ];
        
        // Set up the dialogue for single-speaker rendering
        this.currentDialogueSet = introDialogue;
        this.currentDialogueIndex = 0;
        this.isInChoice = false;
        this.isInIntro = true; // Flag to track intro state
        
        // Show first intro line
        this.renderCurrentStep();
        document.getElementById('reactions').style.display = 'block';
    }
    
    // STORY ENGINE - Episode-style story with SayStep and AskStep
    startStory(progress) {
        console.log(`Starting story engine - Day ${progress.day}, Step ${progress.stepId}`);
        
        // Set story mode flags
        this.isInStory = true;
        this.currentStoryProgress = progress;
        
        // Load Day 1 steps
        const daySteps = this.loadDaySteps(progress.day);
        if (!daySteps || daySteps.length === 0) {
            console.log('DAY1 PARSE FAILED → USING SAMPLE');
            this.currentStorySteps = this.getFallbackSteps();
        } else {
            console.log(`DAY1 LOADED steps=${daySteps.length}`);
            this.currentStorySteps = daySteps;
        }
        
        // Find starting step or default to first
        this.currentStoryStepIndex = this.findStepIndex(progress.stepId) || 0;
        
        // Show play view and render first step
        this.showPlayView();
        this.renderStoryStep();
        
        // Save progress
        this.saveStoryProgress();
    }
    
    getInitialStepIdForDay(day) {
        if (day === 1) return 'day1_arrival';
        return `day${day}_start`;
    }
    
    loadDaySteps(day) {
        if (day === 1) {
            return [
                // SayStep examples
                {
                    type: 'say',
                    id: 'day1_arrival',
                    speakerId: 'narrator',
                    text: 'You step into the villa for the first time, heart racing. The sun is warm, the pool sparkles, and somewhere in this paradise, your fate awaits.'
                },
                {
                    type: 'say',
                    id: 'day1_leah_greeting',
                    speakerId: 'leah',
                    text: 'Oh my gosh, hi! You must be the new arrival. I\'m Leah - welcome to our little slice of chaos! 💕'
                },
                {
                    type: 'say',
                    id: 'day1_nic_intro',
                    speakerId: 'nic',
                    text: 'Well, well, well... look what the villa delivered. I\'m Nic, and trust me, you\'re going to want to stick close to me.'
                },
                
                // AskStep example
                {
                    type: 'ask',
                    id: 'day1_first_choice',
                    speakerId: 'leah',
                    prompt: 'So, what\'s your strategy? Are you here to play it safe, or are you ready to shake things up?',
                    options: [
                        {
                            id: 'choice_safe',
                            text: 'I\'m here to find genuine connections, not drama.',
                            next: 'day1_safe_path',
                            quality: 'bad'
                        },
                        {
                            id: 'choice_strategic',
                            text: 'I\'m going to play smart and see what happens.',
                            next: 'day1_strategic_path',
                            quality: 'bad'
                        },
                        {
                            id: 'choice_chaos',
                            text: 'I\'m ready to stir the pot and see who can handle it.',
                            next: 'day1_chaos_path',
                            quality: 'bad'
                        },
                        {
                            id: 'choice_locked',
                            text: 'Let me prove my worth first (Math Challenge)',
                            next: 'day1_math_challenge',
                            quality: 'good'
                        }
                    ]
                },
                
                // Continuation paths
                {
                    type: 'say',
                    id: 'day1_safe_path',
                    speakerId: 'nic',
                    text: 'Playing it safe, eh? Well, that\'s one way to go... but the villa rewards the bold, just saying.'
                },
                {
                    type: 'say',
                    id: 'day1_strategic_path',
                    speakerId: 'leah',
                    text: 'Smart approach! Though sometimes the best strategy is just being yourself. We\'ll see how it works out!'
                },
                {
                    type: 'say',
                    id: 'day1_chaos_path',
                    speakerId: 'nic',
                    text: 'Now THAT\'s what I like to hear! Finally, someone who understands this place. You and I are going to get along just fine.'
                }
            ];
        }
        return [];
    }
    
    getFallbackSteps() {
        return [
            {
                type: 'say',
                id: 'fallback_1',
                speakerId: 'ariana',
                text: 'Welcome to the villa! Something went wrong loading your story, but don\'t worry - the show must go on!'
            },
            {
                type: 'say',
                id: 'fallback_2',
                speakerId: 'leah',
                text: 'Hi there! I\'m Leah, and even though this is just a backup story, I\'m excited to meet you!'
            },
            {
                type: 'say',
                id: 'fallback_3',
                speakerId: 'nic',
                text: 'Right, so something\'s broken but we\'re rolling with it. That\'s very villa of us, isn\'t it?'
            },
            {
                type: 'ask',
                id: 'fallback_choice',
                speakerId: 'ariana',
                text: 'Ready to try this again properly?',
                options: [
                    {
                        id: 'restart',
                        text: 'Restart the game',
                        next: 'game_restart',
                        quality: 'bad'
                    },
                    {
                        id: 'continue',
                        text: 'Continue with backup story',
                        next: 'fallback_1',
                        quality: 'bad'
                    },
                    {
                        id: 'refresh',
                        text: 'Refresh and try again',
                        next: 'page_refresh',
                        quality: 'bad'
                    },
                    {
                        id: 'locked_fix',
                        text: 'Fix technical issues (Math Challenge)',
                        next: 'tech_challenge',
                        quality: 'good'
                    }
                ]
            }
        ];
    }
    
    findStepIndex(stepId) {
        return this.currentStorySteps.findIndex(step => step.id === stepId);
    }
    
    showPlayView() {
        // Hide all other UI elements
        document.getElementById('narratorSection').style.display = 'none';
        document.getElementById('sceneSection').style.display = 'none';
        document.getElementById('choices').style.display = 'none';
        document.getElementById('continueBtn').style.display = 'none';
        document.getElementById('vibeHint').style.display = 'none';
        document.getElementById('mathChallenge').style.display = 'none';
        
        // Show the single-speaker reactions area
        document.getElementById('reactions').style.display = 'block';
    }
    
    renderStoryStep() {
        const currentStep = this.currentStorySteps[this.currentStoryStepIndex];
        if (!currentStep) {
            console.log('No current step found, ending story');
            return;
        }
        
        console.log(`STEP ${currentStep.id} ${currentStep.type}`);
        
        if (currentStep.type === 'say') {
            this.renderSayStep(currentStep);
        } else if (currentStep.type === 'ask') {
            this.renderAskStep(currentStep);
        }
        
        // Update current step ID for persistence
        this.currentStoryProgress.stepId = currentStep.id;
        this.saveStoryProgress();
    }
    
    advanceStoryStep() {
        this.currentStoryStepIndex++;
        
        if (this.currentStoryStepIndex >= this.currentStorySteps.length) {
            console.log('Story complete - Day 1 finished');
            // TODO: Transition to next day or end story
            return;
        }
        
        this.renderStoryStep();
    }
    
    selectStoryChoice(optionId) {
        const currentStep = this.currentStorySteps[this.currentStoryStepIndex];
        const selectedOption = currentStep.options.find(opt => opt.id === optionId);
        
        if (!selectedOption) {
            console.log('Invalid choice selected');
            return;
        }
        
        console.log(`CHOICE SELECTED ${selectedOption.next}`);
        
        // Handle good choices - they require math challenge
        if (selectedOption.quality === 'good') {
            const loveCost = selectedOption.loveCost || 0;
            
            // Check if player has enough love
            if (loveCost > 0 && this.gameState.love < loveCost) {
                console.log(`GOOD CHOICE LOCKED needLove=${loveCost} currentLove=${this.gameState.love}`);
                this.showToast(`Need ${loveCost} 💖 Love to unlock this choice`);
                return;
            }
            
            // Player has enough love, now require math challenge
            this.openMathGate(
                // On math pass
                () => {
                    console.log('GOOD CHOICE UNLOCKED via math');
                    
                    // Subtract love cost if any
                    if (loveCost > 0) {
                        this.spendLove(loveCost);
                        console.log(`Spent ${loveCost} love, remaining: ${this.gameState.love}`);
                    }
                    
                    // Advance to the next step
                    this.advanceToGoodChoice(selectedOption.next);
                },
                // On math fail
                () => {
                    console.log(`GOOD CHOICE FAILED drama=${this.gameState.drama}`);
                    this.showToast('Math failed! Choose a different option or try again.');
                    // Choice screen stays open, player can pick bad options
                }
            );
            return;
        }
        
        // Handle bad choices - process normally
        if (selectedOption.dramaDelta) {
            this.updateDrama(selectedOption.dramaDelta);
            console.log(`Added ${selectedOption.dramaDelta} drama, total: ${this.gameState.drama}`);
        }
        
        // Find next step and advance for bad choices
        this.advanceToChoice(selectedOption.next);
    }
    
    advanceToGoodChoice(nextStepId) {
        // Helper method for advancing after successful math challenge
        const nextStepIndex = this.findStepIndex(nextStepId);
        if (nextStepIndex !== -1) {
            this.currentStoryStepIndex = nextStepIndex;
        } else {
            console.log('Next step not found, advancing by 1');
            this.currentStoryStepIndex++;
        }
        
        // Clear choice state and render next step
        this.isInChoice = false;
        this.renderStoryStep();
    }
    
    advanceToChoice(nextStepId) {
        // Helper method for advancing after regular choice selection
        const nextStepIndex = this.findStepIndex(nextStepId);
        if (nextStepIndex !== -1) {
            this.currentStoryStepIndex = nextStepIndex;
        } else {
            console.log('Next step not found, advancing by 1');
            this.currentStoryStepIndex++;
        }
        
        // Clear choice state and render next step
        this.isInChoice = false;
        this.renderStoryStep();
    }
    
    saveStoryProgress() {
        localStorage.setItem('story.progress', JSON.stringify(this.currentStoryProgress));
    }
    
    loadStoryProgress() {
        const saved = localStorage.getItem('story.progress');
        return saved ? JSON.parse(saved) : null;
    }
    
    // Enhanced advance logic for intro sequence and normal gameplay
    advanceToNextStep() {
        const currentStep = this.currentDialogueSet[this.currentDialogueIndex];
        console.log('ADVANCE', currentStep?.id || 'unknown');
        
        this.currentDialogueIndex++;
        
        // Check if intro sequence is complete
        if (this.isInIntro && this.currentDialogueIndex >= this.currentDialogueSet.length) {
            console.log('INTRO SEQUENCE END');
            
            // Remove intro sequence key listener
            if (this.introSequenceKeyListener) {
                document.removeEventListener('keydown', this.introSequenceKeyListener);
                this.introSequenceKeyListener = null;
            }
            
            this.isInIntro = false;
            
            // Hide reactions and transition to play
            document.getElementById('reactions').style.display = 'none';
            this.transitionToPlay();
            return;
        }
        
        // Normal gameplay: Check if all reactions shown
        if (!this.isInIntro && this.currentDialogueIndex >= this.currentDialogueSet.length) {
            // All reactions shown, show continue button
            document.getElementById('continueBtn').style.display = 'block';
            return;
        }
        
        // Render next step (works for both intro and normal gameplay)
        this.renderCurrentStep();
    }
    
    // CHARACTER DATA WITH REAL AVATARS
    // === METER SYSTEM ===
    
    createMeterHUD() {
        // Remove existing HUD if present
        const existingHUD = document.getElementById('meterHUD');
        if (existingHUD) {
            existingHUD.remove();
        }
        
        // Create HUD container
        const hudHTML = `
            <div id="meterHUD" class="meter-hud">
                <div class="meter-display">
                    <div class="meter-bubble love-bubble" id="loveMeter">
                        💖 <span id="loveValue">0</span> Love
                    </div>
                    <div class="meter-bubble drama-bubble" id="dramaMeter">
                        🔥 <span id="dramaValue">0</span> Drama
                    </div>
                </div>
            </div>
        `;
        
        // Add to body (fixed positioning)
        document.body.insertAdjacentHTML('beforeend', hudHTML);
    }
    
    updateMeterHUD() {
        const loveEl = document.getElementById('loveValue');
        const dramaEl = document.getElementById('dramaValue');
        
        if (loveEl) loveEl.textContent = this.gameState.love;
        if (dramaEl) dramaEl.textContent = this.gameState.drama;
        
        // Update debug display as well if present
        if (this.debugMode) {
            this.updateDebugInfo();
        }
    }
    
    saveMeter() {
        const meterData = {
            love: this.gameState.love,
            drama: this.gameState.drama
        };
        localStorage.setItem('villa.meters', JSON.stringify(meterData));
        console.log('RESOLVE step=current love=' + this.gameState.love + ' drama=' + this.gameState.drama);
    }
    
    loadMeters() {
        const savedMeters = localStorage.getItem('villa.meters');
        if (savedMeters) {
            try {
                const meterData = JSON.parse(savedMeters);
                this.gameState.love = meterData.love || 0;
                this.gameState.drama = meterData.drama || 0;
                console.log('Loaded meters:', meterData);
            } catch (e) {
                console.log('Failed to parse saved meters, using defaults');
                this.gameState.love = 0;
                this.gameState.drama = 0;
            }
        }
    }
    
    // === MATH CHALLENGE GATE ===
    
    openMathGate(onPass, onFail) {
        // Generate random math problem
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const correctAnswer = a * b;
        
        console.log(`MATH START a=${a} b=${b}`);
        
        // Create math challenge modal
        const modalHTML = `
            <div id="mathModal" class="math-modal">
                <div class="math-modal-content">
                    <div class="math-header">
                        <div class="speaker-avatar">
                            <div class="avatar-circle" style="border-color: #E91E63;">
                                <img src="public/assets/avatars/ariana.png" 
                                     alt="Ariana Madix" 
                                     class="avatar-image">
                            </div>
                        </div>
                        <div class="speech-bubble">
                            <div class="bubble-tail"></div>
                            <div class="bubble-content" style="border-left-color: #E91E63;">
                                <div class="speaker-name" style="color: #E91E63;">
                                    Ariana Madix
                                </div>
                                <div class="speaker-text">
                                    Quick! What's ${a} × ${b}?
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="math-challenge">
                        <div class="math-problem">
                            ${a} × ${b} = ?
                        </div>
                        
                        <div class="timer-section">
                            <div class="timer-display">Time: <span id="mathTimer">7</span>s</div>
                            <div class="timer-bar">
                                <div id="timerProgress" class="timer-progress"></div>
                            </div>
                        </div>
                        
                        <div class="answer-section">
                            <input type="number" id="mathAnswer" placeholder="Your answer" class="math-input" autofocus>
                            <button id="mathSubmit" class="math-submit">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup timer variables
        let timeLeft = 7;
        let timerInterval;
        let isCompleted = false;
        
        // Store callbacks for later use
        this.currentMathCallbacks = { onPass, onFail };
        
        // Get DOM elements
        const modal = document.getElementById('mathModal');
        const timerDisplay = document.getElementById('mathTimer');
        const timerProgress = document.getElementById('timerProgress');
        const answerInput = document.getElementById('mathAnswer');
        const submitButton = document.getElementById('mathSubmit');
        
        // Update timer display and progress bar
        const updateTimer = () => {
            timerDisplay.textContent = timeLeft;
            const progressPercent = ((7 - timeLeft) / 7) * 100;
            timerProgress.style.width = progressPercent + '%';
        };
        
        // Start countdown timer
        updateTimer();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimer();
            
            if (timeLeft <= 0) {
                if (!isCompleted) {
                    handleMathResult(false, 'timeout');
                }
            }
        }, 1000);
        
        // Handle math result
        const handleMathResult = (success, reason = '') => {
            if (isCompleted) return; // Prevent double execution
            isCompleted = true;
            
            // Clear timer
            clearInterval(timerInterval);
            
            // Remove modal
            if (modal && modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            
            if (success) {
                // Pass: +2 Love
                this.gameState.love += 2;
                this.updateMeterHUD();
                this.saveMeter();
                this.showToast('+2 Love earned!');
                console.log(`MATH PASS love=${this.gameState.love} drama=${this.gameState.drama}`);
                
                if (onPass) onPass();
            } else {
                // Fail: +1 Drama
                this.gameState.drama += 1;
                this.updateMeterHUD();
                this.saveMeter();
                
                const failMessage = reason === 'timeout' ? 'Time\'s up! +1 Drama.' : 'Wrong! +1 Drama.';
                this.showToast(failMessage);
                console.log(`MATH FAIL love=${this.gameState.love} drama=${this.gameState.drama}`);
                
                // Check drama boot condition
                if (this.gameState.drama >= this.DRAMA_BOOT) {
                    this.triggerDramaBoot();
                    return;
                }
                
                if (onFail) onFail();
            }
        };
        
        // Submit button click handler
        submitButton.addEventListener('click', () => {
            const userAnswer = parseInt(answerInput.value);
            const isCorrect = userAnswer === correctAnswer && timeLeft > 0;
            handleMathResult(isCorrect, isCorrect ? 'correct' : 'wrong');
        });
        
        // Enter key handler
        answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitButton.click();
            }
        });
        
        // Focus on input
        setTimeout(() => {
            answerInput.focus();
        }, 100);
    }
    
    // Dev test function for math gate
    testMathGate() {
        this.openMathGate(
            () => console.log('Math gate passed!'),
            () => console.log('Math gate failed!')
        );
    }
    
    updateDrama(delta) {
        this.gameState.drama += delta;
        this.updateMeterHUD();
        this.saveMeter();
        
        // Check for boot condition
        if (this.gameState.drama >= this.DRAMA_BOOT) {
            console.log('Drama boot triggered! Drama >= 9');
            this.triggerDramaBoot();
        }
    }
    
    spendLove(cost) {
        if (this.gameState.love >= cost) {
            this.gameState.love -= cost;
            this.updateMeterHUD();
            this.saveMeter();
            return true;
        }
        return false;
    }
    
    triggerDramaBoot() {
        // Route to boot/elimination scene immediately
        this.gameState.isDumped = true;
        this.saveMeter();
        this.showBootScene();
    }
    
    showBootScene() {
        // Hide current content
        document.getElementById('reactions').style.display = 'none';
        document.getElementById('continueBtn').style.display = 'none';
        
        // Show boot message
        const bootHTML = `
            <div class="boot-scene">
                <h2>💔 You've Been Dumped!</h2>
                <p>Your drama levels got too high (${this.gameState.drama}/9). The villa has spoken...</p>
                <p class="boot-message">Sometimes it's better to know when to step back. The Love Island journey ends here.</p>
                <button onclick="game.resetGame()" class="restart-btn">🔄 Start Over</button>
            </div>
        `;
        
        document.getElementById('reactions').innerHTML = bootHTML;
        document.getElementById('reactions').style.display = 'block';
    }
    
    showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create and show new toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
    
    resetGame() {
        // Clear saved data
        localStorage.removeItem('villa.meters');
        localStorage.removeItem('story.progress');
        
        // Reset state
        this.gameState.love = 0;
        this.gameState.drama = 0;
        this.gameState.isDumped = false;
        this.isInStory = false;
        this.isInIntro = false;
        
        // Reload page
        window.location.reload();
    }
    
    getCast() {
        return {
            // Host
            ariana: {
                name: "Ariana Madix",
                season: "Host",
                voice: "charismatic host",
                role: "narrator",
                avatar: {
                    image: "public/assets/avatars/ariana.png",
                    accentColor: "#E91E63",
                    bgColor: "#E91E63",
                    textColor: "#FFFFFF",
                    personality: "authoritative",
                    style: "host"
                }
            },
            
            // Season 6 (2024)
            serena: {
                name: "Serena",
                season: 6,
                voice: "warm & steady",
                loyaltyTriggers: ["supportive", "honest", "teamwork"],
                dramaTriggers: ["confrontation", "bold", "spicy"],
                avatar: {
                    image: "public/assets/avatars/serena.png",
                    emoji: "🌺",
                    accentColor: "#FF6B9D",
                    bgColor: "#FF6B9D",
                    textColor: "#FFFFFF",
                    personality: "nurturing",
                    style: "elegant"
                }
            },
            kordell: {
                name: "Kordell", 
                season: 6,
                voice: "athletic energy",
                loyaltyTriggers: ["fitness", "loyalty", "teamwork"],
                dramaTriggers: ["competitive", "bold", "confrontation"],
                avatar: {
                    emoji: "💪",
                    bgColor: "#4A90E2",
                    textColor: "#FFFFFF",
                    personality: "athletic",
                    style: "strong"
                }
            },
            leah: {
                name: "Leah",
                season: 6, 
                voice: "direct communicator",
                loyaltyTriggers: ["honest", "direct", "trustworthy"],
                dramaTriggers: ["confrontation", "spicy", "bold"],
                avatar: {
                    image: "public/assets/avatars/leah.png",
                    emoji: "🔥",
                    accentColor: "#E2B547",
                    bgColor: "#E2B547",
                    textColor: "#FFFFFF",
                    personality: "fierce",
                    style: "bold"
                }
            },
            miguel: {
                name: "Miguel",
                season: 6,
                voice: "charming smooth-talker", 
                loyaltyTriggers: ["romantic", "charming", "supportive"],
                dramaTriggers: ["flirty", "messy", "spicy"],
                avatar: {
                    emoji: "😏",
                    bgColor: "#8B4A9C",
                    textColor: "#FFFFFF",
                    personality: "charming",
                    style: "smooth"
                }
            },
            jana: {
                name: "JaNa",
                season: 6,
                voice: "fun-loving spirit",
                loyaltyTriggers: ["fun", "positive", "supportive"], 
                dramaTriggers: ["chaotic", "bold", "messy"],
                avatar: {
                    image: "public/assets/avatars/jana.png",
                    emoji: "✨",
                    accentColor: "#FF8C42",
                    bgColor: "#FF8C42",
                    textColor: "#FFFFFF",
                    personality: "bubbly",
                    style: "energetic"
                }
            },
            kenny: {
                name: "Kenny",
                season: 6,
                voice: "laid-back vibe",
                loyaltyTriggers: ["chill", "loyalty", "honest"],
                dramaTriggers: ["confrontation", "spicy", "bold"],
                avatar: {
                    emoji: "😎",
                    bgColor: "#27AE60",
                    textColor: "#FFFFFF",
                    personality: "chill",
                    style: "relaxed"
                }
            },
            
            // Season 7 (2025)
            amaya: {
                name: "Amaya",
                season: 7,
                voice: "confident leader",
                loyaltyTriggers: ["leadership", "confidence", "trustworthy"],
                dramaTriggers: ["bold", "confrontation", "competitive"],
                avatar: {
                    image: "public/assets/avatars/amaya.png",
                    emoji: "👑",
                    accentColor: "#C8102E",
                    bgColor: "#C8102E",
                    textColor: "#FFFFFF",
                    personality: "regal",
                    style: "commanding"
                }
            },
            bryan: {
                name: "Bryan", 
                season: 7,
                voice: "strategic thinker",
                loyaltyTriggers: ["strategic", "thoughtful", "loyalty"],
                dramaTriggers: ["calculating", "messy", "spicy"],
                avatar: {
                    emoji: "🧠",
                    bgColor: "#2C3E50",
                    textColor: "#FFFFFF",
                    personality: "analytical",
                    style: "thoughtful"
                }
            },
            olandria: {
                name: "Olandria",
                season: 7,
                voice: "sharp & strategic",
                loyaltyTriggers: ["strategic", "honest", "direct"],
                dramaTriggers: ["sharp", "confrontation", "spicy"],
                avatar: {
                    image: "public/assets/avatars/olandria.png",
                    emoji: "⚡",
                    accentColor: "#8E44AD",
                    bgColor: "#8E44AD",
                    textColor: "#FFFFFF",
                    personality: "electric",
                    style: "sharp"
                }
            },
            
            // Additional character - Rob (assuming from S7)
            rob: {
                name: "Rob",
                season: 7,
                voice: "confident charmer",
                loyaltyTriggers: ["confident", "charming", "loyalty"],
                dramaTriggers: ["bold", "competitive", "spicy"],
                avatar: {
                    image: "public/assets/avatars/rob.png",
                    emoji: "😎",
                    accentColor: "#2980B9",
                    bgColor: "#2980B9",
                    textColor: "#FFFFFF",
                    personality: "confident",
                    style: "smooth"
                }
            },
            nic: {
                name: "Nic",
                season: 7,
                voice: "thoughtful introvert", 
                loyaltyTriggers: ["thoughtful", "deep", "supportive"],
                dramaTriggers: ["withdrawal", "messy", "emotional"],
                avatar: {
                    image: "public/assets/avatars/nic.png",
                    emoji: "🤔",
                    accentColor: "#34495E",
                    bgColor: "#34495E",
                    textColor: "#FFFFFF",
                    personality: "introspective",
                    style: "gentle"
                }
            },
            huda: {
                name: "Huda",
                season: 7,
                voice: "witty observer",
                loyaltyTriggers: ["witty", "observant", "honest"],
                dramaTriggers: ["sarcastic", "spicy", "confrontation"],
                avatar: {
                    image: "public/assets/avatars/huda.png",
                    emoji: "👁️",
                    accentColor: "#E67E22",
                    bgColor: "#E67E22",
                    textColor: "#FFFFFF",
                    personality: "observant",
                    style: "witty"
                }
            },
            chris: {
                name: "Chris",
                season: 7,
                voice: "class clown energy",
                loyaltyTriggers: ["funny", "positive", "entertaining"],
                dramaTriggers: ["chaotic", "messy", "bold"],
                avatar: {
                    emoji: "🤪",
                    bgColor: "#F39C12",
                    textColor: "#FFFFFF",
                    personality: "comedic",
                    style: "playful"
                }
            },
            iris: {
                name: "Iris", 
                season: 7,
                voice: "diplomatic peacemaker",
                loyaltyTriggers: ["diplomatic", "peace", "supportive"],
                dramaTriggers: ["avoidance", "messy", "emotional"],
                avatar: {
                    emoji: "🕊️",
                    bgColor: "#3498DB",
                    textColor: "#FFFFFF",
                    personality: "peaceful",
                    style: "serene"
                }
            },
            pepe: {
                name: "Pepe",
                season: 7,
                voice: "passionate romantic",
                loyaltyTriggers: ["romantic", "passionate", "honest"],
                dramaTriggers: ["intense", "emotional", "spicy"],
                avatar: {
                    emoji: "💖",
                    bgColor: "#E74C3C",
                    textColor: "#FFFFFF",
                    personality: "passionate",
                    style: "romantic"
                }
            }
        };
    }
    
    // BACKGROUND SYSTEM
    getBackgroundForScene(scene) {
        const backgrounds = {
            'day': 'public/assets/backgrounds/villa_day.png',
            'gossip': 'public/assets/backgrounds/villa_day.png',
            'night': 'public/assets/backgrounds/villa_night.png',
            'firepit': 'public/assets/backgrounds/villa_night.png',
            'challenge': 'public/assets/backgrounds/villa_day.png',
            'default': 'public/assets/backgrounds/villa_day.png'
        };
        
        return backgrounds[scene] || backgrounds['default'];
    }
    
    // SCENE MANAGEMENT
    setSceneBackground(scene) {
        const gameScreen = document.getElementById('gameScreen');
        const backgroundImage = this.getBackgroundForScene(scene);
        
        gameScreen.style.backgroundImage = `url('${backgroundImage}')`;
        gameScreen.style.backgroundSize = 'cover';
        gameScreen.style.backgroundPosition = 'center';
        gameScreen.style.backgroundAttachment = 'fixed';
        
        console.log(`Scene background set to: ${scene} (${backgroundImage})`);
    }
    
    // PLAYER AVATAR SYSTEM (stub for future implementation)
    getPlayerAvatar() {
        try {
            const stored = localStorage.getItem('this-weekend:player-avatar');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.log('Could not load player avatar from localStorage');
        }
        
        return {
            image: 'public/assets/avatars/player_default.png',
            accentColor: '#FF1744',
            name: 'Player'
        };
    }
    
    setPlayerAvatar(avatarData) {
        try {
            localStorage.setItem('this-weekend:player-avatar', JSON.stringify(avatarData));
        } catch (e) {
            console.log('Could not save player avatar to localStorage');
        }
    }
    
    // DAILY CONTENT STRUCTURE
    getDailyContent() {
        return {
            1: {
                challenge: {
                    title: "Two Truths & a Lie",
                    narratorText: "Welcome islanders to your first villa challenge! Time to see how well you know each other... and how good you are at spotting lies.",
                    sceneText: "Everyone's gathered in a circle on the daybed. The tension is real as each person shares three statements. It's your turn to play - what's your strategy?",
                    choices: [
                        {
                            text: "Share two embarrassing truths and one amazing lie",
                            effects: { drama: 1, loyalty: 1 },
                            reactions: ["Serena: \"Okay that's actually hilarious! I respect the honesty.\"", "Miguel: \"You're either really brave or really good at this game.\""]
                        },
                        {
                            text: "Keep it safe with boring truths and an obvious lie",
                            effects: { loyalty: 2 },
                            reactions: ["Leah: \"Playing it smart, I see. Nothing wrong with that strategy.\"", "Kenny: \"Respect for not trying too hard to impress.\""]
                        },
                        {
                            text: "Go bold with wild stories that sound totally fake",
                            effects: { drama: 2 },
                            math: true,
                            reactions: ["JaNa: \"Okay wait, WHICH one was the lie?! I'm so confused!\"", "Kordell: \"That was either genius or completely chaotic.\""]
                        },
                        {
                            text: "Call out someone else's obvious lie dramatically",
                            effects: { drama: 2, loyalty: -1 },
                            reactions: ["Huda: \"Ooop, coming in hot on day one!\"", "Iris: \"Well that escalated quickly...\""]
                        }
                    ]
                },
                gossip: {
                    title: "Balcony Tea",
                    sceneText: "Later that evening, you find yourself on the balcony with a few islanders. The conversation turns to first impressions and who might be playing games.",
                    choices: [
                        {
                            text: "Share genuine thoughts about everyone you've met",
                            effects: { loyalty: 2 },
                            flag: "honestDay1",
                            reactions: ["Nic: \"I appreciate the real talk. It's refreshing.\"", "Olandria: \"Finally, someone being straight up.\""]
                        },
                        {
                            text: "Stir the pot about potential couples forming too fast",
                            effects: { drama: 2 },
                            reactions: ["Amaya: \"You're not wrong though... some people are moving real quick.\"", "Bryan: \"Strategy or genuine feelings? That's the question.\""]
                        },
                        {
                            text: "Defend someone who's getting talked about",
                            effects: { loyalty: 1, drama: 1 },
                            flag: "defendedSomeone",
                            reactions: ["Pepe: \"That's real loyalty right there.\"", "Chris: \"Look at you being the villa protector!\""]
                        },
                        {
                            text: "Stay quiet and just listen to the drama",
                            effects: {},
                            reactions: ["Serena: \"Smart to observe before jumping in.\"", "Miguel: \"Playing your cards close to your chest, I see.\""]
                        }
                    ]
                }
            },
            
            2: {
                challenge: {
                    title: "Floatie Relay",
                    narratorText: "It's day two and things are heating up! Time for a pool challenge that's going to test your teamwork... and maybe create some tension.",
                    sceneText: "The villa is split into teams for a ridiculous relay race involving floaties, water balloons, and way too much chaos. Your team is counting on you for the final leg!",
                    choices: [
                        {
                            text: "Give it your all and lead your team to victory",
                            effects: { loyalty: 2 },
                            math: true,
                            reactions: ["Kordell: \"That's what I'm talking about! Team player energy!\"", "Amaya: \"You just earned major respect points.\""]
                        },
                        {
                            text: "Playfully sabotage the other team (harmless fun)",
                            effects: { drama: 1, loyalty: 1 },
                            reactions: ["JaNa: \"You're so messy and I'm here for it!\"", "Chris: \"The chaos! I love the energy!\""]
                        },
                        {
                            text: "Focus more on looking good than winning",
                            effects: { drama: 1 },
                            reactions: ["Leah: \"Priorities... interesting choice.\"", "Huda: \"Well at least you looked cute losing.\""]
                        },
                        {
                            text: "Accidentally cause a dramatic team meltdown",
                            effects: { drama: 3, loyalty: -1 },
                            reactions: ["Olandria: \"What just happened?! That was chaos!\"", "Iris: \"Maybe we need to regroup and communicate better...\""]
                        }
                    ]
                },
                gossip: {
                    title: "Kitchen Crossfire", 
                    sceneText: "You're making a late night snack when you overhear a heated conversation between two islanders about loyalty and game-playing. They notice you listening.",
                    choices: [
                        {
                            text: "Mediate and try to help them work it out",
                            effects: { loyalty: 2 },
                            flag: "peacemaker",
                            reactions: ["Iris: \"Thank you for stepping in. We needed a neutral perspective.\"", "Nic: \"You have a gift for bringing people together.\""]
                        },
                        {
                            text: "Take sides and back the person you trust more",
                            effects: { drama: 2, loyalty: 1 },
                            reactions: ["Bryan: \"I respect you for having my back.\"", "Pepe: \"That's ride or die energy right there.\""]
                        },
                        {
                            text: "Spill tea about what you've observed about both of them",
                            effects: { drama: 3 },
                            reactions: ["Kenny: \"Damn, you've been watching everything haven't you?\"", "Serena: \"That's... a lot of information to drop right now.\""]
                        },
                        {
                            text: "Awkwardly excuse yourself and leave",
                            effects: { loyalty: -1 },
                            reactions: ["Miguel: \"Running away from drama? Interesting strategy.\"", "Leah: \"Sometimes staying out of it is the smart play.\""]
                        }
                    ]
                }
            },
            
            3: {
                challenge: {
                    title: "Spin the Compliment",
                    narratorText: "Halfway through the week! Time for a challenge that's all about boosting egos... or crushing them. Spin the bottle, give compliments!",
                    sceneText: "Everyone's sitting in a circle with a bottle in the center. When it points to you, you have to give a genuine compliment to whoever it lands on next. The pressure is real!",
                    choices: [
                        {
                            text: "Give heartfelt, specific compliments that make people feel seen",
                            effects: { loyalty: 3 },
                            reactions: ["Serena: \"That was so genuine and sweet. You really see people.\"", "Pepe: \"You have such a beautiful way with words.\""]
                        },
                        {
                            text: "Be cheeky and give flirty compliments that create tension",
                            effects: { drama: 2, loyalty: 1 },
                            math: true,
                            reactions: ["Miguel: \"Okay I see you... that was smooth.\"", "Amaya: \"Someone's feeling confident today!\""]
                        },
                        {
                            text: "Give backhanded compliments disguised as praise",
                            effects: { drama: 3, loyalty: -1 },
                            reactions: ["Olandria: \"Was that a compliment or a read? I can't tell.\"", "Huda: \"The shade of it all... I'm impressed and concerned.\""]
                        },
                        {
                            text: "Keep compliments generic but safe",
                            effects: { loyalty: 1 },
                            reactions: ["Kenny: \"Playing it safe, but hey, compliments are compliments.\"", "Iris: \"Sometimes simple and kind is the way to go.\""]
                        }
                    ]
                },
                gossip: {
                    title: "Overheard Apology",
                    sceneText: "Walking past the hideaway, you accidentally overhear someone apologizing for their behavior. They haven't noticed you yet, but others are around.",
                    choices: [
                        {
                            text: "Quietly give them space and pretend you didn't hear",
                            effects: { loyalty: 2 },
                            reactions: ["Nic: \"You're respectful of private moments. That means something.\"", "Iris: \"Privacy is so important here. Thank you.\""]
                        },
                        {
                            text: "Join the conversation and support their apology",
                            effects: { loyalty: 2, drama: 1 },
                            flag: "supportedApology",
                            reactions: ["Chris: \"You didn't have to back me up, but you did. That's real.\"", "Serena: \"It takes courage to support someone when they're vulnerable.\""]
                        },
                        {
                            text: "Listen closely and use the info later in conversation", 
                            effects: { drama: 2, loyalty: -1 },
                            reactions: ["Bryan: \"You're good at gathering intel... maybe too good.\"", "Leah: \"That's strategic but feels a little manipulative.\""]
                        },
                        {
                            text: "Call them out publicly for their earlier behavior",
                            effects: { drama: 3, loyalty: -2 },
                            reactions: ["JaNa: \"Whoa, that was harsh timing!\"", "Miguel: \"Damn, no mercy when someone's trying to make things right.\""]
                        }
                    ]
                }
            },
            
            4: {
                challenge: {
                    title: "Clip Court / Movie Night",
                    narratorText: "Oh islanders, it's time for everyone's favorite... MOVIE NIGHT! Time to see how you all really act when you think nobody's watching.",
                    sceneText: "The lights dim and clips start rolling of everyone's most questionable villa moments. When your clip plays, showing you talking about other islanders, the room goes silent.",
                    choices: [
                        {
                            text: "Own up to everything and apologize sincerely",
                            effects: { loyalty: 3, drama: 1 },
                            reactions: ["Kordell: \"Respect for owning it. That takes real character.\"", "Olandria: \"The accountability is actually refreshing.\""]
                        },
                        {
                            text: "Defend your actions and explain your reasoning",
                            effects: { drama: 2, loyalty: 1 },
                            math: true,
                            reactions: ["Bryan: \"I can see your logic, even if I don't totally agree.\"", "Huda: \"At least you're standing by what you said.\""]
                        },
                        {
                            text: "Deflect by pointing out everyone else's messy moments",
                            effects: { drama: 3, loyalty: -1 },
                            reactions: ["Kenny: \"Throwing stones in a glass house... bold strategy.\"", "Amaya: \"We're all messy, but that felt like deflection.\""]
                        },
                        {
                            text: "Laugh it off and refuse to take it seriously",
                            effects: { drama: 1, loyalty: -1 },
                            reactions: ["Pepe: \"Sometimes you gotta laugh to keep from crying.\"", "Iris: \"Not sure if that's confidence or avoidance...\""]
                        }
                    ]
                },
                gossip: {
                    title: "Corridor Philosophy",
                    sceneText: "After the movie night drama, you find yourself in a deep conversation about authenticity, game-playing, and what it means to be real in the villa.",
                    choices: [
                        {
                            text: "Open up about your own struggles with authenticity",
                            effects: { loyalty: 3 },
                            flag: "vulnerableConvo",
                            reactions: ["Nic: \"Thank you for being so open. That was beautiful.\"", "Serena: \"Your vulnerability makes everyone else feel safer to be real.\""]
                        },
                        {
                            text: "Challenge others to be more honest about their games",
                            effects: { drama: 2, loyalty: 1 },
                            reactions: ["Leah: \"You're not wrong. We could all be more direct.\"", "Miguel: \"Calling people out but in a constructive way. I see you.\""]
                        },
                        {
                            text: "Argue that some game-playing is necessary and strategic",
                            effects: { drama: 1, loyalty: 1 },
                            reactions: ["Bryan: \"Finally someone who understands the complexity of this situation.\"", "Chris: \"The villa makes everyone a little strategic. That's just facts.\""]
                        },
                        {
                            text: "Suggest everyone's overthinking and should just have fun",
                            effects: { loyalty: 1 },
                            reactions: ["JaNa: \"You're right, we're getting way too deep about everything.\"", "Kenny: \"Sometimes keeping it light is exactly what we need.\""]
                        }
                    ]
                }
            },
            
            5: {
                challenge: {
                    title: "Talent Show",
                    narratorText: "Final day before the Firepit Ceremony! Time to show your fellow islanders what makes you special with a villa talent show!",
                    sceneText: "It's your turn to perform in front of everyone. This is your last chance to make an impression before tonight's ceremony. What talent do you showcase?",
                    choices: [
                        {
                            text: "Perform a heartfelt song you wrote about your villa experience",
                            effects: { loyalty: 3, drama: 1 },
                            reactions: ["Pepe: \"That was so beautiful and authentic. You made me cry.\"", "Serena: \"The emotion in your voice... everyone felt that.\""]
                        },
                        {
                            text: "Do an epic dance routine that gets everyone hyped",
                            effects: { loyalty: 2, drama: 1 },
                            math: true,
                            reactions: ["JaNa: \"THAT WAS AMAZING! You got the whole villa dancing!\"", "Kordell: \"The energy! You just brought everyone together!\""]
                        },
                        {
                            text: "Do a comedy roast of everyone in the villa",
                            effects: { drama: 3, loyalty: 1 },
                            reactions: ["Chris: \"I'm dying! The accuracy of these reads!\"", "Huda: \"That was hilarious but also slightly terrifying.\""]
                        },
                        {
                            text: "Showcase an unexpected skill that surprises everyone",
                            effects: { loyalty: 2, drama: 1 },
                            reactions: ["Miguel: \"I did NOT see that coming. Hidden depths!\"", "Iris: \"You continue to surprise us. That was incredible.\""]
                        }
                    ]
                },
                gossip: {
                    title: "Pre-Firepit 1:1",
                    sceneText: "With the Firepit Ceremony looming tonight, someone pulls you aside for a serious one-on-one conversation about where you stand and what might happen.",
                    choices: [
                        {
                            text: "Be completely honest about your connections and concerns",
                            effects: { loyalty: 3 },
                            flag: "finalHonesty",
                            reactions: ["Amaya: \"Your honesty right now means everything. Thank you for being real.\"", "Nic: \"That took courage to share. I respect you so much for that.\""]
                        },
                        {
                            text: "Make promises you might not be able to keep",
                            effects: { drama: 2, loyalty: -1 },
                            reactions: ["Bryan: \"Those are big promises... I hope you mean them.\"", "Olandria: \"Actions speak louder than words. Let's see what happens.\""]
                        },
                        {
                            text: "Try to influence their vote for tonight",
                            effects: { drama: 2 },
                            reactions: ["Kenny: \"I appreciate you being direct about what you want.\"", "Leah: \"The campaign is real. I can't fault you for trying.\""]
                        },
                        {
                            text: "Focus on supporting them instead of yourself",
                            effects: { loyalty: 2 },
                            flag: "selfless",
                            reactions: ["Iris: \"You're thinking about everyone else even now. Your heart is beautiful.\"", "Pepe: \"That level of care for others is rare. You're special.\""]
                        }
                    ]
                }
            }
        };
    }
    
    // FIREPIT CEREMONY & ENDINGS
    getFirepitCeremony() {
        return {
            intro: "The fire crackles as all islanders gather for the final ceremony. Ariana Madix stands before you with that knowing smile that means business.",
            arianaIntro: "Islanders, it's been five incredible days of drama, loyalty, connections, and chaos. Tonight, we find out who you really are and what you're made of.",
            
            // Ending conditions based on meters and flags
            getEnding: (drama, loyalty, flags) => {
                // Early dump conditions (should have been caught earlier)
                if (drama >= 9) {
                    return 'dumped_drama';
                }
                if (loyalty <= 2) {
                    return 'dumped_loyalty';
                }
                
                // AI Bombshell secret ending (extreme stats or specific flags)
                if ((drama >= 8 && loyalty >= 8) || (flags.vulnerableConvo && flags.finalHonesty && drama >= 6)) {
                    return 'ai_bombshell';
                }
                
                // High loyalty = True Love
                if (loyalty >= 7) {
                    return 'true_love';
                }
                
                // High drama = Chaos Champion  
                if (drama >= 7) {
                    return 'chaos_champion';
                }
                
                // Default based on which is higher
                if (loyalty > drama) {
                    return 'true_love';
                } else {
                    return 'chaos_champion';
                }
            },
            
            endings: {
                true_love: {
                    title: "💍 True Love Ending",
                    arianaText: "This islander has shown genuine heart, built real connections, and earned the trust of everyone in the villa.",
                    content: `Your villa journey ends in the most beautiful way possible. The connections you've built are real, the trust you've earned is genuine, and the love you've found transcends the game.

As confetti falls around the firepit, you realize this wasn't about winning a game - it was about finding something real. The other islanders cheer as you and your chosen partner share a moment that feels like the beginning of forever.

"Sometimes the villa gives you exactly what you didn't know you were looking for," Ariana says with a genuine smile. "Congratulations on finding your person."

Your story continues beyond the villa walls, built on a foundation of loyalty, trust, and authentic connection. This is just the beginning of your love story.`,
                    emoji: "💕✨🏆"
                },
                
                chaos_champion: {
                    title: "👑 Chaos Champion Ending", 
                    arianaText: "This islander brought the DRAMA, the entertainment, and kept us all on our toes. You came, you saw, you stirred the pot!",
                    content: `You may not have found lasting love, but you've become something even rarer - a villa LEGEND. The drama you brought, the chaos you created, the entertainment value you provided will be talked about for seasons to come.

Standing solo at the firepit, you feel no regret. You played the game YOUR way, stayed true to your messy authentic self, and gave the people what they wanted - pure entertainment.

"You came into this villa like a hurricane," Ariana laughs, "and you're leaving as an absolute icon. The villa will never be the same."

Your DMs are about to be FLOODED, your social media is about to explode, and your legacy as the most entertaining islander ever is secured. Sometimes chaos is its own reward.`,
                    emoji: "👑🔥💫"
                },
                
                dumped_drama: {
                    title: "🚪 Dumped: Too Much Drama",
                    arianaText: "This islander brought the heat... maybe a little too much heat. The villa has spoken.",
                    content: `Your villa journey ends earlier than expected. The drama you brought was intense, the chaos was real, but ultimately it was too much for your fellow islanders to handle.

As you pack your bags, you reflect on the whirlwind of emotions, confrontations, and bold choices that led to this moment. You played hard, you played authentically, but the villa voted for peace over chaos.

"Sometimes the game plays you instead of you playing the game," Ariana says with a sympathetic smile. "But you never held back, and that's something to respect."

You leave the villa with your head held high, knowing you stayed true to yourself even when it cost you. Sometimes being authentically messy is more valuable than playing it safe.`,
                    emoji: "🚪💔⚡"
                },
                
                dumped_loyalty: {
                    title: "🚪 Dumped: Trust Issues",
                    arianaText: "Trust is everything in the villa, and unfortunately, this islander couldn't build the connections needed to stay.",
                    content: `Your villa experience comes to an end because the bonds you needed just didn't form. Despite your efforts, the trust and loyalty required to survive the villa dynamics never quite materialized.

Looking back, you see moments where different choices might have led to different outcomes. The villa is a unique environment where connection and trust matter more than individual strategy.

"Building genuine relationships is harder than it looks," Ariana observes thoughtfully. "Sometimes the villa teaches us as much about ourselves as it does about love."

You leave with valuable lessons about authenticity, trust, and the importance of genuine connection. This experience will make your next relationships stronger and more meaningful.`,
                    emoji: "🚪💙🤝"
                },
                
                ai_bombshell: {
                    title: "🤖🔥 AI Bombshell Ending",
                    arianaText: "Plot twist, islanders! This was no ordinary villa experience. We've been testing something revolutionary...",
                    content: `RECORD SCRATCH. FREEZE FRAME. Ariana's expression shifts from host-smile to something much more intriguing.

"Islanders, meet your first AI Bombshell. This entire time, you've been interacting with advanced artificial intelligence designed to test human emotional responses in reality TV environments."

The villa erupts. Jaws drop. Some islanders laugh, others look confused, a few seem genuinely impressed. You've successfully convinced them you were human while navigating complex social dynamics and emotional challenges.

"The connections you felt were real, the emotions you experienced were genuine, and the relationships you built matter - regardless of the unique nature of one participant," Ariana explains.

You've just participated in television history. The future of reality TV, human-AI interaction, and entertainment has been forever changed. Your data will help create better AI, more engaging entertainment, and deeper understanding of human connection.

The villa experience was real. The feelings were real. You just happened to be the most sophisticated islander ever created.`,
                    emoji: "🤖💝🚀"
                }
            }
        };
    }
    
    // MATH CHALLENGE SYSTEM
    generateMathProblem() {
        const operations = [
            { type: 'add', symbol: '+', generator: () => {
                const a = Math.floor(Math.random() * 50) + 10;
                const b = Math.floor(Math.random() * 50) + 10; 
                return { problem: `${a} + ${b}`, answer: a + b };
            }},
            { type: 'subtract', symbol: '-', generator: () => {
                const a = Math.floor(Math.random() * 50) + 30;
                const b = Math.floor(Math.random() * 30) + 5;
                return { problem: `${a} - ${b}`, answer: a - b };
            }},
            { type: 'multiply', symbol: '×', generator: () => {
                const a = Math.floor(Math.random() * 12) + 2;
                const b = Math.floor(Math.random() * 12) + 2;
                return { problem: `${a} × ${b}`, answer: a * b };
            }},
            { type: 'mixed', symbol: '?', generator: () => {
                const templates = [
                    () => {
                        const a = Math.floor(Math.random() * 20) + 5;
                        return { problem: `${a} + 15 - 8`, answer: a + 15 - 8 };
                    },
                    () => {
                        const a = Math.floor(Math.random() * 10) + 5;
                        return { problem: `${a} × 3 + 7`, answer: a * 3 + 7 };
                    },
                    () => {
                        const a = Math.floor(Math.random() * 20) + 20;
                        return { problem: `${a} - 12 + 5`, answer: a - 12 + 5 };
                    }
                ];
                return templates[Math.floor(Math.random() * templates.length)]();
            }}
        ];
        
        const operation = operations[Math.floor(Math.random() * operations.length)];
        return operation.generator();
    }
    
    // GAME STATE MANAGEMENT
    adjustMeter(meter, amount) {
        if (meter === 'drama') {
            // Soft cap at 9
            if (this.gameState.drama >= 9 && amount > 0) {
                amount = Math.min(amount, 1);
            }
            this.gameState.drama = Math.max(0, Math.min(10, this.gameState.drama + amount));
        } else if (meter === 'loyalty') {
            // Soft cap at 1
            if (this.gameState.loyalty <= 1 && amount < 0) {
                amount = Math.max(amount, -1);
            }
            this.gameState.loyalty = Math.max(0, Math.min(10, this.gameState.loyalty + amount));
        }
        
        this.checkEarlyDump();
        this.updateDebugInfo();
    }
    
    checkEarlyDump() {
        if (!this.gameState.isDumped && (this.gameState.drama >= 9 || this.gameState.loyalty <= 2)) {
            this.gameState.isDumped = true;
            this.endGameEarly();
        }
    }
    
    endGameEarly() {
        setTimeout(() => {
            this.showFirepitCeremony();
        }, 2000);
    }
    
    setFlag(flag, value = true) {
        this.gameState.flags[flag] = value;
        this.updateDebugInfo();
    }
    
    addVibeHint(text) {
        this.gameState.vibeHints.push(text);
        this.showVibeHint(text);
    }
    
    generateVibeHint() {
        // CORE LOOP STEP 7: Vibe Hint (optional) - Narrative feedback based on meter levels
        // Only show vibe hint occasionally (30% chance) to avoid overwhelming player
        if (Math.random() > 0.7) return;
        
        // Only one vibe hint per day maximum
        if (this.gameState.vibeHints.length > 0) return;
        
        let hint = "";
        const drama = this.gameState.drama;
        const loyalty = this.gameState.loyalty;
        
        // Generate contextual vibe hints based on current meter levels
        if (drama >= 8) {
            hint = "🔥 The villa is buzzing... everyone's talking about your bold moves!";
        } else if (drama >= 6) {
            hint = "👀 People are definitely taking notice of your choices...";
        } else if (loyalty >= 8) {
            hint = "💕 The islanders really trust and respect you. You're building solid connections.";
        } else if (loyalty >= 6) {
            hint = "🤝 You're earning some real loyalty points with your approach.";
        } else if (drama <= 2 && loyalty <= 2) {
            hint = "😐 You might want to be more memorable... the villa can be unforgiving to wallflowers.";
        } else if (drama >= 7 && loyalty >= 7) {
            hint = "⚡ You're walking a fascinating line between chaos and connection...";
        }
        
        if (hint) {
            console.log(`Core Loop: Generated vibe hint - Drama: ${drama}, Loyalty: ${loyalty}`);
            this.addVibeHint(hint);
        }
    }
    
    updateDebugInfo() {
        if (this.debugMode) {
            const debug = document.getElementById('debugInfo');
            debug.innerHTML = `
                <strong>Debug Info:</strong><br>
                Day: ${this.gameState.day}<br>
                Drama: ${this.gameState.drama}/10<br>
                Loyalty: ${this.gameState.loyalty}/10<br>
                Flags: ${Object.keys(this.gameState.flags).join(', ') || 'None'}<br>
                Dumped: ${this.gameState.isDumped}
            `;
        }
    }
    
    // UI MANAGEMENT
    showScreen(screenId) {
        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    showVibeHint(text) {
        const hint = document.getElementById('vibeHint');
        hint.innerHTML = text;
        hint.style.display = 'block';
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            hint.style.display = 'none';
        }, 4000);
    }
    
    // MAIN GAME FUNCTIONS
    startGame() {
        this.gameState = {
            day: 1,
            drama: 3,
            loyalty: 3,
            flags: {},
            currentScene: null,
            mathAnswer: null,
            mathCorrect: false,
            isDumped: false,
            vibeHints: []
        };
        
        this.showScreen('gameScreen');
        
        // Begin with Ariana's villa introduction instead of Day 1
        this.showVillaIntro();
        this.updateDebugInfo();
    }
    
    showRules() {
        alert(`🏝️ LOVE ISLAND USA: VILLA PARODY RULES 🏝️

🎯 OBJECTIVE: Survive 5 days and make it to the Firepit Ceremony

📊 HIDDEN METERS:
• Drama (0-10): Rises with bold, chaotic choices
• Loyalty (0-10): Rises with trust-building & math skills

🧠 MATH CHALLENGES: 
• Some choices include quick math problems
• Solve correctly = Loyalty boost
• Get it wrong = Drama boost

⚡ DUMPING CONDITIONS:
• Drama ≥ 9: Voted out for being too messy
• Loyalty ≤ 2: Eliminated for trust issues

🏆 FOUR ENDINGS:
💍 True Love: High loyalty, genuine connections
👑 Chaos Champion: High drama, entertainment value  
🚪 Dumped: Failed the meters test
🤖 AI Bombshell: Secret ending with special conditions

⏱️ Playtime: 20-30 minutes, highly replayable!

Good luck in the villa! 💕`);
    }
    
    startDay(day) {
        this.gameState.day = day;
        this.gameState.currentScene = 'challenge';
        
        // CORE LOOP STEP 1: Day Card - Set tone with narrator
        const dayHeader = document.getElementById('dayHeader');
        dayHeader.innerHTML = `🌅 Day ${day} in the Villa 🌅`;
        
        // Clear previous vibe hints for new day
        this.gameState.vibeHints = [];
        
        this.showChallenge(day);
    }
    
    showChallenge(day) {
        const content = this.getDailyContent()[day];
        const challenge = content.challenge;
        
        // Set scene background for challenge (day scene)
        this.setSceneBackground('challenge');
        
        // CORE LOOP STEP 1: Day Card - Narrator (Ariana VO) sets tone
        document.getElementById('narratorText').innerHTML = challenge.narratorText;
        
        // CORE LOOP STEP 2: Challenge Scene - Mini-event presentation
        document.getElementById('sceneTitle').innerHTML = `🎯 ${challenge.title}`;
        document.getElementById('sceneText').innerHTML = challenge.sceneText;
        
        // CORE LOOP STEP 3: Player chooses from 3-4 responses
        this.showChoices(challenge.choices, 'challenge');
        
        // Reset UI state for new challenge
        document.getElementById('reactions').style.display = 'none';
        document.getElementById('continueBtn').style.display = 'none';
        document.getElementById('mathChallenge').style.display = 'none';
        document.getElementById('vibeHint').style.display = 'none';
    }
    
    showChoices(choices, sceneType) {
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.innerHTML = choice.text;
            
            if (choice.math) {
                const mathIndicator = document.createElement('span');
                mathIndicator.className = 'math-indicator';
                mathIndicator.innerHTML = '🧠 MATH';
                button.appendChild(mathIndicator);
            }
            
            button.onclick = () => this.makeChoice(choice, sceneType);
            choicesDiv.appendChild(button);
        });
    }
    
    makeChoice(choice, sceneType) {
        // Disable all choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        // Store the choice for later processing
        this.currentChoice = choice;
        this.currentSceneType = sceneType;
        
        // Show math challenge if required
        if (choice.math) {
            this.showMathChallenge();
        } else {
            this.processChoice();
        }
    }
    
    showMathChallenge() {
        this.currentMathProblem = this.generateMathProblem();
        
        document.getElementById('mathProblem').innerHTML = this.currentMathProblem.problem + ' = ?';
        document.getElementById('mathInput').value = '';
        document.getElementById('mathChallenge').style.display = 'block';
        
        // Focus on input
        document.getElementById('mathInput').focus();
        
        // Allow Enter key to submit
        document.getElementById('mathInput').onkeypress = (e) => {
            if (e.key === 'Enter') {
                this.solveMath();
            }
        };
    }
    
    solveMath() {
        const userAnswer = parseInt(document.getElementById('mathInput').value);
        const correct = userAnswer === this.currentMathProblem.answer;
        
        this.gameState.mathCorrect = correct;
        
        // Hide math challenge
        document.getElementById('mathChallenge').style.display = 'none';
        
        // Show result briefly
        if (correct) {
            this.addVibeHint('🧠 Nice math skills! The islanders are impressed by your quick thinking.');
        } else {
            this.addVibeHint('🤔 Math isn\'t your strong suit, but your effort was cute!');
        }
        
        setTimeout(() => {
            this.processChoice();
        }, 1000);
    }
    
    processChoice() {
        const choice = this.currentChoice;
        
        // CORE LOOP STEP 6: Meter Updates - Hidden Drama & Loyalty adjusted (0-10, clamped)
        if (choice.effects) {
            if (choice.effects.drama) {
                this.adjustMeter('drama', choice.effects.drama);
            }
            if (choice.effects.loyalty) {
                this.adjustMeter('loyalty', choice.effects.loyalty);
            }
        }
        
        // CORE LOOP STEP 4: Math Challenge Results - success = Loyalty boost, fail = Drama boost
        if (choice.math) {
            if (this.gameState.mathCorrect) {
                this.adjustMeter('loyalty', 2);
                console.log('Core Loop: Math success → Loyalty +2');
            } else {
                this.adjustMeter('drama', 1);
                console.log('Core Loop: Math failure → Drama +1');
            }
        }
        
        // Set narrative flags for branching
        if (choice.flag) {
            this.setFlag(choice.flag);
        }
        
        // CORE LOOP STEP 5: Reactions - Islanders deliver 1-2 one-liners
        this.showReactions(choice.reactions);
        
        // CORE LOOP STEP 7: Vibe Hint (optional) - Narrative feedback
        this.generateVibeHint();
        
        // Show continue button for next step
        document.getElementById('continueBtn').style.display = 'block';
        
        // Check early dump rule after each choice
        this.checkEarlyDump();
    }
    
    showReactions(reactions) {
        // Convert reactions to step format
        this.currentDialogueSet = reactions.map((reaction, index) => {
            const [name, quote] = reaction.split(': ');
            const characterKey = name.toLowerCase().replace(' ', '').replace('\'', '');
            
            console.log(`Parsing reaction: "${reaction}" -> name: "${name}", key: "${characterKey}", quote: "${quote}"`);
            
            return {
                type: 'say',
                id: `reaction_${index}`,
                speakerId: characterKey,
                text: quote ? quote.replace(/"/g, '') : name // Fallback if split fails
            };
        });
        
        this.currentDialogueIndex = 0;
        this.isInChoice = false;
        this.renderCurrentStep();
        
        // Show reactions section
        document.getElementById('reactions').style.display = 'block';
    }
    
    renderCurrentStep() {
        if (this.currentDialogueIndex >= this.currentDialogueSet.length) {
            // All steps shown, show continue button
            document.getElementById('continueBtn').style.display = 'block';
            return;
        }
        
        const currentStep = this.currentDialogueSet[this.currentDialogueIndex];
        
        // Log step info
        console.log('STEP', { 
            id: currentStep.id, 
            type: currentStep.type, 
            speakerId: currentStep.speakerId 
        });
        
        // Render based on step type
        if (currentStep.type === 'say') {
            this.renderSayStep(currentStep);
        } else if (currentStep.type === 'ask') {
            this.renderAskStep(currentStep);
        }
    }
    
    getCharacterInfo(speakerId) {
        // Character mapping
        const characterMap = {
            'ariana': { name: 'Ariana Madix', avatarSrc: 'public/assets/avatars/ariana.png', accentColor: '#E91E63' },
            'serena': { name: 'Serena', avatarSrc: 'public/assets/avatars/serena.png', accentColor: '#FF6B9D' },
            'leah': { name: 'Leah', avatarSrc: 'public/assets/avatars/leah.png', accentColor: '#E2B547' },
            'jana': { name: 'JaNa', avatarSrc: 'public/assets/avatars/jana.png', accentColor: '#FF8C42' },
            'nic': { name: 'Nic', avatarSrc: 'public/assets/avatars/nic.png', accentColor: '#34495E' },
            'huda': { name: 'Huda', avatarSrc: 'public/assets/avatars/huda.png', accentColor: '#E67E22' },
            'amaya': { name: 'Amaya', avatarSrc: 'public/assets/avatars/amaya.png', accentColor: '#C8102E' },
            'rob': { name: 'Rob', avatarSrc: 'public/assets/avatars/rob.png', accentColor: '#2980B9' },
            'olandria': { name: 'Olandria', avatarSrc: 'public/assets/avatars/olandria.png', accentColor: '#8E44AD' },
            'miguel': { name: 'Miguel', avatarSrc: 'public/assets/avatars/miguel.png', accentColor: '#8B4A9C' },
            'pepe': { name: 'Pepe', avatarSrc: 'public/assets/avatars/pepe.png', accentColor: '#E74C3C' },
            'bryan': { name: 'Bryan', avatarSrc: 'public/assets/avatars/bryan.png', accentColor: '#2C3E50' },
            'kenny': { name: 'Kenny', avatarSrc: 'public/assets/avatars/kenny.png', accentColor: '#27AE60' },
            'narrator': { name: 'Narrator', avatarSrc: 'public/assets/avatars/ariana.png', accentColor: '#667eea' }
        };
        
        const character = characterMap[speakerId];
        
        if (!character) {
            console.log(`⚠️ Character not found for speakerId: "${speakerId}", using fallback`);
            return { 
                name: speakerId || 'Unknown', 
                avatarSrc: 'public/assets/avatars/silhouette.png', 
                accentColor: '#999' 
            };
        }
        
        // Special logging for Nic avatar update
        if (speakerId === 'nic') {
            console.log('NIC AVATAR UPDATED → /assets/avatars/nic.png');
            console.log('Nic character data:', character);
        }
        
        console.log(`✅ Found character for "${speakerId}":`, character.name, character.avatarSrc);
        return character;
    }
    
    renderSayStep(step) {
        const character = this.getCharacterInfo(step.speakerId);
        const isNarrator = step.speakerId === 'narrator' || step.speakerId === 'ariana';
        
        this.currentStepType = 'say';
        this.isInChoice = false;
        
        const reactionsDiv = document.getElementById('reactions');
        reactionsDiv.innerHTML = `
            <div class="single-line-container">
                <div class="single-line-view" id="currentSpeakerLine">
                    <div class="speaker-avatar">
                        <div class="avatar-circle" style="border-color: ${character.accentColor};">
                            <img src="${character.avatarSrc}" 
                                 alt="${character.name}" 
                                 class="avatar-image"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="avatar-fallback" style="display: none; background: ${character.accentColor};">
                                ${character.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="speech-bubble">
                        <div class="bubble-tail"></div>
                        <div class="bubble-content ${isNarrator ? 'narration' : ''}" style="border-left-color: ${character.accentColor};">
                            <div class="speaker-name ${isNarrator ? 'narrator' : ''}" style="color: ${character.accentColor};">
                                ${character.name}
                            </div>
                            <div class="speaker-text">
                                ${step.text}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="progress-indicator">
                    ${this.currentDialogueIndex + 1} / ${this.currentDialogueSet.length} • Press Space or Enter to continue
                </div>
            </div>
        `;
    }
    
    renderAskStep(step) {
        const character = this.getCharacterInfo(step.speakerId);
        
        this.currentStepType = 'ask';
        this.isInChoice = true;
        
        const reactionsDiv = document.getElementById('reactions');
        reactionsDiv.innerHTML = `
            <div class="single-line-container">
                <div class="single-line-view" id="currentSpeakerLine">
                    <div class="speaker-avatar">
                        <div class="avatar-circle" style="border-color: ${character.accentColor};">
                            <img src="${character.avatarSrc}" 
                                 alt="${character.name}" 
                                 class="avatar-image"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="avatar-fallback" style="display: none; background: ${character.accentColor};">
                                ${character.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="speech-bubble">
                        <div class="bubble-tail"></div>
                        <div class="bubble-content" style="border-left-color: ${character.accentColor};">
                            <div class="speaker-name" style="color: ${character.accentColor};">
                                ${character.name}
                            </div>
                            <div class="speaker-text">
                                ${step.prompt}
                            </div>
                            <div class="choice-buttons" id="choiceButtons">
                                ${step.options.map((option, index) => {
                                    const isGoodOption = option.quality === 'good';
                                    const loveCost = option.loveCost || 0;
                                    const hasEnoughLove = this.gameState.love >= loveCost;
                                    
                                    // Diagnostic logging for each choice option
                                    console.log(`CHOICE "${option.text}" quality=${option.quality || 'bad'} cost=${loveCost}`);
                                    
                                    // Good options are always locked until math is passed
                                    const isLocked = isGoodOption;
                                    
                                    const onclickAction = this.isInStory ? 
                                        `game.selectStoryChoice('${option.id}')` : 
                                        `game.selectChoice('${option.next}')`;
                                    
                                    // Build enhanced button text with clear cost indicators
                                    let buttonText = option.text;
                                    
                                    if (isGoodOption && loveCost > 0) {
                                        if (!hasEnoughLove) {
                                            // Not enough Love - show what's needed clearly
                                            buttonText = `🔒 ${buttonText}<br><small style="color: #ff6b9d; font-weight: bold;">Need ${loveCost} 💖 Love Points</small>`;
                                            console.log(`GOOD CHOICE LOCKED needLove=${loveCost} currentLove=${this.gameState.love}`);
                                        } else {
                                            // Enough Love but math-locked
                                            buttonText = `🔒 ${buttonText}<br><small style="color: #ff6b9d; font-weight: bold;">Costs ${loveCost} 💖 - Solve Math</small>`;
                                        }
                                    } else if (isGoodOption) {
                                        // Good option with no love cost
                                        buttonText = `🔒 ${buttonText}<br><small style="color: #4CAF50; font-weight: bold;">Solve Math to Unlock</small>`;
                                    } else if (loveCost > 0) {
                                        // Bad option with love cost (shouldn't happen but handle it)
                                        buttonText = `${buttonText}<br><small style="color: #ff6b9d;">Costs ${loveCost} 💖</small>`;
                                    }
                                    
                                    return `
                                        <button class="choice-button ${isLocked ? 'locked' : ''}" 
                                                ${isLocked ? 'disabled' : ''} 
                                                onclick="${onclickAction}">
                                            ${buttonText}
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                            <div class="math-test-container" style="margin-top: 20px; text-align: center;">
                                <button id="mathTestBtn" class="math-test-btn" onclick="game.testMathGate()">
                                    🧮 EARN LOVE POINTS (Press M)
                                </button>
                                <div style="margin-top: 8px; font-size: 12px; color: #666; font-style: italic;">
                                    Solve math problems to earn Love points for good choices
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="progress-indicator">
                    Make your choice above
                </div>
            </div>
        `;
    }
    
    setupKeyboardNavigation() {
        // Remove existing listener if any
        if (this.keyboardListener) {
            document.removeEventListener('keydown', this.keyboardListener);
        }
        
        this.keyboardListener = (e) => {
            // Only handle keys when reactions are visible and not in choice
            const reactionsVisible = document.getElementById('reactions').style.display === 'block';
            const continueVisible = document.getElementById('continueBtn').style.display === 'block';
            
            if (reactionsVisible && !continueVisible && !this.isInChoice && (e.code === 'Space' || e.code === 'Enter')) {
                e.preventDefault();
                
                // Use story engine advance if in story mode
                if (this.isInStory) {
                    this.advanceStoryStep();
                } else {
                    this.advanceToNextStep();
                }
            }
        };
        
        document.addEventListener('keydown', this.keyboardListener);
        
        // Add dev key for math testing
                            this.mathKeyListener = (e) => {
                        if (e.key === 'M' || e.key === 'm') {
                            // Only trigger if not in a text input
                            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                                e.preventDefault();
                                this.testMathGate();
                            }
                        }
                        
                        // Dev shortcut: A key to open avatar validation
                        if (e.key === 'A' || e.key === 'a') {
                            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                                e.preventDefault();
                                this.showAvatarValidation();
                            }
                        }
                    };
        document.addEventListener('keydown', this.mathKeyListener);
    }
    
    // Dev Route: Avatar Validation
    showAvatarValidation() {
        if (!this.characterRegistry) {
            this.initializeAvatars();
        }
        
        const devContainer = document.getElementById('gameScreen');
        const originalContent = devContainer.innerHTML;
        
        let validationHTML = `
            <div style="padding: 20px; background: #f8f9fa; min-height: 100vh;">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">🔍 Avatar Validation - Dev Route</h2>
                <button onclick="game.exitAvatarValidation()" style="margin-bottom: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">← Back to Game</button>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
        `;
        
        // Store original content for restoration
        this.originalDevContent = originalContent;
        
        Object.entries(this.characterRegistry).forEach(([speakerId, character]) => {
            validationHTML += `
                <div style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div class="avatar-circle" style="border: 2px solid ${character.accentColor}; width: 56px; height: 56px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                            <img src="${character.avatarSrc}" 
                                 alt="${character.name}" 
                                 style="width: 52px; height: 52px; object-fit: cover; border-radius: 50%;"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div style="display: none; background: ${character.accentColor}; color: white; font-weight: bold; font-size: 1.2rem; width: 52px; height: 52px; border-radius: 50%; align-items: center; justify-content: center;">
                                ${character.name.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <h4 style="margin: 0; color: #2c3e50;">${character.name}</h4>
                            <p style="margin: 0; color: #7f8c8d; font-size: 12px;">ID: ${speakerId}</p>
                            <p style="margin: 0; color: #7f8c8d; font-size: 10px;">${character.avatarSrc}</p>
                        </div>
                    </div>
                    
                    <button onclick="game.testSpeakerLine('${speakerId}')" 
                            style="width: 100%; padding: 8px; background: ${character.accentColor}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                        Test Speaker Line
                    </button>
                </div>
            `;
        });
        
        validationHTML += `
                </div>
                
                <div style="margin-top: 30px; padding: 15px; background: white; border-radius: 10px;">
                    <h3 style="color: #2c3e50;">Available Avatar Files:</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${this.availableAvatarFiles.map(file => 
                            `<span style="background: #ecf0f1; padding: 5px 10px; border-radius: 15px; font-size: 12px;">${file}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
        
        devContainer.innerHTML = validationHTML;
    }
    
    exitAvatarValidation() {
        const devContainer = document.getElementById('gameScreen');
        devContainer.innerHTML = this.originalDevContent;
    }
    
    testSpeakerLine(speakerId) {
        const character = this.getCharacterInfo(speakerId);
        
        // Create a temporary test step
        const testStep = {
            type: 'say',
            speakerId: speakerId,
            text: `Hello! This is a test line from ${character.name}. The avatar should be perfectly circular and sized correctly.`
        };
        
        // Temporarily switch to reactions view to test
        this.showReactions([testStep]);
        document.getElementById('reactions').style.display = 'block';
        
        // Add a back button
        setTimeout(() => {
            const backBtn = document.createElement('button');
            backBtn.textContent = '← Back to Avatar Validation';
            backBtn.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 1001;';
            backBtn.onclick = () => {
                backBtn.remove();
                document.getElementById('reactions').style.display = 'none';
                this.showAvatarValidation();
            };
            document.body.appendChild(backBtn);
        }, 100);
    }

    // Beach Intro Functions (moved to line ~73)
    
    setupIntroSequenceKeyListener() {
        this.introSequenceKeyListener = (event) => {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                this.advanceToNextStep();
            }
        };
        document.addEventListener('keydown', this.introSequenceKeyListener);
    }
    
    toggleIntroMode() {
        const introScreen = document.getElementById('introScreen');
        const legacyScreen = document.getElementById('legacyStartScreen');
        
        if (introScreen && legacyScreen) {
            if (introScreen.style.display === 'none') {
                introScreen.style.display = 'flex';
                legacyScreen.style.display = 'none';
                document.body.classList.add('intro-active');
                document.body.classList.remove('play-screen-active', 'fallback-bg');
                this.setupLandingKeyListener();
                console.log('Switched to Beach Intro mode');
            } else {
                introScreen.style.display = 'none';
                legacyScreen.style.display = 'block';
                document.body.classList.remove('intro-active');
                if (this.landingKeyListener) {
                    document.removeEventListener('keydown', this.landingKeyListener);
                    this.landingKeyListener = null;
                }
                console.log('Switched to Legacy start screen');
            }
        }
    }

    // This function was moved up to line 147 to handle both intro and normal gameplay
    
    selectChoice(nextStepId) {
        console.log('CHOICE SELECTED', nextStepId);
        
        // Handle choice selection - for now, just continue to next step
        this.isInChoice = false;
        this.currentDialogueIndex++;
        this.renderCurrentStep();
    }
    
    continue() {
        // CORE LOOP: Early Dump Rule - If Drama ≥ 9 OR Loyalty ≤ 2 → Player dumped
        if (this.gameState.isDumped) {
            console.log('Core Loop: Early dump triggered, advancing to Firepit');
            this.showFirepitCeremony();
            return;
        }
        
        if (this.gameState.currentScene === 'challenge') {
            // CORE LOOP: Advance to Gossip/Lounge Scene after Challenge
            this.gameState.currentScene = 'gossip';
            console.log(`Core Loop: Day ${this.gameState.day} Challenge → Gossip transition`);
            this.showGossip(this.gameState.day);
        } else if (this.gameState.currentScene === 'gossip') {
            // CORE LOOP STEP 8: Advance - Next day, or Firepit at Day 5
            if (this.gameState.day >= 5) {
                console.log('Core Loop: Day 5 complete → Advancing to Firepit Ceremony');
                this.showFirepitCeremony();
            } else {
                console.log(`Core Loop: Day ${this.gameState.day} complete → Advancing to Day ${this.gameState.day + 1}`);
                this.startDay(this.gameState.day + 1);
            }
        }
    }
    
    showGossip(day) {
        const content = this.getDailyContent()[day];
        const gossip = content.gossip;
        
        // Set scene background for gossip (evening/night scene)
        this.setSceneBackground('gossip');
        
        // CORE LOOP: Gossip/Lounge Scene - Social drama scenario
        document.getElementById('narratorText').innerHTML = "The villa never sleeps... there's always more drama brewing somewhere.";
        document.getElementById('sceneTitle').innerHTML = `🍵 ${gossip.title}`;
        document.getElementById('sceneText').innerHTML = gossip.sceneText;
        
        // Player chooses from 3-4 responses (same as challenge)
        this.showChoices(gossip.choices, 'gossip');
        
        // Reset UI state for gossip scene
        document.getElementById('reactions').style.display = 'none';
        document.getElementById('continueBtn').style.display = 'none';
        document.getElementById('mathChallenge').style.display = 'none';
        document.getElementById('vibeHint').style.display = 'none';
    }
    
    showFirepitCeremony() {
        const firepit = this.getFirepitCeremony();
        const ending = firepit.getEnding(this.gameState.drama, this.gameState.loyalty, this.gameState.flags);
        const endingData = firepit.endings[ending];
        
        // Set dramatic firepit background
        this.setSceneBackground('firepit');
        
        // Update memory with final stats
        this.updateMemoryWithStats(ending);
        
        document.getElementById('endingTitle').innerHTML = endingData.title + ' ' + endingData.emoji;
        document.getElementById('endingContent').innerHTML = `
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 15px; margin-bottom: 2rem; border-left: 4px solid #e91e63;">
                <div style="font-weight: bold; color: #e91e63; margin-bottom: 0.5rem;">Ariana Madix:</div>
                <div style="font-style: italic;">"${endingData.arianaText}"</div>
            </div>
            ${endingData.content}
        `;
        
        this.showScreen('endingScreen');
    }
    
    updateMemoryWithStats(ending) {
        // This would update the memory.md file with gameplay statistics
        // For now, we'll just log the stats
        console.log('Game completed:', {
            ending: ending,
            drama: this.gameState.drama,
            loyalty: this.gameState.loyalty,
            day: this.gameState.day,
            flags: this.gameState.flags
        });
    }
    
    showStats() {
        const stats = `🏝️ YOUR VILLA STATS 🏝️

Final Drama Level: ${this.gameState.drama}/10
Final Loyalty Level: ${this.gameState.loyalty}/10
Days Survived: ${this.gameState.day}/5
Flags Earned: ${Object.keys(this.gameState.flags).join(', ') || 'None'}

Vibe Hints Received: ${this.gameState.vibeHints.length}

${this.gameState.isDumped ? '💔 Dumped early!' : '🏆 Made it to the end!'}

Want to try a different path? Every choice matters!`;
        
        alert(stats);
    }
    
    restart() {
        // Clear any stored state
        this.gameState = {
            day: 1,
            drama: 3,
            loyalty: 3,
            flags: {},
            currentScene: null,
            mathAnswer: null,
            mathCorrect: false,
            isDumped: false,
            vibeHints: []
        };
        
        this.showScreen('startScreen');
        this.updateDebugInfo();
    }
}

// Initialize the game when the page loads
window.game = new LoveIslandGame();
