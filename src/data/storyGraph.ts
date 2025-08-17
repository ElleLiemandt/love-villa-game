/**
 * Story Graph Loader
 * Loads and manages Day1-4 markdown content
 */

import { MarkdownParser, Step } from '../content/markdownParser';

// Raw imports would go here in a real bundler
// For now, we'll load dynamically via fetch

interface StoryData {
    [dayId: string]: Step[];
}

class StoryGraph {
    private storyData: StoryData = {};
    private currentDay = 1;
    private currentStepIndex = 0;
    private initialized = false;

    async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            // Load all day files
            await this.loadDay(1);
            await this.loadDay(2);
            await this.loadDay(3);
            await this.loadDay(4);
            
            this.initialized = true;
            console.log('📚 StoryGraph initialized with all days loaded');
        } catch (error) {
            console.error('Failed to initialize StoryGraph:', error);
            throw error;
        }
    }

    private async loadDay(dayNumber: number): Promise<void> {
        const dayId = `day${dayNumber}`;
        
        try {
            // Fetch markdown content
            const response = await fetch(`/content/this_weekend_v2/Day${dayNumber}.md`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const markdownContent = await response.text();
            
            // Parse with day-specific prefix
            const parser = new MarkdownParser(`d${dayNumber}`);
            const steps = parser.parseMarkdown(markdownContent);
            
            // Add day transition step if not the last day
            if (dayNumber < 4) {
                steps.push({
                    type: 'say',
                    id: `d${dayNumber}_transition`,
                    speakerId: 'ariana',
                    text: `End of Day ${dayNumber}. A new day awaits...`
                });
            }
            
            this.storyData[dayId] = steps;
            console.log(`📖 Loaded Day${dayNumber}.md (${steps.length} steps)`);
            
        } catch (error) {
            console.error(`Failed to load Day${dayNumber}.md:`, error);
            
            // Fallback content
            this.storyData[dayId] = [{
                type: 'say',
                id: `d${dayNumber}_fallback`,
                speakerId: 'ariana',
                text: `Day ${dayNumber} content is currently unavailable. Please check the content files.`
            }];
        }
    }

    getInitialStepId(): string {
        const day1Steps = this.storyData.day1;
        return day1Steps && day1Steps.length > 0 ? day1Steps[0].id : 'd1_001';
    }

    getStepById(id: string): Step | null {
        // Search through all days
        for (const daySteps of Object.values(this.storyData)) {
            const step = daySteps.find(s => s.id === id);
            if (step) return step;
        }
        return null;
    }

    getCurrentDaySteps(): Step[] {
        return this.storyData[`day${this.currentDay}`] || [];
    }

    getCurrentStep(): Step | null {
        const daySteps = this.getCurrentDaySteps();
        return daySteps[this.currentStepIndex] || null;
    }

    advanceStep(): Step | null {
        const daySteps = this.getCurrentDaySteps();
        
        // Try to advance within current day
        if (this.currentStepIndex < daySteps.length - 1) {
            this.currentStepIndex++;
            return this.getCurrentStep();
        }
        
        // End of current day - advance to next day
        if (this.currentDay < 4) {
            this.currentDay++;
            this.currentStepIndex = 0;
            console.log(`🌅 Advancing to Day ${this.currentDay}`);
            return this.getCurrentStep();
        }
        
        // End of all content
        console.log('📚 End of story reached');
        return null;
    }

    jumpToStep(stepId: string): Step | null {
        // Find step and update current position
        for (let day = 1; day <= 4; day++) {
            const daySteps = this.storyData[`day${day}`];
            const stepIndex = daySteps.findIndex(s => s.id === stepId);
            
            if (stepIndex !== -1) {
                this.currentDay = day;
                this.currentStepIndex = stepIndex;
                console.log(`🎯 Jumped to ${stepId} (Day ${day}, Step ${stepIndex + 1})`);
                return daySteps[stepIndex];
            }
        }
        
        console.warn(`Step not found: ${stepId}`);
        return null;
    }

    // Diagnostics
    getDiagnostics(): string {
        const totalSteps = Object.values(this.storyData).reduce((sum, steps) => sum + steps.length, 0);
        return `Story loaded: ${Object.keys(this.storyData).length} days, ${totalSteps} total steps. Currently on Day ${this.currentDay}, Step ${this.currentStepIndex + 1}.`;
    }
}

// Export singleton instance
export const storyGraph = new StoryGraph();

// Export types for external use
export type { Step, SayStep, ChoiceStep } from '../content/markdownParser';

