import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'face-detection', pathMatch: 'full' },
  {
    path: 'face-detection',
    loadChildren: () => import('./face-detection/face-detection.module').then(_ => _.FaceDetectionPageModule)
  },
  { path: '**', redirectTo: 'face-detection', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
