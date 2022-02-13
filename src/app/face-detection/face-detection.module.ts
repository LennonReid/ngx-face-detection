import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FaceDetectionModule} from "../../../projects/face-detection/src/lib/face-detection.module";
import {FaceDetectionPage} from "./face-detection.page";


@NgModule({
  declarations: [FaceDetectionPage],
  imports: [FaceDetectionModule],
  providers: [],
  exports: [FaceDetectionPage]
})
export class FaceDetectionPageModule {}
