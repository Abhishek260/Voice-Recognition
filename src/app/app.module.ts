import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import {  MediaCapture, CaptureError, CaptureAudioOptions,  } from '@awesome-cordova-plugins/media-capture/ngx';
import { FileTransferObject,FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Camera,CameraOptions  } from '@awesome-cordova-plugins/camera/ngx';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    MediaCapture,
    FileTransfer,
    Media,
    FileChooser,
    Camera,
    File,
    SpeechRecognition,
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
