import { Pipe, PipeTransform } from '@angular/core';
import { SafeResourceUrl,DomSanitizer } from '@angular/platform-browser';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the SafePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  usertype: any;
  user: any;
  /**
   * Takes a value and makes it lowercase.
   */
  constructor(private nativeStorage: NativeStorage,private dom:DomSanitizer){
    this.nativeStorage.getItem('profile')//EmpIDX2
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.user = data;
      
      this.usertype=this.user[0].userTypeIdx;
       console.log("usertype:" +this.usertype);
      
    },
    error => console.error(error)
    );

  }
  transform(value: string) {
    console.log(this.dom.bypassSecurityTrustResourceUrl(value));
    return this.dom.bypassSecurityTrustResourceUrl(value);
    // "http://webapps.a2zcreatorz.com/Bayer/graphformobiles/graphs.aspx?salesprogress=1&year=2018&usertype="+this.usertype+"&empidx="+
  }
}
