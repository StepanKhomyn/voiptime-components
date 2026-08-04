export interface VVideoPlayerProps {
  videoBlob?: Blob | string | null;
}

export type VVideoPlayerEmits = {
  asyncUploadVideo: [];
};