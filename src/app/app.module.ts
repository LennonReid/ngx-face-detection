import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceDetectionModule } from "../../projects/face-detection/src/lib/face-detection.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // ----------------------------------------------------------------------------- [ local lib ]
    FaceDetectionModule.forRoot({
      script: 'human/human.js',
      resourcesUrl: './',
      production: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
