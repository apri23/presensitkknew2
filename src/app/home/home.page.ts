import { Component } from '@angular/core';
import { ToastController, Platform, NavController, LoadingController, AlertController, IonRouterOutlet, ModalController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AccessProvider } from '../providers/access-providers';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

	nik: any; nama: any; nopend: any; desk: any; namawilayah: any;versi:any;

  exitval:any = '1';
  hal:any = '2';

  constructor(
  	private storage: Storage,
  	public navCtrl: NavController,
  	public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private statusBar: StatusBar,
    private accsPrvds: AccessProvider,
    private toastCtrl: ToastController,
    private appVersion: AppVersion,
    private platform: Platform,
  ) {
    this.statusBar.backgroundColorByHexString('#438EB9');
    this.statusBar.styleLightContent();
    this.exit();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.firstget();
    this.appVersion.getVersionNumber().then(res => {
      this.versi = 'Versi '+res;
      this.firstget();
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
          this.navCtrl.navigateRoot('/login');
        }
      },(err)=>{
  
      });
    });
  }

  firstget(){
    this.storage.get('storage_xxx_presensitkk').then((res) => {
        if(res == null){
          this.navCtrl.navigateRoot('/login');
        } else {
          this.nik = res.idpetugas;
          this.nama = res.namapetugas;
          this.nopend = res.nopend;
          this.desk = res.deshakakses;
          this.namawilayah = res.nmwilayah
          this.accsPrvds.getDatatoken().subscribe((res:any)=>{
            var Outputtoken = JSON.stringify(res);
            let Responsetoken = JSON.parse(Outputtoken);
            var tokens = Responsetoken.data.api_token;
            // console.log(tokens);
            this.storage.get('storage_xxx_presensitkk_login').then((res2) => {
              var nik = res2.nik;
              var pass = res2.pass;
            
              let param = 'user='+nik+'&password='+pass+'&api_token='+tokens;
              this.accsPrvds.getData('login?'+param).subscribe((res:any)=>{
                var Output = JSON.stringify(res);
                var Response = JSON.parse(Output);
                // console.log(Response);
                if (Response.success == true) {
                  if(Response.data[0].ispresensi == '1' || Response.data[0].ispresensi == 1){
                    
                  } else {
                    this.presentToast('Sesi anda telah berakhir, silahkan login kembali..');
                    this.navCtrl.navigateRoot('/login');
                    this.storage.clear();
                  }
                } else {
                  this.presentToast('Sesi anda telah berakhir, silahkan login kembali..');
                  this.navCtrl.navigateRoot('/login');
                  this.storage.clear();
                }
              },(err)=>{
                this.presentToast('Sesi anda telah berakhir, silahkan login kembali..');
                this.navCtrl.navigateRoot('/login');
                this.storage.clear();
              });

            });
          });
        }
      });
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

  async toastexit(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 2200,
      mode: 'ios',
      color: "dark",

    });
    toast.present();
  }

  async Absensi() {
    this.navCtrl.navigateRoot('/presensi');
  }

  async logout(){
    let Alert = await this.alertCtrl.create({
      header: 'Logout!',      
      message: 'Apakah Anda Yakin ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        },
        {
          text: 'Ya',
          handler: () => {
            this.storage.clear();
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });
    Alert.present();
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
