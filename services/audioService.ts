let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new Ctx({ sampleRate: 24000 }); // Gemini TTS uses 24kHz
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

// --- Standard Sound Effects (Synthesized) ---

export const playSuccessSound = () => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  const notes = [523.25, 659.25, 783.99, 1046.50];
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + (i * 0.06));
    
    gain.gain.setValueAtTime(0, now + (i * 0.06));
    gain.gain.linearRampToValueAtTime(0.1, now + (i * 0.06) + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.06) + 0.4);
    
    osc.start(now + (i * 0.06));
    osc.stop(now + (i * 0.06) + 0.5);
  });
};

export const playErrorSound = () => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.linearRampToValueAtTime(100, now + 0.3);
  
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
  
  osc.start(now);
  osc.stop(now + 0.3);
};

export const playClickSound = () => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  
  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  
  osc.start(now);
  osc.stop(now + 0.08);
};

// --- PCM Audio Decoding for Gemini TTS ---

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodePCMData(
  data: Uint8Array,
  ctx: AudioContext
): Promise<AudioBuffer> {
  const sampleRate = 24000; // Gemini output rate
  const numChannels = 1;
  // Use byteOffset and byteLength to create a view on the underlying buffer correctly
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert Int16 to Float32 [-1.0, 1.0]
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const playPCMFromBase64 = async (base64String: string) => {
  try {
    const ctx = getAudioContext();
    const rawBytes = decodeBase64(base64String);
    const audioBuffer = await decodePCMData(rawBytes, ctx);
    
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();
    
    return new Promise<void>((resolve) => {
      source.onended = () => resolve();
    });
  } catch (error) {
    console.error("Error playing audio:", error);
  }
};