# IELTS Speaking Simulator & AI Coach

A responsive single-page React application for practicing the IELTS Speaking exam with AI-powered evaluation, speech recognition, text-to-speech, and visual brainstorming tools.

## Features

- **Exam Modes**: Part 1, Part 2 (cue card with prep/speaking timers), Part 3, and Full Test
- **Speech-to-Text**: Web Speech API with hold/click microphone button
- **Text-to-Speech**: Gemini TTS with browser SpeechSynthesis fallback
- **AI Evaluation**: Band scores across all 4 IELTS criteria via Gemini
- **Imagen 4**: Visual scene generation for Part 2 cue cards
- **Dynamic Follow-ups**: AI-generated follow-up questions based on your answers
- **Dark/Light Mode**: Sleek slate/indigo/emerald UI

## Setup

1. Install [Node.js](https://nodejs.org/) (v18+)
2. Install dependencies:

```bash
cd ielts-speaking-simulator
npm install
```

3. Configure your Gemini API key (optional — browser TTS works without it):

```bash
cp .env.example .env
# Edit .env and set VITE_GEMINI_API_KEY=your_key
```

Or enter the key in the in-app Settings drawer.

4. Start the dev server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## API Key

Get a free API key at [Google AI Studio](https://aistudio.google.com/apikey).

## Browser Support

- Chrome/Edge recommended for Web Speech API
- Microphone permission required for speech input

## Project Structure

```
src/
├── components/
│   ├── AudioRecorder.tsx   # Mic button + STT
│   ├── AudioWave.tsx       # Playback animation
│   ├── BandScoreModal.tsx  # Evaluation results
│   ├── Header.tsx
│   ├── KeySettings.tsx     # API key & preferences
│   ├── ModeSelector.tsx
│   ├── QuestionCard.tsx
│   └── Timer.tsx           # Prep & speaking countdown
├── data/questions.ts       # IELTS question bank
├── hooks/
│   ├── useGemini.ts
│   ├── useSpeechRecognition.ts
│   └── useTTS.ts
├── services/gemini.ts      # Gemini API integration
├── types/index.ts
└── utils/audio.ts          # Safe audio playback
```
