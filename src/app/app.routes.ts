import {Routes} from '@angular/router';

import {FaceDetectionPage} from './face-detection/face-detection.page';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FaceDetectionPage
  }
];
