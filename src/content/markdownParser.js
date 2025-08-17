/**
 * Markdown Parser for Love Island Story Content
 * Parses dialogue format into Step objects
 */

export class MarkdownParser {
    constructor(dayPrefix = 'd1') {
        this.dayPrefix = dayPrefix;
        this.stepCounter = 0;
    }

    generateId() {
        this.stepCounter++;
        return `${this.dayPrefix}_${this.stepCounter.toString().padStart(3, '0')}`;
    }

    parseMarkdown(content) {
        const lines = content.split('\n').map(line => line.trim());
        const steps = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // Skip empty lines and headers
            if (!line || (line.startsWith('#') && !line.startsWith('# Choice:'))) {
                i++;
                continue;
            }

            // Handle choice blocks
            if (line === '# Choice:') {
                const choiceResult = this.parseChoiceBlock(lines, i);
                if (choiceResult) {
                    steps.push(choiceResult.step);
                    i = choiceResult.nextIndex;
                } else {
                    i++;
                }
                continue;
            }

            // Handle dialogue lines
            const sayStep = this.parseSayLine(line);
            if (sayStep) {
                steps.push(sayStep);
            } else {
                console.warn(`[MarkdownParser] Skipping unrecognized line: "${line}"`);
            }

            i++;
        }

        console.log(`[MarkdownParser] Parsed ${steps.length} steps from ${this.dayPrefix}`);
        return steps;
    }

    parseSayLine(line) {
        // Match "Speaker: text" format
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (!match) {
            return null;
        }

        const [, speaker, text] = match;
        const speakerId = this.getSpeakerId(speaker.trim());

        return {
            type: 'say',
            id: this.generateId(),
            speakerId,
            text: text.trim()
        };
    }

    parseChoiceBlock(lines, startIndex) {
        // Find the last non-empty line before the choice as the prompt
        let promptLine = '';
        let promptSpeakerId = 'ariana';
        
        for (let j = startIndex - 1; j >= 0; j--) {
            const prevLine = lines[j];
            if (prevLine.trim() && !prevLine.startsWith('#')) {
                const sayStep = this.parseSayLine(prevLine);
                if (sayStep) {
                    promptLine = sayStep.text;
                    promptSpeakerId = sayStep.speakerId;
                }
                break;
            }
        }

        // Parse choice options
        const options = [];
        let i = startIndex + 1;

        while (i < lines.length) {
            const line = lines[i];
            
            // Stop when we hit non-choice content
            if (!line.startsWith('-') && line.trim()) {
                break;
            }

            // Skip empty lines
            if (!line.trim()) {
                i++;
                continue;
            }

            // Parse option: "- Option text → id:branchId"
            const optionMatch = line.match(/^-\s*(.+?)\s*→\s*id:(.+)$/);
            if (optionMatch) {
                const [, text, branchId] = optionMatch;
                options.push({
                    id: this.generateId(),
                    text: text.trim(),
                    next: branchId.trim()
                });
            } else {
                console.warn(`[MarkdownParser] Skipping malformed choice option: "${line}"`);
            }

            i++;
        }

        if (options.length === 0) {
            console.warn('[MarkdownParser] Choice block has no valid options');
            return null;
        }

        return {
            step: {
                type: 'choice',
                id: this.generateId(),
                speakerId: promptSpeakerId,
                prompt: promptLine || 'Make your choice...',
                options
            },
            nextIndex: i
        };
    }

    getSpeakerId(speaker) {
        const speakerLower = speaker.toLowerCase();

        // Character mapping
        const characterMap = {
            'narration': 'ariana',
            'narrator': 'ariana',
            'ariana': 'ariana',
            'nic': 'nic',
            'rob': 'rob', 
            'rory': 'rory',
            'kai': 'kai',
            'miguel': 'miguel',
            'pepe': 'pepe',
            'bryan': 'bryan',
            'kenny': 'kenny',
            'chris': 'chris'
        };

        return characterMap[speakerLower] || 'ariana';
    }
}

