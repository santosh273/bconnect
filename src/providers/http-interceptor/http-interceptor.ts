import { Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend } from "@angular/http"
import { Injectable,ErrorHandler } from "@angular/core"
import { Observable } from "rxjs/Rx"

// operators
import "rxjs/add/operator/catch"
import "rxjs/add/observable/throw"
import "rxjs/add/operator/map"
import { CustAlert } from "../cust-alert/cust-alert";
/*
  Generated class for the HttpInterceptorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpInterceptor extends Http {
  constructor(backend: XHRBackend,options: RequestOptions,public http: Http,private custAlert:CustAlert) {
    super(backend, options)
}

public request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options)
        .catch(this.handleError)
}

public handleError = (error: Response) => {
 // Do messaging and error handling here
    //this.custAlert.presentAlert("No Response",error.statusText);
    this.custAlert.presentToast(null);
    return Observable.throw(error)
}


}
