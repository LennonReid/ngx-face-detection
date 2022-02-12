import { IHumanResult } from './human.interface';
import { Config } from '@vladmandic/human';

declare const Human: any;

export interface IHuman {
  detect(image: any, config?: Config): Promise<IHumanResult>;

  load(config?: Config): Promise<void>;

  warmup(config: Config, image?: any): Promise<IHumanResult>;

  image(image?: any, config?: Config): Promise<IHumanResult>;

  simmilarity(embedding1: any, embedding2: any): any;

  [key: string]: any;
}

let human: IHuman;

export function createHuman(config: any): IHuman {
  if (Human && !human) {
    human = new Human.default(config);
  }
  return human;
}

export interface IOptions {
  eleWidth: number;
  eleHeight: number;
  isMobile: boolean;
  maxWidth: number;
  maxHeight: number;
}

export function getNeedVideoWidth(
  width: number,
  height: number,
  videoMaxWidth: number,
  videoMaxHeight: number,
  isMobile: boolean
): MediaTrackConstraints {
  const oldW = width;
  const oldH = height;
  if (isMobile) {
    width = oldH;
    height = oldW;
    videoMaxWidth = videoMaxHeight;
  }
  // Limit maximum width of video
  if (width > videoMaxWidth) {
    width = videoMaxWidth;
    const bl = width / height;
    height = Math.round(width / bl);
  }

  return {
    width
  };
}
