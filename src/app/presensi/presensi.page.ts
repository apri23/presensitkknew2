import { Component, OnInit } from '@angular/core';
import { ToastController, Platform, NavController, LoadingController, AlertController, IonRouterOutlet, ModalController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AccessProvider } from '../providers/access-providers';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Component({
  selector: 'app-presensi',
  templateUrl: './presensi.page.html',
  styleUrls: ['./presensi.page.scss'],
})
export class PresensiPage implements OnInit {

	nik: any; nama: any; nopend: any; desk: any; namawilayah: any; tanggal_now:any; location:any; lat:any; long:any; presensimasuk:any; zona:any; presensipulang:any; tgl_show:any;
	masukket:any = false; pulangket:any = false;
	loadmasuk:any = false;
	loadpulang:any = false;
	opendesctrack:any = false;
	loadshowrekap:any = false;

	rekappresensimasuk:any = {tanggal:'', jenis:'', ket:''};
	rekappresensipulang:any = {tanggal:'', jenis:'', ket:''};

  hal:any = 'presensi';

  constructor(
  	public navCtrl: NavController,
  	private storage: Storage,
  	private geolocation: Geolocation,
  	private globalization: Globalization,
  	private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private statusBar: StatusBar,
    private accsPrvds: AccessProvider,
    private diagnostic: Diagnostic,
    private platform: Platform,
  ) {
    this.statusBar.backgroundColorByHexString('#438EB9');
    this.statusBar.styleLightContent();
  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.storage.get('storage_xxx_presensitkk').then((res) => {
      if(res == null){
        this.navCtrl.navigateRoot('/login');
      } else {
        this.nik = res.idpetugas;
        this.nama = res.namapetugas;
        this.nopend = res.nopend;
        this.desk = res.deshakakses;
        this.namawilayah = res.nmwilayah;
        this.opendesctrack = false;
        this.diagnostic_loc();
        // this.get_loc();
        this.get_tgl_now();
        // this.get_zona();
      }
    });
  }

  doRefresh(event) {
    this.ionViewWillEnter();
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async diagnostic_loc(){
    this.diagnostic.getLocationMode().then((state) => {
      if (state == this.diagnostic.locationMode.LOCATION_OFF) {
        this.navCtrl.navigateRoot('/home');
        this.presentToastWithOptions('Lokasi anda tidak terdeteksi. Buka Pengaturan untuk mengaktifkan Lokasi.');
        console.log('off');
      } else {
        console.log('on');
        this.get_loc();
      }
    }).catch((e) => {
      this.navCtrl.navigateRoot('/home');
      this.presentToastWithOptions('Lokasi anda tidak terdeteksi. Izinkan akses lokasi atau buka pengaturan untuk mengaktifkan Lokasi.');
    });
  }

  back(){
    this.navCtrl.navigateRoot('/home');
  }

  async presentToastWithOptions(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      mode: 'ios',
      color:'danger',
      buttons: [
        {
          text: 'Buka',
          handler: () => {
            this.diagnostic.switchToLocationSettings();
          }
        },{
          icon: 'close',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    toast.present();
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

  get_tgl_now(){
    var today:any = new Date();
    var day = today.getDay();
    var months = today.getMonth();
    var dd = today.toJSON().slice(8,10);
    var mm = today.toJSON().slice(5,7);
    var yyyy = today.toJSON().slice(0,4);
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0');
    // var yyyy = today.getFullYear();

    this.tgl_show = this.convert_day(day)+', '+dd+' '+this.convert_month(months)+' '+yyyy;
    this.tanggal_now = yyyy+'-'+mm+'-'+dd;
  }

  async get_loc(){
    this.lat = '';
    let Loading = await this.loadingCtrl.create({
      spinner: 'dots',
      mode: 'ios',
    });
    Loading.present();
  	this.geolocation.getCurrentPosition().then((resp) => {
  		this.location = 'https://www.google.com/maps/search/'+resp.coords.latitude+','+resp.coords.longitude;
  		this.lat = resp.coords.latitude;
  		this.long = resp.coords.longitude;
      Loading.dismiss();
      if(this.lat == '' || this.lat == null){
        this.navCtrl.navigateRoot('/home');
        this.presentToastWithOptions('Lokasi anda tidak terdeteksi. Izinkan akses lokasi atau buka pengaturan untuk mengaktifkan Lokasi.');
      } else {
        this.get_presensi_masuk();
      }
  	}).catch((e) => {
      Loading.dismiss();
      this.navCtrl.navigateRoot('/home');
      this.presentToastWithOptions('Lokasi anda tidak terdeteksi. Izinkan akses lokasi atau buka pengaturan untuk mengaktifkan Lokasi.');
    });
  }

  // get_zona(){
  //   this.globalization.getDatePattern({formatLength:'short', selector:'date and time'}).then(data => {
  //     if(data.timezone == "GMT+07:00" || data.timezone == "WIB") {
  //       this.zona = "WIB";
  //     }
  //     if(data.timezone == "GMT+08:00" || data.timezone == "WITA") {
  //       this.zona = "WITA";
  //     }
  //     if(data.timezone == "GMT+09:00" || data.timezone == "WIT") {
  //       this.zona = "WIT";
  //     }
  //     console.log(this.zona);
  //   })
  // }

  convert_month(month){
  	let monts = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  	return monts[month];
  }

  convert_day(day){
  	let weekdays = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  	return weekdays[day];
  }

  get_presensi_masuk(){
  	this.loadmasuk = true;
    this.accsPrvds.getDatatoken().subscribe((res:any)=>{
      var Outputtoken = JSON.stringify(res);
      let Responsetoken = JSON.parse(Outputtoken);
      var tokenmasuk = Responsetoken.data.api_token;

    	let param = 'nik='+this.nik+'&nopend='+this.nopend+'&tgl='+this.tanggal_now+'&api_token='+tokenmasuk;
      this.accsPrvds.getData('data_presensi_masuk?'+param).subscribe((res:any)=>{
      	var Output = JSON.stringify(res);
    		var Response = JSON.parse(Output);
    		if(Response.success == true){
    			var jam = Response.data[0].tanggal;
    			this.presensimasuk = jam.substring(11, 19);
    			this.masukket = true;
    			// console.log(jam.substring(11, 19));
          this.get_presensi_keluar();
    		} else {
    			this.presensimasuk = '-';
    			this.masukket = false;
          this.get_presensi_keluar();
    		}
    		this.loadmasuk = false;
    	},(err)=>{
        console.log('masuk');
    		this.presentToast('Tidak dapat terhubung ke server masuk');
    		this.loadmasuk = false;
    	});

    });
  }

  get_presensi_keluar(){
  	this.loadpulang = true;
    this.accsPrvds.getDatatoken().subscribe((res:any)=>{
      var Outputtoken = JSON.stringify(res);
      let Responsetoken = JSON.parse(Outputtoken);
      var tokenpulang = Responsetoken.data.api_token;

    	let param = 'nik='+this.nik+'&nopend='+this.nopend+'&tgl='+this.tanggal_now+'&api_token='+tokenpulang;
      this.accsPrvds.getData('data_presensi_pulang?'+param).subscribe((res:any)=>{
      	var Output = JSON.stringify(res);
    		var Response = JSON.parse(Output);
    		if(Response.success == true){
    			var jam = Response.data[0].tanggal;
    			var jamonly = jam.substring(11, 19);
    			// console.log(jam.substring(11, 19));
    			if(jamonly == '00:00:00'){
    				this.presensipulang = '-';
    			} else {
    				this.presensipulang = jamonly;
    			}
    			this.pulangket = true;
    		} else {
    			this.presensipulang = '-';
    			this.pulangket = false;
    		}
      	this.loadpulang = false;
    	},(err)=>{
        console.log('pulang');
    		this.presentToast('Tidak dapat terhubung ke server pulang');
    		this.loadpulang = false;
    	});

    });
  }

  presensimasukadd(){
    if(this.lat == '' || this.lat == null){
      this.navCtrl.navigateRoot('/home');
      this.presentToastWithOptions('Lokasi anda tidak terdeteksi. Izinkan akses lokasi atau buka pengaturan untuk mengaktifkan Lokasi.');
      return;
    }
  	this.loadmasuk = true;
    this.accsPrvds.getDatatoken().subscribe((res:any)=>{
      var Outputtoken = JSON.stringify(res);
      let Responsetoken = JSON.parse(Outputtoken);
      var tokens = Responsetoken.data.api_token;

      let param = 'nik='+this.nik+'&nopend='+this.nopend+'&absenew='+this.location+'&tgl='+this.tanggal_now+'&api_token='+tokens;
      this.accsPrvds.getData('presensi_masuk?'+param).subscribe((res:any)=>{
      	var Output = JSON.stringify(res);
    		var Response = JSON.parse(Output);
    		if(Response.success == true){
    			var jam = Response.data[0].tanggal;
    			var jamonly = jam.substring(11, 19);
    			this.presensimasuk = jamonly;
    			this.presentToastOk('Presensi masuk berhasil pada jam '+this.presensimasuk);
          this.get_presensi_masuk();
    		} else if(Response.success == 'false2'){
    			this.presentToast('Anda sudah presensi masuk!');
    		} else {
    			this.presentToast('Gagal!');
    		}
    		// console.log(Response.message);
    		this.loadmasuk = false;
    	},(err)=>{
    		this.presentToast('Tidak dapat terhubung ke server');
    		this.loadmasuk = false;
    	});

    });
  }

  presensipulangadd(){
    if(this.lat == '' || this.lat == null){
      this.navCtrl.navigateRoot('/home');
      this.presentToastWithOptions('Lokasi anda tidak terdeteksi. Izinkan akses lokasi atau buka pengaturan untuk mengaktifkan Lokasi.');
      return;
    }
  	this.loadpulang = true;
    this.accsPrvds.getDatatoken().subscribe((res:any)=>{
      var Outputtoken = JSON.stringify(res);
      let Responsetoken = JSON.parse(Outputtoken);
      var tokens = Responsetoken.data.api_token;

    	let param = 'nik='+this.nik+'&nopend='+this.nopend+'&absenew='+this.location+'&tgl='+this.tanggal_now+'&api_token='+tokens;
      this.accsPrvds.getData('presensi_pulang?'+param).subscribe((res:any)=>{
      	var Output = JSON.stringify(res);
    		var Response = JSON.parse(Output);
    		if(Response.success == true){
    			var jam = Response.data[0].tanggal;
    			var jamonly = jam.substring(11, 19);
    			this.presensipulang = jamonly;
    			this.presentToastOk('Presensi pulang berhasil pada jam '+this.presensipulang);
          this.get_presensi_keluar();
    		} else {
    			this.presentToast('Anda sudah presensi pulang!');
    		}
    		// console.log(Response);
    		this.opendesctrack = false;
          	this.loadshowrekap = false;
    		this.loadpulang = false;
    	},(err)=>{
    		this.presentToast('Tidak dapat terhubung ke server');
    		this.loadpulang = false;
    	});

    });
  }

  hidenopendesctrack(){
  	this.loadshowrekap = true;
    if(this.opendesctrack == true){

      this.opendesctrack = false;
      this.loadshowrekap = false;
      console.log('tutup');
    } else {
      console.log('buka');
      this.getrekapmasuk();
    }
  }

  getrekapmasuk(){
    this.rekappresensimasuk.jam = '00:00:00';
    this.accsPrvds.getDatatoken().subscribe((res:any)=>{
      var Outputtoken = JSON.stringify(res);
      let Responsetoken = JSON.parse(Outputtoken);
      var tokens = Responsetoken.data.api_token;

    	let param = 'nik='+this.nik+'&nopend='+this.nopend+'&tgl='+this.tanggal_now+'&api_token='+tokens;
      this.accsPrvds.getData('data_presensi_masuk?'+param).subscribe((res:any)=>{
      	var Output = JSON.stringify(res);
    		var Response = JSON.parse(Output);
    		// console.log(Response.data[0]);
    		var jamonly = Response.data[0].tanggal.substring(0, 19);
        var jam = Response.data[0].tanggal.substring(11, 19);

        this.rekappresensimasuk.jam = jam;
    		this.rekappresensimasuk.tanggal = jamonly;
    		this.rekappresensimasuk.jenis = Response.data[0].j_presensi;
    		this.rekappresensimasuk.ket = Response.data[0].keterangan;
    		
    		this.opendesctrack = true;
        this.loadshowrekap = false;
        this.getrekappulang();
    	},(err)=>{
    		this.presentToast('Tidak dapat terhubung ke server');
    		this.loadshowrekap = false;
    	});

    });
  }

  getrekappulang(){
    this.rekappresensipulang.jam = '00:00:00';
    this.accsPrvds.getDatatoken().subscribe((res:any)=>{
      var Outputtoken = JSON.stringify(res);
      let Responsetoken = JSON.parse(Outputtoken);
      var tokens = Responsetoken.data.api_token;

    	let param = 'nik='+this.nik+'&nopend='+this.nopend+'&tgl='+this.tanggal_now+'&api_token='+tokens;
      this.accsPrvds.getData('data_presensi_pulang?'+param).subscribe((res:any)=>{
      	var Output = JSON.stringify(res);
    		var Response = JSON.parse(Output);
    		// console.log(Response.data[0]);
    		var tgl = Response.data[0].tanggal.substring(0, 19);
        var jam = Response.data[0].tanggal.substring(11, 19);

        this.rekappresensipulang.jam = jam;
    		this.rekappresensipulang.tanggal = tgl;
    		this.rekappresensipulang.jenis = Response.data[0].j_presensi;
    		this.rekappresensipulang.ket = Response.data[0].keterangan;
    		
    		this.opendesctrack = true;
        	this.loadshowrekap = false;
    	},(err)=>{
    		this.presentToast('Tidak dapat terhubung ke server');
    		this.loadpulang = false;
    	});

    });
  }

  show_maps(ket){
    window.open(ket, '_system');
  }

  rekappulang(tgl){
    return tgl.substring(11, 19);
    // if(jamonly == '00:00:00'){
    //   return true;
    // } else {
    //   return false;
    // }
  }

  jam_only(tanggal){
    return tanggal.substring(11, 19);
  }

  exit(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      if(this.hal == 'presensi'){
        this.navCtrl.navigateRoot('/home');
      }
    });
  }

}
