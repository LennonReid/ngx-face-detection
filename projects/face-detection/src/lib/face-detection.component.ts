import isMobileFn from 'ismobilejs';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, map, share, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { Config } from '@vladmandic/human';
import {
  FaceRect,
  IFaceDetectionOptions,
  LivenessActionResult,
  LivenessActions,
  NGX_FACE_DETECTION
} from './face-detection.interface';
import { FaceDetectionService } from './face-detection.service';
import { getBetterPhoto } from './get-better-photo';
import { getConfig } from './get-config';
import { getAvailableVideoInputs } from './getAvailableVideoInputs';
import { createHuman, getNeedVideoWidth, IHuman } from './human-helper';
import { IHumanFaceResult, IHumanResult } from './human.interface';
import { hasLivenessAction, variance } from './liveness.util';
import { loadScript } from './load-script';
import { mapFaceResult } from './map-face-result';
import { takefacePhoto, takeVideoPhoto } from './take-photo';
import { groupFace } from './takephoto.util';

type ImageSizeType = 'original' | 'compressed';
type ImageSourceType = 'album' | 'camera';
// 处理以下 rect
const getFilterFace = (result: IHumanResult) =>
  result.face
    .filter(face => face.withinRect && face.box[2] > 50)
    // 脸大的优先识别
    .sort((face1, face2) => face2.box[2] - face1.box[2]);

/**
 * a compoent for photo taking
 */
@Component({
  selector: 'ngx-face-detection',
  templateUrl: './face-detection.component.html',
  styleUrls: ['./face-detection.component.scss']
})
export class FaceDetectionComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  // debug
  _info = '';
  _score = 0;
  // Cache a canvas for calculation
  private canvasEle!: HTMLCanvasElement;

  // the interval to face detection
  @Input() delay = 100;

  // if liveness detection needed
  @Input() bioassay = false;
  // if eyes detection needed
  @Input() iris = false;

  // ismobile devices or not
  @Input() isMobile: boolean = isMobileFn().any;

  // open test panel or not
  @HostBinding('class.debug')
  @Input()
  debug = false;

  // the steam of video
  @Input() stream!: any;

  // autoplay
  @Input() autoplay = true;

  // config for humanJs
  private config!: Config;

  // The maximum width of the video, some machines cannot exceed 1280
  @Input() videoMaxWidth = 1280;
  // The maximum height of the video
  @Input() videoMaxHeight = 720;

  @ViewChild('videoFaceDetect', { static: true }) videoEle!: ElementRef<HTMLVideoElement>;
  @ViewChild('devCanvas') devCanvasEle!: ElementRef<HTMLCanvasElement>;

  // there is still no available stream when request to open camera again
  @Output() noAvailableStream = new EventEmitter<boolean>();
  private onDestroy$ = new Subject<void>();

  // detect the status that the sources of humanjs loaded completely or not
  private detectStateSub = new BehaviorSubject<boolean>(false);
  // the observable for status
  onDetect$ = this.detectStateSub.asObservable();
  // the detection status in first time
  beginDetect$ = this.onDetect$.pipe(
    filter(d => d),
    take(1)
  );

  // the observale of face detection
  detect$ = new Observable<IHumanResult>(subscribe => {
    let timer: any;
    let unsubscribed = false;
    const loop = async () => {
      if (unsubscribed) {
        return;
      }
      if (!this.FaceDetectionService.loaded) {
        await this.FaceDetectionService.preload({
          live: this.bioassay,
          iris: this.iris,
          debug: this.debug
        });
      }
      const result = await this.detectVideoDelegate(this.config);
      if (result && result.face) {
        this.detectStateSub.next(true);
      }
      if (result && result.face && result.face.length && result.face.length > 0) {
        // TODO: Every time you upgrade humanjs, you may need to adapt to the new detection frame width
        // Fix the problem that the face width is larger when the mesh mode is disabled
        let sm = 0.6;
        if (this.config && this.config.face.mesh?.enabled !== true) {
          sm = 0.4;
          if (this.isMobile) {
            sm = 0.5;
          }
        }
        result.face = result.face.map(face => {
          const [fx, fy, fw, fh] = face.box;
          let bx = fx;
          let by = fy;
          let bWidth = fw;
          let bHeight = fh;

          const nWidth = bWidth * sm;
          const nHeight = bHeight * sm;
          bx += (bWidth - nWidth) / 2;
          by += (bHeight - nHeight) / 2;

          bWidth = nWidth;
          bHeight = nHeight;
          face.box = [bx, by, bWidth, bHeight];
          return face;
        });
        subscribe.next(result);
        if (this.debug && result.face[0]) {
          const face = result.face[0];
          this._info =
            (face.gesture || []).join(',') +
            '\nbackend: ' +
            result.performance.backend +
            '\nload: ' +
            result.performance.load +
            '\nimage: ' +
            result.performance.image +
            '\ntotal: ' +
            result.performance.total +
            '\nfacebox: ' +
            face.box[2] +
            '\nconfidence: ' +
            face.confidence;
        }
      }
      timer = setTimeout(loop, this.delay);
    };
    loop();
    return () => {
      unsubscribed = true;
      this.detectStateSub.next(false);
      clearTimeout(timer);
    };
  }).pipe(share());

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) document: any,
    @Inject(NGX_FACE_DETECTION) private options: IFaceDetectionOptions,
    private FaceDetectionService: FaceDetectionService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.canvasEle = document.createElement('canvas');
    }
  }

  @HostBinding('class.video-loaded')
  loadstartVideo = false;

  loadstartHandler() {
    this.loadstartVideo = true;
  }

  /**
   * pause the stream of camera
   */
  pause() {
    this.videoEle.nativeElement.pause();
  }

  /**
   * stop the steam of camera
   */
  stopStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((i: any) => i.stop());
      this.stream = void 0;
    }
  }

  /**
   * play the stream of camera
   */
  play() {
    if (this.videoEle) {
      this.videoEle.nativeElement.play();
    }
  }

  /**
   * take a photo when there have faces in the area for face-detection
   *
   * @param photo [width=600] the width of the photo needed
   * @param rectPhoto [height=800] the height of the photo needed
   * @param faceRect [faceRect] the area for face-detection
   * @param videoPhoto [videoPhoto] need photo or not
   */
  takePhoto(
    width: number = 600,
    height: number = 800,
    faceRect?: FaceRect,
    videoPhoto?: boolean
  ): Observable<{ photo?: string; rectPhoto?: string; result: IHumanResult }> {
    return new Observable(subscribe => {
      const faces: IHumanResult[] = [];
      const scores: number[] = [];
      const sub = this.detectWithRect(faceRect)
        .pipe(
          filter(d => d.face.length > 0),
          filter(result => getFilterFace(result)?.length > 0),
          // TODO: Here is currently a group of 5, which can be adjusted according to the actual situation
          tap(res => {
            faces.push(res);
          }),
          // filter(res => faces.length >= 3),
          tap(face => scores.push(groupFace(faces))),
          filter(res => scores.length >= 3),
          filter(res => {
            if (variance(scores) > 0 && variance(scores) < 2) {
              return true;
            } else {
              scores.shift();
              faces.shift();
              return false;
            }
          }),
          takeUntil(this.onDestroy$)
        )
        .subscribe(async result => {
          let photo: string | undefined = void 0;
          let rectPhoto: string | undefined = void 0;
          const withinRect = getFilterFace(result);
          if (withinRect.length > 0) {
            let _rectPhoto: string | undefined = void 0;
            const faceBox = withinRect[0].box;
            // Capture a face image with a specified width and size
            const _photo = takefacePhoto(this.videoEle.nativeElement, this.canvasEle, width, height, {
              x: faceBox[0],
              y: faceBox[1],
              width: faceBox[2],
              height: faceBox[3]
            });
            if (videoPhoto) {
              _rectPhoto = takeVideoPhoto(this.videoEle.nativeElement, this.canvasEle);
            }
            photo = _photo;
            rectPhoto = _rectPhoto;
            if (photo) {
              if (this.isMobile) {
                // send result
                subscribe.next({ photo, rectPhoto, result });
                // complete the observale when there have a sent image
                if (photo) {
                  sub.unsubscribe();
                  subscribe.complete();
                }
              } else {
                const imgRepeated = document.createElement('img');
                if (imgRepeated) {
                  imgRepeated.src = photo;
                  imgRepeated.onload = async () => {
                    const finalResult = await this.human.detect(
                      imgRepeated,
                      getConfig({
                        resourcesUrl: this.options?.resourcesUrl,
                        debug: this.debug,
                        iris: false,
                        live: false
                      })
                    );
                    if (finalResult && finalResult.face && finalResult.face.length > 0) {
                      // send result
                      subscribe.next({ photo, rectPhoto, result });
                      // complete the observale when there have a sent image
                      if (photo) {
                        sub.unsubscribe();
                        subscribe.complete();
                      }
                    }
                  };
                }
              }
            }
          }
        });
      return () => sub.unsubscribe();
    });
  }

  /**
   * get better photo of faces
   *
   * @param photo [width=600] the width of the photo needed
   * @param rectPhoto [height=800] the height of the photo needed
   * @param faceRect [faceRect] the area for face-detection{{
   * @param videoPhoto [videoPhoto] need photo or not}}
   */
  takeBetterPhoto(
    width: number = 600,
    height: number = 800,
    faceRect?: FaceRect,
    videoPhoto?: boolean
  ): Observable<{ photo?: string; rectPhoto?: string; result: IHumanResult }> {
    // The current level  the bigger the badder
    let currentBetterLevel = Number.MAX_SAFE_INTEGER;
    // TODO: consider the situation when the person isn't the origin person
    // TODO: Found the phenomenon, 1, the movement distance will not be too large, 2, the face width and height will not change too much
    // current face data
    let currnetFaceData: IHumanFaceResult;
    return new Observable(subscribe => {
      const sub = this.detectWithRect(faceRect)
        .pipe(
          filter(d => d.face.length > 0),
          takeUntil(this.onDestroy$)
        )
        .subscribe(result => {
          let rectPhoto: string | undefined = void 0;
          // If a face is detected
          const withinRect = getFilterFace(result);
          if (withinRect.length > 0) {
            const faceBox = withinRect[0].box;
            // Determine if faceBox is better than the current one
            const { level, isBetter } = getBetterPhoto(currentBetterLevel, withinRect[0], currnetFaceData);
            if (isBetter) {
              // Update level and data
              currentBetterLevel = level;
              currnetFaceData = withinRect[0];
              // Capture a face image with a specified width and size
              const photo = takefacePhoto(this.videoEle.nativeElement, this.canvasEle, width, height, {
                x: faceBox[0],
                y: faceBox[1],
                width: faceBox[2],
                height: faceBox[3]
              });
              // Capture a picture in an determinate area
              if (videoPhoto) {
                rectPhoto = takeVideoPhoto(this.videoEle.nativeElement, this.canvasEle);
              }
              subscribe.next({ photo, rectPhoto, result });
            }
          }
        });
      return () => sub && sub.unsubscribe();
    });
  }

  /**
   * judge if the person is human being or not
   */
  liveness(action: LivenessActions, faceRect?: FaceRect): Observable<boolean> {
    const faceDataArr: LivenessActionResult[] = [];
    const maxLen = 30;
    const minLen = 5;
    return new Observable(subscribe => {
      const sub = this.detectWithRect(faceRect)
        .pipe(
          takeUntil(this.onDestroy$),
          filter(d => d.face.length > 0),
          map(result => {
            const withinRect = getFilterFace(result);
            // TODO: function called more than once
            if (withinRect.length > 0) {
              const face = withinRect[0];
              const gestures = mapFaceResult(face);
              faceDataArr.push(gestures);
              if (faceDataArr.length > maxLen) {
                faceDataArr.shift();
              }
            }
            return faceDataArr;
          }),
          filter(result => result.length > minLen)
        )
        .subscribe(result => {
          const isLiveness = hasLivenessAction(result, action);
          if (isLiveness) {
            subscribe.next(true);
            subscribe.complete();
          }
        });
      return () => sub && sub.unsubscribe();
    });
  }

  /**
   * judge if the person is human being or not by a lot of actions
   * @param actions a lot of actions needed
   * @param faceRect the determinate to face-detection
   */
  livenessArray(actions: LivenessActions[], faceRect?: FaceRect): Observable<{ act: string; num: number }> {
    return new Observable(subscribe => {
      if (actions.length === 0) {
        subscribe.error('an action at least');
      }
      let ob: Observable<boolean> = of(true);
      for (let i = 0; i < actions.length; i++) {
        const act = actions[i];
        ob = ob.pipe(
          switchMap(() => this.liveness(act, faceRect)),
          tap(() => subscribe.next({ act: act, num: i }))
        );
      }
      const sub = ob.subscribe(() => subscribe.complete());

      return () => sub && sub.unsubscribe();
    });
  }

  /**
   * judge if the person is human being or not by a lot of actions and return the best photo in the process when face-detection
   * @param actions a lot of actions needed
   * @param width the width needed
   * @param height the height needed
   * @param faceRect the determinate area to face-detection
   * @param videoPhoto [videoPhoto] need photo or not
   */
  livenessArrayTakeBetterPhoto(
    actions: LivenessActions[],
    width: number = 600,
    height: number = 800,
    faceRect?: FaceRect,
    videoPhoto?: boolean
  ): Observable<{ step: number; action: string; photo?: string; rectPhoto?: string }> {
    return new Observable(subscribe => {
      const sub = combineLatest([
        this.livenessArray(actions, faceRect),
        this.takeBetterPhoto(width, height, faceRect, videoPhoto)
      ]).subscribe(([action, result]) => {
        if (action.num >= actions.length - 1) {
          subscribe.next({ step: action.num, action: action.act, photo: result.photo, rectPhoto: result.rectPhoto });
          subscribe.complete();
        }
        subscribe.next({ step: action.num, action: action.act });
      });
      return () => sub && sub.unsubscribe();
    });
  }

  /**
   * face detection in a determinate area
   *
   * @param rect the determinate area
   */
  detectWithRect(rect?: FaceRect): Observable<IHumanResult> {
    const { x, y, width, height } = rect || {
      x: 0,
      y: 0,
      width: Number.MAX_SAFE_INTEGER,
      height: Number.MAX_SAFE_INTEGER
    };
    let devCtx: CanvasRenderingContext2D | null;
    if (this.debug && this.devCanvasEle) {
      devCtx = this.devCanvasEle.nativeElement.getContext('2d');
    }
    return this.detect$.pipe(
      map((result: IHumanResult) => {
        const vWidth = this.videoEle.nativeElement.videoWidth;
        const vHeight = this.videoEle.nativeElement.videoHeight;
        const nWidth = this.elementRef.nativeElement.clientWidth || document.body.clientWidth;
        const nHeight = this.elementRef.nativeElement.clientHeight || document.body.clientHeight;
        // 画范围框
        if (this.debug && devCtx) {
          this.devCanvasEle.nativeElement.width = nWidth;
          this.devCanvasEle.nativeElement.height = nHeight;
          devCtx.clearRect(0, 0, nWidth, nHeight);
          devCtx.fillStyle = '#FF000033';
          if (width && height) {
            devCtx.fillRect(x, y, width, height);
          }
          // import('./draw').then(d => {
          //   d.drawFace(result, this.devCanvasEle.nativeElement, this.human.facemesh.triangulation);
          // });
        }
        // Add withinRect to calculate whether the face is inside the determinate area
        result.face = result.face.map((face, index) => {
          const [fx, fy, fw, fh] = face.box;

          // Flip transformation of box position
          let b_lt_x = vWidth - fx - fw;
          let b_lt_y = fy;
          let b_rb_x = b_lt_x + fw;
          let b_rb_y = b_lt_y + fh;

          const vBl = vWidth / vHeight;
          const nBl = nWidth / nHeight;

          // The fit cover mode converts the coordinates of the video to the screen
          if (vBl > nBl) {
            // height 100%
            const bw = nHeight / vHeight;
            b_lt_x *= bw;
            b_lt_y *= bw;
            b_rb_x *= bw;
            b_rb_y *= bw;
            const px = (nWidth - vWidth * bw) / 2;
            // Calculate the deviation of x
            b_lt_x += px;
            b_rb_x += px;
          } else {
            // width 100%
            const bw = nWidth / vWidth;
            b_lt_x *= bw;
            b_lt_y *= bw;
            b_rb_x *= bw;
            b_rb_y *= bw;
            // Calculate the deviation of y
            const py = (nHeight - vHeight * bw) / 2;
            b_lt_y += py;
            b_rb_y += py;
          }

          face.gesture = result.gesture.filter(d => d.face === index).map(d => d.gesture);
          // TODO: Filter out non-positive faces
          let withinRect;
          if (width && height) {
            withinRect = b_lt_x > x && b_lt_y > y && b_rb_x < x + width && b_rb_y < y + height;
          }

          if (this.debug && devCtx) {
            //  the width and height of faces
            const b_width = b_rb_x - b_lt_x;
            const b_height = b_rb_y - b_lt_y;
            // the line to describe faces
            const color = ['green', 'red', 'yellow', 'blue', 'cyan', 'purple'][index];
            devCtx.fillStyle = devCtx.strokeStyle = color;
            devCtx.lineWidth = 4;
            const size = 30;
            let line = 1;
            devCtx.font = `${size}px Arial`;
            devCtx.strokeRect(b_lt_x, b_lt_y, b_width, b_height);
            devCtx.fillText(`${index}`, b_lt_x + 10, b_lt_y + size * line++, b_width);
            devCtx.fillText(`${face.gesture.join(',')}`, b_lt_x + 10, b_lt_y + size * line++, b_width);
          }

          // Assign current face recognition information
          return { ...face, withinRect };
        });
        return result;
      })
    );
  }

  /**
   * start detection
   */
  begin(stream: MediaStream = this.stream) {
    return new Observable(subscribe => {
      // Determine if it can work
      const beginNext = () => {
        if (this.stream && this.videoEle && this.videoEle.nativeElement.srcObject !== this.stream) {
          this.videoEle.nativeElement.srcObject = this.stream;
          this.play();
        }
        if (this.FaceDetectionService.loaded) {
          subscribe.complete();
        }
      };

      if (stream && stream.active) {
        this.stream = stream;
        beginNext();
      } else {
        const options = this.getNeedWidth();
        // Get the stream again
        navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: {
              ...options,
              facingMode: 'user'
            }
          })
          .then(
            sm => {
              this.stream = sm;
              beginNext();
            },
            error => {
              subscribe.error(error);
            }
          )
          .catch(err => {
            this.noAvailableStream.emit(true);
            console.log(err);
          });
      }
    });
  }

  /**
   * Get the width and height of cemera
   */
  private getNeedWidth(): MediaTrackConstraints {
    const width = this.elementRef.nativeElement.clientWidth;
    const height = this.elementRef.nativeElement.clientHeight;
    return getNeedVideoWidth(width, height, this.videoMaxWidth, this.videoMaxHeight, this.isMobile);
  }

  private get human(): IHuman {
    return createHuman(this.config);
  }

  private async detectVideoDelegate(config?: Config) {
    // Judgment and execution environment
    if (!this.videoEle) {
      return false;
    }
    const videoEl = this.videoEle.nativeElement;
    if (!videoEl.currentTime || videoEl.paused || videoEl.ended) {
      return false;
    }
    // videoEl.srcObject = this.stream;
    await loadScript(this.options?.script);
    return await this.human.detect(videoEl, config);
  }

  private updateConfig() {
    if (this.options) {
      this.config = getConfig({
        resourcesUrl: this.options?.resourcesUrl,
        debug: this.debug,
        iris: this.iris,
        live: this.bioassay
      });
    }
  }

  ngOnInit() {
    this.updateConfig();
  }

  async ngAfterViewInit() {
    this.startCamera();
  }

  ngOnChanges(changes: SimpleChanges) {
    const { stream, iris, bioassay } = changes;
    if (stream?.currentValue) {
      if (this.stream && this.stream.active) {
        this.startCamera();
      }
    }
    if (iris?.currentValue || bioassay?.currentValue) {
      this.updateConfig();
    }
  }

  /**
   * Turn on the camera
   */
  async startCamera() {
    if (isPlatformBrowser(this.platformId)) {
      //TODO: Error handling 325
      // Is there a camera capability
      const videoInput = await getAvailableVideoInputs();
      console.log(videoInput);
      const hasDeviceId = videoInput?.some(video => video.deviceId);
      if (hasDeviceId) {
        this.begin().subscribe();
      } else {
        // TODO: no avaiable camera
        // this.turnOnCamera();
        console.log('no avaiable camera');
      }
    }
  }

  async detect(img: any) {
    return this.human.detect(img, this.config);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
