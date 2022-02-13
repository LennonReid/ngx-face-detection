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
  // https://stackoverflow.com/questions/69321466/angular-workspace-monorepo-forroot-giving-me-errors-a-value-for-forroot-can
  // change the interface any to FaceDetectionModule
  static forRoot(opts?: IFaceDetectionOptions): ModuleWithProviders<FaceDetectionModule> {
    return {
      ngModule: FaceDetectionModule,
      providers: [{ provide: NGX_FACE_DETECTION, useValue: opts }]
    };
  }
}
