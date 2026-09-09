// Industrial Text-To-Speech (TTS) Engine for Field Operators & Engineers
// Allows hands-free audio listening to technical instructions, ISO vibration audits & SOPs

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentText: string;
  progressPercent: number;
  rate: number;
}

type TTSListener = (state: TTSState) => void;

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<TTSListener> = new Set();
  private state: TTSState = {
    isPlaying: false,
    isPaused: false,
    currentText: '',
    progressPercent: 0,
    rate: 1.0,
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: TTSListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l({ ...this.state }));
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      lang?: string;
      onComplete?: () => void;
    }
  ) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser environment.');
      return;
    }

    // Cancel any existing speech
    this.stop();

    if (!text || text.trim().length === 0) return;

    const rate = options?.rate ?? this.state.rate;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = options?.pitch ?? 1.0;

    // Detect language: if contains Persian/Arabic characters use 'fa-IR', else 'en-US'
    const isFarsi = /[\u0600-\u06FF]/.test(text);
    utterance.lang = options?.lang || (isFarsi ? 'fa-IR' : 'en-US');

    // Pick best available voice matching language
    const voices = this.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(isFarsi ? 'fa' : 'en'));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    this.state = {
      isPlaying: true,
      isPaused: false,
      currentText: text,
      progressPercent: 0,
      rate,
    };
    this.currentUtterance = utterance;
    this.notify();

    utterance.onboundary = (event) => {
      if (text.length > 0 && event.charIndex !== undefined) {
        const pct = Math.min(100, Math.round((event.charIndex / text.length) * 100));
        this.state.progressPercent = pct;
        this.notify();
      }
    };

    utterance.onend = () => {
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.state.progressPercent = 100;
      this.currentUtterance = null;
      this.notify();
      options?.onComplete?.();
    };

    utterance.onerror = (e) => {
      console.error('SpeechSynthesis error:', e);
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    };

    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.state.isPlaying && !this.state.isPaused) {
      this.synth.pause();
      this.state.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.state.isPaused) {
      this.synth.resume();
      this.state.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.state.progressPercent = 0;
      this.currentUtterance = null;
      this.notify();
    }
  }

  public setRate(rate: number) {
    this.state.rate = rate;
    if (this.state.isPlaying && this.state.currentText) {
      this.speak(this.state.currentText, { rate });
    } else {
      this.notify();
    }
  }
}

export const ttsService = new TTSService();
