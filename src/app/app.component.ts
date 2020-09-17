import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.statusBar.backgroundColorByHexString('#273677');
      this.splashScreen.hide();
      this.storage.get('storage_xxx_presensitkk').then((res) => {
        // console.log(res);
        if(res == null){
          this.navCtrl.navigateRoot('/login');
        } else {
          this.navCtrl.navigateRoot('/home');
        }
      });
    });
  }
}
