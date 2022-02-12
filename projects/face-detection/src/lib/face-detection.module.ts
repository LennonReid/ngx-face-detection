import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FaceDetectionComponent } from './face-detection.component';
import { IFaceDetectionOptions, NGX_FACE_DETECTION } from './face-detection.interface';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [
    FaceDetectionComponent
  ],
  exports: [
    FaceDetectionComponent
  ]
})
export class FaceDetectionModule {
  static forRoot(opts?: IFaceDetectionOptions): ModuleWithProviders<any> {
    return {
      ngModule: FaceDetectionModule,
      providers: [{ provide: NGX_FACE_DETECTION, useValue: opts }]
    };
  }
}
