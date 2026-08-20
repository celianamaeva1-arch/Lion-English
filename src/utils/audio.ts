/** Decode base64 audio and return a playable HTMLAudioElement. */
export function audioFromBase64(
  base64: string,
  mimeType = 'audio/wav',
): HTMLAudioElement {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true });
  return audio;
}

/** Safely play audio; swallow AbortError from overlapping playback. */
export async function safePlay(audio: HTMLAudioElement): Promise<void> {
  try {
    await audio.play();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    console.warn('Audio playback failed', err);
  }
}

export function stopSpeechSynthesis(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
