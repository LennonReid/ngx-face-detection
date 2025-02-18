# ngx-face-detection

A library for face detection based on [vladmandic/human](https://github.com/vladmandic/human) and TensorFlow/JS

[repo](https://github.com/lenonMax/ngx-face-detection)

[demo](https://lenonmax.github.io/ngx-face-detection)
```
npm i ngx-face-detection @vladmandic/human ismobilejs mathjs
```

or

```
yarn add ngx-face-detection @vladmandic/human ismobilejs mathjs
```

## Additional Config

### 1. Create `longtypes.d.ts` file in `src`
And put this code on `longtypes.d.ts`:
``` typescript
import Long from 'long';

declare module '@tensorflow/tfjs-core/dist/hash_util' {
  export function hexToLong(hex: string): Long;
  export function fingerPrint64(s: Uint8Array, len?: number): Long;
}
```

### 2. Add new config on tsconfig.json
``` typescript
{
  ...
  "compilerOptions": {
    ...
    "types": ["@webgpu/types", "src/longtypes.d.ts"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  ...
}
```

## get-started

### 1. Project. Json or angular.json of the required app

Add it to assets

```json

{
  "glob": "human.{js,js.map}",
  "input": "node_modules/@vladmandic/human/dist",
  "output": "./human"
},
{
"glob": "*.{bin,json}",
"input": "node_modules/@vladmandic/human/models",
"output": "./human/models"
},
{
"glob": "*.wasm",
"input": "node_modules/@vladmandic/human/assets",
"output": "./human/assets"
}
```

examples:

```json

    "ngx-face-detection": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss"
        },
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/ngx-face-detection",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "human.{js,js.map}",
                "input": "node_modules/@vladmandic/human/dist",
                "output": "./human"
              },
              {
                "glob": "*.{bin,json}",
                "input": "node_modules/@vladmandic/human/models",
                "output": "./human/models"
              },
              {
                "glob": "*.wasm",
                "input": "node_modules/@vladmandic/human/assets",
                "output": "./human/assets"
              }
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "ngx-face-detection:build:production"
            },
            "development": {
              "browserTarget": "ngx-face-detection:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "ngx-face-detection:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "src/test.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.spec.json",
            "karmaConfig": "karma.conf.js",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": []
          }
        }
      }
    }
```

These variables are used when the module is loaded.

### 2. Import in appModule

examples:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceDetectionModule } from "../../projects/face-detection/src/lib/face-detection.module";
import {FaceDetectionPageModule} from "./face-detection/face-detection.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FaceDetectionPageModule,
    // ----------------------------------------------------------------------------- [ local lib ]
    FaceDetectionModule.forRoot({
      script: 'human/human.js',
      // baseHref
      resourcesUrl: '/ngx-face-detection/',
      production: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

```
### 3. in required html file

examples:

```html
<ngx-face-detection (noAvailableStream)="noAvailableStream($event)" [stream]="stream" [bioassay]="live" [iris]="iris" [debug]="debug"></ngx-face-detection>
```

### 4. in required ts file

examples:

```typescript
import {Subscription} from 'rxjs';

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  FaceDetectionComponent,
  FaceDetectionService,
  isMobile,
  getUserMedia
} from "../../../projects/face-detection/src/public-api";

const img = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

@Component({
  selector: 'app-face-detection-page',
  templateUrl: './face-detection.page.html',
  styleUrls: ['./face-detection.page.scss']
})
export class FaceDetectionPage implements OnInit, AfterViewInit {
  loading = true;
  title = 'dev-face-camera';
  live = true;
  iris = true;
  debug = true;
  delay = 100;
  photo: string = img;
  rectPhoto: string = img;
  stream!: MediaStream;
  public isMobile = isMobile(window);

  videoMaxWidth = 1440;
  videoMaxHeight = 720;

  get width() {
    return this.el.nativeElement.clientWidth || document.body.clientWidth;
  }

  get height() {
    return this.el.nativeElement.clientHeight || document.body.clientHeight;
  }

  // a subscription for screenshot of videos
  lastfaceDetectionSub!: Subscription;
  @ViewChild(FaceDetectionComponent, {static: true}) faceDetection!: FaceDetectionComponent;
  @ViewChild('rectPhoto') rectPhotoEle!: ElementRef<HTMLImageElement>;

  constructor(
    private el: ElementRef<HTMLElement>,
    private faceDetectionService: FaceDetectionService
  ) {
  }

  getCamera() {
    try {
      const {width, height, videoMaxWidth, videoMaxHeight, isMobile} = this;
      getUserMedia(width, height, videoMaxWidth, videoMaxHeight, isMobile).then(async media => {
        this.stream = media;
      });
    } catch (err) {
    }
  }

  ngOnInit(): void {

    this.getCamera();
    this.faceDetection.beginDetect$.subscribe(
      () => {
        this.loading = false;
        console.log('detection started');
      },
      error => {
        console.log('error when detection start');

      }
    );
  }

  ngAfterViewInit() {
    this.takePhoto();
  }

  preload() {
    this.faceDetectionService.preload({live: this.live, iris: this.iris, debug: this.debug});
  }

  get rect() {
    return isMobile(window)
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
      const {photo, rectPhoto} = result;
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
      const {photo, rectPhoto} = d;
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
      () => {
      },
      () => {
      },
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
        const {photo, rectPhoto} = d;
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
    console.log('no camera available')
  }
}

```
