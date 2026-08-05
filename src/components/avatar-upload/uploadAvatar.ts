export interface DragRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ZoomRect extends DragRect {
  zoom?: number;
}

export interface CropRange {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export function getRange(select: DragRect, target: ZoomRect): CropRange {
  const zoom = target.zoom || 1;
  const sx = select.left - target.left > 0 ? select.left - target.left : 0;
  const sy = select.top - target.top > 0 ? select.top - target.top : 0;
  const sw = select.width;
  const sh = select.height;
  return {
    sx: sx / zoom,
    sy: sy / zoom,
    sw: sw / zoom,
    sh: sh / zoom,
  };
}

export function createCutImg() {
  const canvas = document.createElement('canvas');
  const contex = canvas.getContext('2d')!;

  return function cutImg(url: string, range: CropRange, format = 'png'): Promise<Blob> {
    const { sx, sy, sw, sh } = range;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = '';
      img.src = url;
      img.onload = () => {
        canvas.height = sh;
        canvas.width = sw;
        contex.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          reject(new Error('canvas to blob error'));
          contex.restore();
        }, format);
      };
      img.onerror = e => {
        reject(e);
      };
    });
  };
}

export function getVectorLength(vector: number[]) {
  return Math.sqrt(vector.reduce((pre, cur) => pre + cur ** 2, 0));
}

export function getProjectionLength(vector: number[], targetVector: number[]) {
  const targetVectorLength = getVectorLength(targetVector);
  let dotProduct = 0;
  vector.forEach((v, i) => {
    dotProduct += v * targetVector[i];
  });
  return dotProduct / targetVectorLength;
}

export function getBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export function isMobile() {
  return !!navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  );
}