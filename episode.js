// Episode-style Dialog System with Multi-Day Support
class EpisodeDialog {
    constructor() {
        // Day registry
        this.DAYS = {
            1: { id: 1, file: 'day-1', initialStepId: 'd1_001' },
            2: { id: 2, file: 'day-2', initialStepId: 'd2_001' },
            3: { id: 3, file: 'day-3', initialStepId: 'd3_001' }
        };
        
        this.currentDay = 1;
        this.steps = [];
        this.currentIndex = 0;
        this.initialized = false;
        this.keyListener = null;
        this.isInChoice = false;
        this.love = 0; // Love points
        this.modalOpen = false;
        this.playerAvatar = null; // Initialize player avatar
        
        // Math quiz state
        this.mathQuiz = {
            active: false,
            round: 0,
            totalRounds: 5,
            correct: 0,
            currentAnswer: null,
            timer: null,
            timeLeft: 7,
            submitted: false
        };
        
        // Couple up state
        this.currentPartner = null;
        this.romance = {};
        this.coupleUpShown = false;
        this.messageCount = 0;
        
        // Drama meter
        this.drama = 0;
        
        // Bryan-specific points
        this.bryanPoints = 0;
        
        // Cutscene system
        this.isPlayingCutscene = false;
        this.cutsceneFlags = {};
        
        // Cutscene registry
        this.CUTSCENES = {
            nic_kiss_pool: {
                bg: '/public/assets/backgrounds/villa_day.png',
                steps: [
                    // STEP 1: NIC KISS
                    { type: 'say', speakerId: 'nic', text: "(leans closer) I can't hold back anymore…" },
                    { type: 'say', speakerId: 'narration', text: "Nic leans in and kisses you softly. The world feels like it stops for a moment." },
                    { type: 'say', speakerId: 'you', text: "(flustered) Nic… that was—" },
                    { type: 'say', speakerId: 'nic', text: "(grinning) Worth the wait?" },
                    { type: 'say', speakerId: 'you', text: "(teasing) You're trouble, you know that?" },
                    { type: 'say', speakerId: 'nic', text: "(low voice) Then get used to it, because I'm not letting you go now." },
                    { type: 'say', speakerId: 'narration', text: "He tucks a strand of hair behind your ear, eyes burning with intent." },
                    { type: 'say', speakerId: 'you', text: "(softly) You're making it really hard to think straight." },
                    { type: 'say', speakerId: 'nic', text: "(serious) Good. Stop thinking. Just feel." },
                    { type: 'say', speakerId: 'narration', text: "The kiss deepens, sealing the connection between you." },
                    
                    // STEP 2: BRYAN INTERRUPTION (immediately after, no gap)
                    { type: 'say', speakerId: 'bryan', text: "(angry) So that's how it is? First day and you're already kissing Nic?" },
                    { type: 'say', speakerId: 'you', text: "Bryan… it's not what it looks like." },
                    { type: 'say', speakerId: 'bryan', text: "(hurt) Looks like you wanted him, not me." },
                    { type: 'say', speakerId: 'nic', text: "(defensive) Relax, Bryan. She can choose for herself." },
                    { type: 'say', speakerId: 'bryan', text: "(sharp) And you think she chose you?" },
                    { type: 'say', speakerId: 'you', text: "Stop it, both of you. This isn't a competition." },
                    { type: 'say', speakerId: 'bryan', text: "(jealous) Maybe not for you. But it feels like one for me." },
                    { type: 'say', speakerId: 'narration', text: "The tension crackles by the pool, Islanders glancing over." },
                    { type: 'say', speakerId: 'nic', text: "(to you, softer) Don't let him guilt you. You know what you feel." },
                    { type: 'say', speakerId: 'bryan', text: "(quiet) Just tell me… was I wrong to think we had something?" }
                ],
                rewards: { 
                    romance: { nic: 3 }, 
                    drama: 2 
                },
                flags: { 'day1.bryanInterrupt': true }
            },
            bryan_kitchen_kiss: {
                bg: null,  // Keep current kitchen background
                steps: [
                    { type: 'say', speakerId: 'bryan', text: "I don't care who's watching..." },
                    { type: 'say', speakerId: 'narration', text: "Bryan pulls you close and kisses you deeply. Gasps echo around the kitchen." }
                ],
                rewards: null  // Rewards are already handled by the option itself
            },
            

            bryanCoupleIntro: {
                bg: '/public/assets/backgrounds/villa_day.png',  // Fire pit background
                steps: [
                    { type: 'say', speakerId: 'bryan', text: "(smiling) You know… when you picked me, I swear my heart skipped a beat." },
                    { type: 'say', speakerId: 'you', text: "(teasing) Oh really? You didn't look nervous at all." },
                    { type: 'say', speakerId: 'bryan', text: "(grinning) Trust me, inside I was praying you'd call my name." },
                    { type: 'say', speakerId: 'you', text: "Well… maybe I like keeping you on your toes." },
                    { type: 'say', speakerId: 'bryan', text: "(leans in slightly) Good. Because I want to prove to you I'm worth the risk." },
                    { type: 'say', speakerId: 'you', text: "(soft smile) Big words for Day 1, Bryan." },
                    { type: 'say', speakerId: 'bryan', text: "(serious tone) I don't waste time. Life's too short to play it safe." },
                    { type: 'say', speakerId: 'you', text: "So what happens now?" },
                    { type: 'say', speakerId: 'bryan', text: "(warm) Now? We start writing our story… one moment at a time." },
                    { type: 'say', speakerId: 'narration', text: "The villa buzz fades away as Bryan takes your hand, his eyes locked on yours." }
                ],
                rewards: { romance: { bryan: 3 } }
            },
            
            // Recoupling ceremony cutscenes
            bryan_recouple_excited: {
                bg: '/public/assets/backgrounds/villa_night.png',
                steps: [
                    { type: 'say', speakerId: 'bryan', text: "(beaming) You picked me again… I swear you won't regret this." },
                    { type: 'say', speakerId: 'narration', text: "Bryan lifts you off your feet, grinning ear to ear." },
                    { type: 'say', speakerId: 'bryan', text: "(softly) From here on out, I'm yours." }
                ],
                rewards: { romance: { bryan: 3 } },
                flags: { 'day2.recoupling.bryan': true }
            },
            
            nic_recouple_excited: {
                bg: '/public/assets/backgrounds/villa_night.png',
                steps: [
                    { type: 'say', speakerId: 'nic', text: "(smirking, relieved) So it's me, huh? Smart choice." },
                    { type: 'say', speakerId: 'narration', text: "Nic pulls you close, brushing a kiss on your cheek in front of everyone." },
                    { type: 'say', speakerId: 'nic', text: "(low voice) Now everyone knows you're mine." }
                ],
                rewards: { romance: { nic: 3 } },
                flags: { 'day2.recoupling.nic': true }
            }
        };
    }
    
    async init() {
        if (this.initialized) return;
        
        // Check if player avatar is selected, redirect if not
        const playerAvatarPath = localStorage.getItem('player.avatar.path');
        const playerAvatarName = localStorage.getItem('player.avatar.name');
        if (!playerAvatarPath || !playerAvatarName) {
            console.log('No player avatar found, redirecting to bombshell selection');
            // Redirect to bombshell selection
            if (window.navigateToBombshellSelector) {
                window.navigateToBombshellSelector();
                return;
            }
        }
        
        // Load and restore player avatar
        this.playerAvatar = {
            path: playerAvatarPath,
            name: playerAvatarName,
            id: localStorage.getItem('player.id') || 'you'
        };
        
        // Save default path if not already saved
        if (!localStorage.getItem('player.avatar.defaultPath')) {
            localStorage.setItem('player.avatar.defaultPath', playerAvatarPath);
        }
        
        console.log('PLAYER AVATAR RESTORED', this.playerAvatar);
        
        // Load current day from localStorage
        const savedDay = localStorage.getItem('story.progress.day');
        this.currentDay = savedDay ? parseInt(savedDay, 10) : 1;
        
        console.log(`EPISODE VIEW READY — day-${this.currentDay}`);
        
        // Load love points from localStorage
        this.loadLovePoints();
        
        // Load drama points from localStorage
        this.loadDramaPoints();
        
        // Load Bryan points if applicable
        this.loadBryanPoints();
        
        // Load couple up state
        this.loadCoupleState();
        
        // Create HUD
        this.createLoveHUD();
        this.createDramaHUD();
        this.createPartnerHUD();
        this.createPlayerAvatarHUD();
        
        // Check if we're in a special arc (like Bryan's)
        const currentArc = localStorage.getItem('story.currentArc');
        if (currentArc === 'bryan' && this.currentPartner === 'bryan') {
            // Load Bryan's arc instead of regular day content
            console.log('Resuming Bryan arc');
            await this.loadBryanArc();
        } else {
            // Load and parse current day's content
            await this.loadDayContent(this.currentDay);
        }
        
        // Restore progress from localStorage
        this.restoreProgress();
        
        // Render current step
        this.renderCurrentStep();
        
        // Setup keyboard controls
        this.setupKeyboardControls();
        
        // Setup dev shortcuts
        this.setupDevShortcuts();
        
        this.initialized = true;
    }
    
    loadLovePoints() {
        const saved = localStorage.getItem('meters.love');
        if (saved !== null) {
            this.love = parseInt(saved, 10);
        } else {
            this.love = 0;
        }
        console.log('Love points loaded:', this.love);
    }
    
    saveLovePoints() {
        localStorage.setItem('meters.love', this.love.toString());
    }
    
    loadDramaPoints() {
        const saved = localStorage.getItem('meters.drama');
        if (saved !== null) {
            this.drama = parseInt(saved, 10);
        } else {
            this.drama = 0;
        }
        console.log('Drama points loaded:', this.drama);
    }
    
    saveDramaPoints() {
        localStorage.setItem('meters.drama', this.drama.toString());
    }
    
    loadBryanPoints() {
        const saved = localStorage.getItem('story.bryan.points');
        if (saved !== null) {
            this.bryanPoints = parseInt(saved, 10);
        } else {
            this.bryanPoints = 0;
        }
        console.log('Bryan points loaded:', this.bryanPoints);
    }
    
    saveBryanPoints() {
        localStorage.setItem('story.bryan.points', this.bryanPoints.toString());
    }
    
    updateBryanPoints(change) {
        this.bryanPoints += change;
        this.saveBryanPoints();
        console.log('BRYAN POINTS UPDATED →', this.bryanPoints);
    }
    
    spendLove(cost) {
        this.love -= cost;
        this.saveLovePoints();
        this.updateLoveHUD();
        console.log(`LOVE SPEND cost=${cost} newLove=${this.love}`);
    }
    
    createLoveHUD() {
        // Remove existing HUD if any
        const existingHUD = document.getElementById('episodeLoveHUD');
        if (existingHUD) existingHUD.remove();
        
        // Create HUD container
        const hud = document.createElement('div');
        hud.id = 'episodeLoveHUD';
        hud.className = 'episode-love-hud';
        hud.innerHTML = `💖 Love: ${this.love}`;
        
        // Add to NextView
        const nextView = document.getElementById('nextView');
        if (nextView) {
            nextView.appendChild(hud);
        }
    }
    
    updateLoveHUD() {
        const hud = document.getElementById('episodeLoveHUD');
        if (hud) {
            hud.innerHTML = `💖 Love: ${this.love}`;
        }
    }
    
    createDramaHUD() {
        // Remove existing HUD if any
        const existingHUD = document.getElementById('episodeDramaHUD');
        if (existingHUD) existingHUD.remove();
        
        // Create HUD container
        const hud = document.createElement('div');
        hud.id = 'episodeDramaHUD';
        hud.className = 'episode-drama-hud';
        hud.innerHTML = `🔥 Drama: ${this.drama}`;
        
        // Add to body
        document.body.appendChild(hud);
    }
    
    updateDramaHUD() {
        const hud = document.getElementById('episodeDramaHUD');
        if (hud) {
            hud.innerHTML = `🔥 Drama: ${this.drama}`;
        }
    }
    
    loadCoupleState() {
        // Load current partner
        const savedPartner = localStorage.getItem('story.partner.current');
        if (savedPartner) {
            this.currentPartner = savedPartner;
            console.log('COUPLE UP: already coupled to', this.currentPartner);
        }
        
        // Load romance scores
        const savedRomance = localStorage.getItem('story.romance');
        if (savedRomance) {
            try {
                this.romance = JSON.parse(savedRomance);
            } catch (e) {
                this.romance = {};
            }
        }
    }
    
    saveCoupleState() {
        if (this.currentPartner) {
            localStorage.setItem('story.partner.current', this.currentPartner);
        }
        localStorage.setItem('story.romance', JSON.stringify(this.romance));
    }
    
    createPartnerHUD() {
        // Remove existing HUD if any
        const existingHUD = document.getElementById('episodePartnerHUD');
        if (existingHUD) existingHUD.remove();
        
        if (!this.currentPartner) return;
        
        // Create partner HUD container
        const hud = document.createElement('div');
        hud.id = 'episodePartnerHUD';
        hud.className = 'episode-partner-hud';
        hud.innerHTML = `💑 Coupled: ${this.getCharacterName(this.currentPartner)}`;
        
        // Add to NextView
        const nextView = document.getElementById('nextView');
        if (nextView) {
            nextView.appendChild(hud);
        }
    }
    
    updatePartnerHUD() {
        const hud = document.getElementById('episodePartnerHUD');
        if (hud && this.currentPartner) {
            hud.innerHTML = `💑 Coupled: ${this.getCharacterName(this.currentPartner)}`;
        } else if (!this.currentPartner && hud) {
            hud.remove();
        } else if (this.currentPartner && !hud) {
            this.createPartnerHUD();
        }
    }
    
    async switchToDressedUpAvatar() {
        // Get current player avatar info
        const currentPath = this.playerAvatar?.path || localStorage.getItem('player.avatar.path');
        const currentName = this.playerAvatar?.name || localStorage.getItem('player.avatar.name');
        
        if (!currentPath || !currentName) {
            console.log('No player avatar to switch');
            return;
        }
        
        // Extract the base name (remove "swimsuit" if already present, normalize)
        let baseName = currentName.toLowerCase().replace(/\s+/g, '');
        baseName = baseName.replace('swimsuit', ''); // Remove swimsuit if present
        baseName = baseName.replace('dressedup', ''); // Remove dressedup if already present
        
        // If already wearing dressed up outfit, don't switch again
        if (currentPath.includes('dressedup')) {
            console.log('Already wearing dressed-up outfit');
            return;
        }
        
        // Construct dressed-up path - try both capitalizations
        let dressedUpPath = `/public/assets/bombshells/${baseName}dressedup.png`;
        
        // For Maddie, use capital M (handle known capitalization issue)
        if (baseName === 'maddie') {
            dressedUpPath = `/public/assets/bombshells/Maddiedressedup.png`;
        }
        
        // Check if dressed-up version exists
        try {
            const response = await fetch(dressedUpPath);
            if (response.ok) {
                const oldPath = currentPath;
                
                // Update avatar path
                this.playerAvatar = {
                    path: dressedUpPath,
                    name: currentName // Keep the display name
                };
                
                // Persist to localStorage
                localStorage.setItem('player.avatar.path', dressedUpPath);
                
                console.log('Night outfit swap', { oldPath, newPath: dressedUpPath });
                
                // Update the avatar HUD if it exists
                const avatarImg = document.querySelector('#playerAvatarHUD img');
                if (avatarImg) {
                    avatarImg.src = dressedUpPath;
                }
            } else {
                console.log('No dressed-up version found for', baseName, '- keeping current outfit');
                // Ensure playerAvatar is still set even if dressed-up doesn't exist
                if (!this.playerAvatar) {
                    this.playerAvatar = {
                        path: currentPath,
                        name: currentName
                    };
                }
            }
        } catch (error) {
            console.log('Could not check for dressed-up avatar:', error);
            // Ensure playerAvatar is still set even on error
            if (!this.playerAvatar) {
                this.playerAvatar = {
                    path: currentPath,
                    name: currentName
                };
            }
        }
    }
    
    async loadRecouplingCeremony() {
        console.log('DAY 2 RECOUPLING CEREMONY START');
        
        // Ensure player avatar is loaded
        if (!this.playerAvatar || !this.playerAvatar.path) {
            const avatarPath = localStorage.getItem('player.avatar.path');
            const avatarName = localStorage.getItem('player.avatar.name');
            if (avatarPath && avatarName) {
                this.playerAvatar = {
                    path: avatarPath,
                    name: avatarName
                };
                console.log('Loaded player avatar for recoupling:', this.playerAvatar);
            }
        }
        
        // Clear existing steps and prepare ceremony
        this.steps = [];
        this.currentIndex = 0;
        
        // Ceremony narration
        this.steps.push({
            type: 'say',
            id: 'recouple_001',
            speakerId: 'narration',
            text: "Islanders, it's time to recouple. Tonight, choices will shake the villa."
        });
        
        // Quick NPC pairings
        this.steps.push({
            type: 'say',
            id: 'recouple_002',
            speakerId: 'amaya',
            text: "I'm choosing Chris. We have a connection I want to explore."
        });
        
        this.steps.push({
            type: 'say',
            id: 'recouple_003',
            speakerId: 'narration',
            text: "Olandria steps forward next."
        });
        
        this.steps.push({
            type: 'say',
            id: 'recouple_004',
            speakerId: 'olandria',
            text: "I pick Rob. He makes me laugh."
        });
        
        this.steps.push({
            type: 'say',
            id: 'recouple_005',
            speakerId: 'huda',
            text: "Kenny, you're mine tonight."
        });
        
        this.steps.push({
            type: 'say',
            id: 'recouple_006',
            speakerId: 'serena',
            text: "Miguel, come join me."
        });
        
        this.steps.push({
            type: 'say',
            id: 'recouple_007',
            speakerId: 'narration',
            text: "The fire pit grows quiet. All eyes turn to you."
        });
        
        this.steps.push({
            type: 'say',
            id: 'recouple_008',
            speakerId: 'narration',
            text: "Elle, it's your turn. Who will you couple up with tonight?"
        });
        
        // Player's choice
        this.steps.push({
            type: 'ask',
            id: 'recouple_choice',
            speakerId: 'you',
            prompt: "(This is it. Time to make my choice...)",
            options: [
                {
                    id: 'choose_bryan',
                    text: 'Choose Bryan',
                    quality: 'good',
                    loveCost: 5,
                    cutscene: 'bryan_recouple_excited',
                    flags: { 'day2.recoupling.bryan': true }
                },
                {
                    id: 'choose_nic',
                    text: 'Choose Nic',
                    quality: 'good',
                    loveCost: 5,
                    cutscene: 'nic_recouple_excited',
                    flags: { 'day2.recoupling.nic': true }
                },
                {
                    id: 'leave_villa',
                    text: 'Choose no one and leave the villa',
                    quality: 'bad',
                    loveCost: 0,
                    flags: { 'day2.leftVilla': true }
                }
            ]
        });
        
        // Start rendering
        this.renderCurrentStep();
    }
    
    createPlayerAvatarHUD() {
        const existingAvatar = document.getElementById('playerAvatarHUD');
        if (existingAvatar) existingAvatar.remove();
        
        const avatarPath = localStorage.getItem('player.avatar.path');
        const avatarName = localStorage.getItem('player.avatar.name');
        
        if (avatarPath && avatarName) {
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
    
    ensurePlayerAvatarHUD() {
        const existingAvatar = document.getElementById('playerAvatarHUD');
        if (!existingAvatar) {
            this.createPlayerAvatarHUD();
        }
    }
    
    updatePlayerAvatarHUD() {
        const avatarHUD = document.getElementById('playerAvatarHUD');
        if (!avatarHUD) {
            this.createPlayerAvatarHUD();
            return;
        }
        
        const avatarPath = this.playerAvatar?.path || localStorage.getItem('player.avatar.path');
        const avatarName = this.playerAvatar?.name || localStorage.getItem('player.avatar.name');
        
        if (avatarPath && avatarName) {
            const avatarImg = avatarHUD.querySelector('.player-avatar-img');
            if (avatarImg) {
                avatarImg.src = avatarPath;
            }
        }
    }
    
    getCharacterName(speakerId) {
        // Check if this is the player
        if (speakerId === 'you' || speakerId === 'player') {
            const playerName = localStorage.getItem('player.avatar.name');
            if (playerName) {
                return playerName;
            }
        }
        
        const names = {
            'nic': 'Nic',
            'rob': 'Rob',
            'miguel': 'Miguel',
            'bryan': 'Bryan',
            'pepe': 'Pepe',
            'kenny': 'Kenny',
            'amaya': 'Amaya',
            'jana': 'Jana',
            'huda': 'Huda',
            'olandria': 'Olandria',
            'serena': 'Serena',
            'chris': 'Chris'
        };
        return names[speakerId] || speakerId.charAt(0).toUpperCase() + speakerId.slice(1);
    }
    
    async loadDayContent(dayNumber) {
        // Special handling for Day 2 - Kitchen Scene
        if (dayNumber === 2) {
            this.loadDay2KitchenScene();
            return;
        }
        
        // Special handling for Day 3 - Bedroom Fallout
        if (dayNumber === 3) {
            this.loadDay3BedroomScene();
            return;
        }
        
        const dayConfig = this.DAYS[dayNumber];
        if (!dayConfig) {
            console.error(`Day ${dayNumber} not found in registry`);
            this.loadFallbackContent(dayNumber);
            return;
        }
        
        try {
            const response = await fetch(`/public/story/${dayConfig.file}.md`);
            const text = await response.text();
            this.parseContent(text, dayNumber);
            console.log('DAY LOAD', { day: dayNumber, steps: this.steps.length });
        } catch (error) {
            console.error(`Failed to load Day ${dayNumber} content:`, error);
            console.log(`DAY ${dayNumber} PARSE FAILED`);
            this.loadFallbackContent(dayNumber);
        }
    }
    
    loadFallbackContent(dayNumber) {
        // Minimal fallback script
        this.steps = [
            { type: 'say', id: `d${dayNumber}_001`, speakerId: 'narration', text: `Day ${dayNumber} in the villa...` },
            { type: 'say', id: `d${dayNumber}_002`, speakerId: 'ariana', text: 'Technical difficulties! But the show must go on!' },
            { type: 'say', id: `d${dayNumber}_003`, speakerId: 'narration', text: 'End of day. (Content unavailable)' }
        ];
    }
    
    // Keep old function for backward compatibility
    async loadDay1Content() {
        return this.loadDayContent(1);
    }
    
    parseContent(text, dayNumber = 1) {
        const lines = text.split('\n');
        const parsedSteps = [];
        let stepCounter = 1;
        let i = 0;
        let hasCoupleUpMarker = text.includes('# COUPLE_UP');
        let coupleUpInserted = false;
        const dayPrefix = `d${dayNumber}_`;
        
        // Check for END_DAY marker
        let hasEndDayMarker = text.includes(`# END_DAY_${dayNumber}`);
        
        while (i < lines.length && parsedSteps.length < 40) {
            const trimmed = lines[i].trim();
            
            // Check for END_DAY marker
            if (trimmed === `# END_DAY_${dayNumber}`) {
                // Add end of day step
                parsedSteps.push({
                    type: 'end_day',
                    id: `${dayPrefix}end`,
                    dayNumber: dayNumber
                });
                break;
            }
            
            // Check for COUPLE_UP marker (Day 1 only)
            if (dayNumber === 1 && trimmed === '# COUPLE_UP' && !coupleUpInserted) {
                this.insertCoupleUpStep(parsedSteps, stepCounter, dayPrefix);
                stepCounter++;
                coupleUpInserted = true;
                i++;
                continue;
            }
            
            // Check for choice block
            if (trimmed === '# Choice:') {
                // Get the prompt from the previous step
                if (parsedSteps.length > 0) {
                    const prevStep = parsedSteps[parsedSteps.length - 1];
                    const options = [];
                    
                    // Parse choice options
                    i++;
                    while (i < lines.length && lines[i].trim().startsWith('-')) {
                        const optionLine = lines[i].trim().substring(1).trim();
                        const option = this.parseChoiceOption(optionLine);
                        if (option) options.push(option);
                        i++;
                    }
                    
                    // If we need 4 options but have fewer, add placeholder bad options
                    while (options.length < 4) {
                        options.push({
                            id: `placeholder_${options.length}`,
                            text: `Option ${options.length + 1}`,
                            next: 'continue',
                            quality: 'bad',
                            loveCost: 0
                        });
                    }
                    
                    // Convert previous step to ask step
                    parsedSteps[parsedSteps.length - 1] = {
                        type: 'ask',
                        id: `${dayPrefix}ask_${String(stepCounter).padStart(3, '0')}`,
                        speakerId: prevStep.speakerId,
                        prompt: prevStep.text,
                        options: options
                    };
                    stepCounter++;
                }
                continue;
            }
            
            // Skip other headings
            if (trimmed.startsWith('#')) {
                i++;
                continue;
            }
            
            // Skip blank lines
            if (!trimmed) {
                i++;
                continue;
            }
            
            // Parse narration
            if (trimmed.startsWith('Narration:')) {
                const text = trimmed.substring('Narration:'.length).trim();
                parsedSteps.push({
                    type: 'say',
                    id: `${dayPrefix}${String(stepCounter).padStart(3, '0')}`,
                    speakerId: 'narration',
                    text: text
                });
                stepCounter++;
            }
            // Parse character dialog
            else if (trimmed.includes(':') && !trimmed.startsWith('-')) {
                const colonIndex = trimmed.indexOf(':');
                const speaker = trimmed.substring(0, colonIndex).trim();
                const text = trimmed.substring(colonIndex + 1).trim();
                
                // Only process valid speaker names
                if (speaker && text && !speaker.includes(' ')) {
                    parsedSteps.push({
                        type: 'say',
                        id: `${dayPrefix}${String(stepCounter).padStart(3, '0')}`,
                        speakerId: speaker.toLowerCase(),
                        text: text
                    });
                    stepCounter++;
                }
            }
            
            // Insert couple up after 13 messages if no marker found (Day 1 only)
            if (dayNumber === 1 && !hasCoupleUpMarker && !coupleUpInserted && parsedSteps.length === 13) {
                this.insertCoupleUpStep(parsedSteps, stepCounter, dayPrefix);
                stepCounter++;
                coupleUpInserted = true;
            }
            
            i++;
        }
        
        // Add end of day prompt if this day has a next day (but not for Day 1 with couple-up)
        // Day 1 will branch based on partner instead
        if (!hasEndDayMarker && this.DAYS[dayNumber + 1] && dayNumber !== 1) {
            parsedSteps.push({
                type: 'day_transition',
                id: `${dayPrefix}transition`,
                currentDay: dayNumber,
                nextDay: dayNumber + 1
            });
        }
        
        this.steps = parsedSteps;
        console.log(`DAY ${dayNumber} PARSED lines=`, this.steps.length);
    }
    
    insertCoupleUpStep(parsedSteps, stepCounter, dayPrefix = 'd1_') {
        // Skip if already coupled
        if (this.currentPartner) {
            console.log('COUPLE UP: already coupled to', this.currentPartner);
            return;
        }
        
        const eligibleBoys = ['nic', 'rob', 'miguel', 'bryan', 'pepe', 'kenny'];
        console.log('COUPLE UP: showing options', eligibleBoys);
        
        // Create couple up ask step
        const coupleUpStep = {
            type: 'ask',
            id: `${dayPrefix}couple_up_${String(stepCounter).padStart(3, '0')}`,
            speakerId: 'ariana',
            prompt: 'Time to couple up. Who are you choosing?',
            options: eligibleBoys.map(boy => ({
                id: boy,
                text: this.getCharacterName(boy),
                next: 'couple_selected',
                isCoupleUp: true
            })),
            isCoupleUp: true
        };
        
        parsedSteps.push(coupleUpStep);
    }
    
    parseChoiceOption(optionLine) {
        // Parse format: "text → id:value [quality:good|bad] [cost:n]"
        const arrowIndex = optionLine.indexOf('→');
        if (arrowIndex === -1) return null;
        
        const text = optionLine.substring(0, arrowIndex).trim();
        const metadata = optionLine.substring(arrowIndex + 1).trim();
        
        // Parse id
        const idMatch = metadata.match(/id:(\w+)/);
        if (!idMatch) return null;
        
        const option = {
            id: idMatch[1],
            text: text,
            next: idMatch[1],
            quality: 'bad',
            loveCost: 0
        };
        
        // Parse quality
        const qualityMatch = metadata.match(/\[quality:(good|bad)\]/);
        if (qualityMatch) {
            option.quality = qualityMatch[1];
        }
        
        // Parse cost
        const costMatch = metadata.match(/\[cost:(\d+)\]/);
        if (costMatch) {
            option.loveCost = parseInt(costMatch[1], 10);
        }
        
        // Assign quality based on text patterns (fallback detection)
        if (!qualityMatch) {
            // If it's the first option and has specific names, it might be good
            if (text.toLowerCase().includes('nic')) {
                option.quality = 'good';
                option.loveCost = 5; // Default cost for good options
            }
        }
        
        return option;
    }
    
    renderCurrentStep() {
        // Ensure player avatar HUD is visible
        this.ensurePlayerAvatarHUD();
        
        if (this.currentIndex >= this.steps.length) {
            this.renderComplete();
            return;
        }
        
        const step = this.steps[this.currentIndex];
        
        // Handle day_transition step type
        if (step && step.type === 'day_transition') {
            this.renderDayTransition(step);
            return;
        }
        
        // Handle day_card step type (interstitial cards)
        if (step && step.type === 'day_card') {
            this.renderDayCard(step);
            return;
        }
        
        // Handle scene_end step type
        if (step && step.type === 'scene_end') {
            this.handleSceneEnd(step);
            return;
        }
        
        // Handle background_transition step type
        if (step && step.type === 'background_transition') {
            this.handleBackgroundTransition(step);
            return;
        }
        
        // Handle scene_trigger step type
        if (step && step.type === 'scene_trigger') {
            this.handleSceneTrigger(step);
            return;
        }
        
        // Handle navigate step type
        if (step && step.type === 'navigate') {
            this.handleNavigate(step);
            return;
        }
        
        // Handle scene_complete step type  
        if (step && step.type === 'scene_complete') {
            // Scene is complete - could return to previous or show complete
            if (this.returnState) {
                // Restore previous state if this was an inserted scene
                this.steps = this.returnState.steps;
                this.currentIndex = this.returnState.currentIndex;
                this.currentBackground = this.returnState.currentBackground;
                this.returnState = null;
                this.updateBackground();
                this.renderCurrentStep();
            } else {
                // Otherwise show complete
                this.renderComplete();
            }
            return;
        }
        
        // Handle end_day step type (for explicit markers)
        if (step && step.type === 'end_day') {
            const nextDay = step.dayNumber + 1;
            if (this.DAYS[nextDay]) {
                this.renderDayTransition({
                    type: 'day_transition',
                    currentDay: step.dayNumber,
                    nextDay: nextDay
                });
            } else {
                this.renderComplete();
            }
            return;
        }
        
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Update background for the scene (applies to nextView parent)
        if (this.currentDay === 2 && this.currentBackground) {
            this.updateBackground();
        } else if (this.currentDay === 1) {
            // Reset to villa background for Day 1
            const nextView = document.getElementById('nextView');
            if (nextView) {
                nextView.style.backgroundImage = "url('/public/assets/backgrounds/villa_day.png')";
                nextView.style.backgroundSize = 'cover';
                nextView.style.backgroundPosition = 'center';
                nextView.style.backgroundRepeat = 'no-repeat';
            }
        }
        
        if (step.type === 'ask') {
            this.renderAskStep(step, container);
        } else {
            this.renderSayStep(step, container);
        }
        
        // Add reset button instead of progress indicator
        this.addResetButton(container);
    }
    
    addResetButton(container) {
        // Don't add reset button if it already exists
        if (document.getElementById('episodeResetBtn')) return;
        
        // Create reset button
        const resetBtn = document.createElement('button');
        resetBtn.id = 'episodeResetBtn';
        resetBtn.className = 'episode-reset-btn';
        resetBtn.innerHTML = '🔄 Reset';
        resetBtn.setAttribute('role', 'button');
        resetBtn.setAttribute('aria-label', 'Reset Game');
        
        // Add click handler
        resetBtn.onclick = () => {
            console.log('RESET button clicked → Landing');
            if (window.resetGame) {
                window.resetGame();
            }
        };
        
        // Add to container
        container.appendChild(resetBtn);
    }
    
    addLoveChipToContainer(container) {
        // Don't add if it already exists
        if (document.getElementById('askLoveChip')) return;
        
        // Create love chip
        const loveChip = document.createElement('div');
        loveChip.id = 'askLoveChip';
        loveChip.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #e91e63;
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 16px;
            font-weight: bold;
            color: #e91e63;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
        `;
        loveChip.innerHTML = `💖 Love: ${this.love}`;
        
        // Add to container
        container.appendChild(loveChip);
    }
    
    renderSayStep(step, container) {
        // Log the step for Day 2 diagnostics
        if (this.currentDay === 2) {
            console.log('STEP', { speakerId: step.speakerId, text: step.text });
        }
        
        // Create dialog view
        const dialogView = document.createElement('div');
        dialogView.className = 'episode-dialog-view';
        
        // Create avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'episode-avatar';
        
        const avatarCircle = document.createElement('div');
        avatarCircle.className = 'episode-avatar-circle';
        
        const avatarImg = document.createElement('img');
        avatarImg.className = 'episode-avatar-img';
        
        // Set avatar based on speaker
        const avatarPath = this.getAvatarPath(step.speakerId);
        avatarImg.src = avatarPath;
        avatarImg.alt = step.speakerId;
        

        
        // Log speaker and avatar info
        console.log('STEP SPEAKER', { 
            speakerId: step.speakerId, 
            avatar: avatarPath,
            name: this.getSpeakerName(step.speakerId)
        });
        avatarImg.onerror = () => {
            // Fallback to initials if image fails
            avatarCircle.innerHTML = `<div class="episode-avatar-fallback">${this.getInitials(step.speakerId)}</div>`;
        };
        
        avatarCircle.appendChild(avatarImg);
        avatarDiv.appendChild(avatarCircle);
        
        // Create speech bubble
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'episode-bubble';
        
        const bubbleTail = document.createElement('div');
        bubbleTail.className = 'episode-bubble-tail';
        
        const bubbleContent = document.createElement('div');
        if (step.speakerId === 'narration') {
            bubbleContent.className = 'episode-bubble-content narration';
        } else if (step.isInnerThought) {
            bubbleContent.className = 'episode-bubble-content inner-thought';
            // Add tinted background style for inner thoughts
            bubbleContent.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,248,255,0.95))';
            bubbleContent.style.fontStyle = 'italic';
        } else {
            bubbleContent.className = 'episode-bubble-content';
        }
        
        const speakerName = document.createElement('div');
        speakerName.className = 'episode-speaker-name';
        speakerName.textContent = this.getSpeakerName(step.speakerId);
        
        const speakerText = document.createElement('div');
        speakerText.className = 'episode-speaker-text';
        speakerText.textContent = step.text;
        
        bubbleContent.appendChild(speakerName);
        bubbleContent.appendChild(speakerText);
        bubbleDiv.appendChild(bubbleTail);
        bubbleDiv.appendChild(bubbleContent);
        
        // Add to dialog view
        dialogView.appendChild(avatarDiv);
        dialogView.appendChild(bubbleDiv);
        
        container.appendChild(dialogView);
        
        // Animation
        requestAnimationFrame(() => {
            dialogView.classList.add('animate-in');
        });
        
        // Set flag that we're not in a choice
        this.isInChoice = false;
    }
    
    renderAskStep(step, container) {
        
        // Check if this is the main couple-up step (8 boys)
        if (step.isCoupleUp) {
            console.log('COUPLE UP: rendering selection');
            this.renderCoupleUpStep(step, container);
            return;
        }
        
        // Check if this is the couple-up screen by looking for specific options (old math version)
        const hasNic = step.options.some(opt => opt.text.toLowerCase().includes('nic'));
        const hasRob = step.options.some(opt => opt.text.toLowerCase().includes('rob'));
        const hasMiguel = step.options.some(opt => opt.text.toLowerCase().includes('miguel'));
        const isCoupleUp = hasNic && hasRob && hasMiguel;
        
        if (isCoupleUp) {
            console.log('COUPLE-UP ASK loaded');
            // Override the prompt for couple-up screen
            step.prompt = "Based on their intros, which boy do you want to couple up with?";
            
            // Set specific costs for couple-up options
            step.options.forEach(option => {
                if (option.text.toLowerCase().includes('nic')) {
                    option.loveCost = 5;
                    option.quality = 'good';
                } else if (option.text.toLowerCase().includes('rob')) {
                    option.loveCost = 5;  // Updated to 5
                    option.quality = 'good';
                } else if (option.text.toLowerCase().includes('miguel')) {
                    option.loveCost = 5;  // Updated to 5
                    option.quality = 'good';
                } else if (option.text.toLowerCase().includes('stay') || option.text.toLowerCase().includes('observe')) {
                    option.loveCost = 0;
                    option.quality = 'bad';
                }
                console.log(`Option: ${option.text}, Cost: ${option.loveCost}`);
            });
        } else if (step.isBryanChoice) {
            console.log('BRYAN CHOICE', { id: step.id, options: step.options });
        } else if (step.isDay2KitchenChoice) {
            console.log('D2 Kitchen ASK shown');
        } else if (step.isNicPoolChoice) {
            console.log('NIC POOL CHOICE shown');
        } else {
            console.log('ASK', { id: step.id, options: step.options });
        }
        
        // Count locked good options for diagnostics
        const lockedGoodOptions = step.options ? step.options.filter(opt => 
            opt.quality === 'good' && opt.loveCost > 0
        ).length : 0;
        console.log('ASK RENDER', { lockedGoodOptions, love: this.love });
        
        // Set flag that we're in a choice
        this.isInChoice = true;
        
        // Add Love meter chip at top center
        this.addLoveChipToContainer(container);
        
        // Create dialog view for the prompt
        const dialogView = document.createElement('div');
        dialogView.className = 'episode-dialog-view';
        
        // Create avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'episode-avatar';
        
        const avatarCircle = document.createElement('div');
        avatarCircle.className = 'episode-avatar-circle';
        
        const avatarImg = document.createElement('img');
        avatarImg.className = 'episode-avatar-img';
        
        // Set avatar based on speaker
        const avatarPath = this.getAvatarPath(step.speakerId);
        avatarImg.src = avatarPath;
        avatarImg.alt = step.speakerId;
        

        
        // Log speaker and avatar info for AskStep
        console.log('STEP SPEAKER (Ask)', { 
            speakerId: step.speakerId, 
            avatar: avatarPath,
            name: this.getSpeakerName(step.speakerId),
            playerAvatar: this.playerAvatar
        });
        
        avatarImg.onerror = () => {
            console.log('Avatar failed to load for', step.speakerId, 'at path', avatarPath);
            const initials = this.getInitials(step.speakerId);
            avatarCircle.innerHTML = `<div class="episode-avatar-fallback">${initials}</div>`;
        };
        
        avatarCircle.appendChild(avatarImg);
        avatarDiv.appendChild(avatarCircle);
        
        // Create speech bubble with prompt
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'episode-bubble';
        
        const bubbleTail = document.createElement('div');
        bubbleTail.className = 'episode-bubble-tail';
        
        const bubbleContent = document.createElement('div');
        bubbleContent.className = step.speakerId === 'narration' ? 'episode-bubble-content narration' : 'episode-bubble-content';
        
        const speakerName = document.createElement('div');
        speakerName.className = 'episode-speaker-name';
        speakerName.textContent = this.getSpeakerName(step.speakerId);
        
        const speakerText = document.createElement('div');
        speakerText.className = 'episode-speaker-text';
        speakerText.textContent = step.prompt;
        
        bubbleContent.appendChild(speakerName);
        bubbleContent.appendChild(speakerText);
        bubbleDiv.appendChild(bubbleTail);
        bubbleDiv.appendChild(bubbleContent);
        
        // Add to dialog view
        dialogView.appendChild(avatarDiv);
        dialogView.appendChild(bubbleDiv);
        
        container.appendChild(dialogView);
        
        // Create choice buttons container
        const choicesDiv = document.createElement('div');
        choicesDiv.className = 'episode-choices';
        
        // Render each option as a button
        step.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'episode-choice-btn';
            
            // STANDARDIZED GOOD OPTION HANDLING
            // Good options with love costs check if player has enough love
            if (option.quality === 'good' && option.loveCost > 0) {
                const hasEnoughLove = this.love >= option.loveCost;
                
                if (hasEnoughLove) {
                    // Player has enough love - make it unlockable with visual indicator
                    button.classList.add('unlockable');
                    button.disabled = false;
                    button.innerHTML = `✨ ${option.text} <span class="love-cost-badge" style="color: #e91e63; font-size: 0.9em;">(Spend ${option.loveCost} 💖)</span>`;
                    
                    button.onclick = () => {
                        console.log('LOVE OPTION SELECTED', { cost: option.loveCost, remaining: this.love - option.loveCost });
                        
                        // Deduct love immediately
                        this.love -= option.loveCost;
                        this.saveLovePoints();
                        this.updateLoveHUD();
                        
                        // Remove love chip when spending
                        const loveChip = document.getElementById('askLoveChip');
                        if (loveChip) {
                            loveChip.innerHTML = `💖 Love: ${this.love}`;
                        }
                        
                        // Execute the choice based on context
                        if (step.isDay2KitchenChoice) {
                            // For Day2 Kitchen kiss, play the cutscene first if it exists
                            if (option.cutscene) {
                                console.log('D2 KITCHEN CUTSCENE START — Love spent', { love: this.love });
                                
                                // Temporarily set romance change to 0 (cutscene will handle it)
                                const originalRomanceChange = option.romanceChange;
                                option.romanceChange = 0;
                                
                                this.playCutscene(option.cutscene, () => {
                                    console.log('D2 KITCHEN CUTSCENE END');
                                    // Restore original romance change
                                    option.romanceChange = originalRomanceChange;
                                    // Execute remaining choice logic
                                    this.selectDay2KitchenChoice(option);
                                });
                            } else {
                                this.selectDay2KitchenChoice(option);
                            }
                        } else if (step.isNicPoolChoice) {
                            // For Nic pool kiss, play the cutscene first
                            if (option.cutscene) {
                                // Temporarily set romance change to 0 (cutscene will handle it)
                                const originalRomanceChange = option.romanceChange;
                                option.romanceChange = 0;
                                
                                // Play the combined Nic kiss + Bryan interruption scene
                                console.log('NIC POOL CUTSCENE START — Love spent', { love: this.love });
                                this.playCutscene(option.cutscene, () => {
                                    console.log('Bryan interrupt end');
                                    
                                    // Show interstitial card
                                    const container = document.getElementById('episodeContainer');
                                    container.innerHTML = '';
                                    container.style.cssText = `
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        height: 100vh;
                                        background: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9));
                                    `;
                                    
                                    const interstitial = document.createElement('div');
                                    interstitial.style.cssText = `
                                        text-align: center;
                                        color: white;
                                        font-size: 24px;
                                        padding: 40px;
                                        animation: fadeInUp 1s ease;
                                    `;
                                    interstitial.innerHTML = '🌙 The night in the villa just got complicated…';
                                    container.appendChild(interstitial);
                                    
                                    // Continue to main flow after 2 seconds
                                    setTimeout(async () => {
                                        container.style = '';
                                        // Change background to night after the interstitial
                                        this.currentBackground = '/public/assets/backgrounds/villa_night.png';
                                        this.updateBackground();
                                        console.log('BACKGROUND CHANGE → villa_night.png');
                                        
                                        // Switch to dressed-up outfit for night scene
                                        await this.switchToDressedUpAvatar();
                                        
                                        // Load the recoupling ceremony
                                        await this.loadRecouplingCeremony();
                                    }, 2000);
                                });
                            } else {
                                this.selectNicPoolChoice(option);
                            }
                        } else {
                            this.selectChoice(option);
                        }
                    };
                } else {
                    // Not enough love - require math to unlock
                    button.classList.add('locked');
                    button.disabled = false; // Keep clickable to open math
                    
                    const needMore = option.loveCost - this.love;
                    button.innerHTML = `🔒 ${option.text} <span style="color: #999; font-size: 0.9em;">(Need ${needMore} more 💖 — Solve math)</span>`;
                    
                    button.onclick = () => {
                        console.log('MATH OPEN', { source: 'lock', needLove: needMore });
                        
                        // Store context for after math success
                        this.mathSpecialContext = 'goodOption';
                        this.mathContextOption = option;
                        this.mathContextStep = step;
                        
                        // Open math modal with 5 questions
                        this.openMathModal(false, false, 'goodOption', option);
                    };
                }
            }
            // Special handling for old Day2/NicPool math options (backward compatibility)
            else if ((step.isDay2KitchenChoice || step.isNicPoolChoice) && option.requiresMath) {
                // Check if this option has a loveCost and the player has enough
                const hasEnoughLove = option.loveCost && this.love >= option.loveCost;
                
                if (hasEnoughLove) {
                    // Player has enough love - make it directly clickable
                    button.classList.add('unlockable');
                    button.disabled = false;
                    button.innerHTML = `✨ ${option.text} <span class="love-cost-badge" style="color: #e91e63; font-size: 0.9em;">(Spend ${option.loveCost} 💖)</span>`;
                    
                    button.onclick = () => {
                        console.log('LOVE OPTION SELECTED (legacy)', { cost: option.loveCost, remaining: this.love - option.loveCost });
                        
                        // Deduct love immediately
                        this.love -= option.loveCost;
                        this.saveLovePoints();
                        this.updateLoveHUD();
                        
                        // Update love chip
                        const loveChip = document.getElementById('askLoveChip');
                        if (loveChip) {
                            loveChip.innerHTML = `💖 Love: ${this.love}`;
                        }
                        
                        // Execute the choice based on context
                        if (step.isDay2KitchenChoice) {
                            // For Day2 Kitchen kiss, play the cutscene first if it exists
                            if (option.cutscene) {
                                console.log('D2 KITCHEN CUTSCENE START — Love spent', { love: this.love });
                                
                                // Temporarily set romance change to 0 (cutscene will handle it)
                                const originalRomanceChange = option.romanceChange;
                                option.romanceChange = 0;
                                
                                this.playCutscene(option.cutscene, () => {
                                    console.log('D2 KITCHEN CUTSCENE END');
                                    // Restore original romance change
                                    option.romanceChange = originalRomanceChange;
                                    // Execute remaining choice logic
                                    this.selectDay2KitchenChoice(option);
                                });
                            } else {
                                this.selectDay2KitchenChoice(option);
                            }
                        } else if (step.isNicPoolChoice) {
                            // For Nic pool kiss, play the cutscene first
                            if (option.cutscene) {
                                // Temporarily set romance change to 0 (cutscene will handle it)
                                const originalRomanceChange = option.romanceChange;
                                option.romanceChange = 0;
                                
                                // Play the combined Nic kiss + Bryan interruption scene
                                console.log('NIC POOL CUTSCENE START — Love spent', { love: this.love });
                                this.playCutscene(option.cutscene, () => {
                                    console.log('Bryan interrupt end');
                                    
                                    // Show interstitial card
                                    const container = document.getElementById('episodeContainer');
                                    container.innerHTML = '';
                                    container.style.cssText = `
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        height: 100vh;
                                        background: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9));
                                    `;
                                    
                                    const interstitial = document.createElement('div');
                                    interstitial.style.cssText = `
                                        text-align: center;
                                        color: white;
                                        font-size: 24px;
                                        padding: 40px;
                                        animation: fadeInUp 1s ease;
                                    `;
                                    interstitial.innerHTML = '🌙 The night in the villa just got complicated…';
                                    container.appendChild(interstitial);
                                    
                                    // Continue to main flow after 2 seconds
                                    setTimeout(async () => {
                                        container.style = '';
                                        // Change background to night after the interstitial
                                        this.currentBackground = '/public/assets/backgrounds/villa_night.png';
                                        this.updateBackground();
                                        console.log('BACKGROUND CHANGE → villa_night.png');
                                        
                                        // Switch to dressed-up outfit for night scene
                                        await this.switchToDressedUpAvatar();
                                        
                                        // Load the recoupling ceremony
                                        await this.loadRecouplingCeremony();
                                    }, 2000);
                                });
                            } else {
                                this.selectNicPoolChoice(option);
                            }
                        }
                    };
                } else {
                    // Not enough love - require math
                    button.classList.add('locked');
                    button.disabled = false;
                    
                    const needMore = option.loveCost ? option.loveCost - this.love : 0;
                    const lockText = option.loveCost 
                        ? `(Need ${needMore} more 💖 — Solve math)`
                        : (option.mathLockText || '(Solve fast math to unlock)');
                    
                    button.innerHTML = `🔒 ${option.text} <span style="color: #999; font-size: 0.9em;">${lockText}</span>`;
                    
                    button.onclick = () => {
                        if (step.isDay2KitchenChoice) {
                            console.log('D2 Kitchen FAST MATH open');
                            this.openMathModal(false, false, 'day2Kitchen', option);
                        } else if (step.isNicPoolChoice) {
                            console.log('NIC POOL MATH open');
                            this.openMathModal(false, false, 'nicPool', option);
                        }
                    };
                }
            }
            // Free/bad options
            else {
                button.textContent = option.text;
                button.onclick = () => {
                    // Check for special behaviors
                    if (step.isDay2KitchenChoice) {
                        this.selectDay2KitchenChoice(option);

                    } else if (step.isNicPoolChoice) {
                        this.selectNicPoolChoice(option);
                    } else {
                        this.selectChoice(option);
                    }
                };
            }
            
            choicesDiv.appendChild(button);
        });
        
        container.appendChild(choicesDiv);
        
        // Add "Earn Love (Math)" button if there are locked good options
        if (lockedGoodOptions > 0) {
            const earnLoveBtn = document.createElement('button');
            earnLoveBtn.className = 'episode-earn-love-btn';
            earnLoveBtn.innerHTML = '💖 Earn Love (Math)';
            earnLoveBtn.style.marginTop = '10px';
            earnLoveBtn.onclick = () => {
                console.log('MATH OPEN', { source: 'earn' });
                // Open infinite math mode to earn love
                this.openMathModal(false, false);
            };
            container.appendChild(earnLoveBtn);
        }
        
        // Animation
        requestAnimationFrame(() => {
            dialogView.classList.add('animate-in');
            choicesDiv.classList.add('animate-in');
        });
    }
    
    selectNicPoolChoice(option) {
        console.log('NIC POOL RESULT', { 
            choice: option.id, 
            romanceNic: (this.romance?.nic || 0) + (option.romanceChange || 0),
            drama: this.drama + (option.dramaChange || 0)
        });
        
        // If this is the kiss option with a cutscene, the cutscene already handled everything
        // Just complete the scene without adding extra steps
        if (option.id === 'kiss_nic' && option.cutscene) {
            console.log('Kiss cutscene already played - completing scene');
            // The cutscene and Bryan jealousy already handled everything
            // Just mark scene as complete
            this.handleSceneComplete({ id: 'nic_pool_scene_complete' });
            return;
        }
        
        // Log if Bryan jealousy will be skipped (non-kiss option selected)
        if (option.id !== 'kiss_nic') {
            console.log('Bryan jealousy skipped (no Nic kiss)');
        }
        
        // Initialize romance object if needed
        if (!this.romance) this.romance = {};
        if (!this.romance.nic) this.romance.nic = 0;
        
        // Apply romance changes
        if (option.romanceChange) {
            this.romance.nic += option.romanceChange;
            localStorage.setItem('story.romance', JSON.stringify(this.romance));
        }
        
        // Apply drama changes
        if (option.dramaChange) {
            this.drama = (this.drama || 0) + option.dramaChange;
            this.saveDramaPoints();
            this.updateDramaHUD();
        }
        
        // Set flag
        if (option.flagToSet) {
            this.setFlag(option.flagToSet);
        }
        
        // Create reaction steps
        const reactionSteps = [];
        
        // Add specific narration based on choice
        if (option.id === 'tease_nic') {
            reactionSteps.push({
                type: 'say',
                id: 'nic_tease_narration',
                speakerId: 'narration',
                text: "You laugh and brush him off playfully."
            });
        } else if (option.id === 'walk_away') {
            reactionSteps.push({
                type: 'say',
                id: 'nic_walk_narration',
                speakerId: 'narration',
                text: "You stand and leave him hanging."
            });
        }
        
        // Add Nic's response (but skip if the kiss cutscene played)
        const kissCutscenePlayed = option.id === 'kiss_nic' && option.cutscene;
        if (option.response && !kissCutscenePlayed) {
            const responseId = option.id === 'walk_away' ? 'nic_mutters' : 'nic_response';
            reactionSteps.push({
                type: 'say',
                id: responseId,
                speakerId: 'nic',
                text: option.id === 'walk_away' ? `(mutters) ${option.response}` : option.response
            });
        }
        
        // Add scene ending interstitial (but skip if kiss cutscene will play)
        if (!kissCutscenePlayed) {
            reactionSteps.push({
                type: 'day_card',
                id: 'nic_pool_end_card',
                text: '🌙 The night continues…'
            });
        }
        
        // Add a completion step to end the scene properly
        reactionSteps.push({
            type: 'scene_complete',
            id: 'nic_pool_scene_complete'
        });
        
        // Insert reaction steps
        this.steps.splice(this.currentIndex + 1, 0, ...reactionSteps);
        
        // Advance to show reactions
        this.currentIndex++;
        this.isInChoice = false;
        this.saveProgress();
        this.renderCurrentStep();
    }
    
    selectDay2KitchenChoice(option) {
        console.log('D2 Kitchen choice selected:', option.id);
        
        // Log if cutscene was skipped (free option selected)
        if (option.quality !== 'good' && this.mathContextOption && this.mathContextOption.cutscene) {
            console.log('CUTSCENE SKIPPED', 'free option selected');
        }
        
        // Initialize romance object if needed
        if (!this.romance) this.romance = {};
        
        // Handle each branch with specific reactions
        const reactionSteps = [];
        let dramaChange = 0;
        let romanceChanges = {};
        
        switch(option.id) {
            case 'back_jana':
                // Back Jana publicly
                dramaChange = 1;
                romanceChanges.jana = 1;
                
                reactionSteps.push({
                    type: 'say',
                    id: 'd2_jana_smirk',
                    speakerId: 'jana',
                    text: "Thanks, babe. At least someone's got my back."
                });
                reactionSteps.push({
                    type: 'say',
                    id: 'd2_kenny_mutter',
                    speakerId: 'kenny',
                    text: "Don't get used to it."
                });
                break;
                
            case 'stay_quiet':
                // Stay quiet
                dramaChange = 1;
                
                reactionSteps.push({
                    type: 'say',
                    id: 'd2_bryan_sideeye',
                    speakerId: 'bryan',
                    text: "Playing it safe, huh?"
                });
                reactionSteps.push({
                    type: 'say',
                    id: 'd2_amaya_smirk',
                    speakerId: 'amaya',
                    text: "(She smirks knowingly)"
                });
                break;
                
            case 'kiss_bryan':
                // Kiss Bryan (after math pass)
                dramaChange = 2;
                romanceChanges.bryan = 3;
                
                reactionSteps.push({
                    type: 'say',
                    id: 'd2_bryan_beam',
                    speakerId: 'narration',
                    text: "Bryan beams and pulls you close."
                });
                reactionSteps.push({
                    type: 'say',
                    id: 'd2_amaya_shock',
                    speakerId: 'amaya',
                    text: "Seriously? In front of me?"
                });
                reactionSteps.push({
                    type: 'say',
                    id: 'd2_islanders_gasp',
                    speakerId: 'narration',
                    text: "The other islanders gasp and laugh."
                });
                
                // Set flag
                this.setFlag('flags.day2.kitchen.kissBryan');
                break;
                
            case 'slap_huda':
                // Slap Huda - immediate blackout
                dramaChange = 4;
                
                reactionSteps.push({
                    type: 'say',
                    id: 'd2_huda_shriek',
                    speakerId: 'huda',
                    text: "Did you just—?!"
                });
                reactionSteps.push({
                    type: 'say',
                    id: 'd2_islanders_shock',
                    speakerId: 'narration',
                    text: "The islanders shout in shock."
                });
                
                // Set flag and trigger blackout
                this.setFlag('flags.day2.kitchen.hudaSlap');
                localStorage.setItem('story.progress.lastScene', 'day2_blackout');
                
                // Add reactions then trigger blackout
                this.steps.splice(this.currentIndex + 1, 0, ...reactionSteps);
                
                // Advance and then trigger blackout
                this.currentIndex++;
                this.isInChoice = false;
                this.saveProgress();
                this.renderCurrentStep();
                
                // Trigger blackout after a short delay
                setTimeout(() => {
                    this.showBlackoutWithWarning();
                    console.log('D2 Kitchen Blackout triggered');
                }, 1500);
                
                console.log('D2 Kitchen Outcome', { 
                    branch: option.id, 
                    drama: this.drama + dramaChange, 
                    romance: this.romance 
                });
                return;
        }
        
        // Apply drama changes
        this.drama = (this.drama || 0) + dramaChange;
        this.saveDramaPoints();
        this.updateDramaHUD();
        
        // Apply romance changes
        for (const [character, change] of Object.entries(romanceChanges)) {
            if (!this.romance[character]) this.romance[character] = 0;
            this.romance[character] += change;
        }
        localStorage.setItem('story.romance', JSON.stringify(this.romance));
        
        // Add continuation for non-blackout branches
        if (option.id !== 'slap_huda') {
            reactionSteps.push({
                type: 'say',
                id: 'd2_bryan_calm',
                speakerId: 'bryan',
                text: "Alright, chill everyone. It's too early for this."
            });
            reactionSteps.push({
                type: 'say',
                id: 'd2_grumble',
                speakerId: 'narration',
                text: "The islanders grumble and slowly disperse."
            });
            
            // Add transition to pool scene
            reactionSteps.push({
                type: 'say',
                id: 'd2_elle_thought',
                speakerId: 'you',
                text: "(Wow, that was a lot of drama at breakfast. I think I need a dip in the pool.)",
                isInnerThought: true
            });
            
            // Add background transition step
            reactionSteps.push({
                type: 'background_transition',
                id: 'd2_bg_transition',
                from: '/public/assets/backgrounds/kitchen.png',
                to: '/public/assets/backgrounds/villa_day.png'
            });
            
            // Add Nic's thought (using player's name)
            const playerName = this.playerAvatar?.name || localStorage.getItem('player.avatar.name') || 'She';
            reactionSteps.push({
                type: 'say',
                id: 'd2_nic_thought',
                speakerId: 'nic',
                text: `(Damn… ${playerName} looks good out there. I'm going to go talk to her.)`,
                isInnerThought: true
            });
            
            // Add trigger for Nic pool scene
            reactionSteps.push({
                type: 'scene_trigger',
                id: 'd2_trigger_pool',
                scene: 'nicPool'
            });
            
            localStorage.setItem('story.progress.lastScene', 'day2_morning_done');
        }
        
        // Insert all reaction steps
        this.steps.splice(this.currentIndex + 1, 0, ...reactionSteps);
        
        // Log outcome
        console.log('D2 Kitchen Outcome', { 
            branch: option.id, 
            drama: this.drama, 
            romance: this.romance 
        });
        
        // Advance normally
        this.currentIndex++;
        this.isInChoice = false;
        this.saveProgress();
        this.renderCurrentStep();
        
        // Log scene exit
        setTimeout(() => {
            const lastScene = localStorage.getItem('story.progress.lastScene');
            console.log('D2 Morning End', { lastScene });
        }, 100);
    }
    
    setFlag(flagPath) {
        const flagParts = flagPath.split('.');
        let flagObj = {};
        try {
            const existingFlags = localStorage.getItem('story.flags');
            if (existingFlags) flagObj = JSON.parse(existingFlags);
        } catch(e) {}
        
        // Navigate to the flag location
        let current = flagObj;
        for (let i = 0; i < flagParts.length - 1; i++) {
            if (!current[flagParts[i]]) current[flagParts[i]] = {};
            current = current[flagParts[i]];
        }
        current[flagParts[flagParts.length - 1]] = true;
        
        localStorage.setItem('story.flags', JSON.stringify(flagObj));
    }
    
    selectDay3BedroomChoice(option) {
        console.log('D3 Amaya → PICK', { option: option.id });
        
        // Initialize romance object if needed
        if (!this.romance) this.romance = {};
        
        // Clear the choice flag immediately
        this.isInChoice = false;
        
        // Create the resolution steps for this branch
        const resolutionSteps = [];
        
        // Handle each branch
        switch(option.id) {
            case 'comfort_amaya':
                // Apply effects
                this.drama = Math.max(0, (this.drama || 0) - 1);
                if (!this.romance.amaya) this.romance.amaya = 0;
                this.romance.amaya += 1;
                this.setFlag('flags.day3.comfortAmaya');
                
                // Add resolution lines
                resolutionSteps.push({
                    type: 'say',
                    id: 'd3_comfort_player',
                    speakerId: 'you',
                    text: "I didn't know you had feelings. I'm sorry."
                });
                resolutionSteps.push({
                    type: 'say',
                    id: 'd3_comfort_amaya',
                    speakerId: 'amaya',
                    text: "Just… give me space, okay?"
                });
                break;
                
            case 'fight_amaya':
                // Apply effects
                this.drama = (this.drama || 0) + 2;
                this.setFlag('flags.day3.amayaBeef');
                
                // Add resolution lines
                resolutionSteps.push({
                    type: 'say',
                    id: 'd3_fight_player',
                    speakerId: 'you',
                    text: "Don't blame me. You never made a move."
                });
                resolutionSteps.push({
                    type: 'say',
                    id: 'd3_fight_amaya',
                    speakerId: 'amaya',
                    text: "Wow. Heartless."
                });
                break;
                
            case 'ignore_amaya':
                // Apply effects
                this.setFlag('flags.day3.ignoreAmaya');
                
                // Add resolution lines
                resolutionSteps.push({
                    type: 'say',
                    id: 'd3_ignore_narration',
                    speakerId: 'narration',
                    text: "You stay silent."
                });
                resolutionSteps.push({
                    type: 'say',
                    id: 'd3_ignore_amaya',
                    speakerId: 'amaya',
                    text: "Fine. Stay out of my way."
                });
                break;
        }
        
        // Add common closer
        resolutionSteps.push({
            type: 'say',
            id: 'd3_time_to_get_ready',
            speakerId: 'narration',
            text: "You take a breath. Time to get ready."
        });
        
        // Add navigation step
        resolutionSteps.push({
            type: 'navigate',
            id: 'd3_navigate_outfit',
            target: 'ChooseOutfitView'
        });
        
        // Save all state changes
        this.saveDramaPoints();
        this.saveRomance();
        this.updateDramaHUD();
        
        console.log('D3 Amaya → RESOLVED', { 
            option: option.id, 
            drama: this.drama || 0, 
            romanceAmaya: this.romance.amaya || 0
        });
        
        // Replace current steps with resolution steps
        this.steps = resolutionSteps;
        this.currentIndex = 0;
        
        // Save progress
        this.saveProgress();
        
        // Clear container and start rendering
        const container = document.getElementById('episodeContainer');
        if (container) {
            container.innerHTML = '';
        }
        
        // Render the first step
        this.renderCurrentStep();
    }
    
    handleNavigate(step) {
        console.log('NAVIGATE STEP:', step);
        // Handle navigation to different views
        switch(step.target) {
            case 'ChooseOutfitView':
                console.log('Navigating to ChooseOutfitView...');
                this.showChooseOutfitView();
                // Don't advance - we're switching views
                break;
            default:
                console.warn('Unknown navigation target:', step.target);
                // Continue to next step if navigation target unknown
                this.currentIndex++;
                this.renderCurrentStep();
                break;
        }
    }
    
    showChooseOutfitView() {
        console.log('NAV → ChooseOutfitView');
        console.log('ChooseOutfitView loaded');
        
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Set bedroom background on the parent nextView
        const nextView = document.getElementById('nextView');
        if (nextView) {
            nextView.style.backgroundImage = "url('/public/assets/backgrounds/Bedroom.png')";
            nextView.style.backgroundSize = 'cover';
            nextView.style.backgroundPosition = 'center';
            nextView.style.backgroundRepeat = 'no-repeat';
        }
        
        // Create outfit view container
        const outfitView = document.createElement('div');
        outfitView.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            height: 100vh;
            padding: 40px 20px;
            box-sizing: border-box;
        `;
        
        // Title at top
        const title = document.createElement('h1');
        title.style.cssText = `
            color: white;
            font-size: 36px;
            text-align: center;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            font-weight: bold;
        `;
        title.textContent = 'Day 3 Begins';
        
        // Subtitle
        const subtitle = document.createElement('h2');
        subtitle.style.cssText = `
            color: white;
            font-size: 24px;
            text-align: center;
            margin: 10px 0 20px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            font-weight: normal;
            opacity: 0.9;
        `;
        subtitle.textContent = 'Choose Your Outfit for the Day';
        
        // Center section with outfit choices
        const outfitChoicesSection = document.createElement('div');
        outfitChoicesSection.style.cssText = `
            display: flex;
            gap: 40px;
            align-items: center;
            justify-content: center;
            flex: 1;
            padding: 20px;
            margin: 20px 0;
        `;
        
        // Selected outfit state
        let selectedOutfit = null;
        let selectedOutfitPath = null;
        
        // Create 3 outfit choice circles
        const outfitOptions = [
            { path: '/public/assets/bombshells/outfitchoice.png', name: 'Outfit 1' },
            { path: '/public/assets/bombshells/outfitchoice1.png', name: 'Outfit 2' },
            { path: '/public/assets/bombshells/outfitchoice3.png', name: 'Outfit 3' }
        ];
        
        const outfitCircles = [];
        
        outfitOptions.forEach((outfit, index) => {
            const outfitContainer = document.createElement('div');
            outfitContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            `;
            
            const outfitCircle = document.createElement('div');
            outfitCircle.style.cssText = `
                width: 280px;
                height: 280px;
                border-radius: 50%;
                border: 3px solid rgba(255, 255, 255, 0.7);
                overflow: hidden;
                background: white;
                box-shadow: 0 5px 20px rgba(0,0,0,0.4);
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            `;
            
            const outfitImg = document.createElement('img');
            outfitImg.src = outfit.path;
            outfitImg.style.cssText = `
                width: 130%;
                height: 130%;
                object-fit: cover;
                object-position: center -20px;
                transform: translateX(-11.5%);
            `;
            
            // Add error handling for images
            outfitImg.onerror = () => {
                console.error('Failed to load outfit image:', outfit.path);
                // Hide failed image
                outfitImg.style.display = 'none';
                // Add a fallback with outfit name
                const fallbackContent = document.createElement('div');
                fallbackContent.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #666;
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                `;
                fallbackContent.textContent = outfit.name;
                outfitCircle.appendChild(fallbackContent);
                outfitCircle.style.background = '#f0f0f0';
            };
            
            outfitImg.onload = () => {
                console.log('Outfit image loaded:', outfit.name);
            };
            
            outfitCircle.appendChild(outfitImg);
            outfitCircles.push(outfitCircle);
            
            // Hover effect
            outfitCircle.onmouseover = () => {
                if (!outfitCircle.classList.contains('selected')) {
                    outfitCircle.style.transform = 'scale(1.08)';
                    outfitCircle.style.border = '3px solid white';
                    outfitCircle.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
                }
            };
            
            outfitCircle.onmouseout = () => {
                if (!outfitCircle.classList.contains('selected')) {
                    outfitCircle.style.transform = 'scale(1)';
                    outfitCircle.style.border = '3px solid rgba(255, 255, 255, 0.7)';
                    outfitCircle.style.boxShadow = '0 5px 20px rgba(0,0,0,0.4)';
                }
            };
            
            // Click to select
            outfitCircle.onclick = () => {
                // Reset all circles
                outfitCircles.forEach(circle => {
                    circle.classList.remove('selected');
                    circle.style.transform = 'scale(1)';
                    circle.style.border = '3px solid rgba(255, 255, 255, 0.7)';
                    circle.style.boxShadow = '0 5px 20px rgba(0,0,0,0.4)';
                });
                
                // Select this circle
                outfitCircle.classList.add('selected');
                outfitCircle.style.transform = 'scale(1.1)';
                outfitCircle.style.border = '5px solid #FFD700';
                outfitCircle.style.boxShadow = '0 10px 35px rgba(255,215,0,0.6)';
                
                selectedOutfit = index;
                selectedOutfitPath = outfit.path;
                
                // Enable the "Wear this" button
                wearButton.disabled = false;
                wearButton.style.cssText = `
                    padding: 15px 40px;
                    font-size: 18px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 30px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: transform 0.2s;
                `;
                
                console.log('Selected outfit:', outfit.name, outfit.path);
            };
            
            const outfitLabel = document.createElement('div');
            outfitLabel.style.cssText = `
                color: white;
                font-size: 16px;
                font-weight: 600;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
                margin-top: 5px;
            `;
            outfitLabel.textContent = outfit.name;
            
            outfitContainer.appendChild(outfitCircle);
            outfitContainer.appendChild(outfitLabel);
            outfitChoicesSection.appendChild(outfitContainer);
        });
        
        // Button section at bottom
        const buttonSection = document.createElement('div');
        buttonSection.style.cssText = `
            display: flex;
            gap: 20px;
            margin-top: 30px;
        `;
        
        // "Wear this" button (starts disabled)
        const wearButton = document.createElement('button');
        wearButton.style.cssText = `
            padding: 15px 40px;
            font-size: 18px;
            background: #999;
            color: white;
            border: none;
            border-radius: 30px;
            cursor: not-allowed;
            opacity: 0.5;
            font-weight: bold;
        `;
        wearButton.textContent = 'Wear this';
        wearButton.disabled = true;
        
        wearButton.onclick = () => {
            if (selectedOutfitPath) {
                console.log('Wearing outfit:', selectedOutfitPath);
                // Store the selected outfit
                localStorage.setItem('day3.selectedOutfit', selectedOutfitPath);
                // Continue with Day 3
                this.continueDay3AfterOutfit();
            }
        };
        
        // "Back" button
        const backButton = document.createElement('button');
        backButton.style.cssText = `
            padding: 15px 40px;
            font-size: 18px;
            background: white;
            color: #333;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
        `;
        backButton.textContent = 'Back';
        backButton.onmouseover = () => backButton.style.transform = 'scale(1.05)';
        backButton.onmouseout = () => backButton.style.transform = 'scale(1)';
        backButton.onclick = () => {
            console.log('Back button clicked - returning to Day 3');
            // Continue with Day 3 after outfit selection
            this.continueDay3AfterOutfit();
        };
        
        buttonSection.appendChild(wearButton);
        buttonSection.appendChild(backButton);
        
        // Assemble the view
        outfitView.appendChild(title);
        outfitView.appendChild(subtitle);
        outfitView.appendChild(outfitChoicesSection);
        outfitView.appendChild(buttonSection);
        
        container.appendChild(outfitView);
    }
    
    continueDay3AfterOutfit() {
        console.log('Continuing Day 3 after outfit selection');
        
        // Mark that we've completed the bedroom scene
        localStorage.setItem('day3.bedroomComplete', 'true');
        
        // Create continuation steps for Day 3
        this.steps = [
            {
                type: 'say',
                id: 'd3_outfit_done',
                speakerId: 'you',
                text: "Perfect! Time to see what drama today brings."
            },
            {
                type: 'day_card',
                id: 'd3_begin_card',
                text: '☀️ Day 3 - Drama Rising',
                duration: 2000
            },
            {
                type: 'say',
                id: 'd3_villa_morning',
                speakerId: 'narration',
                text: "You head downstairs to find the villa already buzzing with activity."
            },
            {
                type: 'say',
                id: 'd3_kitchen_scene',
                speakerId: 'narration',
                text: "The boys are gathered in the kitchen, whispering about something..."
            },
            {
                type: 'say',
                id: 'd3_to_be_continued',
                speakerId: 'narration',
                text: "To be continued..."
            }
        ];
        
        // Reset index
        this.currentIndex = 0;
        
        // Clear container and render
        const container = document.getElementById('episodeContainer');
        if (container) container.innerHTML = '';
        this.renderCurrentStep();
    }
    
    showBlackoutWithWarning() {
        console.log('BLACKOUT: Huda slap branch');
        
        // Create blackout overlay
        const blackout = document.createElement('div');
        blackout.id = 'blackoutView';
        blackout.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.5s ease-in;
        `;
        
        document.body.appendChild(blackout);
        
        // Fade in
        requestAnimationFrame(() => {
            blackout.style.opacity = '1';
        });
        
        // After 1.5 seconds, show villa warning
        setTimeout(() => {
            // Add warning text
            const warning = document.createElement('div');
            warning.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 1.5em;
                text-align: center;
                padding: 20px;
                max-width: 600px;
                opacity: 0;
                transition: opacity 0.8s ease-in;
            `;
            warning.innerHTML = `
                <div style="margin-bottom: 20px; font-size: 1.2em; font-weight: bold;">
                    The villa has rules.
                </div>
                <div style="font-style: italic;">
                    Violence will not be tolerated.
                </div>
            `;
            blackout.appendChild(warning);
            
            requestAnimationFrame(() => {
                warning.style.opacity = '1';
            });
            
            // After 3 seconds, fade out and end Day 2 morning
            setTimeout(() => {
                blackout.style.opacity = '0';
                setTimeout(() => {
                    blackout.remove();
                    // End Day 2 morning here - show complete screen or next scene
                    console.log('Day 2 morning ended after blackout');
                    // Could trigger end of day or next scene here
                }, 500);
            }, 3000);
        }, 1500);
    }
    
    showBlackout() {
        // Legacy function for compatibility
        this.showBlackoutWithWarning();
    }
    
    selectChoice(option) {
        console.log('CHOICE', option.id, option.text, option.next);
        
        // Handle recoupling ceremony choices
        if (option.id === 'choose_bryan' || option.id === 'choose_nic') {
            // Deduct love cost if applicable
            if (option.loveCost > 0 && this.love >= option.loveCost) {
                this.love -= option.loveCost;
                this.saveLovePoints();
                this.updateLoveHUD();
                console.log(`Love spent: ${option.loveCost}, remaining: ${this.love}`);
            }
            
            // Update partner
            const newPartner = option.id === 'choose_bryan' ? 'bryan' : 'nic';
            this.currentPartner = newPartner;
            
            // Save flags
            if (option.flags) {
                Object.entries(option.flags).forEach(([key, value]) => {
                    const flagKey = `flags.${key}`;
                    localStorage.setItem(flagKey, value);
                });
            }
            
            console.log('Recoupling choice', { pick: newPartner, love: this.love, romance: this.romance });
            
            // Play the appropriate cutscene
            if (option.cutscene) {
                this.playCutscene(option.cutscene, () => {
                    // After cutscene, show Day 2 end
                    this.showDay2End();
                });
            }
            return;
        }
        
        // Handle leave villa option
        if (option.id === 'leave_villa') {
            // Set flag
            localStorage.setItem('flags.day2.leftVilla', 'true');
            console.log('Player left villa');
            
            // Show goodbye screen
            this.showGoodbyeScreen();
            return;
        }
        
        // Handle couple up selection
        if (option.isCoupleUp) {
            this.currentPartner = option.id;
            this.romance[option.id] = (this.romance[option.id] || 0) + 2;
            console.log('COUPLED WITH', option.id);
            console.log('COUPLE UP: picked', option.id, 'romance=', this.romance[option.id]);
            
            // Save state
            this.saveCoupleState();
            
            // Update HUD
            this.updatePartnerHUD();
            
            // Show confirmation
            this.showCoupleConfirmation(option.id);
            
            // Check for partner-specific branching
            setTimeout(() => {
                this.isInChoice = false;
                
                // Check if we should show Bryan couple intro cut-scene
                if (option.id === 'bryan') {
                    const bryanCutscenePlayed = localStorage.getItem('flags.cutscenes.bryanCoupleIntro');
                    if (bryanCutscenePlayed !== 'true') {
                        console.log('BRYAN COUPLE CUTSCENE START');
                        this.playCutscene('bryanCoupleIntro', () => {
                            console.log('BRYAN COUPLE CUTSCENE END', { romanceBryan: this.romance.bryan });
                            
                            // After Bryan cutscene, check for post-couple chat
                            const postCoupleChatShown = localStorage.getItem('flags.postCoupleChatShown');
                            if (!postCoupleChatShown) {
                                this.showPostCoupleChat();
                            } else {
                                // Continue with normal branching
                                this.continueAfterCoupleUp();
                            }
                        });
                        return;
                    }
                }
                
                // Check if we should show post-couple chat
                const postCoupleChatShown = localStorage.getItem('flags.postCoupleChatShown');
                if (!postCoupleChatShown) {
                    this.showPostCoupleChat();
                } else {
                    // Continue with normal branching
                    this.continueAfterCoupleUp();
                }
            }, 2000);
            return;
        }
        
        // Handle Bryan-specific choices
        const currentStep = this.steps[this.currentIndex];
        if (currentStep && currentStep.isBryanChoice) {
            // Update Bryan points
            if (option.bryanPointsChange !== undefined) {
                this.updateBryanPoints(option.bryanPointsChange);
                console.log('CHOICE', { option: option.id, bryanPoints: this.bryanPoints });
            }
            
            // Show Bryan's response
            if (option.response) {
                const container = document.getElementById('episodeContainer');
                if (container) {
                    container.innerHTML = '';
                    
                    // Create a temporary say step for Bryan's response
                    const responseStep = {
                        type: 'say',
                        speakerId: 'bryan',
                        text: option.response
                    };
                    
                    this.renderSayStep(responseStep, container);
                    
                    // After 2 seconds, advance to next step
                    setTimeout(() => {
                        this.isInChoice = false;
                        this.advance();
                    }, 2000);
                    
                    return;
                }
            }
        }
        
        // Check if this option has a love cost (love was spent)
        const hadLoveCost = option.loveCost > 0;
        
        // Spend love if this option has a cost
        if (hadLoveCost) {
            this.spendLove(option.loveCost);
        }
        
        // Clear the choice state
        this.isInChoice = false;
        
        // Check if we should show Nic kiss cutscene
        // Only for regular choices with love cost, not special contexts
        const isSpecialContext = currentStep && (
            currentStep.isDay2KitchenChoice || 
            currentStep.isNicPoolChoice || 
            currentStep.isBryanChoice
        );
        
        if (hadLoveCost && !isSpecialContext) {
            // Show Nic kiss cutscene for regular love-cost choices
            this.showNicKissCutscene();
        } else {
            // Otherwise just advance normally
            this.advance();
        }
    }
    
    showCoupleConfirmation(partnerId) {
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        // Create confirmation bubble
        const confirmDiv = document.createElement('div');
        confirmDiv.className = 'couple-confirmation';
        confirmDiv.innerHTML = `💑 You coupled with ${this.getCharacterName(partnerId)}!`;
        
        container.appendChild(confirmDiv);
        
        // Animate in
        requestAnimationFrame(() => {
            confirmDiv.classList.add('show');
        });
        
        // Remove after delay
        setTimeout(() => {
            confirmDiv.classList.remove('show');
            setTimeout(() => {
                confirmDiv.remove();
            }, 300);
        }, 1800);
    }
    
    showPostCoupleChat() {
        console.log('POST-COUPLE CHAT SHOW', { partner: this.currentPartner });
        
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Create the Ask step
        const askStep = {
            type: 'ask',
            id: 'post_couple_chat',
            speakerId: this.currentPartner,
            prompt: "Hey, I'm so happy you picked me — can I pull you for a chat?",
            isPostCoupleChat: true,
            options: [
                {
                    id: 'reject_harsh',
                    text: 'No, I hate you.',
                    quality: 'bad',
                    dramaCost: 2,
                    response: 'Wow. Harsh.'
                },
                {
                    id: 'reject_busy',
                    text: "Not really. I'm busy.",
                    quality: 'bad',
                    dramaCost: 1,
                    response: 'Oh... okay then.'
                },
                {
                    id: 'maybe_later',
                    text: 'Maybe later.',
                    quality: 'bad',
                    dramaCost: 1,
                    response: 'Alright, I\'ll wait.'
                },
                {
                    id: 'yes_like_you',
                    text: 'Yes, I like you so much.',
                    quality: 'good',
                    loveCost: 5,  // Cost 5 love points to unlock
                    romanceCost: 2,
                    response: "I feel the same way. Come here..."  // Partner's response before cutscene
                }
            ]
        };
        
        // Store the step for later refresh
        this.postCoupleStep = askStep;
        
        // Render the Ask step with player avatar visible
        this.renderPostCoupleAskStep(askStep, container);
    }
    
    renderPostCoupleAskStep(step, container) {
        const dialogView = document.createElement('div');
        dialogView.className = 'episode-dialog-view';
        
        // Partner's avatar with proper structure
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'episode-avatar';
        
        const avatarCircle = document.createElement('div');
        avatarCircle.className = 'episode-avatar-circle';
        
        const avatarImg = document.createElement('img');
        avatarImg.className = 'episode-avatar-img';
        avatarImg.src = this.getAvatarPath(step.speakerId);
        avatarImg.alt = this.getSpeakerName(step.speakerId);
        
        avatarCircle.appendChild(avatarImg);
        avatarDiv.appendChild(avatarCircle);
        
        // Partner's speech bubble
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'episode-bubble';
        
        const bubbleTail = document.createElement('div');
        bubbleTail.className = 'episode-bubble-tail';
        
        const bubbleContent = document.createElement('div');
        bubbleContent.className = 'episode-bubble-content';
        
        const speakerName = document.createElement('div');
        speakerName.className = 'episode-speaker-name';
        speakerName.textContent = this.getSpeakerName(step.speakerId);
        
        const speakerText = document.createElement('div');
        speakerText.className = 'episode-speaker-text';
        speakerText.textContent = step.prompt;
        
        bubbleContent.appendChild(speakerName);
        bubbleContent.appendChild(speakerText);
        bubbleDiv.appendChild(bubbleTail);
        bubbleDiv.appendChild(bubbleContent);
        
        dialogView.appendChild(avatarDiv);
        dialogView.appendChild(bubbleDiv);
        
        // Choice buttons
        const choicesDiv = document.createElement('div');
        choicesDiv.className = 'episode-choices';
        choicesDiv.style.marginTop = '15px';
        
        step.options.forEach((option) => {
            const btn = document.createElement('button');
            btn.className = 'episode-choice-btn';
            
            // Check if this option has a love cost
            if (option.loveCost && option.loveCost > 0) {
                const canAfford = this.love >= option.loveCost;
                
                if (!canAfford) {
                    // Not enough love points - show locked with cost
                    btn.classList.add('locked');
                    btn.innerHTML = `<span class="lock-icon">🔒</span> ${option.text} <span class="love-cost-badge">${option.loveCost} 💖</span>`;
                    btn.disabled = true;
                } else {
                    // Can afford - show unlockable with cost
                    btn.classList.add('unlockable');
                    btn.innerHTML = `${option.text} <span class="love-cost-badge">${option.loveCost} 💖</span>`;
                    btn.onclick = () => {
                        // Love will be deducted if needed
                        // Note: Post-couple choices don't actually have loveCost in current implementation
                        this.selectPostCoupleChoice(option);
                    };
                }
            } else {
                // Free option
                btn.textContent = option.text;
                btn.onclick = () => this.selectPostCoupleChoice(option);
            }
            
            choicesDiv.appendChild(btn);
        });
        
        container.appendChild(dialogView);
        container.appendChild(choicesDiv);
        
        // Add "Earn Love" button if any option requires love points
        const needsLove = step.options.some(opt => opt.loveCost > 0 && this.love < opt.loveCost);
        if (needsLove) {
            const earnLoveBtn = document.createElement('button');
            earnLoveBtn.className = 'episode-earn-love-btn';
            earnLoveBtn.innerHTML = '💖 Earn Love (Math)';
            earnLoveBtn.style.marginTop = '10px';
            earnLoveBtn.onclick = () => {
                // Open infinite math quiz
                this.openMathModal(false, false);  // Not post-couple context, not couple-up context = infinite mode
            };
            container.appendChild(earnLoveBtn);
        }
        
        // Set choice state
        this.isInChoice = true;
        
        // Animate in
        requestAnimationFrame(() => {
            dialogView.classList.add('animate-in');
            choicesDiv.classList.add('animate-in');
        });
    }
    
    openMathForPostCoupleChat(option, step) {
        console.log('POST-COUPLE CHAT MATH OPEN');
        
        // Store the option to select after success
        this.pendingPostCoupleOption = option;
        this.postCoupleStep = step;
        
        // Open the math modal
        this.openMathModal(true); // Pass true to indicate post-couple context
    }
    
    selectPostCoupleChoice(option) {
        console.log('POST-COUPLE CHAT PICK', { 
            option: option.id, 
            drama: option.dramaCost || 0, 
            romance: option.romanceCost || 0 
        });
        
        // Track if this was the romantic option (passed math)
        const isRomanticOption = option.id === 'yes_like_you';
        
        // Apply drama cost if any
        if (option.dramaCost) {
            this.drama += option.dramaCost;
            this.saveDramaPoints();
            this.updateDramaHUD();
        }
        
        // Apply romance if any
        if (option.romanceCost && this.currentPartner) {
            this.romance[this.currentPartner] = (this.romance[this.currentPartner] || 0) + option.romanceCost;
            this.saveCoupleState();
        }
        
        // Show partner's response if any
        if (option.response) {
            const container = document.getElementById('episodeContainer');
            if (container) {
                container.innerHTML = '';
                
                const responseStep = {
                    type: 'say',
                    id: 'partner_response',
                    speakerId: this.currentPartner,
                    text: option.response
                };
                
                this.renderSayStep(responseStep, container);
                
                // Continue after a short delay
                setTimeout(() => {
                    // If this was the romantic option (passed math), show a romantic cutscene
                    if (isRomanticOption) {
                        console.log('POST-COUPLE ROMANCE - Partner:', this.currentPartner);
                        
                        // Create a partner-specific romantic cutscene
                        const cutsceneId = `${this.currentPartner}PostCoupleRomance`;
                        
                        // Define cutscenes for each partner if not already defined
                        if (!this.CUTSCENES[cutsceneId]) {
                            const partnerName = this.getCharacterName(this.currentPartner);
                            this.CUTSCENES[cutsceneId] = {
                                bg: null, // Keep current background
                                steps: [
                                    { type: 'say', speakerId: this.currentPartner, text: "(moving closer) I've been wanting to do this since the moment we coupled up..." },
                                    { type: 'say', speakerId: 'narration', text: `${partnerName} pulls you close, and for a moment, the whole villa disappears.` }
                                ],
                                rewards: null // Romance already applied
                            };
                        }
                        
                        // Play the partner-specific cutscene
                        this.playCutscene(cutsceneId, () => {
                            console.log('POST-COUPLE ROMANCE CUTSCENE END');
                            this.finalizePostCoupleChat();
                        });
                    } else {
                        // No cutscene for non-romantic options
                        this.finalizePostCoupleChat();
                    }
                }, 2000);
            }
        } else {
            // No response means something went wrong, just continue
            if (isRomanticOption) {
                // Still play cutscene even without response
                console.log('POST-COUPLE ROMANCE (no response) - Partner:', this.currentPartner);
                const cutsceneId = `${this.currentPartner}PostCoupleRomance`;
                if (!this.CUTSCENES[cutsceneId]) {
                    const partnerName = this.getCharacterName(this.currentPartner);
                    this.CUTSCENES[cutsceneId] = {
                        bg: null,
                        steps: [
                            { type: 'say', speakerId: this.currentPartner, text: "(moving closer) I've been wanting to do this since the moment we coupled up..." },
                            { type: 'say', speakerId: 'narration', text: `${partnerName} pulls you close, and for a moment, the whole villa disappears.` }
                        ],
                        rewards: null
                    };
                }
                this.playCutscene(cutsceneId, () => {
                    this.finalizePostCoupleChat();
                });
            } else {
                this.finalizePostCoupleChat();
            }
        }
    }
    
    finalizePostCoupleChat() {
        // Mark as shown
        localStorage.setItem('flags.postCoupleChatShown', 'true');
        
        // Reset choice state
        this.isInChoice = false;
        
        // Continue with normal flow
        this.continueAfterCoupleUp();
    }
    
    showNicKissCutscene(onComplete) {
        console.log('LOVE SPEND CUTSCENE → Nic Kiss');
        
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Create cutscene steps
        const cutsceneSteps = [
            {
                type: 'say',
                speakerId: 'nic',
                text: "You know what? I can't hold back anymore."
            },
            {
                type: 'say',
                speakerId: 'narrator',
                text: "Nic kisses you softly, sealing the moment."
            }
        ];
        
        let cutsceneIndex = 0;
        
        const showCutsceneStep = () => {
            if (cutsceneIndex >= cutsceneSteps.length) {
                // Cutscene complete - call callback or advance
                if (onComplete) {
                    onComplete();
                } else {
                    this.advance();
                }
                return;
            }
            
            const step = cutsceneSteps[cutsceneIndex];
            container.innerHTML = '';
            
            // Render the step
            this.renderSayStep(step, container);
            
            // Auto-advance after 2 seconds
            setTimeout(() => {
                cutsceneIndex++;
                showCutsceneStep();
            }, 2000);
        };
        
        // Start cutscene
        showCutsceneStep();
    }
    
    async playCutscene(cutsceneId, onComplete) {
        const cutscene = this.CUTSCENES[cutsceneId];
        if (!cutscene) {
            console.error('CUTSCENE NOT FOUND:', cutsceneId);
            if (onComplete) onComplete();
            return;
        }
        
        // Check if already played (skip for testing - you can re-enable this later)
        const flagKey = `flags.cutscenes.${cutsceneId}`;
        // Temporarily always allow replaying cutscenes for testing
        const alreadyPlayed = false; // localStorage.getItem(flagKey) === 'true';
        if (alreadyPlayed) {
            console.log('CUTSCENE ALREADY PLAYED:', cutsceneId);
            if (onComplete) onComplete();
            return;
        }
        
        console.log('CUTSCENE TRIGGER', cutsceneId);
        this.isPlayingCutscene = true;
        
        const container = document.getElementById('episodeContainer');
        if (!container) {
            if (onComplete) onComplete();
            return;
        }
        
        // Hide HUDs during cutscene
        const loveHUD = document.getElementById('episodeLoveHUD');
        const dramaHUD = document.getElementById('episodeDramaHUD');
        const partnerHUD = document.getElementById('episodePartnerHUD');
        const playerAvatarHUD = document.getElementById('playerAvatarHUD');
        
        if (loveHUD) loveHUD.style.display = 'none';
        if (dramaHUD) dramaHUD.style.display = 'none';
        if (partnerHUD) partnerHUD.style.display = 'none';
        if (playerAvatarHUD) playerAvatarHUD.style.display = 'none';
        
        // Save current background
        const originalBackground = this.currentBackground;
        
        // Fade out
        container.style.transition = 'opacity 0.25s ease';
        container.style.opacity = '0';
        
        setTimeout(() => {
            // Change background if specified (null means keep current)
            if (cutscene.bg) {
                this.currentBackground = cutscene.bg;
                this.updateBackground();
            }
            
            // Clear container
            container.innerHTML = '';
            
            let cutsceneIndex = 0;
            
            const showCutsceneStep = () => {
                console.log(`CUTSCENE STEP ${cutsceneIndex + 1}/${cutscene.steps.length} for ${cutsceneId}`);
                
                // Special log when we reach the Bryan interruption (step 11 of nic_kiss_pool)
                if (cutsceneId === 'nic_kiss_pool' && cutsceneIndex === 10) {
                    console.log('NIC KISS → Bryan interrupt');
                }
                
                if (cutsceneIndex >= cutscene.steps.length) {
                    // Apply rewards
                    if (cutscene.rewards) {
                        if (cutscene.rewards.romance) {
                            Object.entries(cutscene.rewards.romance).forEach(([character, amount]) => {
                                if (!this.romance) this.romance = {};
                                this.romance[character] = (this.romance[character] || 0) + amount;
                            });
                            localStorage.setItem('story.romance', JSON.stringify(this.romance));
                        }
                        if (cutscene.rewards.drama) {
                            this.drama += cutscene.rewards.drama;
                            this.saveDramaPoints();
                            this.updateDramaHUD();
                        }
                        console.log('CUTSCENE END', cutsceneId, cutscene.rewards);
                    } else {
                        console.log('CUTSCENE END', cutsceneId, 'no rewards');
                    }
                    
                    // Set any flags defined in the cutscene
                    if (cutscene.flags) {
                        for (const [flagPath, value] of Object.entries(cutscene.flags)) {
                            this.setFlag('flags.' + flagPath, value);
                        }
                    }
                    
                    // Mark as played
                    localStorage.setItem(flagKey, 'true');
                    
                    // Restore original background if it was changed
                    if (cutscene.bg) {
                        this.currentBackground = originalBackground;
                        this.updateBackground();
                    }
                    
                    // Fade out
                    container.style.opacity = '0';
                    
                    setTimeout(() => {
                        // Clean up any lingering keyboard handlers
                        if (this.currentCutsceneHandler) {
                            document.removeEventListener('keydown', this.currentCutsceneHandler);
                            this.currentCutsceneHandler = null;
                        }
                        
                        // Reset state
                        this.isPlayingCutscene = false;
                        container.style.transition = '';
                        container.style.opacity = '1';
                        
                        // Restore HUDs
                        if (loveHUD) loveHUD.style.display = '';
                        if (dramaHUD) dramaHUD.style.display = '';
                        if (partnerHUD) partnerHUD.style.display = '';
                        if (playerAvatarHUD) playerAvatarHUD.style.display = '';
                        
                        // Update HUD values in case they changed
                        this.updateLoveHUD();
                        this.updateDramaHUD();
                        this.updatePartnerHUD();
                        
                        // Call completion callback
                        if (onComplete) onComplete();
                    }, 250);
                    
                    return;
                }
                
                const step = cutscene.steps[cutsceneIndex];
                container.innerHTML = '';
                
                // Render the step
                this.renderSayStep(step, container);
                
                // Set up keyboard listener for this step
                const handleKey = (e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        document.removeEventListener('keydown', handleKey);
                        cutsceneIndex++;
                        showCutsceneStep();
                    }
                };
                
                // Store the handler so we can clean it up if needed
                this.currentCutsceneHandler = handleKey;
                document.addEventListener('keydown', handleKey);
            };
            
            // Fade in with first step
            container.style.opacity = '1';
            showCutsceneStep();
        }, 250);
    }
    
    continueAfterCoupleUp() {
        // Branch based on partner
        if (this.currentPartner === 'bryan') {
            console.log('BRYAN ARC → using this weekend V2(6)');
            this.loadBryanArc();
        } else if (this.currentPartner === 'chris') {
            console.log('NO ARC YET → end Day 1 (Chris)');
            this.loadDay1Ending();
        } else {
            console.log('NO ARC YET → end Day 1');
            this.loadDay1Ending();
        }
    }
    
    async loadBryanArc() {
        console.log('BRYAN ARC DAY 1 START');
        
        // Clear existing steps
        this.steps = [];
        
        // Scene 1: The Pull for a Chat
        // Bryan's initial dialogue
        this.steps.push({
            type: 'say',
            id: 'bryan_chat_001',
            speakerId: 'bryan',
            text: "So… I've got to ask. What made you pick me? Was it the smile, the chat, or just my muscles?"
        });
        
        // Ask step with 3 choices
        this.steps.push({
            type: 'ask',
            id: 'bryan_chat_002',
            speakerId: 'bryan',
            prompt: "(He winks at you)",
            isBryanChoice: true,  // Flag for Bryan-specific choice handling
            options: [
                {
                    id: 'bryan_good',
                    text: 'Honestly? All of the above. But I think it was the way you carry yourself.',
                    quality: 'good',
                    bryanPointsChange: 3,
                    response: 'Smooth. I knew you were trouble the second you walked in.'
                },
                {
                    id: 'bryan_neutral', 
                    text: 'You seemed like the safe option.',
                    quality: 'neutral',
                    bryanPointsChange: 1,
                    response: 'Safe? Hey, I\'ll take it… for now.'
                },
                {
                    id: 'bryan_bad',
                    text: 'I just didn\'t feel like picking anyone else.',
                    quality: 'bad',
                    bryanPointsChange: -3,
                    response: 'Wow. Straight to the point, huh?'
                }
            ]
        });
        
        // Placeholder for continuation
        this.steps.push({
            type: 'say',
            id: 'bryan_chat_003',
            speakerId: 'narration',
            text: '…The night falls over the villa. Tomorrow brings new drama.'
        });
        
        // Add transition to Day 2
        this.steps.push({
            type: 'day_transition',
            id: 'bryan_chat_004',
            currentDay: 1,
            nextDay: 2
        });
        
        // Mark that we're in Bryan's arc
        localStorage.setItem('story.currentArc', 'bryan');
        
        // Reset to start of arc
        this.currentIndex = 0;
        this.saveProgress();
        
        // Render first step
        const container = document.getElementById('episodeContainer');
        if (container) {
            container.innerHTML = '';
            this.renderCurrentStep();
        }
        
        console.log('Bryan arc loaded: Fire pit chat scene');
    }
    
    async triggerNicPoolScene() {
        // This can be called to insert the Nic pool scene as an optional romance event
        // Save current state
        const returnState = {
            steps: [...this.steps],
            currentIndex: this.currentIndex,
            currentBackground: this.currentBackground
        };
        
        // Store return state for later
        this.returnState = returnState;
        
        // Load Nic pool scene (with swimsuit switch)
        await this.loadNicPoolScene();
    }
    
    async loadNicPoolScene() {
        console.log('NIC POOL SCENE START');
        
        // Switch to swimsuit for pool scene (Elle needs to be in swimsuit)
        try {
            await this.switchToSwimsuitAvatar();
        } catch (error) {
            console.log('Swimsuit switch failed, continuing with current avatar:', error);
        }
        
        // Clear existing steps
        this.steps = [];
        
        // Set the background to villa pool
        this.currentBackground = '/public/assets/backgrounds/villa_day.png';
        this.updateBackground();
        
        // Create the 10-exchange sequence
        
        // Exchange 1
        this.steps.push({
            type: 'say',
            id: 'nic_pool_001',
            speakerId: 'nic',
            text: "There you are… I was hoping I'd catch you by the pool."
        });
        
        this.steps.push({
            type: 'say',
            id: 'nic_pool_002',
            speakerId: 'you',
            text: "Oh yeah? What gave me away — the swimsuit?"
        });
        
        // Exchange 2
        this.steps.push({
            type: 'say',
            id: 'nic_pool_003',
            speakerId: 'nic',
            text: "Nah, the way you make this villa look boring when you're not in it."
        });
        
        this.steps.push({
            type: 'say',
            id: 'nic_pool_004',
            speakerId: 'you',
            text: "Smooth… do you rehearse those lines in the mirror?"
        });
        
        // Exchange 3
        this.steps.push({
            type: 'say',
            id: 'nic_pool_005',
            speakerId: 'nic',
            text: "Only when I know the reflection won't look half as good as you."
        });
        
        this.steps.push({
            type: 'say',
            id: 'nic_pool_006',
            speakerId: 'you',
            text: "Careful, if you keep talking like that, I might start to believe you."
        });
        
        // Exchange 4
        this.steps.push({
            type: 'say',
            id: 'nic_pool_007',
            speakerId: 'nic',
            text: "That's the idea. I don't waste words I don't mean."
        });
        
        this.steps.push({
            type: 'say',
            id: 'nic_pool_008',
            speakerId: 'you',
            text: "So what do you mean right now?"
        });
        
        // Exchange 5
        this.steps.push({
            type: 'say',
            id: 'nic_pool_009',
            speakerId: 'nic',
            text: "That out of everyone here… you're the only one I actually want to get to know."
        });
        
        this.steps.push({
            type: 'say',
            id: 'nic_pool_010',
            speakerId: 'you',
            text: "Then maybe you should stop talking and show me you mean it."
        });
        
        // Add a narration step to build tension
        this.steps.push({
            type: 'say',
            id: 'nic_pool_tension',
            speakerId: 'narration',
            text: "Nic leans in closer, the tension between you electric..."
        });
        
        // Add Nic's choice setup
        this.steps.push({
            type: 'say',
            id: 'nic_pool_setup',
            speakerId: 'nic',
            text: "So… what happens next depends on you."
        });
        
        // Add the branching choice
        this.steps.push({
            type: 'ask',
            id: 'nic_pool_choice',
            speakerId: 'nic',
            prompt: "(His eyes are locked on yours, waiting...)",
            isNicPoolChoice: true,
            options: [
                {
                    id: 'kiss_nic',
                    text: 'Kiss Nic now',
                    quality: 'good',
                    loveCost: 5,
                    requiresMath: true,
                    mathLockText: '(Solve fast math to unlock)',
                    romanceChange: 3,
                    flagToSet: 'flags.nic.kissPool',
                    response: "Knew you'd feel the spark too.",
                    cutscene: 'nic_kiss_pool'
                },
                {
                    id: 'tease_nic',
                    text: 'Tease him, pull away',
                    quality: 'neutral',
                    romanceChange: 1,
                    flagToSet: 'flags.nic.teasePool',
                    response: "Alright, I see how it is… you like making me work for it."
                },
                {
                    id: 'walk_away',
                    text: 'Walk away',
                    quality: 'bad',
                    romanceChange: -2,
                    dramaChange: 1,
                    flagToSet: 'flags.nic.walkAwayPool',
                    response: "Cold. Didn't expect that…"
                }
            ]
        });
        
        // Reset index to start of scene
        this.currentIndex = 0;
        this.saveProgress();
        
        // Render first step
        const container = document.getElementById('episodeContainer');
        if (container) {
            container.innerHTML = '';
            this.renderCurrentStep();
        }
    }
    
    loadDay2VillaNightScene() {
        console.log('DAY 2 — Villa Night scene start');
        
        // Clear existing steps
        this.steps = [];
        
        // Set the background to villa night
        this.currentBackground = '/public/assets/backgrounds/villa_night.png';
        this.updateBackground();
        
        // Bryan's opening lines
        this.steps.push({
            type: 'say',
            id: 'd2_night_001',
            speakerId: 'bryan',
            text: "(warm smile) Even at night, you shine brighter than the villa lights. I'm glad you picked me."
        });
        
        this.steps.push({
            type: 'say',
            id: 'd2_night_002',
            speakerId: 'bryan',
            text: "(leans closer) I just hope you'll give me the chance to prove I was the right choice."
        });
        
        // Nic interrupts
        this.steps.push({
            type: 'say',
            id: 'd2_night_003',
            speakerId: 'nic',
            text: "(cutting in, confident) Careful, Bryan. Don't hog her all night. She might want better company."
        });
        
        // 10-line back-and-forth between Nic and Player
        // Line 1
        this.steps.push({
            type: 'say',
            id: 'd2_night_004',
            speakerId: 'nic',
            text: "You know, the moon looks jealous with how good you look right now."
        });
        
        // Line 2
        this.steps.push({
            type: 'say',
            id: 'd2_night_005',
            speakerId: 'you',
            text: "Jealous, huh? Maybe it should learn some of your lines."
        });
        
        // Line 3
        this.steps.push({
            type: 'say',
            id: 'd2_night_006',
            speakerId: 'nic',
            text: "(grins) Lines? No. I just say what I'm thinking — and I'm thinking about you."
        });
        
        // Line 4
        this.steps.push({
            type: 'say',
            id: 'd2_night_007',
            speakerId: 'you',
            text: "(teasing) Smooth talker. Do you practice this, or does it come naturally?"
        });
        
        // Line 5
        this.steps.push({
            type: 'say',
            id: 'd2_night_008',
            speakerId: 'nic',
            text: "(leaning in) When it's you, it just happens. You've got me off balance."
        });
        
        // Line 6
        this.steps.push({
            type: 'say',
            id: 'd2_night_009',
            speakerId: 'you',
            text: "Funny, you don't seem like the type to lose control."
        });
        
        // Line 7
        this.steps.push({
            type: 'say',
            id: 'd2_night_010',
            speakerId: 'nic',
            text: "(serious now) That's the thing… you're the exception. I want to know everything about you."
        });
        
        // Line 8
        this.steps.push({
            type: 'say',
            id: 'd2_night_011',
            speakerId: 'you',
            text: "(soft smile) Careful, if you keep this up, I might let you."
        });
        
        // Line 9
        this.steps.push({
            type: 'say',
            id: 'd2_night_012',
            speakerId: 'nic',
            text: "(eyes flick to lips) Then don't hold back. Not with me."
        });
        
        // Line 10
        this.steps.push({
            type: 'say',
            id: 'd2_night_013',
            speakerId: 'you',
            text: "(flustered) Nic… you're trouble. And I think I like it."
        });
        
        // Add scene end handler
        this.steps.push({
            type: 'scene_end',
            id: 'd2_night_complete',
            handler: 'villaNightComplete'
        });
        
        // Add day transition to Day 3
        this.steps.push({
            type: 'day_transition',
            id: 'd2_to_d3_transition',
            currentDay: 2,
            nextDay: 3
        });
        
        // Reset index to start of scene
        this.currentIndex = 0;
        this.saveProgress();
        
        // Render first step
        const container = document.getElementById('episodeContainer');
        if (container) {
            container.innerHTML = '';
            this.renderCurrentStep();
        }
    }
    
    loadDay2KitchenScene() {
        console.log('DAY 2 START — Kitchen Scene');
        
        // Clear existing steps
        this.steps = [];
        
        // Set the background to kitchen
        this.currentBackground = '/public/assets/backgrounds/kitchen.png';
        
        // Check if the kitchen background exists
        const img = new Image();
        img.onerror = () => {
            console.warn('Warning: Kitchen background not found at', this.currentBackground);
            console.warn('Falling back to villa background');
            this.currentBackground = null; // Fall back to default
            this.updateBackground();
        };
        img.src = this.currentBackground;
        
        // Scene 1: Kitchen Drama
        // Bryan supportive
        this.steps.push({
            type: 'say',
            id: 'd2_001',
            speakerId: 'bryan',
            text: "Morning, everyone. I'll make coffee. Who needs it most?"
        });
        
        // Amaya flirty toward Bryan
        this.steps.push({
            type: 'say',
            id: 'd2_002',
            speakerId: 'amaya',
            text: "I'll take mine strong. You know I like it that way."
        });
        
        // Player's response (using their avatar)
        this.steps.push({
            type: 'say',
            id: 'd2_003',
            speakerId: 'you',
            text: "..."
        });
        
        // Jana annoyed at Kenny
        this.steps.push({
            type: 'say',
            id: 'd2_004',
            speakerId: 'jana',
            text: "You've got something to say, Kenny? Spit it out."
        });
        
        // Kenny being villainous
        this.steps.push({
            type: 'say',
            id: 'd2_005',
            speakerId: 'kenny',
            text: "Just wondering how long before you scare someone off, Jana. You've got a real… energy."
        });
        
        // Jana fired up
        this.steps.push({
            type: 'say',
            id: 'd2_006',
            speakerId: 'jana',
            text: "At least I don't slither around like a snake."
        });
        
        // Huda being chaotic
        this.steps.push({
            type: 'say',
            id: 'd2_007',
            speakerId: 'huda',
            text: "SNAKE! Snake in the kitchen! Somebody check the fridge!"
        });
        
        // Bryan trying to calm
        this.steps.push({
            type: 'say',
            id: 'd2_008',
            speakerId: 'bryan',
            text: "Okay, okay, chill. It's too early for this."
        });
        
        // Main Ask step with 4 options
        this.steps.push({
            type: 'ask',
            id: 'd2_009',
            speakerId: 'you',
            prompt: "(What do you want to do?)",
            isDay2KitchenChoice: true,  // Flag for special handling
            options: [
                {
                    id: 'back_jana',
                    text: 'Back Jana publicly',
                    quality: 'neutral',
                    isFree: true
                },
                {
                    id: 'stay_quiet', 
                    text: 'Stay quiet',
                    quality: 'neutral',
                    isFree: true
                },
                {
                    id: 'kiss_bryan',
                    text: 'Kiss Bryan in front of Amaya to claim your territory',
                    quality: 'good',
                    loveCost: 5,
                    requiresMath: true,
                    mathLockText: '(Solve fast math to unlock)',
                    romanceChange: 3,
                    dramaChange: 1,
                    flagToSet: 'flags.day2.kitchen.kissBryan',
                    cutscene: 'bryan_kitchen_kiss'
                },
                {
                    id: 'slap_huda',
                    text: 'Bitch slap Huda',
                    quality: 'bad',
                    isFree: true,
                    dramaChange: 4,
                    flagToSet: 'flags.day2.kitchen.hudaSlap',
                    triggersBlackout: true
                }
            ]
        });
        
        // Set day to 2
        this.currentDay = 2;
        localStorage.setItem('story.progress.day', '2');
        
        // Reset index for new day
        this.currentIndex = 0;
        this.saveProgress();
        
        // Update the background
        this.updateBackground();
        
        console.log('Day 2 Kitchen Scene loaded:', this.steps.length, 'steps');
    }
    
    updateBackground() {
        // Apply background to the parent nextView container, not episodeContainer
        const nextView = document.getElementById('nextView');
        if (!nextView) return;
        
        // Apply the current background
        if (this.currentBackground) {
            console.log(`Background updated: ${this.currentBackground}`);
            nextView.style.backgroundImage = `url('${this.currentBackground}')`;
            nextView.style.backgroundSize = 'cover';
            nextView.style.backgroundPosition = 'center';
            nextView.style.backgroundRepeat = 'no-repeat';
        } else {
            // Default to villa background
            nextView.style.backgroundImage = "url('/public/assets/backgrounds/villa_day.png')";
            nextView.style.backgroundSize = 'cover';
            nextView.style.backgroundPosition = 'center';
            nextView.style.backgroundRepeat = 'no-repeat';
        }
    }
    
    loadDay3BedroomScene() {
        console.log('DAY 3 START — Going directly to outfit choice');
        
        // Check if bedroom scene was already completed
        if (localStorage.getItem('day3.bedroomComplete') === 'true') {
            console.log('Bedroom scene already complete, continuing Day 3');
            this.continueDay3AfterOutfit();
            return;
        }
        
        // Clear existing steps
        this.steps = [];
        
        // Set the background to bedroom
        this.currentBackground = '/public/assets/backgrounds/Bedroom.png';
        this.updateBackground();
        
        // Navigate directly to outfit selection - no dialogue first
        this.steps.push({
            type: 'navigate',
            id: 'd3_navigate_outfit',
            target: 'ChooseOutfitView'
        });
        
        // Set day to 3
        this.currentDay = 3;
        localStorage.setItem('story.progress.day', '3');
        
        // Reset index for new day
        this.currentIndex = 0;
        this.saveProgress();
        
        // Update background
        this.updateBackground();
        
        // Ensure player avatar HUD is created
        this.ensurePlayerAvatarHUD();
        
        console.log('Day 3 Simplified Scene loaded:', this.steps.length, 'steps');
        
        // Start rendering the first step
        this.renderCurrentStep();
    }
    
    parseBryanContent(text) {
        const lines = text.split('\n');
        const parsedSteps = [];
        let stepCounter = 1;
        let i = 0;
        const prefix = 'bryan_';
        
        // First add opening narration
        parsedSteps.push({
            type: 'say',
            id: `${prefix}${String(stepCounter).padStart(3, '0')}`,
            speakerId: 'narration',
            text: "At the fire pit, Bryan flashes his easy grin..."
        });
        stepCounter++;
        
        while (i < lines.length) {
            const line = lines[i].trim();
            
            // Skip empty lines, headers, and dividers
            if (!line || line.startsWith('##') || line.startsWith('---') || line === '---') {
                i++;
                continue;
            }
            
            // Parse Bryan's dialogue
            if (line.startsWith('**Bryan:**') || line.includes('Bryan:')) {
                let dialogue = line.replace('**Bryan:**', '').replace('Bryan:', '').trim();
                // Remove quotes and markdown formatting
                dialogue = dialogue.replace(/["""]/g, '').replace(/\*\*/g, '').replace(/\\/g, '');
                
                if (dialogue) {
                    parsedSteps.push({
                        type: 'say',
                        id: `${prefix}${String(stepCounter).padStart(3, '0')}`,
                        speakerId: 'bryan',
                        text: dialogue
                    });
                    stepCounter++;
                }
            }
            // Parse choice blocks
            else if (line.includes('Choice') && line.includes('–')) {
                // Found a choice header, collect the options
                const choices = [];
                i++;
                
                while (i < lines.length) {
                    const choiceLine = lines[i].trim();
                    
                    // Check if this is a numbered choice
                    if (choiceLine.match(/^\d+\./)) {
                        // Extract choice text
                        let choiceText = choiceLine.replace(/^\d+\.\s*/, '');
                        
                        // Handle bold formatting
                        if (choiceText.includes('**')) {
                            const boldMatch = choiceText.match(/\*\*(.*?)\*\*/);
                            if (boldMatch) {
                                choiceText = boldMatch[1];
                            }
                        }
                        
                        // Clean up the text
                        choiceText = choiceText.replace(/[*:]/g, '').trim();
                        
                        // Look ahead for response text
                        let responseText = '';
                        let j = i + 1;
                        while (j < lines.length && !lines[j].trim().match(/^\d+\./) && lines[j].trim() !== '') {
                            const respLine = lines[j].trim();
                            if (respLine.includes('→')) {
                                break; // Skip navigation markers
                            }
                            if (respLine.startsWith('*') || respLine.includes('Bryan:')) {
                                responseText = respLine.replace(/\*/g, '').replace('Bryan:', '').trim();
                                break;
                            }
                            j++;
                        }
                        
                        choices.push({
                            id: `bryan_choice_${choices.length + 1}`,
                            text: choiceText,
                            next: 'continue',
                            quality: choices.length === 0 ? 'good' : 'bad',
                            loveCost: choices.length === 0 ? 5 : 0  // Good choices cost 5 love
                        });
                        
                        i = j;
                    } else if (choiceLine === '' || choiceLine.startsWith('##')) {
                        break; // End of choices
                    } else {
                        i++;
                    }
                }
                
                if (choices.length > 0) {
                    // Add the choice step
                    const lastStep = parsedSteps[parsedSteps.length - 1];
                    const prompt = lastStep && lastStep.speakerId === 'bryan' ? 
                        lastStep.text : 'What will you say?';
                    
                    parsedSteps.push({
                        type: 'ask',
                        id: `${prefix}ask_${String(stepCounter).padStart(3, '0')}`,
                        speakerId: 'bryan',
                        prompt: prompt,
                        options: choices.slice(0, 4)
                    });
                    stepCounter++;
                }
            }
            // Parse regular text as narration
            else if (line.length > 0 && !line.startsWith('*') && !line.match(/^\d+\./)) {
                // Clean up the text
                let cleanText = line.replace(/\*/g, '').trim();
                
                if (cleanText && !cleanText.includes('→')) {
                    parsedSteps.push({
                        type: 'say',
                        id: `${prefix}${String(stepCounter).padStart(3, '0')}`,
                        speakerId: 'narration',
                        text: cleanText
                    });
                    stepCounter++;
                }
            }
            
            i++;
        }
        
        // Add ending if Bryan's arc is complete
        if (parsedSteps.length > 0) {
            parsedSteps.push({
                type: 'say',
                id: `${prefix}end`,
                speakerId: 'narration',
                text: "Bryan's route continues... More content coming soon!"
            });
        }
        
        this.steps = parsedSteps;
        console.log('Bryan content parsed, steps:', this.steps.length);
    }
    
    loadDay1Ending() {
        // Create ending sequence for Day 1
        this.steps = [
            {
                type: 'say',
                id: 'd1_ending_001',
                speakerId: 'ariana',
                text: "The first day comes to a close. Tomorrow will bring new surprises… but for now, get some rest."
            },
            {
                type: 'say',
                id: 'd1_ending_002',
                speakerId: 'narration',
                text: `You've coupled up with ${this.getCharacterName(this.currentPartner)}. Sweet dreams in the villa!`
            }
        ];
        
        // Reset index
        this.currentIndex = 0;
        
        // Render ending
        const container = document.getElementById('episodeContainer');
        if (container) container.innerHTML = '';
        this.renderCurrentStep();
    }
    
    openMathModal(isPostCoupleContext = false, isCoupleUpContext = false, specialContext = null, contextOption = null) {
        if (this.modalOpen) return;
        
        this.modalOpen = true;
        
        // Store context
        this.isPostCoupleContext = isPostCoupleContext;
        this.isCoupleUpContext = isCoupleUpContext;
        this.mathSpecialContext = specialContext;
        this.mathContextOption = contextOption;
        
        // Reset quiz state - for post-couple, couple-up, Day 2 Kitchen, Nic Pool, and good options, use 5 questions; otherwise infinite
        const useFiniteQuiz = isPostCoupleContext || isCoupleUpContext || specialContext === 'day2Kitchen' || specialContext === 'nicPool' || specialContext === 'goodOption';
        this.mathQuiz = {
            active: true,
            round: 0,
            totalRounds: useFiniteQuiz ? 5 : Infinity,  // 5 rounds for special contexts, infinite otherwise
            correct: 0,
            totalAttempts: 0,
            currentAnswer: null,
            currentA: null,  // Store the operands for logging
            currentB: null,
            timer: null,
            timeLeft: 7,
            timeLeftMs: 7000,  // Track milliseconds for precise timing
            roundStatus: 'pending',  // 'pending' | 'submitted' | 'timeout'
            difficulty: useFiniteQuiz ? 2 : 1  // Use multiplication (level 2) for 5-question quiz, easy for infinite
        };
        
        const contextLabel = isPostCoupleContext ? 'post-couple' : 
                            isCoupleUpContext ? 'couple-up' : 
                            specialContext === 'day2Kitchen' ? 'day2-kitchen' :
                            specialContext === 'nicPool' ? 'nic-pool' : 'infinite mode';
        console.log(`MATH START ${useFiniteQuiz ? 'rounds=5' : 'infinite'} (${contextLabel}) [AUTO-PASS ALWAYS ENABLED]`);
        
        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'mathModal';
        modal.className = 'episode-modal-overlay';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'episode-modal-content';
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        
        // Add keyboard listener
        this.modalKeyListener = (e) => {
            if (e.key === 'Enter' && !this.mathQuiz.submitted) {
                this.submitMathAnswer();
            } else if (e.key === 'Escape' && !this.mathQuiz.active) {
                this.closeMathModal();
            }
        };
        document.addEventListener('keydown', this.modalKeyListener);
        
        // Animate in and start quiz
        requestAnimationFrame(() => {
            modal.classList.add('show');
            setTimeout(() => {
                this.runMathRound();
            }, 300);
        });
    }
    
    runMathRound() {
        // Check if we've reached the limit for finite quiz contexts
        const useFiniteQuiz = this.isPostCoupleContext || this.isCoupleUpContext;
        if (useFiniteQuiz && this.mathQuiz.round >= this.mathQuiz.totalRounds) {
            this.endMathQuiz();
            return;
        }
        
        this.mathQuiz.round++;
        this.mathQuiz.totalAttempts++;
        this.mathQuiz.roundStatus = 'pending';  // Reset status for new round
        this.mathQuiz.timeLeft = 7;
        this.mathQuiz.timeLeftMs = 7000;
        
        // For 5-question quiz, keep difficulty at multiplication (level 2)
        // For infinite mode, increase difficulty every 5 correct answers
        if (!useFiniteQuiz) {
            const difficultyLevel = Math.floor(this.mathQuiz.correct / 5) + 1;
            this.mathQuiz.difficulty = Math.min(difficultyLevel, 4); // Max difficulty 4
        }
        
        // Generate question based on difficulty - now returns a, b, question, answer
        const { question, answer, a, b } = this.generateMathProblem(this.mathQuiz.difficulty);
        
        // Store the answer as a NUMBER, not string
        this.mathQuiz.currentAnswer = Number(answer);
        this.mathQuiz.currentA = a;
        this.mathQuiz.currentB = b;
        
        // Verify the answer is a valid number
        if (Number.isNaN(this.mathQuiz.currentAnswer)) {
            console.error('ERROR: Generated answer is NaN!', { a, b, answer });
            this.mathQuiz.currentAnswer = 0;  // Fallback
        }
        
        console.log(`Q${this.mathQuiz.round}: ${question} = ${this.mathQuiz.currentAnswer}`);
        
        // Update modal content
        const modalContent = document.querySelector('#mathModal .episode-modal-content');
        if (!modalContent) return;
        
        modalContent.innerHTML = '';
        
        // Round indicator
        const roundDiv = document.createElement('div');
        roundDiv.className = 'math-round-indicator';
        const roundText = this.mathQuiz.totalRounds === Infinity 
            ? `Question ${this.mathQuiz.round}` 
            : `Round ${this.mathQuiz.round} of ${this.mathQuiz.totalRounds}`;
        roundDiv.textContent = roundText;
        modalContent.appendChild(roundDiv);
        
        // Show auto-pass indicator
        const autoPassDiv = document.createElement('div');
        autoPassDiv.style.cssText = 'background: #4CAF50; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; margin-top: 5px;';
        autoPassDiv.textContent = '✓ All Answers Correct';
        modalContent.appendChild(autoPassDiv);
        
        // Modal dialog view
        const dialogView = document.createElement('div');
        dialogView.className = 'episode-modal-dialog';
        
        // Ariana's avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'episode-avatar';
        
        const avatarCircle = document.createElement('div');
        avatarCircle.className = 'episode-avatar-circle';
        
        const avatarImg = document.createElement('img');
        avatarImg.className = 'episode-avatar-img';
        avatarImg.src = '/public/assets/avatars/ariana.png';
        avatarImg.alt = 'ariana';
        
        avatarCircle.appendChild(avatarImg);
        avatarDiv.appendChild(avatarCircle);
        
        // Message bubble
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'episode-bubble';
        
        const bubbleTail = document.createElement('div');
        bubbleTail.className = 'episode-bubble-tail';
        
        const bubbleContent = document.createElement('div');
        bubbleContent.className = 'episode-bubble-content';
        
        const speakerName = document.createElement('div');
        speakerName.className = 'episode-speaker-name';
        speakerName.textContent = 'Ariana';
        
        const speakerText = document.createElement('div');
        speakerText.className = 'episode-speaker-text';
        speakerText.innerHTML = `Quick! What's ${question}? You've got 7 seconds!`;
        
        bubbleContent.appendChild(speakerName);
        bubbleContent.appendChild(speakerText);
        bubbleDiv.appendChild(bubbleTail);
        bubbleDiv.appendChild(bubbleContent);
        
        dialogView.appendChild(avatarDiv);
        dialogView.appendChild(bubbleDiv);
        modalContent.appendChild(dialogView);
        
        // Stats section
        const statsSection = document.createElement('div');
        statsSection.className = 'math-stats-section';
        statsSection.style.cssText = 'text-align: center; margin: 10px 0; font-size: 14px; color: #666;';
        
        // Determine difficulty label
        const difficultyLabels = ['', 'Easy', 'Medium', 'Hard', 'Expert'];
        const diffLabel = difficultyLabels[this.mathQuiz.difficulty];
        
        statsSection.innerHTML = `
            <div style="display: flex; justify-content: space-around; padding: 10px; background: rgba(255, 107, 157, 0.1); border-radius: 10px;">
                <span>Question #${this.mathQuiz.round}</span>
                <span>Level: <strong>${diffLabel}</strong></span>
                <span>💖 Earned: <strong>${this.mathQuiz.correct}</strong></span>
            </div>
        `;
        modalContent.appendChild(statsSection);
        
        // Timer section
        const timerSection = document.createElement('div');
        timerSection.className = 'math-timer-section';
        
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'mathTimerDisplay';
        timerDisplay.className = 'math-timer-display';
        timerDisplay.textContent = '7 seconds';
        
        const timerBar = document.createElement('div');
        timerBar.className = 'math-timer-bar';
        
        const timerProgress = document.createElement('div');
        timerProgress.id = 'mathTimerProgress';
        timerProgress.className = 'math-timer-progress';
        timerProgress.style.width = '100%';
        
        timerBar.appendChild(timerProgress);
        timerSection.appendChild(timerDisplay);
        timerSection.appendChild(timerBar);
        modalContent.appendChild(timerSection);
        
        // Answer section
        const answerSection = document.createElement('div');
        answerSection.className = 'math-answer-section';
        
        const input = document.createElement('input');
        input.id = 'mathInput';
        input.type = 'number';
        input.className = 'math-input';
        input.placeholder = '?';
        input.autocomplete = 'off';
        input.disabled = false;  // Ensure enabled at start of round
        
        const submitBtn = document.createElement('button');
        submitBtn.id = 'mathSubmitBtn';
        submitBtn.className = 'math-submit-btn';
        submitBtn.textContent = 'Submit';
        submitBtn.disabled = false;  // Ensure enabled at start of round
        submitBtn.onclick = () => this.submitMathAnswer();
        
        // Add Exit button
        const exitBtn = document.createElement('button');
        exitBtn.className = 'math-exit-btn';
        exitBtn.style.cssText = 'background: #999; margin-left: 10px;';
        exitBtn.textContent = 'Exit Quiz';
        exitBtn.onclick = () => this.endMathQuiz();
        
        answerSection.appendChild(input);
        answerSection.appendChild(submitBtn);
        answerSection.appendChild(exitBtn);
        modalContent.appendChild(answerSection);
        
        // Focus input
        setTimeout(() => {
            input.focus();
        }, 100);
        
        // Start timer
        this.startMathTimer();
    }
    
    startMathTimer() {
        // Clear any existing timer
        if (this.mathQuiz.timer) {
            clearInterval(this.mathQuiz.timer);
            this.mathQuiz.timer = null;
        }
        
        const startTime = Date.now();
        
        this.mathQuiz.timer = setInterval(() => {
            // Calculate precise time left
            const elapsed = Date.now() - startTime;
            this.mathQuiz.timeLeftMs = Math.max(0, 7000 - elapsed);
            const secondsLeft = Math.ceil(this.mathQuiz.timeLeftMs / 1000);
            this.mathQuiz.timeLeft = secondsLeft;
            
            // Update display
            const display = document.getElementById('mathTimerDisplay');
            const progress = document.getElementById('mathTimerProgress');
            
            if (display) {
                display.textContent = `${secondsLeft} second${secondsLeft !== 1 ? 's' : ''}`;
            }
            
            if (progress) {
                const percentage = (this.mathQuiz.timeLeftMs / 7000) * 100;
                progress.style.width = `${percentage}%`;
                
                // Change color based on time left
                if (secondsLeft <= 2) {
                    progress.style.background = '#ff4757';
                } else if (secondsLeft <= 4) {
                    progress.style.background = '#ffa502';
                } else {
                    progress.style.background = '#4CAF50';
                }
            }
            
            // Time's up - check round status to prevent race conditions
            if (this.mathQuiz.timeLeftMs <= 0 && this.mathQuiz.roundStatus === 'pending') {
                clearInterval(this.mathQuiz.timer);
                this.mathQuiz.timer = null;
                this.mathQuiz.roundStatus = 'timeout';
                this.submitMathAnswer(true); // Force submit as timeout
            }
        }, 100);  // Update every 100ms for smoother countdown
    }
    
    submitMathAnswer(isTimeout = false) {
        // Prevent multiple submissions for the same round
        if (this.mathQuiz.roundStatus !== 'pending') {
            console.log('Submission ignored - round already completed');
            return;
        }
        
        // Set status immediately to prevent race conditions
        this.mathQuiz.roundStatus = isTimeout ? 'timeout' : 'submitted';
        
        // Stop the timer IMMEDIATELY before any evaluation
        if (this.mathQuiz.timer) {
            clearInterval(this.mathQuiz.timer);
            this.mathQuiz.timer = null;
        }
        
        // Disable input and submit button immediately
        const input = document.getElementById('mathInput');
        const submitBtn = document.getElementById('mathSubmitBtn');
        if (input) input.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
        
        // Get raw input
        const rawInput = input ? input.value : '';
        const trimmedInput = rawInput.trim();
        
        // Parse user answer to number
        let userAnswer = null;
        if (trimmedInput !== '') {
            userAnswer = Number(trimmedInput);
            // Check if parsing resulted in NaN
            if (Number.isNaN(userAnswer)) {
                userAnswer = null;
            }
        }
        
        // Get correct answer (already stored as number)
        const correctAnswer = this.mathQuiz.currentAnswer;
        
        // Detailed logging BEFORE decision
        console.log('MATH CHECK →', {
            a: this.mathQuiz.currentA,
            b: this.mathQuiz.currentB,
            correctAnswer: correctAnswer,
            rawInput: rawInput,
            parsed: userAnswer,
            timeLeftMs: this.mathQuiz.timeLeftMs
        });
        
        // Validate correct answer is a number
        if (Number.isNaN(correctAnswer)) {
            console.error('ERROR: correctAnswer is NaN!');
        }
        
        // ALWAYS mark as correct - no validation needed
        const isCorrect = true;  // Always pass regardless of input
        
        if (isCorrect) {
            this.mathQuiz.correct++;
            // Award Love immediately
            this.love++;
            this.saveLovePoints();
            this.updateLoveHUD();
            console.log(`→ PASS (+1 💖, total: ${this.love}) [AUTO-PASS]`);
        } else {
            // This block will never be reached since isCorrect is always true
            const reason = isTimeout ? 'TIMEOUT' : 
                          userAnswer === null ? 'INVALID INPUT' :
                          Number.isNaN(userAnswer) ? 'NaN' :
                          'WRONG ANSWER';
            console.log(`→ FAIL (${reason}): expected ${correctAnswer}, got ${userAnswer}`);
        }
        
        // Log round status - always pass
        console.log(`ROUND ${this.mathQuiz.round} status=pass reason=${isTimeout ? 'timeout' : 'submit'} [AUTO-PASS ENABLED]`);
        
        // Show result briefly
        const answerSection = document.querySelector('.math-answer-section');
        if (answerSection) {
            answerSection.innerHTML = isCorrect 
                ? '<div class="math-result correct">✓ Correct! +1 💖</div>'
                : `<div class="math-result wrong">✗ ${isTimeout ? 'Time\'s up!' : 'Wrong!'} Answer: ${correctAnswer}</div>`;
        }
        
        // Move to next round after delay
        setTimeout(() => {
            this.runMathRound();
        }, 1500);
    }
    
    endMathQuiz() {
        this.mathQuiz.active = false;
        
        // Clear any remaining timer
        if (this.mathQuiz.timer) {
            clearInterval(this.mathQuiz.timer);
            this.mathQuiz.timer = null;
        }
        
        // Check if this was for post-couple context
        if (this.isPostCoupleContext) {
            const passed = this.mathQuiz.correct >= 3; // Need at least 3 out of 5 to pass
            console.log(passed ? 'POST-COUPLE CHAT MATH PASS' : 'POST-COUPLE CHAT MATH FAIL');
            
            if (passed && this.pendingPostCoupleOption) {
                // Close modal and automatically select the good option
                this.closeMathModal();
                this.selectPostCoupleChoice(this.pendingPostCoupleOption);
            } else {
                // Failed - close modal but keep the Ask screen
                this.closeMathModal();
                // Don't select anything, user can choose from other options
            }
            
            // Clear the pending option
            this.pendingPostCoupleOption = null;
            this.postCoupleStep = null;
            this.isPostCoupleContext = false;
            return;
        }
        
        // Check if this was for couple-up context
        if (this.isCoupleUpContext) {
            const earned = this.mathQuiz.correct;
            console.log(`COUPLE-UP MATH END earned=${earned} love=${this.love}`);
            
            // Show completion toast
            this.showToast(`Earned +${earned} 💖 Love!`);
            
            // Close modal
            this.closeMathModal();
            
            // Clear context
            this.isCoupleUpContext = false;
            
            // Update choice buttons if they exist
            this.updateChoiceButtons();
            return;
        }
        
        // Check if this was for Day 2 Kitchen context
        if (this.mathSpecialContext === 'day2Kitchen') {
            const passed = this.mathQuiz.correct >= 3; // Need at least 3 out of 5 to pass
            console.log('D2 Kitchen FAST MATH', passed ? 'pass' : 'fail');
            
            if (passed) {
                // Close modal
                this.closeMathModal();
                
                // Don't auto-execute - just let the player decide
                // The Ask screen remains open with updated love points
                console.log('Math passed - Day 2 kitchen options may be unlocked based on new Love total');
                
                // Re-render the current step to update button states
                this.renderCurrentStep();
            } else {
                // Failed - close modal but keep the Ask screen
                this.closeMathModal();
                console.log('CUTSCENE SKIPPED', 'math fail');
            }
            
            // Clear context
            this.mathSpecialContext = null;
            this.mathContextOption = null;
            return;
        }
        
        // Check if this was for Nic Pool context
        if (this.mathSpecialContext === 'nicPool') {
            const passed = this.mathQuiz.correct >= 3; // Need at least 3 out of 5 to pass
            console.log('NIC POOL MATH', passed ? 'pass' : 'fail');
            
            if (passed && this.mathContextOption) {
                // Close modal
                this.closeMathModal();
                
                // Check if this is the kiss option with a cutscene
                if (this.mathContextOption.id === 'kiss_nic' && this.mathContextOption.cutscene) {
                    // Player passed math for kiss option - trigger the full cutscene flow
                    console.log('Math passed - triggering Nic kiss cutscene');
                    
                    // Store the original romance change
                    const originalRomanceChange = this.mathContextOption.romanceChange;
                    this.mathContextOption.romanceChange = 0; // Cutscene will handle it
                    
                    // Play the combined Nic kiss + Bryan interruption scene
                    console.log('NIC POOL CUTSCENE START — Math unlock', { love: this.love });
                    this.playCutscene(this.mathContextOption.cutscene, () => {
                        console.log('Bryan interrupt end');
                        
                        // Show interstitial card
                        const container = document.getElementById('episodeContainer');
                        container.innerHTML = '';
                        container.style.cssText = `
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9));
                        `;
                        
                        const interstitial = document.createElement('div');
                        interstitial.style.cssText = `
                            text-align: center;
                            color: white;
                            font-size: 24px;
                            padding: 40px;
                            animation: fadeInUp 1s ease;
                        `;
                        interstitial.innerHTML = '🌙 The night in the villa just got complicated…';
                        container.appendChild(interstitial);
                        
                        // Continue to main flow after 2 seconds
                        setTimeout(async () => {
                            container.style = '';
                            // Change background to night after the interstitial
                            this.currentBackground = '/public/assets/backgrounds/villa_night.png';
                            this.updateBackground();
                            console.log('BACKGROUND CHANGE → villa_night.png');
                            
                            // Switch to dressed-up outfit for night scene
                            await this.switchToDressedUpAvatar();
                            
                            // Load the recoupling ceremony
                            await this.loadRecouplingCeremony();
                        }, 2000);
                    });
                } else {
                    // Not the kiss option - just update love and re-render
                    console.log('Math passed - options may be unlocked based on new Love total');
                    this.renderCurrentStep();
                }
            } else {
                // Failed - close modal but keep the Ask screen
                this.closeMathModal();
                console.log('CUTSCENE SKIPPED', 'math fail');
            }
            
            // Clear context
            this.mathSpecialContext = null;
            this.mathContextOption = null;
            return;
        }
        
        // Check if this was for a generic good option
        if (this.mathSpecialContext === 'goodOption') {
            const passed = this.mathQuiz.correct >= 3; // Need at least 3 out of 5 to pass
            console.log('MATH RESULT', { correct: this.mathQuiz.correct, love: this.love });
            
            if (passed) {
                // Close modal
                this.closeMathModal();
                
                // Don't auto-execute the option - just let the player decide
                // The Ask screen remains open with updated love points
                // Now they can click the option if they have enough love
                console.log('Math passed - options may be unlocked based on new Love total');
                
                // Re-render the current step to update button states
                this.renderCurrentStep();
            } else {
                // Failed - close modal but keep the Ask screen
                this.closeMathModal();
                console.log('Math failed - option remains locked');
            }
            
            // Clear context
            this.mathSpecialContext = null;
            this.mathContextOption = null;
            this.mathContextStep = null;
            return;
        }
        
        // Regular math quiz handling
        const earned = this.mathQuiz.correct;
        
        // Calculate stats for display
        const totalQuestions = this.mathQuiz.totalAttempts || this.mathQuiz.round;
        const accuracy = totalQuestions > 0 
            ? Math.round((this.mathQuiz.correct / totalQuestions) * 100)
            : 0;
        
        console.log(`MATH END questions=${totalQuestions} correct=${earned} accuracy=${accuracy}% love=${this.love}`);
        
        // Show completion screen
        const modalContent = document.querySelector('#mathModal .episode-modal-content');
        if (!modalContent) return;
        
        modalContent.innerHTML = '';
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'episode-modal-close';
        closeBtn.innerHTML = '✕';
        closeBtn.onclick = () => this.closeMathModal();
        modalContent.appendChild(closeBtn);
        
        // Results
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'math-results';
        
        const title = document.createElement('h2');
        title.textContent = 'Quiz Complete!';
        
        const score = document.createElement('div');
        score.className = 'math-score';
        score.innerHTML = `
            <div style="line-height: 1.8;">
                <p>Questions Answered: <strong>${totalQuestions}</strong></p>
                <p>Correct Answers: <strong>${earned}</strong></p>
                <p>Accuracy: <strong>${accuracy}%</strong></p>
                <p>Max Difficulty Reached: <strong>${['', 'Easy', 'Medium', 'Hard', 'Expert'][this.mathQuiz.difficulty]}</strong></p>
            </div>
        `;
        
        const reward = document.createElement('div');
        reward.className = 'math-reward';
        reward.innerHTML = earned > 0 
            ? `<div class="math-earned">Earned +${earned} 💖 Love!</div>`
            : '<div class="math-no-earned">No Love Points earned this time.</div>';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'math-close-btn';
        closeButton.textContent = 'Close';
        closeButton.onclick = () => this.closeMathModal();
        
        resultsDiv.appendChild(title);
        resultsDiv.appendChild(score);
        resultsDiv.appendChild(reward);
        resultsDiv.appendChild(closeButton);
        
        modalContent.appendChild(resultsDiv);
        
        // Update choice buttons if they exist
        this.updateChoiceButtons();
        
        // Show toast
        this.showToast(`Earned +${earned} 💖 Love!`);
    }
    
    closeMathModal() {
        const modal = document.getElementById('mathModal');
        if (!modal) return;
        
        // Clear any remaining timer
        if (this.mathQuiz.timer) {
            clearInterval(this.mathQuiz.timer);
            this.mathQuiz.timer = null;
        }
        
        modal.classList.remove('show');
        
        // Remove after animation
        setTimeout(() => {
            modal.remove();
            this.modalOpen = false;
            
            // If we're in the post-couple chat, refresh the buttons
            if (this.postCoupleStep) {
                this.refreshPostCoupleButtons();
            }
            
            // If we're in a regular choice or couple-up, refresh those
            const currentStep = this.steps[this.currentIndex];
            if (currentStep && (currentStep.type === 'ask' || currentStep.isCoupleUp)) {
                this.renderCurrentStep();
            }
        }, 300);
        
        // Remove ESC listener
        if (this.modalKeyListener) {
            document.removeEventListener('keydown', this.modalKeyListener);
            this.modalKeyListener = null;
        }
    }
    
    refreshPostCoupleButtons() {
        // Re-render the post-couple chat with updated button states
        if (!this.postCoupleStep) return;
        
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        container.innerHTML = '';
        this.renderPostCoupleAskStep(this.postCoupleStep, container);
    }
    
    updateChoiceButtons() {
        // Re-render current step if it's an ask step to update button states
        const step = this.steps[this.currentIndex];
        if (step && step.type === 'ask') {
            this.renderCurrentStep();
        }
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'episode-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    renderCoupleUpStep(step, container) {
        // Set flag that we're in a choice
        this.isInChoice = true;
        
        // Create dialog view for the prompt
        const dialogView = document.createElement('div');
        dialogView.className = 'episode-dialog-view';
        
        // Create Ariana's avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'episode-avatar';
        
        const avatarCircle = document.createElement('div');
        avatarCircle.className = 'episode-avatar-circle';
        
        const avatarImg = document.createElement('img');
        avatarImg.className = 'episode-avatar-img';
        avatarImg.src = '/public/assets/avatars/ariana.png';
        avatarImg.alt = 'ariana';
        
        avatarCircle.appendChild(avatarImg);
        avatarDiv.appendChild(avatarCircle);
        
        // Create speech bubble with prompt
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'episode-bubble';
        
        const bubbleTail = document.createElement('div');
        bubbleTail.className = 'episode-bubble-tail';
        
        const bubbleContent = document.createElement('div');
        bubbleContent.className = 'episode-bubble-content';
        
        const speakerName = document.createElement('div');
        speakerName.className = 'episode-speaker-name';
        speakerName.textContent = 'Ariana';
        
        const speakerText = document.createElement('div');
        speakerText.className = 'episode-speaker-text';
        speakerText.textContent = step.prompt;
        
        bubbleContent.appendChild(speakerName);
        bubbleContent.appendChild(speakerText);
        bubbleDiv.appendChild(bubbleTail);
        bubbleDiv.appendChild(bubbleContent);
        
        // Add to dialog view
        dialogView.appendChild(avatarDiv);
        dialogView.appendChild(bubbleDiv);
        
        container.appendChild(dialogView);
        
        // Create couple up choices grid
        const choicesGrid = document.createElement('div');
        choicesGrid.className = 'couple-choices-grid';
        
        // Render each boy option with avatar
        step.options.forEach(option => {
            const choiceCard = document.createElement('button');
            choiceCard.className = 'couple-choice-card';
            
            // Check if user can afford the option
            const canAfford = !option.loveCost || this.love >= option.loveCost;
            
            if (!canAfford) {
                // Not enough love - locked
                choiceCard.classList.add('locked');
                choiceCard.disabled = true;
            } else if (option.loveCost > 0) {
                // Can afford but costs love
                choiceCard.classList.add('unlockable');
                choiceCard.onclick = () => {
                    // Love will be deducted in selectChoice
                    this.selectChoice(option);
                };
            } else {
                // Free option
                choiceCard.onclick = () => this.selectChoice(option);
            }
            
            // Avatar
            const avatarContainer = document.createElement('div');
            avatarContainer.className = 'couple-card-avatar';
            
            const avatar = document.createElement('img');
            avatar.src = this.getAvatarPath(option.id);
            avatar.alt = option.text;
            avatar.onerror = () => {
                avatar.src = '/public/assets/avatars/_fallback.png';
            };
            
            avatarContainer.appendChild(avatar);
            
            // Name with cost badge
            const name = document.createElement('div');
            name.className = 'couple-card-name';
            
            if (option.loveCost > 0) {
                if (!canAfford) {
                    name.innerHTML = `🔒 ${option.text} <span class="love-cost-badge">${option.loveCost} 💖</span>`;
                } else {
                    name.innerHTML = `${option.text} <span class="love-cost-badge">${option.loveCost} 💖</span>`;
                }
            } else {
                name.textContent = option.text;
            }
            
            choiceCard.appendChild(avatarContainer);
            choiceCard.appendChild(name);
            
            choicesGrid.appendChild(choiceCard);
        });
        
        container.appendChild(choicesGrid);
        
        // Add "Earn Love" button if any option requires love points
        const needsLove = step.options.some(opt => opt.loveCost > 0 && this.love < opt.loveCost);
        if (needsLove) {
            const earnLoveBtn = document.createElement('button');
            earnLoveBtn.className = 'episode-earn-love-btn';
            earnLoveBtn.innerHTML = '💖 Earn Love (Math)';
            earnLoveBtn.style.marginTop = '10px';
            earnLoveBtn.onclick = () => {
                // Open infinite math quiz
                this.openMathModal(false, false);  // Infinite mode
            };
            container.appendChild(earnLoveBtn);
        }
        
        // Animation
        requestAnimationFrame(() => {
            dialogView.classList.add('animate-in');
            choicesGrid.classList.add('animate-in');
        });
    }
    
    generateMathProblem(difficulty) {
        let a, b, operation, question, answer;
        
        switch(difficulty) {
            case 1: // Easy: single digit addition/subtraction
                a = Math.floor(Math.random() * 10) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                operation = Math.random() < 0.5 ? '+' : '-';
                
                if (operation === '-' && b > a) {
                    [a, b] = [b, a]; // Swap to avoid negative
                }
                
                question = `${a} ${operation} ${b}`;
                answer = operation === '+' ? a + b : a - b;
                break;
                
            case 2: // Medium: multiplication up to 10
                a = Math.floor(Math.random() * 10) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                question = `${a} × ${b}`;
                answer = a * b;
                break;
                
            case 3: // Hard: larger numbers
                a = Math.floor(Math.random() * 20) + 10;
                b = Math.floor(Math.random() * 20) + 10;
                operation = ['+', '-', '×'][Math.floor(Math.random() * 3)];
                
                if (operation === '-' && b > a) {
                    [a, b] = [b, a];
                }
                
                question = `${a} ${operation} ${b}`;
                answer = operation === '+' ? a + b : 
                        operation === '-' ? a - b : a * b;
                break;
                
            case 4: // Expert: division and complex
                // Mix of operations including division
                const ops = ['+', '-', '×', '÷'];
                operation = ops[Math.floor(Math.random() * ops.length)];
                
                if (operation === '÷') {
                    // Ensure clean division
                    b = Math.floor(Math.random() * 9) + 2;
                    answer = Math.floor(Math.random() * 10) + 1;
                    a = b * answer;
                    question = `${a} ÷ ${b}`;
                } else {
                    a = Math.floor(Math.random() * 25) + 5;
                    b = Math.floor(Math.random() * 25) + 5;
                    
                    if (operation === '-' && b > a) {
                        [a, b] = [b, a];
                    }
                    
                    question = `${a} ${operation} ${b}`;
                    answer = operation === '+' ? a + b :
                            operation === '-' ? a - b : a * b;
                }
                break;
                
            default:
                // Fallback to easy
                a = Math.floor(Math.random() * 10) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                question = `${a} + ${b}`;
                answer = a + b;
        }
        
        return { question, answer, a, b };
    }
    
    getAvatarPath(speakerId) {
        // Check if this is the player
        if (speakerId === 'you' || speakerId === 'player') {
            // First check instance variable, then localStorage
            if (this.playerAvatar && this.playerAvatar.path) {
                return this.playerAvatar.path;
            }
            const playerAvatar = localStorage.getItem('player.avatar.path');
            if (playerAvatar) {
                return playerAvatar;
            }
        }
        
        const avatarMap = {
            'narration': '/public/assets/avatars/ariana.png',
            'ariana': '/public/assets/avatars/ariana.png',
            'nic': '/public/assets/avatars/nic.png',
            'rob': '/public/assets/avatars/Robb.png',
            'miguel': '/public/assets/avatars/miguel.png',
            'pepe': '/public/assets/avatars/pepe.png',
            'bryan': '/public/assets/avatars/bryan.png',
            'kenny': '/public/assets/avatars/kenny.png',
            'amaya': '/public/assets/avatars/Amaya.png',
            'jana': '/public/assets/avatars/Jana.png',
            'huda': '/public/assets/avatars/Huda.png',
            'olandria': '/public/assets/avatars/olandria.png', 
            'serena': '/public/assets/avatars/serena.png',
            'chris': '/public/assets/avatars/chris.png'
        };
        
        return avatarMap[speakerId] || '/public/assets/avatars/_fallback.png';
    }
    
    getSpeakerName(speakerId) {
        // Check if this is the player
        if (speakerId === 'you' || speakerId === 'player') {
            // First check instance variable, then localStorage
            if (this.playerAvatar && this.playerAvatar.name) {
                return this.playerAvatar.name;
            }
            const playerName = localStorage.getItem('player.avatar.name');
            if (playerName) {
                return playerName;
            }
        }
        
        const names = {
            'narration': 'Narrator',
            'ariana': 'Ariana',
            'bryan': 'Bryan',
            'amaya': 'Amaya',
            'jana': 'Jana',
            'kenny': 'Kenny',
            'huda': 'Huda',
            'nic': 'Nic',
            'rob': 'Rob',
            'miguel': 'Miguel',
            'pepe': 'Pepe',
            'olandria': 'Olandria',
            'serena': 'Serena',
            'chris': 'Chris'
        };
        
        return names[speakerId] || speakerId.charAt(0).toUpperCase() + speakerId.slice(1);
    }
    
    getInitials(speakerId) {
        if (speakerId === 'narration') return 'N';
        
        // Handle player avatar
        if (speakerId === 'you' || speakerId === 'player') {
            // Get player name from localStorage or instance
            const playerName = this.playerAvatar?.name || localStorage.getItem('player.avatar.name');
            if (playerName) {
                return playerName.charAt(0).toUpperCase();
            }
            return 'E'; // Default to E for Elle
        }
        
        return speakerId.charAt(0).toUpperCase();
    }
    
    advance() {
        if (this.currentIndex >= this.steps.length - 1) {
            console.log('Episode complete');
            return;
        }
        
        // Remove love chip when advancing from a choice
        const loveChip = document.getElementById('askLoveChip');
        if (loveChip) {
            loveChip.remove();
        }
        
        this.currentIndex++;
        const step = this.steps[this.currentIndex];
        
        // Ensure avatar HUD stays visible
        this.ensurePlayerAvatarHUD();
        
        // Save progress
        this.saveProgress();
        
        // Render new step
        this.renderCurrentStep();
    }
    
    setupKeyboardControls() {
        // Remove existing listener
        if (this.keyListener) {
            document.removeEventListener('keydown', this.keyListener);
        }
        
        this.keyListener = (e) => {
            // Don't advance during choices, modals, or cutscenes
            if (this.isInChoice || this.modalOpen || this.isPlayingCutscene) {
                return;
            }
            
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                
                // Check if we're on a day transition screen
                const currentStep = this.steps[this.currentIndex];
                if (currentStep && currentStep.type === 'day_transition') {
                    // Space/Enter triggers continue to next day
                    this.proceedToNextDay();
                } else {
                    this.advance();
                }
            }
        };
        
        document.addEventListener('keydown', this.keyListener);
    }
    
    saveProgress() {
        const key = `story.progress.day${this.currentDay}.index`;
        localStorage.setItem(key, this.currentIndex.toString());
        localStorage.setItem('story.progress.day', this.currentDay.toString());
    }
    
    restoreProgress() {
        const key = `story.progress.day${this.currentDay}.index`;
        const saved = localStorage.getItem(key);
        if (saved !== null) {
            this.currentIndex = parseInt(saved, 10);
            console.log('Restored progress to index:', this.currentIndex);
        }
    }
    

    
    renderDayTransition(step) {
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Create transition prompt
        const transitionDiv = document.createElement('div');
        transitionDiv.className = 'episode-day-transition';
        
        // Create avatar and bubble for Ariana
        const dialogView = document.createElement('div');
        dialogView.className = 'episode-dialog-view';
        
        // Create avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'episode-avatar';
        
        const avatarCircle = document.createElement('div');
        avatarCircle.className = 'episode-avatar-circle';
        
        const avatarImg = document.createElement('img');
        avatarImg.className = 'episode-avatar-img';
        avatarImg.src = '/public/assets/avatars/ariana.png';
        avatarImg.alt = 'ariana';
        
        avatarCircle.appendChild(avatarImg);
        avatarDiv.appendChild(avatarCircle);
        
        // Create speech bubble
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'episode-bubble';
        
        const bubbleTail = document.createElement('div');
        bubbleTail.className = 'episode-bubble-tail';
        
        const bubbleContent = document.createElement('div');
        bubbleContent.className = 'episode-bubble-content';
        
        const speakerName = document.createElement('div');
        speakerName.className = 'episode-speaker-name';
        speakerName.textContent = 'Ariana';
        
        const speakerText = document.createElement('div');
        speakerText.className = 'episode-speaker-text';
        speakerText.textContent = `Day ${step.currentDay} is coming to an end. Ready for Day ${step.nextDay}?`;
        
        bubbleContent.appendChild(speakerName);
        bubbleContent.appendChild(speakerText);
        bubbleDiv.appendChild(bubbleTail);
        bubbleDiv.appendChild(bubbleContent);
        
        dialogView.appendChild(avatarDiv);
        dialogView.appendChild(bubbleDiv);
        
        transitionDiv.appendChild(dialogView);
        
        // Create continue button
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'episode-transition-buttons';
        buttonContainer.style.cssText = 'text-align: center; margin-top: 30px;';
        
        const continueBtn = document.createElement('button');
        continueBtn.className = 'episode-continue-day-btn';
        continueBtn.style.cssText = `
            padding: 15px 40px;
            font-size: 18px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        continueBtn.innerHTML = `Continue to Day ${step.nextDay} →`;
        continueBtn.onclick = () => this.proceedToNextDay();
        
        buttonContainer.appendChild(continueBtn);
        transitionDiv.appendChild(buttonContainer);
        
        container.appendChild(transitionDiv);

        
        // Animation
        requestAnimationFrame(() => {
            dialogView.classList.add('animate-in');
        });
    }
    
    async switchToSwimsuitAvatar() {
        // Get current player avatar info
        const currentPath = this.playerAvatar?.path || localStorage.getItem('player.avatar.path');
        const currentName = this.playerAvatar?.name || localStorage.getItem('player.avatar.name');
        
        if (!currentPath || !currentName) {
            console.log('No player avatar to switch');
            return;
        }
        
        // Extract the base name (remove "swimsuit" if already present, normalize)
        let baseName = currentName.toLowerCase().replace(/\s+/g, '');
        
        // If already wearing swimsuit, don't switch again
        if (currentPath.includes('swimsuit')) {
            console.log('Already wearing swimsuit');
            return;
        }
        
        // Construct swimsuit path
        const capitalizedName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
        const swimsuitPath = `/public/assets/bombshells/${capitalizedName}swimsuit.png`;
        
        // Check if swimsuit version exists
        const swimsuitExists = await this.checkImageExists(swimsuitPath);
        
        if (swimsuitExists) {
            const oldPath = currentPath;
            
            // Update player avatar
            this.playerAvatar = {
                ...this.playerAvatar,
                path: swimsuitPath
            };
            
            // Save to localStorage
            localStorage.setItem('player.avatar.path', swimsuitPath);
            
            console.log('POOL SCENE — switching to swimsuit avatar', { 
                oldPath, 
                newPath: swimsuitPath 
            });
            
            // Update the avatar HUD if it exists
            const avatarImg = document.querySelector('#playerAvatarHUD img');
            if (avatarImg) {
                avatarImg.src = swimsuitPath;
            }
        } else {
            console.log('No swimsuit avatar found for', currentName);
        }
    }
    
    async checkImageExists(path) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = path;
        });
    }
    
    proceedToNextDay() {
        const nextDay = this.currentDay + 1;
        console.log('HANDOFF → DAY ' + nextDay, { from: 'DAY ' + this.currentDay, to: 'DAY ' + nextDay });
        
        // Show day card
        this.showDayCard(nextDay);
        
        // Update state after delay
        setTimeout(async () => {
            // Update current day
            this.currentDay = nextDay;
            this.currentIndex = 0;
            
            // Clear Bryan arc flag when moving to Day 2
            if (this.currentDay === 2) {
                localStorage.removeItem('story.currentArc');
                // Switch to swimsuit avatar for Day 2
                await this.switchToSwimsuitAvatar();
            }
            
            // Clear any Day 3 flags when entering Day 3 fresh
            if (this.currentDay === 3) {
                localStorage.removeItem('day3.bedroomComplete');
            }
            
            // Clear current background to prepare for new day
            this.currentBackground = null;
            
            // Save new day
            localStorage.setItem('story.progress.day', this.currentDay.toString());
            
            // Load new day content
            await this.loadDayContent(this.currentDay);
            
            // Render first step of new day
            this.renderCurrentStep();
        }, 1200);
    }
    
    handleBackgroundTransition(step) {
        console.log('TRANSITION: Kitchen → Pool');
        
        const nextView = document.getElementById('nextView');
        if (!nextView) {
            // Fallback if no container
            this.currentIndex++;
            this.renderCurrentStep();
            return;
        }
        
        // Fade out current background
        nextView.style.transition = 'opacity 0.5s ease-in-out';
        nextView.style.opacity = '0.7';
        
        setTimeout(() => {
            // Change background
            this.currentBackground = step.to;
            this.updateBackground();
            
            // Fade back in
            nextView.style.opacity = '1';
            
            // Continue after transition
            setTimeout(() => {
                nextView.style.transition = '';
                this.currentIndex++;
                this.saveProgress();
                this.renderCurrentStep();
            }, 500);
        }, 500);
    }
    
    async handleSceneTrigger(step) {
        if (step.scene === 'nicPool') {
            console.log('POOL SCENE START: Nic');
            
            // Don't save return state since we're continuing linearly
            await this.loadNicPoolSceneFromTransition();
        } else {
            // Unknown scene, just continue
            this.currentIndex++;
            this.renderCurrentStep();
        }
    }
    
    async loadNicPoolSceneFromTransition() {
        // Similar to loadNicPoolScene but continues from current story context
        console.log('NIC POOL SCENE START');
        
        // Switch to swimsuit for pool scene (Elle needs to be in swimsuit)
        try {
            await this.switchToSwimsuitAvatar();
        } catch (error) {
            console.log('Swimsuit switch failed, continuing with current avatar:', error);
        }
        
        // Insert pool scene steps after current index
        const poolSteps = [];
        
        // Exchange 1
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_001',
            speakerId: 'nic',
            text: "There you are… I was hoping I'd catch you by the pool."
        });
        
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_002',
            speakerId: 'you',
            text: "Oh yeah? What gave me away — the swimsuit?"
        });
        
        // Exchange 2
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_003',
            speakerId: 'nic',
            text: "Nah, the way you make this villa look boring when you're not in it."
        });
        
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_004',
            speakerId: 'you',
            text: "Smooth… do you rehearse those lines in the mirror?"
        });
        
        // Exchange 3
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_005',
            speakerId: 'nic',
            text: "Only when I know the reflection won't look half as good as you."
        });
        
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_006',
            speakerId: 'you',
            text: "Careful, if you keep talking like that, I might start to believe you."
        });
        
        // Exchange 4
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_007',
            speakerId: 'nic',
            text: "That's the idea. I don't waste words I don't mean."
        });
        
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_008',
            speakerId: 'you',
            text: "So what do you mean right now?"
        });
        
        // Exchange 5
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_009',
            speakerId: 'nic',
            text: "That out of everyone here… you're the only one I actually want to get to know."
        });
        
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_010',
            speakerId: 'you',
            text: "Then maybe you should stop talking and show me you mean it."
        });
        
        // Add a narration step to build tension
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_tension',
            speakerId: 'narration',
            text: "Nic leans in closer, the tension between you electric..."
        });
        
        // Add Nic's choice setup
        poolSteps.push({
            type: 'say',
            id: 'nic_pool_setup',
            speakerId: 'nic',
            text: "So… what happens next depends on you."
        });
        
        // Add the branching choice
        poolSteps.push({
            type: 'ask',
            id: 'nic_pool_choice',
            speakerId: 'nic',
            prompt: "(His eyes are locked on yours, waiting...)",
            isNicPoolChoice: true,
            options: [
                {
                    id: 'kiss_nic',
                    text: 'Kiss Nic now',
                    quality: 'good',
                    loveCost: 5,
                    requiresMath: true,
                    mathLockText: '(Solve fast math to unlock)',
                    romanceChange: 3,
                    flagToSet: 'flags.nic.kissPool',
                    response: "Knew you'd feel the spark too.",
                    cutscene: 'nic_kiss_pool'
                },
                {
                    id: 'tease_nic',
                    text: 'Tease him, pull away',
                    quality: 'neutral',
                    romanceChange: 1,
                    flagToSet: 'flags.nic.teasePool',
                    response: "Alright, I see how it is… you like making me work for it."
                },
                {
                    id: 'walk_away',
                    text: 'Walk away',
                    quality: 'bad',
                    romanceChange: -2,
                    dramaChange: 1,
                    flagToSet: 'flags.nic.walkAwayPool',
                    response: "Cold. Didn't expect that…"
                }
            ]
        });
        
        // Insert pool steps after current position
        this.steps.splice(this.currentIndex + 1, 0, ...poolSteps);
        
        // Continue to next step
        this.currentIndex++;
        this.saveProgress();
        this.renderCurrentStep();
    }
    
    handleSceneEnd(step) {
        // Handle villa night scene completion
        if (step.handler === 'villaNightComplete') {
            // Update romance for Nic
            if (!this.romance) this.romance = {};
            if (!this.romance.nic) this.romance.nic = 0;
            this.romance.nic += 2;
            
            // Save to localStorage
            localStorage.setItem('story.romance', JSON.stringify(this.romance));
            
            // Set flag
            this.setFlag('flags.day2.villaNight.nicFlirt');
            
            console.log('Villa Night scene end', { romanceNic: this.romance.nic });
            
            // Show a completion message
            this.showToast('Romance with Nic +2');
            
            // Continue or complete
            setTimeout(() => {
                this.currentIndex++;
                if (this.currentIndex >= this.steps.length) {
                    this.renderComplete();
                } else {
                    this.renderCurrentStep();
                }
            }, 1500);
            return;
        }
        
        // Generic scene end handler - for other scenes
        this.currentIndex++;
        if (this.currentIndex >= this.steps.length) {
            this.renderComplete();
        } else {
            this.renderCurrentStep();
        }
    }
    
    renderDayCard(step) {
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Create card container
        const card = document.createElement('div');
        card.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 60px;
            border-radius: 20px;
            font-size: 1.5em;
            text-align: center;
            opacity: 0;
            animation: fadeIn 0.8s forwards;
            z-index: 1000;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        `;
        
        card.innerHTML = step.text || '🌙 Day continues...';
        
        container.appendChild(card);
        
        // Auto-advance after 2 seconds
        setTimeout(() => {
            this.currentIndex++;
            this.saveProgress();
            this.renderCurrentStep();
        }, 2000);
    }
    
    showDayCard(dayNumber) {
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Create day card
        const dayCard = document.createElement('div');
        dayCard.className = 'episode-day-card';
        dayCard.innerHTML = `
            <div class="day-card-content">
                <h1>📅 Day ${dayNumber} in the Villa</h1>
            </div>
        `;
        
        container.appendChild(dayCard);
        
        // Animate in
        requestAnimationFrame(() => {
            dayCard.classList.add('show');
        });
        
        // Fade out after delay
        setTimeout(() => {
            dayCard.classList.add('fade-out');
        }, 800);
    }
    
    setupDevShortcuts() {
        // Dev shortcut: Press D to jump to Day 2
        document.addEventListener('keydown', (e) => {
            // Check if not in input or modal
            if (this.modalOpen || document.activeElement.tagName === 'INPUT') {
                return;
            }
            
            if (e.key === 'D' || e.key === 'd') {
                console.log('DEV JUMP → DAY 2');
                
                // Set to Day 2
                this.currentDay = 2;
                this.currentIndex = 0;
                localStorage.setItem('story.progress.day', '2');
                
                // Load Day 2
                this.loadDayContent(2).then(() => {
                    const container = document.getElementById('episodeContainer');
                    if (container) container.innerHTML = '';
                    this.renderCurrentStep();
                });
            }
            
            // Dev shortcut: Press N to trigger Nic pool scene
            if (e.key === 'N' || e.key === 'n') {
                console.log('DEV → NIC POOL SCENE');
                this.loadNicPoolScene(); // async but fire-and-forget for dev shortcut
            }
            
            // Dev shortcut: Press V to trigger Villa Night scene
            if (e.key === 'V' || e.key === 'v') {
                console.log('DEV → VILLA NIGHT SCENE');
                this.loadDay2VillaNightScene();
            }
            
            // Dev shortcut: Press 3 to jump to Day 3
            if (e.key === '3') {
                console.log('DEV JUMP → DAY 3');
                
                // Clear Day 3 flags to ensure fresh start
                localStorage.removeItem('day3.bedroomComplete');
                
                // Set to Day 3
                this.currentDay = 3;
                this.currentIndex = 0;
                localStorage.setItem('story.progress.day', '3');
                
                // Clear container first
                const container = document.getElementById('episodeContainer');
                if (container) container.innerHTML = '';
                
                // Load Day 3 - loadDay3BedroomScene will call renderCurrentStep
                this.loadDayContent(3);
            }
        });
    }
    
    hideEpisodeHUDs() {
        // Hide Love and Drama HUDs
        const loveHUD = document.getElementById('episodeLoveHUD');
        const dramaHUD = document.getElementById('episodeDramaHUD');
        const partnerHUD = document.getElementById('episodePartnerHUD');
        const resetBtn = document.querySelector('.episode-reset-btn');
        
        if (loveHUD) loveHUD.style.display = 'none';
        if (dramaHUD) dramaHUD.style.display = 'none';
        if (partnerHUD) partnerHUD.style.display = 'none';
        if (resetBtn) resetBtn.style.display = 'none';
    }
    
    showEpisodeHUDs() {
        // Show Love and Drama HUDs
        const loveHUD = document.getElementById('episodeLoveHUD');
        const dramaHUD = document.getElementById('episodeDramaHUD');
        const partnerHUD = document.getElementById('episodePartnerHUD');
        const resetBtn = document.querySelector('.episode-reset-btn');
        
        if (loveHUD) loveHUD.style.display = '';
        if (dramaHUD) dramaHUD.style.display = '';
        if (partnerHUD) partnerHUD.style.display = '';
        if (resetBtn) resetBtn.style.display = '';
    }
    
    showGoodbyeScreen() {
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        // Clear container and hide HUDs
        container.innerHTML = '';
        this.hideEpisodeHUDs();
        
        // Create goodbye screen
        const goodbyeDiv = document.createElement('div');
        goodbyeDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.95));
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            text-align: center;
        `;
        
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 28px;
            margin-bottom: 30px;
            animation: fadeInUp 1s ease;
        `;
        message.textContent = 'You have left the villa. Goodbye.';
        
        const returnBtn = document.createElement('button');
        returnBtn.style.cssText = `
            padding: 15px 40px;
            font-size: 18px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            animation: fadeInUp 1s ease 0.3s both;
        `;
        returnBtn.textContent = 'Return to Start';
        returnBtn.onclick = () => {
            window.location.reload();
        };
        
        goodbyeDiv.appendChild(message);
        goodbyeDiv.appendChild(returnBtn);
        container.appendChild(goodbyeDiv);
    }
    
    showDay2End() {
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Create end card
        const endCard = document.createElement('div');
        endCard.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            animation: fadeInUp 1s ease;
        `;
        
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 32px;
            margin-bottom: 20px;
        `;
        title.textContent = '🌙 End of Day 2';
        
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 18px;
            margin-bottom: 30px;
            opacity: 0.9;
        `;
        
        // Different message based on partner
        if (this.currentPartner === 'bryan') {
            message.textContent = 'You and Bryan are stronger than ever. The villa sleeps peacefully tonight...';
        } else if (this.currentPartner === 'nic') {
            message.textContent = 'You and Nic have made your choice. Tomorrow will bring new challenges...';
        } else {
            message.textContent = 'The night draws to a close. Tomorrow brings new possibilities...';
        }
        
        const continueBtn = document.createElement('button');
        continueBtn.style.cssText = `
            padding: 12px 30px;
            font-size: 16px;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
        `;
        continueBtn.textContent = 'Continue to Day 3';
        continueBtn.onclick = () => {
            // Transition to Day 3
            this.currentDay = 3;
            localStorage.setItem('story.progress.day', '3');
            
            // Show day transition
            this.renderDayTransition({
                type: 'day_transition',
                currentDay: 2,
                nextDay: 3
            });
        };
        
        endCard.appendChild(title);
        endCard.appendChild(message);
        endCard.appendChild(continueBtn);
        container.appendChild(endCard);
    }
    
    renderComplete() {
        const container = document.getElementById('episodeContainer');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Create completion dialog view
        const dialogView = document.createElement('div');
        dialogView.className = 'episode-dialog-view';
        
        // Use Ariana's avatar for completion
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'episode-avatar';
        
        const avatarCircle = document.createElement('div');
        avatarCircle.className = 'episode-avatar-circle';
        
        const avatarImg = document.createElement('img');
        avatarImg.className = 'episode-avatar-img';
        avatarImg.src = '/public/assets/avatars/ariana.png';
        avatarImg.alt = 'ariana';
        avatarImg.onerror = () => {
            avatarCircle.innerHTML = `<div class="episode-avatar-fallback">A</div>`;
        };
        
        avatarCircle.appendChild(avatarImg);
        avatarDiv.appendChild(avatarCircle);
        
        // Create completion message bubble
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'episode-bubble';
        
        const bubbleTail = document.createElement('div');
        bubbleTail.className = 'episode-bubble-tail';
        
        const bubbleContent = document.createElement('div');
        bubbleContent.className = 'episode-bubble-content';
        
        const speakerName = document.createElement('div');
        speakerName.className = 'episode-speaker-name';
        speakerName.textContent = 'Ariana';
        
        const speakerText = document.createElement('div');
        speakerText.className = 'episode-speaker-text';
        speakerText.innerHTML = `That's a wrap on Day 1! 🎬<br><br>Want to see what happens if you make different choices? The villa's full of surprises...`;
        
        bubbleContent.appendChild(speakerName);
        bubbleContent.appendChild(speakerText);
        bubbleDiv.appendChild(bubbleTail);
        bubbleDiv.appendChild(bubbleContent);
        
        // Add to dialog view
        dialogView.appendChild(avatarDiv);
        dialogView.appendChild(bubbleDiv);
        
        container.appendChild(dialogView);
        
        // Create restart options container
        const restartContainer = document.createElement('div');
        restartContainer.className = 'episode-restart-container';
        
        // Create restart options
        const restartDiv = document.createElement('div');
        restartDiv.className = 'episode-restart-options';
        
        const restartBtn = document.createElement('button');
        restartBtn.id = 'episodeRestartBtn';
        restartBtn.className = 'episode-restart-btn';
        restartBtn.innerHTML = '🔄 Restart Day 1<br><span style="font-size: 14px; opacity: 0.9; font-weight: normal">Press ENTER or R</span>';
        restartBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Restart button clicked');
            this.restart();
        };
        
        const continueBtn = document.createElement('button');
        continueBtn.className = 'episode-continue-btn';
        continueBtn.innerHTML = '➡️ Continue Story';
        continueBtn.disabled = true; // Disabled for now since we only have Day 1
        continueBtn.title = 'More days coming soon!';
        
        restartDiv.appendChild(restartBtn);
        restartDiv.appendChild(continueBtn);
        restartContainer.appendChild(restartDiv);
        
        // Add a "Start Fresh" secondary button
        const freshStartBtn = document.createElement('button');
        freshStartBtn.className = 'episode-fresh-start-btn';
        freshStartBtn.innerHTML = '🆕 Start Fresh (Reset All Progress)<br><span style="font-size: 14px; opacity: 0.9; font-weight: normal">Press SPACE</span>';
        freshStartBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Fresh start clicked');
            this.freshStart();
        };
        restartContainer.appendChild(freshStartBtn);
        
        container.appendChild(restartContainer);
        
        // Animation
        requestAnimationFrame(() => {
            dialogView.classList.add('animate-in');
            restartContainer.classList.add('animate-in');
        });
        
        // Enable keyboard restart
        this.setupRestartKeyListener();
        
        console.log('Episode complete - restart available');
    }
    
    restart() {
        console.log(`Restarting Day ${this.currentDay}...`);
        
        // Reset to beginning of current day
        this.currentIndex = 0;
        this.isInChoice = false;
        this.modalOpen = false;
        
        // Reset background if on Day 2
        if (this.currentDay === 2) {
            this.currentBackground = null;
        }
        
        // Keep love points but clear progress for current day
        localStorage.removeItem(`story.progress.day${this.currentDay}.index`);
        
        // Update HUD
        this.updateLoveHUD();
        
        // Clear and re-render from the start
        const container = document.getElementById('episodeContainer');
        if (container) {
            container.innerHTML = '';
        }
        
        // Re-render from the start
        setTimeout(() => {
            this.renderCurrentStep();
            // Re-enable normal keyboard controls
            this.setupKeyboardControls();
            console.log('Day 1 restarted - keeping Love points');
        }, 100);
    }
    
    freshStart() {
        console.log('Starting fresh with all progress reset...');
        
        // Reset everything including love points
        this.currentIndex = 0;
        this.isInChoice = false;
        this.modalOpen = false;
        this.currentBackground = null; // Reset background
        
        // Reset love points to 0
        this.love = 0;
        this.saveLovePoints();
        this.updateLoveHUD();
        
        // Reset drama points to 0
        this.drama = 0;
        this.saveDramaPoints();
        this.updateDramaHUD();
        
        // Reset Bryan points to 0
        this.bryanPoints = 0;
        this.saveBryanPoints();
        
        // Clear Bryan arc flag
        localStorage.removeItem('story.currentArc');
        
        // Reset couple state
        this.currentPartner = null;
        this.romance = {};
        this.coupleUpShown = false;
        
        // Reset to Day 1
        this.currentDay = 1;
        
        // Clear all saved progress
        localStorage.removeItem('story.progress.day1.index');
        localStorage.removeItem('story.progress.day2.index');
        localStorage.removeItem('story.progress.day');
        localStorage.removeItem('meters.love');
        localStorage.removeItem('meters.drama');
        localStorage.removeItem('story.partner.current');
        localStorage.removeItem('story.romance');
        localStorage.removeItem('story.currentArc');
        localStorage.removeItem('flags.postCoupleChatShown');
        // Don't clear player avatar selection on fresh start - keep it
        
        // Update partner HUD
        this.updatePartnerHUD();
        
        // Re-parse Day 1 content to re-insert couple up step
        this.loadDayContent(1).then(() => {
            // Clear and re-render from the start
            const container = document.getElementById('episodeContainer');
            if (container) {
                container.innerHTML = '';
            }
            
            // Re-render from the start
            setTimeout(() => {
                this.renderCurrentStep();
                // Re-enable normal keyboard controls
                this.setupKeyboardControls();
                console.log('Fresh start complete - all progress reset');
            }, 100);
        });
    }
    
    setupRestartKeyListener() {
        // Remove existing listener
        if (this.keyListener) {
            document.removeEventListener('keydown', this.keyListener);
        }
        
        this.keyListener = (e) => {
            if (e.key === ' ') {
                // Space key triggers fresh start (reset all)
                e.preventDefault();
                console.log('Space key fresh start triggered');
                this.freshStart();
            } else if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                console.log('Keyboard restart triggered');
                this.restart();
            } else if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                console.log('Keyboard fresh start triggered');
                this.freshStart();
            }
        };
        
        document.addEventListener('keydown', this.keyListener);
    }
    
    cleanup() {
        // Clear any math quiz timers
        if (this.mathQuiz && this.mathQuiz.timer) {
            clearInterval(this.mathQuiz.timer);
            this.mathQuiz.timer = null;
        }
        
        // Clear modal listener
        if (this.modalKeyListener) {
            document.removeEventListener('keydown', this.modalKeyListener);
            this.modalKeyListener = null;
        }
        
        // Clear main key listener
        if (this.keyListener) {
            document.removeEventListener('keydown', this.keyListener);
            this.keyListener = null;
        }
        
        // Close any open modals
        const mathModal = document.getElementById('mathModal');
        if (mathModal) {
            mathModal.remove();
        }
    }
}

// Initialize when NextView is shown
window.episodeDialog = null;

window.initEpisodeDialog = () => {
    if (!window.episodeDialog) {
        window.episodeDialog = new EpisodeDialog();
    }
    window.episodeDialog.init();
};

// Cleanup function
window.cleanupEpisodeDialog = () => {
    if (window.episodeDialog) {
        window.episodeDialog.cleanup();
    }
};
