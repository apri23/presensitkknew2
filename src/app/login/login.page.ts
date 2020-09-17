import { Component, OnInit } from '@angular/core';
import { ToastController, Platform, NavController, LoadingController, AlertController, IonRouterOutlet, ModalController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AccessProvider } from '../providers/access-providers';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  versi:any;

	nik:any;
	pass:any;

	showPassword = false;
  passwordToggleIcon = 'eye-off';

  exitval:any = '1';
  hal:any = '1';

  constructor(
  	private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProvider,
    private navCtrl: NavController,
    private storage: Storage,
    private statusBar: StatusBar,
    private platform: Platform,
    private appVersion: AppVersion,
  ) {
  	this.statusBar.backgroundColorByHexString('#fff');
    this.statusBar.styleDefault();
    this.exit();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.appVersion.getVersionNumber().then(res => {
      this.versi = 'Versi '+res;
      this.get_versi(res);
    });
  }

  get_versi(vers){
    this.accsPrvds.getDatatoken().subscribe((res:any)=>{
      var Outputtoken = JSON.stringify(res);
      let Responsetoken = JSON.parse(Outputtoken);
      var tokens = Responsetoken.data.api_token;

      let param = 'version='+vers+'&api_token='+tokens;
      this.accsPrvds.getData('check_versi?'+param).subscribe((res:any)=>{
        var Output = JSON.stringify(res);
        var Response = JSON.parse(Output);
        // console.log(Response);
        if (Response.success == false) {   
          this.presentAlert(Response.msg);
        }
      },(err)=>{
  
      });
    });
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
    if(this.passwordToggleIcon == 'eye-off'){
      this.passwordToggleIcon = 'eye';
    } else {
      this.passwordToggleIcon = 'eye-off';
    }
  }

  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Tersedia versi terbaru. Download dan update sekarang di '+msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 2500,
      mode: 'ios',
      color:'danger',
    });
    toast.present();
  }

  async presentToastOk(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 2500,
      mode: 'ios',
      color:'primary',
    });
    toast.present();
  }

  async toastexit(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 2200,
      mode: 'ios',
      color: "dark",

    });
    toast.present();
  }

  async login_action(){
    if(this.nik == '' || this.nik == null){
      this.presentToast('NIK tidak boleh kosong..');
      return;
    } else if(this.pass == '' || this.pass == null){
      this.presentToast('Password tidak boleh kosong..');
      return;
    }
    let Loading = await this.loadingCtrl.create({
      spinner: 'dots',
      mode: 'ios',
    });
    Loading.present();

    this.accsPrvds.getDatatoken().subscribe((res:any)=>{
      var Outputtoken = JSON.stringify(res);
      let Responsetoken = JSON.parse(Outputtoken);
      var tokens = Responsetoken.data.api_token;
      // console.log(tokens);
    
      let param = 'user='+this.nik+'&password='+this.pass+'&api_token='+tokens;
      this.accsPrvds.getData('login?'+param).subscribe((res:any)=>{
      var Output = JSON.stringify(res);
  		var Response = JSON.parse(Output);
  		console.log(Response);

  		if (Response.success == true) {
        if(Response.data[0].ispresensi == '1' || Response.data[0].ispresensi == 1){
    		  this.storage.set('storage_xxx_presensitkk', Response.data[0]);
          this.storage.set('storage_xxx_presensitkk_login', {nik:this.nik,pass:this.pass});
    		  setTimeout(() => {
    		    this.nik = '';
    		    this.pass = '';
    		    Loading.dismiss();
    		    this.navCtrl.navigateRoot('/home');
    		  }, 3000);
        } else {
          Loading.dismiss();
          this.presentToast('Anda belum terdaftar pada presensi TKK mobile..');
        }
  		} else {
  		  Loading.dismiss();
  		  this.presentToast('NIK atau Password salah..');
  		}
      },(err)=>{
        this.presentToast('Tidak dapat terhubung ke server');
        Loading.dismiss();
      });

    });

  }

  exit(){
    this.platform.backButton.subscribeWithPriority(10, () => {
        setTimeout(() => {
        this.exitval = '1';
        console.log(this.exitval);
      }, 2200);
      if(this.hal == '1'){
        if(this.exitval == '1'){
          this.toastexit('Tekan sekali lagi untuk keluar');
        } else if(this.exitval == '2'){
          navigator['app'].exitApp();
        }
        this.exitval = '2';
      }
    });
  }

}
