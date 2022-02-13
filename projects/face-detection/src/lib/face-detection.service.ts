import { BehaviorSubject } from 'rxjs';

import { Inject, Injectable } from '@angular/core';

import { IFaceDetectionOptions, NGX_FACE_DETECTION } from './face-detection.interface';
import { createHuman } from './human-helper';
import { loadScript } from './load-script';
import { getConfig } from './get-config';

@Injectable({ providedIn: 'root' })
export class FaceDetectionService {
  loaded!: boolean;

  private cachePromiseMap = new Map<string, Promise<boolean>>();
  private loadModelSub = new BehaviorSubject(false);
  loadModel$ = this.loadModelSub.asObservable();

  constructor(@Inject(NGX_FACE_DETECTION) private options: IFaceDetectionOptions) {}

  /**
   * preload the sources of humanjs
   */
  async preload(options?: { live: boolean; iris: boolean; debug: boolean }) {
    // let { live, iris } = options;
    const live = options?.live ? options?.live : false;
    let iris = options?.iris ? options?.iris : false;
    iris = live && iris;
    const cacheKey = `${live}|${iris}`;
    if (!this.cachePromiseMap.has(cacheKey)) {
      const config = getConfig({
        resourcesUrl: this.options.resourcesUrl,
        ...options
      });
      const promise = loadScript(this.options.script)
        .then(() => createHuman(config).load(config))
        .then(
          () => {
            this.loadModelSub.next(true);
            this.loaded = true;
            return true;
          },
          () => false
        )
        .catch(err => {
          console.log(err);
          return false;
        });
      this.cachePromiseMap.set(cacheKey, promise);
    }
    return this.cachePromiseMap.get(cacheKey);
  }
}
