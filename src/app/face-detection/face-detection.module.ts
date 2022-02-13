import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FaceDetectionModule} from "../../../projects/face-detection/src/lib/face-detection.module";
import {FaceDetectionPage} from "./face-detection.page";
import {LoadingModule} from "../loading/loading.module";
import {CommonModule} from "@angular/common";


@NgModule({
  declarations: [FaceDetectionPage],
  imports: [CommonModule, FaceDetectionModule, LoadingModule],
  providers: [],
  exports: [FaceDetectionPage]
})
export class FaceDetectionPageModule {
}
