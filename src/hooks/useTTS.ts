import { useCallback, useRef, useState } from 'react';
import { audioFromBase64, safePlay, stopSpeechSynthesis } from '../utils/audio';
import { synthesizeSpeech } from '../services/gemini';

export function useTTS(apiKey: string) {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    stopSpeechSynthesis();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(false);
  }, []);

  const speakBrowser = useCallback((text: string) => {
    stopSpeechSynthesis();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-GB';
    utter.rate = 0.95;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      stop();

      if (apiKey.trim()) {
        try {
          const audioData = await synthesizeSpeech(apiKey, text);
          if (audioData) {
            const audio = audioFromBase64(audioData.base64, audioData.mimeType);
            audioRef.current = audio;
            audio.onended = () => setSpeaking(false);
            setSpeaking(true);
            await safePlay(audio);
            return;
          }
        } catch {
          // fall through to browser TTS
        }
      }

      speakBrowser(text);
    },
    [apiKey, speakBrowser, stop],
  );

  return { speaking, speak, stop };
}
