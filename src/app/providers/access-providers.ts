import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AccessProvider{

	// server: string = 'http://psis.posindonesia.co.id/simtkk/public/';
	server: string = 'https://appsupport-api.posindonesia.co.id:7443/simtkk_dev/public/';
	// server: string = 'http://10.32.41.95/simtkk_dev/public/';

	constructor(
		public http: HttpClient
	) {	}

	getData(file){
		let headers = new HttpHeaders({
			// 'Authorization': 'possale-7afe44278f6eca70e119035e6ae0e002'
		});
		let options = {
			headers: headers
		}
		let data = JSON.stringify({
	      
	    });

		return this.http.post(this.server+'presensi/'+ file,data).timeout(59000).map(res => res);
	}

	getDatatoken(){
		let file = 'email=cHNpczJAcG9zaW5kb25lc2lhLmNvLmlk&password=cG9zSW5kb25lc2lhcEBzczYzNTQyMw==';
		let headers = new HttpHeaders({
			
		});
		let options = {
			headers: headers
		}
		let data = JSON.stringify({
	      
	    });

		return this.http.post(this.server+'login/login_user?'+file,data).timeout(59000).map(res => res);
	}
}