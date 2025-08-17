/**
 * Markdown Parser for Love Island Story Content
 * Parses dialogue format into Step objects
 */

export interface SayStep {
    type: 'say';
    id: string;
    speakerId: string;
    text: string;
}

export interface ChoiceOption {
    id: string;
    text: string;
    next: string;
}

export interface ChoiceStep {
    type: 'choice';
    id: string;
    speakerId: string;
    prompt: string;
    options: ChoiceOption[];
}

export type Step = SayStep | ChoiceStep;

export class MarkdownParser {
    private stepCounter = 0;
    private dayPrefix = '';

    constructor(dayPrefix: string = 'd1') {
        this.dayPrefix = dayPrefix;
        this.stepCounter = 0;
    }

    generateId(): string {
        this.stepCounter++;
        return `${this.dayPrefix}_${this.stepCounter.toString().padStart(3, '0')}`;
    }

    parseMarkdown(content: string): Step[] {
        const lines = content.split('\n').map(line => line.trim());
        const steps: Step[] = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // Skip empty lines and headers
            if (!line || line.startsWith('#') && !line.startsWith('# Choice:')) {
                i++;
                continue;
            }

            // Handle choice blocks
            if (line === '# Choice:') {
                const choiceStep = this.parseChoiceBlock(lines, i);
                if (choiceStep) {
                    steps.push(choiceStep.step);
                    i = choiceStep.nextIndex;
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

    private parseSayLine(line: string): SayStep | null {
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

    private parseChoiceBlock(lines: string[], startIndex: number): { step: ChoiceStep; nextIndex: number } | null {
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
        const options: ChoiceOption[] = [];
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

    private getSpeakerId(speaker: string): string {
        const speakerLower = speaker.toLowerCase();

        // Character mapping
        const characterMap: { [key: string]: string } = {
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

