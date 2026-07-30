'use client';

let audioCtx = null;
let oscillator = null;
let gainNode = null;
let isPlaying = false;
let intervalId = null;

/**
 * High-Decibel Web Audio Emergency Siren Synthesizer
 * Oscillates pitch between 750Hz and 1350Hz continuously
 */
export const startEmergencySiren = () => {
  if (isPlaying) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    audioCtx = new AudioContextClass();
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

    // Siren pitch modulation (oscillate 750Hz -> 1350Hz every 350ms)
    let high = true;
    intervalId = setInterval(() => {
      if (oscillator && audioCtx && audioCtx.state === 'running') {
        oscillator.frequency.exponentialRampToValueAtTime(
          high ? 1350 : 750,
          audioCtx.currentTime + 0.3
        );
        high = !high;
      }
    }, 350);
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
};
