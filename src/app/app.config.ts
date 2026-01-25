import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';

import {environment} from '../environments/environment';
import {appRoutes} from './app.routes';
import {FaceDetectionModule} from '../../projects/face-detection/src/public-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    importProvidersFrom(
      FaceDetectionModule.forRoot({
        script: 'human/human.js',
        resourcesUrl: environment.production ? '/ngx-face-detection/' : '',
        production: environment.production
      })
    )
  ]
};
