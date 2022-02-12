import isMobile from 'ismobilejs';
import { Subscription } from 'rxjs';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FaceDetectionComponent, FaceDetectionService} from "../../../projects/face-detection/src/public-api";

const img = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

@Component({
  selector: 'app-face-detection-page',
  templateUrl: './face-detection.page.html',
  styleUrls: ['./face-detection.page.scss']
})
export class FaceDetectionPage implements OnInit {
  title = 'dev-face-camera';
  live = true;
  iris = true;
  debug = true;
  delay = 100;
  photo: string = img;
  rectPhoto: string = img;
  stream!: MediaStream;

  // a subscription for screenshot of videos
  lastfaceDetectionSub!: Subscription;
  @ViewChild(FaceDetectionComponent, { static: true }) faceDetection!: FaceDetectionComponent;
  @ViewChild('rectPhoto') rectPhotoEle!: ElementRef<HTMLImageElement>;

  constructor(
    private el: ElementRef,
    private faceDetectionService: FaceDetectionService
  ) {}

  ngOnInit(): void {
    console.log(this.el.nativeElement.clientLeft);
    console.log(this.el.nativeElement.clientWidth);
    this.faceDetection.beginDetect$.subscribe(
      () => {
        console.log('detection started');
      },
      error => {
        console.log('error when detection start');

      }
    );
  }

  preload() {
    this.faceDetectionService.preload({ live: this.live, iris: this.iris, debug: this.debug });
  }

  get rect() {
    return isMobile().any
      ? {
          x: 0,
          y: 0,
          width: this.el.nativeElement.clientWidth,
          height: this.el.nativeElement.clientHeight
        }
      : {
          x: this.el.nativeElement.clientWidth / 4,
          y: 0,
          width: this.el.nativeElement.clientWidth / 2,
          height: this.el.nativeElement.clientHeight
      };
  }

  takePhoto() {
    if (this.lastfaceDetectionSub) {
      this.lastfaceDetectionSub.unsubscribe();
    }
    this.photo = img;
    this.rectPhoto = img;
    console.log(this.rect);
    this.lastfaceDetectionSub = this.faceDetection.takePhoto(600, 800, this.rect, true).subscribe(result => {
      const { photo, rectPhoto } = result;
      this.photo = photo || img;
      this.rectPhoto = rectPhoto || img;
    });
  }

  takeBetterPhoto() {
    if (this.lastfaceDetectionSub) {
      this.lastfaceDetectionSub.unsubscribe();
    }
    this.photo = img;
    this.rectPhoto = img;
    this.lastfaceDetectionSub = this.faceDetection.takeBetterPhoto(600, 800, this.rect, true).subscribe(d => {
      const { photo, rectPhoto } = d;
      this.photo = photo || img;
      this.rectPhoto = rectPhoto || img;
      console.log('find a photo can be used');
    });
  }

  liveness(action: string) {
    if (this.lastfaceDetectionSub) {
      this.lastfaceDetectionSub.unsubscribe();
    }
    this.lastfaceDetectionSub = this.faceDetection.liveness(action as any, this.rect).subscribe(result => {
      console.log(result);
      console.log('successful liveness detection');
    });
  }

  livenessArray() {
    if (this.lastfaceDetectionSub) {
      this.lastfaceDetectionSub.unsubscribe();
    }
    this.lastfaceDetectionSub = this.faceDetection.livenessArray(['facingLeft', 'facingRight'], this.rect).subscribe(
      () => {},
      () => {},
      () => {
        console.log('successful liveness detection');
      }
    );
  }

  livenessArrayTakeBetterPhoto(action: any) {
    if (this.lastfaceDetectionSub) {
      this.lastfaceDetectionSub.unsubscribe();
    }
    this.photo = img;
    this.rectPhoto = img;
    this.lastfaceDetectionSub = this.faceDetection
      .livenessArrayTakeBetterPhoto(
        [action],
        600,
        800,
        this.rect,
        true
      )
      .subscribe(d => {
        const { photo, rectPhoto } = d;
        this.photo = photo || img;
        this.rectPhoto = rectPhoto || img;
        console.log('successful liveness detection');
      });
  }

  play() {
    this.faceDetection.play();
  }

  pause() {
    this.faceDetection.pause();
  }

  /**
   * can't find available video stream
   */
  noAvailableStream(res: boolean) {
    //
  }
}
