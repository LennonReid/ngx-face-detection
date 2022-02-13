import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FaceDetectionModule} from "../../../projects/face-detection/src/lib/face-detection.module";
import {FaceDetectionPage} from "./face-detection.page";


const routes: Routes = [
  {
    path: '',
    component: FaceDetectionPage
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [FaceDetectionPage],
  imports: [FaceDetectionModule, RouterModule.forChild(routes)],
  providers: []
})
export class FaceDetectionPageModule {}
