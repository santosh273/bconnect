import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Enums from '../../models/interfaces/enums';
/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {
  posts:any;

  constructor(public http: Http) {
    console.log('Hello ApiProvider Provider');
    
  }
  getUserInfo(userName:string,password:string) {
    this.http.get(Enums.APIURL.URL+'fetchuserdetails/'+userName+'/'+password).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].Address);
         this.posts = obj; 
         
       alert(this.posts[0].userName);
         
          // this.userName=this.posts[0].Address;
          // console.log(this.posts[0].Address);
       
          //  alert("successfully loggedIn");
           // this.navCtrl.push(HomePage,{userName:this.userName});
         
          
         
        
        
        },err => {
          console.log(err);
          alert(err);
        });
        console.log(this.posts);
        return this.posts;
  }

}
