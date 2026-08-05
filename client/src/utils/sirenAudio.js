'use client';

let audioCtx = null;
let oscillator = null;
let gainNode = null;
let isPlaying = false;
let intervalId = null;

// Global touch/click interaction handler to unlock suspended AudioContext on mobile devices
if (typeof window !== 'undefined') {
  const unlockAudioOnInteraction = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        console.log('[Siren Audio] AudioContext resumed on user interaction');
      }).catch(() => {});
    }
  };

  window.addEventListener('touchstart', unlockAudioOnInteraction, { capture: true, passive: true });
  window.addEventListener('click', unlockAudioOnInteraction, { capture: true, passive: true });
  window.addEventListener('pointerdown', unlockAudioOnInteraction, { capture: true, passive: true });
}

/**
 * High-Decibel Web Audio Emergency Siren Synthesizer
 * Oscillates pitch between 750Hz and 1350Hz continuously
 */
export const startEmergencySiren = () => {
  if (isPlaying) {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return;
  }

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    audioCtx = new AudioContextClass();

    // Mobile browsers initialize AudioContext in 'suspended' state until explicitly resumed
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(750, audioCtx.currentTime);

    // Loud, attention-grabbing volume gain
    gainNode.gain.setValueAtTime(0.85, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    isPlaying = true;

    // Siren pitch modulation (oscillate 750Hz -> 1350Hz every 300ms)
    let high = true;
    intervalId = setInterval(() => {
      if (oscillator && audioCtx) {
        if (audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => {});
        }
        if (audioCtx.state === 'running') {
          oscillator.frequency.exponentialRampToValueAtTime(
            high ? 1350 : 750,
            audioCtx.currentTime + 0.25
          );
          high = !high;
        }
      }
    }, 300);

    // Trigger mobile vibration pattern
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate([1000, 300, 1000, 300, 1000, 300, 1000]);
      } catch (ve) {}
    }
  } catch (e) {
    console.warn('[Siren Audio] High-decibel audio siren could not start automatically:', e.message);
  }
};

/**
 * Stops Emergency Siren
 */
export const stopEmergencySiren = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (oscillator) {
    try {
      oscillator.stop();
    } catch (e) {}
    oscillator = null;
  }
  if (audioCtx) {
    try {
      audioCtx.close();
    } catch (e) {}
    audioCtx = null;
  }
  gainNode = null;
  isPlaying = false;

  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      navigator.vibrate(0);
    } catch (ve) {}
  }
};
