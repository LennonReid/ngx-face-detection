import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FaceDetectionPage} from "./face-detection/face-detection.page";

const routes: Routes = [
  {
    path: '',
    component: FaceDetectionPage
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
