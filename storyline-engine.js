class StorylineEngine {
    constructor() {
        this.gameState = {
            // Core progression
            currentDay: 1,
            currentScene: 0,
            turnCount: 0,
            
            // Romance meters (per boy)
            romance: {
                nic: 0,
                rob: 0, 
                miguel: 0,
                pepe: 0,
                bryan: 0,
                rory: 0,
                kai: 0,
                kenny: 0  // Generally stays 0 unless player makes bad choices
            },
            
            // Global drama meter
            drama: 0,
            
            // Story flags
            chosenLI: null,  // Love Interest player is pursuing
            mathGatesPassed: 0,
            mathGatesFailed: 0,
            
            // Current dialogue state
            currentDialogue: null,
            waitingForMathGate: false,
            waitingForChoice: false
        };
        
        this.storyData = this.initializeStoryData();
        this.loadGameState();
        this.setupEventListeners();
    }
    
    initializeStoryData() {
        return {
            day1: {
                scenes: [
                    {
                        id: 'day1_opening',
                        type: 'narration',
                        speaker: 'ariana',
                        text: "Welcome to the villa, babe! The sun is shining, the pool is glistening, and drama is already brewing. Let's see who you'll meet first…",
                        scene: 'day'
                    },
                    {
                        id: 'day1_meet_boys',
                        type: 'dialogue_sequence',
                        characters: [
                            {
                                speaker: 'nic',
                                text: "Oi, you alright? I'm Nic — bit cheeky, bit charming. People say I can talk my way out of anything… fancy testing that?"
                            },
                            {
                                speaker: 'rob', 
                                text: "I'm Rob. Straightforward guy. I don't like games — unless I'm winning them."
                            },
                            {
                                speaker: 'miguel',
                                text: "Hola, I'm Miguel. I mix confidence with a smile — dangerous combo, yeah?"
                            },
                            {
                                speaker: 'pepe',
                                text: "I'm Pepe. Spanish, passionate, and maybe a little bit too competitive."
                            },
                            {
                                speaker: 'bryan',
                                text: "Bryan here. Honest lad, but don't cross me — I'll remember."
                            },
                            {
                                speaker: 'kenny',
                                text: "And I'm Kenny. Don't get too comfortable. I'm not here to make friends."
                            }
                        ]
                    },
                    {
                        id: 'day1_challenge_setup',
                        type: 'narration',
                        speaker: 'ariana',
                        text: "You mingle with the lads, trading smiles and small talk. But suddenly—your first villa challenge appears!",
                        scene: 'day',
                        triggerMathGate: {
                            id: 'day1_math_gate',
                            onPass: 'day1_romance_choice',
                            onFail: 'day1_bad_choices'
                        }
                    },
                    {
                        id: 'day1_romance_choice',
                        type: 'choice',
                        speaker: 'ariana',
                        text: "Sharp brain, babe! You've unlocked the chance to pull one of the boys for a chat.",
                        choices: [
                            {
                                id: 'choose_nic',
                                text: 'Pull Nic for a cheeky laugh',
                                mathRequired: false, // Already passed gate
                                effects: { chosenLI: 'nic' },
                                nextScene: 'day1_nic_romance'
                            },
                            {
                                id: 'choose_rob',
                                text: 'Pull Rob for a serious convo',
                                mathRequired: false,
                                effects: { chosenLI: 'rob' },
                                nextScene: 'day1_rob_romance'
                            },
                            {
                                id: 'choose_miguel',
                                text: 'Pull Miguel for Spanish charm',
                                mathRequired: false,
                                effects: { chosenLI: 'miguel' },
                                nextScene: 'day1_miguel_romance'
                            }
                        ]
                    },
                    {
                        id: 'day1_nic_romance',
                        type: 'dialogue',
                        speaker: 'nic',
                        text: "So you picked me? Can't say I blame ya. What's your type then?",
                        choices: [
                            {
                                id: 'nic_flirt1',
                                text: 'Funny, confident guys like you',
                                effects: { romance: { nic: +1 } },
                                nextScene: 'day1_closing'
                            },
                            {
                                id: 'nic_flirt2', 
                                text: "Not sure yet, but you're growing on me",
                                effects: { romance: { nic: +1 } },
                                nextScene: 'day1_closing'
                            }
                        ]
                    },
                    {
                        id: 'day1_rob_romance',
                        type: 'dialogue',
                        speaker: 'rob',
                        text: "Alright, you picked me. I appreciate directness. What are you really looking for here?",
                        choices: [
                            {
                                id: 'rob_sincere',
                                text: 'Someone genuine who says what they mean',
                                effects: { romance: { rob: +1 } },
                                nextScene: 'day1_closing'
                            },
                            {
                                id: 'rob_challenge',
                                text: 'Someone who can handle a challenge',
                                effects: { romance: { rob: +1 } },
                                nextScene: 'day1_closing'
                            }
                        ]
                    },
                    {
                        id: 'day1_miguel_romance',
                        type: 'dialogue',
                        speaker: 'miguel',
                        text: "Ah, so you chose the charming one. Smart choice, beautiful. Tell me, what caught your attention?",
                        choices: [
                            {
                                id: 'miguel_confidence',
                                text: 'Your confidence is magnetic',
                                effects: { romance: { miguel: +1 } },
                                nextScene: 'day1_closing'
                            },
                            {
                                id: 'miguel_mystery',
                                text: 'You seem interesting and mysterious',
                                effects: { romance: { miguel: +1 } },
                                nextScene: 'day1_closing'
                            }
                        ]
                    },
                    {
                        id: 'day1_bad_choices',
                        type: 'choice',
                        speaker: 'ariana',
                        text: "Oh dear... looks like you'll have to make do with what's available.",
                        choices: [
                            {
                                id: 'insult_boring',
                                text: 'I think you all seem boring, actually',
                                mathRequired: false,
                                effects: { drama: +3 },
                                nextScene: 'day1_drama_reaction'
                            },
                            {
                                id: 'fancy_kenny',
                                text: 'Honestly, I fancy Kenny',
                                mathRequired: false, 
                                effects: { drama: +4, romance: { kenny: +1 } },
                                nextScene: 'day1_kenny_reaction'
                            }
                        ]
                    },
                    {
                        id: 'day1_drama_reaction',
                        type: 'dialogue_sequence',
                        characters: [
                            {
                                speaker: 'nic',
                                text: "Boring? Mate, she's having a laugh."
                            },
                            {
                                speaker: 'kenny',
                                text: "Well, well. Looks like someone's too good for us mere mortals."
                            }
                        ],
                        nextScene: 'day1_closing'
                    },
                    {
                        id: 'day1_kenny_reaction',
                        type: 'dialogue_sequence',
                        characters: [
                            {
                                speaker: 'kenny',
                                text: "Finally, someone with taste."
                            },
                            {
                                speaker: 'nic',
                                text: "She's a lost cause, mate."
                            }
                        ],
                        nextScene: 'day1_closing'
                    },
                    {
                        id: 'day1_closing',
                        type: 'narration',
                        speaker: 'ariana',
                        text: "The sun sets on your first day in the villa. Some doors have opened… and others may have slammed shut. Tomorrow, the games really begin.",
                        scene: 'night',
                        triggerDayEnd: 2
                    }
                ]
            },
            
            day2: {
                scenes: [
                    {
                        id: 'day2_opening',
                        type: 'narration',
                        speaker: 'ariana', 
                        text: "It's Day 2 in the villa. The boys are laughing by the pool, the gossip's already sizzling, and Kenny… well, Kenny looks way too pleased with himself.",
                        scene: 'day'
                    },
                    {
                        id: 'day2_kenny_stirs',
                        type: 'dialogue_sequence',
                        characters: [
                            {
                                speaker: 'kenny',
                                text: "So… did you hear what she said last night? Apparently she called Rob boring."
                            },
                            {
                                speaker: 'rob',
                                text: "Wait, what? Did you actually say that?"
                            }
                        ]
                    },
                    {
                        id: 'day2_ungated_choice',
                        type: 'choice',
                        speaker: 'rob',
                        text: "Well? Did you say I was boring?",
                        choices: [
                            {
                                id: 'admit_boring',
                                text: "Yeah, I did. You kinda are.",
                                mathRequired: false,
                                effects: { drama: +3, romance: { rob: -2 } },
                                nextScene: 'day2_math_gate_setup'
                            },
                            {
                                id: 'thought_boring',
                                text: "I didn't say it... but maybe I thought it.",
                                mathRequired: false,
                                effects: { drama: +4 },
                                nextScene: 'day2_math_gate_setup'
                            }
                        ]
                    },
                    {
                        id: 'day2_math_gate_setup',
                        type: 'narration',
                        speaker: 'ariana',
                        text: "The tension lingers in the air… but you get another shot to prove yourself.",
                        triggerMathGate: {
                            id: 'day2_math_gate',
                            onPass: 'day2_romance_selection',
                            onFail: 'day2_fail_choices'
                        }
                    }
                    // Continue with more Day 2 scenes...
                ]
            }
            
            // Continue with day3 and day4 data...
        };
    }
    
    startStoryline() {
        this.loadScene('day1', 0);
    }
    
    loadScene(day, sceneIndex) {
        const dayData = this.storyData[day];
        if (!dayData || !dayData.scenes[sceneIndex]) {
            console.error(`Scene not found: ${day}, index ${sceneIndex}`);
            return;
        }
        
        const scene = dayData.scenes[sceneIndex];
        this.gameState.currentDay = parseInt(day.replace('day', ''));
        this.gameState.currentScene = sceneIndex;
        this.gameState.currentDialogue = scene;
        
        this.renderScene(scene);
    }
    
    renderScene(scene) {
        const container = document.getElementById('dialogueContainer');
        
        switch (scene.type) {
            case 'narration':
                this.renderNarration(scene);
                break;
            case 'dialogue':
                this.renderDialogue(scene);
                break;
            case 'dialogue_sequence':
                this.renderDialogueSequence(scene);
                break;
            case 'choice':
                this.renderChoice(scene);
                break;
            case 'check_ending':
                this.checkEndingConditions();
                return;
            case 'trigger_ending':
                this.triggerEnding(scene.endingType);
                return;
        }
        
        // Increment turn count for each bubble
        this.gameState.turnCount++;
        this.saveGameState();
        
        // Check for math gate trigger every 20 turns
        if (this.gameState.turnCount % 20 === 0 && !scene.triggerMathGate) {
            this.triggerAutoMathGate();
        } else if (scene.triggerMathGate) {
            // Scene-specific math gate
            this.scheduleDelayedMathGate(scene.triggerMathGate);
        }
        
        // Handle day transitions
        if (scene.triggerDayEnd) {
            setTimeout(() => {
                this.gameState.currentDay = scene.triggerDayEnd;
                this.loadScene(`day${scene.triggerDayEnd}`, 0);
            }, 3000);
        }
    }
    
    renderNarration(scene) {
        const cast = this.getCast();
        const speaker = cast[scene.speaker];
        
        const bubble = this.createDialogueBubble(speaker, scene.text, 'narration');
        this.appendBubbleAndScroll(bubble);
    }
    
    renderDialogue(scene) {
        const cast = this.getCast();
        const speaker = cast[scene.speaker];
        
        const bubble = this.createDialogueBubble(speaker, scene.text, 'dialogue');
        this.appendBubbleAndScroll(bubble);
        
        if (scene.choices) {
            this.gameState.waitingForChoice = true;
            this.renderChoices(scene.choices);
        }
    }
    
    renderDialogueSequence(scene) {
        const cast = this.getCast();
        
        scene.characters.forEach((char, index) => {
            setTimeout(() => {
                const speaker = cast[char.speaker];
                const bubble = this.createDialogueBubble(speaker, char.text, 'dialogue');
                this.appendBubbleAndScroll(bubble);
                
                // If this is the last character and there's a next scene
                if (index === scene.characters.length - 1 && scene.nextScene) {
                    setTimeout(() => {
                        this.navigateToNextScene(scene.nextScene);
                    }, 1000);
                }
            }, index * 1500);
        });
    }
    
    renderChoice(scene) {
        const cast = this.getCast();
        const speaker = cast[scene.speaker];
        
        const bubble = this.createDialogueBubble(speaker, scene.text, 'choice');
        this.appendBubbleAndScroll(bubble);
        
        this.gameState.waitingForChoice = true;
        this.renderChoices(scene.choices);
    }
    
    createDialogueBubble(speaker, text, type = 'dialogue') {
        const bubble = document.createElement('div');
        bubble.className = `dialogue-bubble current ${type}-bubble`;
        
        bubble.innerHTML = `
            <div class="bubble-avatar">
                <div class="perfect-circle-avatar" style="border-color: ${speaker.avatar.accentColor}; width: 80px; height: 80px;">
                    <div class="avatar-circle-wrapper">
                        <img src="${speaker.avatar.image}" 
                             alt="${speaker.name}" 
                             class="perfect-circle-image"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="avatar-fallback perfect-circle-fallback" style="display: none; background: ${speaker.avatar.bgColor};">
                            ${speaker.avatar.emoji || '👤'}
                        </div>
                    </div>
                </div>
            </div>
            <div class="bubble-content" style="--accent-color: ${speaker.avatar.accentColor};">
                <div class="bubble-speaker" style="color: ${speaker.avatar.accentColor};">
                    ${speaker.name}
                </div>
                <div class="bubble-text">${text}</div>
            </div>
        `;
        
        return bubble;
    }
    
    renderChoices(choices) {
        const choiceContainer = document.getElementById('dialogueChoiceContainer') || this.createChoiceContainer();
        choiceContainer.innerHTML = '';
        choiceContainer.style.display = 'block';
        
        choices.forEach((choice, index) => {
            const choiceElement = document.createElement('div');
            choiceElement.className = `dialogue-choice ${choice.mathRequired ? 'choice-gated' : 'choice-ungated'}`;
            
            choiceElement.innerHTML = `
                <div class="choice-text">${choice.text}</div>
                ${choice.mathRequired ? '<span class="choice-math-indicator">🧠 Math</span>' : ''}
            `;
            
            choiceElement.addEventListener('click', () => {
                if (choice.mathRequired) {
                    this.triggerMathGateForChoice(choice);
                } else {
                    this.selectChoice(choice);
                }
            });
            
            choiceContainer.appendChild(choiceElement);
        });
    }
    
    createChoiceContainer() {
        const container = document.createElement('div');
        container.id = 'dialogueChoiceContainer';
        container.className = 'dialogue-choice-container';
        document.getElementById('dialogueContainer').parentElement.appendChild(container);
        return container;
    }
    
    selectChoice(choice) {
        this.gameState.waitingForChoice = false;
        document.getElementById('dialogueChoiceContainer').style.display = 'none';
        
        // Apply effects
        this.applyChoiceEffects(choice.effects);
        
        // Navigate to next scene
        if (choice.nextScene) {
            this.navigateToNextScene(choice.nextScene);
        }
    }
    
    applyChoiceEffects(effects) {
        if (!effects) return;
        
        // Apply romance changes
        if (effects.romance) {
            Object.keys(effects.romance).forEach(boy => {
                this.gameState.romance[boy] += effects.romance[boy];
                this.gameState.romance[boy] = Math.max(0, Math.min(10, this.gameState.romance[boy]));
            });
        }
        
        // Apply drama changes
        if (effects.drama) {
            this.gameState.drama += effects.drama;
            this.gameState.drama = Math.max(0, Math.min(15, this.gameState.drama));
        }
        
        // Set chosen love interest
        if (effects.chosenLI) {
            this.gameState.chosenLI = effects.chosenLI;
        }
        
        this.saveGameState();
        this.updateStateUI();
    }
    
    // Math gate integration
    triggerAutoMathGate() {
        const mathGate = {
            id: `auto_gate_turn_${this.gameState.turnCount}`,
            onPass: null, // Continue current flow
            onFail: 'auto_fail_consequences'
        };
        
        this.showMathGate(mathGate);
    }
    
    scheduleDelayedMathGate(mathGateData) {
        setTimeout(() => {
            this.showMathGate(mathGateData);
        }, 1500);
    }
    
    showMathGate(mathGateData) {
        // Use existing math gate system from game.js
        this.gameState.waitingForMathGate = true;
        
        // Generate operands
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        
        const cast = this.getCast();
        const ariana = cast.ariana;
        
        const mathBubble = document.createElement('div');
        mathBubble.className = 'dialogue-bubble current math-gate-bubble';
        mathBubble.id = 'mathGateContainer';
        
        mathBubble.innerHTML = `
            <div class="bubble-avatar">
                <div class="perfect-circle-avatar" style="border-color: ${ariana.avatar.accentColor}; width: 80px; height: 80px;">
                    <div class="avatar-circle-wrapper">
                        <img src="${ariana.avatar.image}" 
                             alt="${ariana.name}" 
                             class="perfect-circle-image"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="avatar-fallback perfect-circle-fallback" style="display: none; background: ${ariana.avatar.bgColor};">
                            ${ariana.avatar.emoji || '👤'}
                        </div>
                    </div>
                </div>
            </div>
            <div class="bubble-content math-gate-content" style="--accent-color: ${ariana.avatar.accentColor};">
                <div class="bubble-speaker" style="color: ${ariana.avatar.accentColor};">
                    ${ariana.name}
                </div>
                <div class="math-gate-challenge">
                    <div class="math-question">${a} × ${b} = ?</div>
                    <div class="math-timer-container">
                        <div class="math-timer-bar" id="mathTimerBar"></div>
                        <div class="math-timer-text" id="mathTimerText">7s</div>
                    </div>
                    <div class="math-input-container">
                        <input type="number" 
                               id="mathAnswerInput" 
                               class="math-answer-input" 
                               placeholder="?"
                               min="0"
                               step="1">
                        <button id="mathSubmitBtn" class="math-submit-btn" disabled>Submit</button>
                    </div>
                    <div class="math-hint">Enter your answer and press Submit or Enter</div>
                </div>
            </div>
        `;
        
        this.appendBubbleAndScroll(mathBubble);
        
        // Store math gate data
        this.currentMathGate = {
            ...mathGateData,
            a: a,
            b: b,
            startTime: Date.now(),
            timeLimit: 7000
        };
        
        this.setupMathGateControls();
        this.startMathGateTimer();
    }
    
    setupMathGateControls() {
        const input = document.getElementById('mathAnswerInput');
        const submitBtn = document.getElementById('mathSubmitBtn');
        
        if (!input || !submitBtn) return;
        
        input.focus();
        
        input.addEventListener('input', () => {
            const hasValue = input.value.trim() !== '' && !isNaN(input.value);
            submitBtn.disabled = !hasValue;
            submitBtn.className = hasValue ? 'math-submit-btn enabled' : 'math-submit-btn';
        });
        
        const submitAnswer = () => {
            if (!submitBtn.disabled && this.gameState.waitingForMathGate) {
                this.submitMathGateAnswer();
            }
        };
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitAnswer();
            }
            
            // Block spacebar
            if (e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            
            // Allow only numbers and control keys
            const allowedKeys = /^[\d\b\x7f]$|^Arrow|^Tab$/;
            if (!allowedKeys.test(e.key) && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
            }
        });
        
        submitBtn.addEventListener('click', submitAnswer);
    }
    
    startMathGateTimer() {
        const timerBar = document.getElementById('mathTimerBar');
        const timerText = document.getElementById('mathTimerText');
        const timeLimit = this.currentMathGate.timeLimit;
        
        let timeLeft = timeLimit;
        
        this.mathGateTimer = setInterval(() => {
            timeLeft -= 100;
            
            const seconds = Math.ceil(timeLeft / 1000);
            const percentage = (timeLeft / timeLimit) * 100;
            
            timerText.textContent = `${seconds}s`;
            timerBar.style.width = `${percentage}%`;
            
            // Color coding
            if (percentage > 50) {
                timerBar.style.background = '#4CAF50';
            } else if (percentage > 25) {
                timerBar.style.background = '#FF9800';
            } else {
                timerBar.style.background = '#F44336';
            }
            
            if (timeLeft <= 0) {
                this.handleMathGateTimeout();
            }
        }, 100);
    }
    
    submitMathGateAnswer() {
        const input = document.getElementById('mathAnswerInput');
        const userAnswer = Number(input.value.trim());
        const correctAnswer = this.currentMathGate.a * this.currentMathGate.b;
        
        clearInterval(this.mathGateTimer);
        
        const isCorrect = userAnswer === correctAnswer;
        
        if (isCorrect) {
            this.gameState.mathGatesPassed++;
        } else {
            this.gameState.mathGatesFailed++;
        }
        
        this.showMathGateFeedback(isCorrect, correctAnswer);
        
        setTimeout(() => {
            this.processMathGateResult(isCorrect);
        }, 1500);
    }
    
    handleMathGateTimeout() {
        clearInterval(this.mathGateTimer);
        this.gameState.mathGatesFailed++;
        
        const correctAnswer = this.currentMathGate.a * this.currentMathGate.b;
        this.showMathGateFeedback(false, correctAnswer, true);
        
        setTimeout(() => {
            this.processMathGateResult(false);
        }, 1500);
    }
    
    showMathGateFeedback(isCorrect, correctAnswer, isTimeout = false) {
        const mathContainer = document.getElementById('mathGateContainer');
        const feedbackClass = isCorrect ? 'math-feedback-correct' : 'math-feedback-incorrect';
        
        let feedbackText;
        if (isTimeout) {
            feedbackText = `⏰ Time's up! The answer was ${correctAnswer}`;
        } else if (isCorrect) {
            feedbackText = `✅ Correct! ${correctAnswer}`;
        } else {
            feedbackText = `❌ Wrong! The answer was ${correctAnswer}`;
        }
        
        const feedback = document.createElement('div');
        feedback.className = `math-gate-feedback ${feedbackClass}`;
        feedback.textContent = feedbackText;
        
        mathContainer.appendChild(feedback);
        mathContainer.classList.add(feedbackClass);
    }
    
    processMathGateResult(passed) {
        this.gameState.waitingForMathGate = false;
        
        const mathContainer = document.getElementById('mathGateContainer');
        if (mathContainer) {
            mathContainer.remove();
        }
        
        if (passed && this.currentMathGate.onPass) {
            this.navigateToNextScene(this.currentMathGate.onPass);
        } else if (!passed && this.currentMathGate.onFail) {
            // Add drama for failing math gate
            this.gameState.drama += 2;
            this.navigateToNextScene(this.currentMathGate.onFail);
        } else {
            // Continue with current flow
            this.advanceToNextScene();
        }
        
        this.saveGameState();
        this.updateStateUI();
    }
    
    // Navigation and advancement
    navigateToNextScene(sceneId) {
        // Find the scene in current or other days
        const currentDay = `day${this.gameState.currentDay}`;
        const dayData = this.storyData[currentDay];
        
        const sceneIndex = dayData.scenes.findIndex(scene => scene.id === sceneId);
        if (sceneIndex !== -1) {
            this.loadScene(currentDay, sceneIndex);
        } else {
            console.error(`Scene not found: ${sceneId}`);
        }
    }
    
    advanceToNextScene() {
        const currentDay = `day${this.gameState.currentDay}`;
        const nextSceneIndex = this.gameState.currentScene + 1;
        
        if (this.storyData[currentDay].scenes[nextSceneIndex]) {
            this.loadScene(currentDay, nextSceneIndex);
        } else {
            // End of day - check for ending or advance to next day
            this.checkEndingConditions();
        }
    }
    
    checkEndingConditions() {
        const { romance, drama, chosenLI } = this.gameState;
        
        // Day 4 ending conditions
        if (this.gameState.currentDay >= 4) {
            if (drama >= 9) {
                this.triggerEnding('public_dump');
            } else if (chosenLI && romance[chosenLI] >= 4 && drama <= 6) {
                this.triggerEnding('romantic_win');
            } else if (chosenLI && romance[chosenLI] >= 2 && romance[chosenLI] <= 3 && drama <= 8) {
                this.triggerEnding('shaky_couple');
            } else if (chosenLI === 'kenny') {
                this.triggerEnding('kenny_path');
            } else {
                this.triggerEnding('roast_ending');
            }
        } else {
            // Advance to next day
            this.gameState.currentDay++;
            this.loadScene(`day${this.gameState.currentDay}`, 0);
        }
    }
    
    triggerEnding(endingType) {
        console.log(`🎬 Triggering ending: ${endingType}`);
        
        const endings = {
            romantic_win: {
                title: '❤️ Romantic Win (Happy Ending)',
                narration: [
                    {
                        speaker: 'ariana',
                        text: "It's official — the villa has a new power couple!"
                    },
                    {
                        speaker: this.gameState.chosenLI || 'nic',
                        text: "I knew from day one you were special. This is just the beginning for us."
                    }
                ],
                outcome: 'You found true love in the villa! Your relationship with ' + (this.gameState.chosenLI || 'your chosen islander') + ' is stronger than ever.',
                color: '#e91e63'
            },
            
            shaky_couple: {
                title: '😬 Shaky Couple (Neutral Ending)',
                narration: [
                    {
                        speaker: this.gameState.chosenLI || 'nic', 
                        text: "I'll give you one more chance, but you need to prove yourself."
                    },
                    {
                        speaker: 'ariana',
                        text: "Tomorrow could be make or break…"
                    }
                ],
                outcome: 'Your relationship is hanging by a thread. There\'s still hope, but you\'ll need to step up your game.',
                color: '#ff9800'
            },
            
            public_dump: {
                title: '🔥 Public Dump (Elimination Ending)',
                narration: [
                    {
                        speaker: 'ariana',
                        text: "Babe, the villa has decided. Your time here is over."
                    },
                    {
                        speaker: 'kenny',
                        text: "Tough crowd. Better luck next time."
                    }
                ],
                outcome: 'Too much drama led to your elimination. The villa couldn\'t handle your chaos!',
                color: '#f44336'
            },
            
            kenny_path: {
                title: '😈 Kenny Path (Toxic Fail Ending)',
                narration: [
                    {
                        speaker: 'kenny',
                        text: "Finally, someone with taste. This'll be fun…"
                    },
                    {
                        speaker: 'ariana',
                        text: "…Sure. Good luck with that, babe."
                    }
                ],
                outcome: 'You chose Kenny. This toxic relationship is doomed from the start, but at least it\'ll be entertaining!',
                color: '#9c27b0'
            },
            
            roast_ending: {
                title: '🤡 Roast Ending (Fail-Gate Collapse)',
                narration: [
                    {
                        speaker: 'nic',
                        text: "She came here for maths, not love."
                    },
                    {
                        speaker: 'kenny',
                        text: "Pack your bags, professor."
                    }
                ],
                outcome: 'Your math failures and poor choices led to the most embarrassing dump in villa history. Time to hit the books!',
                color: '#795548'
            }
        };
        
        const ending = endings[endingType];
        if (!ending) {
            console.error(`Unknown ending type: ${endingType}`);
            return;
        }
        
        // Clear dialogue container
        document.getElementById('dialogueContainer').innerHTML = '';
        
        // Show ending sequence
        this.showEndingSequence(ending);
    }
    
    showEndingSequence(ending) {
        // Create ending container
        const endingContainer = document.createElement('div');
        endingContainer.className = 'ending-sequence';
        endingContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, ${ending.color}22 0%, ${ending.color}44 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(10px);
        `;
        
        endingContainer.innerHTML = `
            <div style="
                background: rgba(255, 255, 255, 0.95);
                padding: 40px;
                border-radius: 20px;
                max-width: 600px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <h1 style="color: ${ending.color}; margin: 0 0 20px 0; font-size: 2.5rem;">
                    ${ending.title}
                </h1>
                <div id="endingNarration" style="margin: 20px 0;"></div>
                <p style="font-size: 1.2rem; color: #333; line-height: 1.6; margin: 20px 0;">
                    ${ending.outcome}
                </p>
                <div style="margin-top: 30px;">
                    <button onclick="location.reload()" style="
                        background: ${ending.color};
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-size: 1.1rem;
                        cursor: pointer;
                        margin: 0 10px;
                        transition: all 0.3s ease;
                    ">🔄 Play Again</button>
                    <button onclick="game.showStats()" style="
                        background: #666;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-size: 1.1rem;
                        cursor: pointer;
                        margin: 0 10px;
                    ">📊 View Stats</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(endingContainer);
        
        // Animate narration bubbles
        const narrationContainer = document.getElementById('endingNarration');
        ending.narration.forEach((line, index) => {
            setTimeout(() => {
                const cast = this.getCast();
                const speaker = cast[line.speaker];
                
                const bubble = document.createElement('div');
                bubble.style.cssText = `
                    display: flex;
                    align-items: center;
                    margin: 15px 0;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 15px;
                    border-left: 4px solid ${speaker.avatar.accentColor};
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.5s ease;
                `;
                
                bubble.innerHTML = `
                    <img src="${speaker.avatar.image}" 
                         style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; border: 2px solid ${speaker.avatar.accentColor};">
                    <div>
                        <div style="font-weight: bold; color: ${speaker.avatar.accentColor}; margin-bottom: 5px;">
                            ${speaker.name}
                        </div>
                        <div style="color: #333;">${line.text}</div>
                    </div>
                `;
                
                narrationContainer.appendChild(bubble);
                
                // Animate in
                setTimeout(() => {
                    bubble.style.opacity = '1';
                    bubble.style.transform = 'translateY(0)';
                }, 100);
                
            }, index * 1500);
        });
    }
    
    // Utility methods
    getCast() {
        return {
            ariana: {
                name: 'Ariana Madix',
                avatar: {
                    image: '/public/assets/avatars/ariana.png',
                    accentColor: '#E91E63',
                    bgColor: '#FCE4EC',
                    emoji: '👑'
                }
            },
            nic: {
                name: 'Nic',
                avatar: {
                    image: '/public/assets/avatars/nic.png',
                    accentColor: '#34495E',
                    bgColor: '#ECF0F1',
                    emoji: '😏'
                }
            },
            rob: {
                name: 'Rob',
                avatar: {
                    image: '/public/assets/avatars/rob.png',
                    accentColor: '#2980B9',
                    bgColor: '#EBF3FD',
                    emoji: '💪'
                }
            },
            miguel: {
                name: 'Miguel',
                avatar: {
                    image: '/public/assets/avatars/miguel.png',
                    accentColor: '#8B4A9C',
                    bgColor: '#F3E5F5',
                    emoji: '😎'
                }
            },
            pepe: {
                name: 'Pepe',
                avatar: {
                    image: '/public/assets/avatars/pepe.png',
                    accentColor: '#E74C3C',
                    bgColor: '#FADBD8',
                    emoji: '🔥'
                }
            },
            bryan: {
                name: 'Bryan',
                avatar: {
                    image: '/public/assets/avatars/bryan.png',
                    accentColor: '#2C3E50',
                    bgColor: '#D5DBDB',
                    emoji: '🛡️'
                }
            },
            kenny: {
                name: 'Kenny',
                avatar: {
                    image: '/public/assets/avatars/kenny.png',
                    accentColor: '#27AE60',
                    bgColor: '#D5F4E6',
                    emoji: '😈'
                }
            }
        };
    }
    
    appendBubbleAndScroll(bubble) {
        const container = document.getElementById('dialogueContainer');
        container.appendChild(bubble);
        bubble.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    
    setupEventListeners() {
        // Spacebar advancement
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.gameState.waitingForMathGate && !this.gameState.waitingForChoice) {
                e.preventDefault();
                this.advanceToNextScene();
            }
        });
        
        // Show state panel initially
        setTimeout(() => {
            this.updateStateUI();
        }, 1000);
    }
    
    // State management
    saveGameState() {
        localStorage.setItem('loveIslandStoryState', JSON.stringify(this.gameState));
    }
    
    loadGameState() {
        const saved = localStorage.getItem('loveIslandStoryState');
        if (saved) {
            try {
                const parsedState = JSON.parse(saved);
                this.gameState = { ...this.gameState, ...parsedState };
            } catch (e) {
                console.error('Failed to load game state:', e);
            }
        }
    }
    
    updateStateUI() {
        // Show state panel if hidden
        const statePanel = document.getElementById('statePanel');
        if (statePanel && statePanel.style.display === 'none') {
            statePanel.style.display = 'block';
        }
        
        // Update romance meters
        Object.keys(this.gameState.romance).forEach(boy => {
            const meterValue = document.getElementById(`romance-${boy}`);
            const meterBar = document.getElementById(`romance-${boy}-bar`);
            const value = this.gameState.romance[boy];
            
            if (meterValue) {
                meterValue.textContent = value;
            }
            
            if (meterBar) {
                const percentage = (value / 10) * 100; // Romance scale 0-10
                meterBar.style.width = `${percentage}%`;
                meterBar.setAttribute('data-value', value);
                
                // Color coding for romance levels
                if (value >= 4) {
                    meterBar.style.background = 'linear-gradient(45deg, #e91e63, #ff6b9d)'; // Hot pink for high romance
                } else if (value >= 2) {
                    meterBar.style.background = 'linear-gradient(45deg, #ff9800, #ffb74d)'; // Orange for medium
                } else {
                    meterBar.style.background = 'linear-gradient(45deg, #9e9e9e, #bdbdbd)'; // Gray for low
                }
            }
        });
        
        // Update drama meter
        const dramaMeter = document.getElementById('drama-meter');
        const dramaBar = document.getElementById('drama-bar');
        const dramaWarning = document.getElementById('drama-warning');
        const dramaValue = this.gameState.drama;
        
        if (dramaMeter) {
            dramaMeter.textContent = dramaValue;
        }
        
        if (dramaBar) {
            const percentage = (dramaValue / 15) * 100; // Drama scale 0-15
            dramaBar.style.width = `${percentage}%`;
            dramaBar.setAttribute('data-value', dramaValue);
            
            // Color coding for drama levels
            if (dramaValue >= 9) {
                dramaBar.style.background = 'linear-gradient(45deg, #f44336, #e57373)'; // Red for dangerous
                if (dramaWarning) dramaWarning.style.display = 'block';
            } else if (dramaValue >= 6) {
                dramaBar.style.background = 'linear-gradient(45deg, #ff9800, #ffb74d)'; // Orange for high
                if (dramaWarning) dramaWarning.style.display = 'none';
            } else {
                dramaBar.style.background = 'linear-gradient(45deg, #4caf50, #81c784)'; // Green for low
                if (dramaWarning) dramaWarning.style.display = 'none';
            }
        }
        
        // Update turn count
        const turnCount = document.getElementById('turn-count');
        if (turnCount) {
            turnCount.textContent = this.gameState.turnCount;
        }
        
        // Update chosen love interest
        const chosenLI = document.getElementById('chosen-li');
        const chosenLIName = document.getElementById('chosen-li-name');
        
        if (this.gameState.chosenLI && chosenLI && chosenLIName) {
            chosenLI.style.display = 'block';
            chosenLIName.textContent = this.gameState.chosenLI;
        } else if (chosenLI) {
            chosenLI.style.display = 'none';
        }
        
        // Highlight current LI's meter
        Object.keys(this.gameState.romance).forEach(boy => {
            const meterElement = document.querySelector(`#romance-${boy}`).parentElement;
            if (boy === this.gameState.chosenLI) {
                meterElement.style.background = 'rgba(233, 30, 99, 0.1)';
                meterElement.style.borderRadius = '8px';
                meterElement.style.padding = '4px';
            } else {
                meterElement.style.background = 'transparent';
                meterElement.style.padding = '0';
            }
        });
    }
}
