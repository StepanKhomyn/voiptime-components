import WaveSurfer from 'wavesurfer.js';

export interface VAudioProps {
  recordUrl?: string | null;
  userA?: string | null;
  userB?: string | null;
  disabled?: boolean;
}

export type PlaybackSpeed = 1 | 1.5 | 2;

// Типізація для емітів
export type VAudioEmits = {
  timeUpdate: [currentTime: number];
  play: [];
  pause: [];
  ended: [];
  error: [];
};

// @ts-ignore
export interface WaveSurferInstance extends WaveSurfer {
  getMediaElement(): HTMLMediaElement;

  decodedData: AudioBuffer | null;
}

export const CHANNEL_COLORS = {
  WAVE_DEFAULT: '#D9D9D9',
  PROGRESS: '#F2994A',
} as const;
