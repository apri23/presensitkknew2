import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppVersion } from '@ionic-native/app-version/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { AccessProvider } from './providers/access-providers';

import { Diagnostic } from '@ionic-native/diagnostic/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

import { Globalization } from '@ionic-native/globalization/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot()],
  providers: [
    Geolocation,
    Diagnostic,
    StatusBar,
    SplashScreen,
    AccessProvider,
    NativeGeocoder,
    Globalization,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AppVersion,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
