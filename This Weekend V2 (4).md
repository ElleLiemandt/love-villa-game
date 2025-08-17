# **📖 Day 4 — Firepit Tension**

## **Opening Narration (Ariana)**

* *“Day 4 in the villa. The sun is soft, the whispers are loud, and tonight’s firepit could change everything.”*

---

## **Morning: Fallout & Foreshadow**

**Kenny** (smirking): *“Everyone’s acting brand-new… must be guilt. Right, {LI}?”*  
 **{LI}** (guarded): *“Focus on yourself, mate.”*  
 **Ariana**: *“You can feel it—the villa’s about to split into teams.”*

**Ungated (bad) mini-choice** — DO NOT block this with math:

* **“Tell everyone {LI} is clingy.”** → Drama \+3, {LI} loyalty –1

* **“Say you’re only here for TV.”** → Drama \+4, all boys’ loyalty –1

*Ariana (aside):* *“Bold move. Not… necessarily smart.”*

---

## **Afternoon: Private Check-in (if Romance with {LI} ≥ threshold)**

**{LI}**: *“Look, I’m still here for you. But you’ve got to help me drown out Kenny.”*  
 **Player typed reply** (AI-adaptive): sincere vs. evasive

* Sincere → *“Okay. Then let’s shut the noise up—together.”* (+Romance {LI} \+1)

* Evasive → *“I’m not playing second to drama.”* (Romance {LI} –1)

---

## **Math Gate \#4 (7s) — “Win Your Say at the Firepit”**

*Ariana pops up, urgent bubble:*  
 *“Quick check: **a × b \= ?** (1–10 range). You’ve got 7 seconds. Pass, and you’ll get to speak first tonight.”*

* ✅ **Pass** → *“Sharp\! You’ll get first word at the firepit—and a chance to defend your romance.”*

* ❌ **Fail** → Kenny cackles: *“No words? I’ll take the mic then.”* → Drama \+2, you **lose** the right to speak first.

---

## **Evening: Poolside Rumor Scene (pre-ceremony)**

**Kenny**: *“I heard she told {LI} they’re a placeholder.”*  
 **Nic/Rob/Miguel (pick one not-{LI} at random)**: *“Is that true?”*

**If Math Gate Passed → Free-text defense** (AI-adaptive, from the player):

* *Kind/clear message* → *“Alright, I hear you. Let’s see it through tonight.”* (+Romance {LI} \+1, Drama –1)

* *Defensive/snappy* → *“That… didn’t help your case.”* (Romance {LI} –1)

**If Math Gate Failed → Ungated bad options appear** (choose one; both terrible):

* **“Maybe I *did* say it. So what?”** → Drama \+3, {LI} loyalty –1

* **“Honestly, I think Kenny’s right.”** → Drama \+4, {LI} loyalty –2, Kenny gains social sway

---

## **Night: Firepit Ceremony**

### **If Passed the gate (you speak first)**

**Ariana**: *“You’ve earned first word.”*  
 **Player typed declaration** (AI-adaptive):

* Romantic, specific to {LI} → {LI}: *“Alright. I’m with you.”* (+Romance {LI} \+2)

* Vague / non-committal → {LI}: *“I need more than that.”* (no change)

**Choice (good, unlocked by pass):**

* **Couple with {LI}** → {LI} smiles; Kenny scowls (Drama –1)

* **Risk it with a different boy** → {LI} hurt (Romance {LI} –2), new boy \+1

### **If Failed the gate (Kenny speaks first)**

**Kenny** (grandstanding): *“She’s playing all sides. Ask {LI}.”*  
 **Ariana**: *“You’ll respond after the others.”*  
 **Ungated (bad) response options only:**

* **“Fine. I’m here for chaos.”** → Drama \+4

* **“Whatever, couple me with Kenny.”** → Instant **Kenny Path** (toxic, funny fail branch)

---

## **Late-Night Outcomes (pick by meters)**

* **Romantic Save** (Romance {LI} ≥ 4 and Drama ≤ 6):  
   {LI}: *“Come sit by me.”* → Hand-hold or kiss scene; Kenny fades to background.

* **Shaky Truce** (Romance 2–3 or Drama 7–8):  
   {LI}: *“You’ve got one more chance.”* → Neutral couple, tension remains.

* **Public Dump** (Drama ≥ 9):  
   **Ariana**: *“Babe, the villa has decided. Your time here is over.”*  
   **Kenny** (aside): *“Tough crowd.”*

---

## **Closing Narration (Ariana)**

*“The firepit’s flames die down, but the heat lingers. If you want a happy ending with {LI}, you’ll need brains, heart… and fewer catastrophes.”*

---

## **Implementation notes (for your PRD)**

* **Trigger:** Day 4 includes **Math Gate \#4** that specifically controls who speaks first at the firepit.

* **Adaptive text:** Any free-text from the player should be parsed for **tone** (sincere, romantic, evasive, hostile) and characters respond in-voice.

* **Meters:**

  * Pass gate → unlocks positive path \+ potential Romance {LI} \+2.

  * Fail gate → forces negative-only options; Drama spikes 2–4.

  * Boot rule remains: **Drama ≥ 9** at end of ceremony → elimination.

* **Kenny Path:** If the player couples with Kenny (bad choice), branch to a short toxic mini-arc on Day 5 (funny but doomed).

