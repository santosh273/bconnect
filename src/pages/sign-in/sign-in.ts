import { Component } from '@angular/core';
import {  NavController, NavParams, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, RequestOptions,Headers } from '@angular/http';
import {usercreds} from '../../models/interfaces/usercreds'
import { HomePage } from '../home/home';
import * as Enums from '../../models/interfaces/enums';

import { ApiProvider } from './../../providers/api/api';
import { NativeStorage } from '@ionic-native/native-storage';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { CustAlert } from '../../providers/cust-alert/cust-alert';
import { Events } from 'ionic-angular';
/**
 * Generated class for the SignInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {
  roles=[];
  userIP: any="";
  custNo: any;
  isAso: any;
  ID: any;
  credentials ={} as usercreds;
  userName:any;
  posts:any;
  userId:any;
  crtdbyId:any
  isLoggedIn:any;                                                                                           
  userType:any;
  EmpIDX2:any;
  public custumUrl;
  reward: any;
  constructor(private toastCtrl: ToastController,public events: Events,public navCtrl: NavController,public loadingCtrl: LoadingController, public navParams: NavParams,private http: HttpInterceptor,api:ApiProvider,private nativeStorage: NativeStorage,public menu: MenuController,public alertCtrl: AlertController, private custAlert:CustAlert) {
    console.log(Enums.APIURL.URL);
    
  }
  forget() {
    let prompt = this.alertCtrl.create({
      title: 'Forget Password',
      message: "Enter user ID to get email.",
      inputs: [
        {
          name: 'ID',
          placeholder: 'user ID'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            console.log('Saved clicked');
            this.sendRequest(data.ID).then((x=>{
              if(x){
                this.custAlert.presentAlert("Bayer","Email has been sent to you.");
                // alert('Email has been sent to you.');
              }else{
                this.custAlert.presentAlert("Bayer","user ID not matched...");
                // alert('user ID not matched...');
              }
            }))
          }
        }
      ]
    });
    prompt.present();
  }

  ionViewDidLoad() {
    this.getIP();
    this.menu.enable(false);
    console.log('ionViewDidLoad SignInPage');
  }
  ionViewDidLeave() {
    this.menu.enable(true);
    console.log('ionViewDidLoad SignInPage');
  }
  getIP(){
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    
    });
    loader.present();
    try {
      this.http.get(Enums.APIURL.URL+'fetchipaddress').map(res => res.json()).subscribe(data => {
  
        console.log(data);
           var obj = data;
         var ip =data
          this.userIP=ip;
          console.log('IP: ',this.userIP);
           loader.dismiss();
        }) ;
    } catch (error) {
      
    }
   
}
  signIn(){
   
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      // duration: 3000
    
    });
    loader.present();
    
    console.log(Enums.APIURL.URL+'fetchuserdetails/'+this.credentials.email+'/'+this.credentials.password);
    this.http.get(Enums.APIURL.URL+'fetchuserdetails/'+this.credentials.email+'/'+this.credentials.password).map(res => res.json()).subscribe(data => {
  // debugger;
     var obj = JSON.parse(data);
  // alert(obj[0].userName);
     this.posts = obj; 
     console.log(this.posts);
    //  alert( this.posts);
     loader.dismiss();
     if(obj==""){
      this.saveHistory("0",this.credentials.email,"0","Login Failed")
      this.custAlert.presentAlert("Not found","No user found with these credentials.)-:");
     }else{
            this.userName=this.posts[0].userName;
            this.userId=this.posts[0].idx1;
            this.crtdbyId=this.posts[0].idx;
            this.userType=this.posts[0].userTypeIdx;
            this.EmpIDX2=this.posts[0].idx2;
            this.custNo=this.posts[0].customerNo;
            this.reward=this.posts[0].reward;
            this.isAso=this.posts[0].isASO
             console.log(this.posts[0].userName);
             console.log(this.posts[0].idx1);
             console.log(this.userId,'u');
             console.log(this.crtdbyId,'c');
             //userId
             this.nativeStorage.setItem('userID', this.userId)
             .then(
             () => console.log('Stored item!'),
             error =>{ console.error('Error storing item', error)
            //  alert(error);
           }
             );//userId ends
             this.nativeStorage.setItem('reward', this.reward)
             .then(
             () => console.log('Stored item!'),
             error =>{ console.error('Error storing item', error)
            //  alert(error);
           }
             );//userId ends
             this.events.publish('user:reward',this.reward);
            //  custumerId
             this.nativeStorage.setItem('crtdbyID', this.crtdbyId)
             .then(
             () => console.log('Stored item!'),
             error =>{ console.error('Error storing item', error)
            //  alert(error);
           }
             );
             //ends
             //userprofile
             this.nativeStorage.setItem('profile', this.posts)
             .then(
             () => console.log('Stored item!'),
             error =>{ console.error('Error storing item', error)
                  
                }
             );//userprofile

            //  usertype
             this.nativeStorage.setItem('userType', this.userType)
             .then(
             () => console.log('Stored item!'),
             error =>{ console.error('Error storing item', error)
                 
                }
             );

            if(this.userType === 4){
              
              //isloged in
           
             this.nativeStorage.setItem('isloggedIn', 4)
             .then(
             () => console.log('Stored item!'),
             error =>{ console.error('Error storing item', error)
                 
                }
             );//is logeed in ends
             this.getRoles('0','2').then(resolve=>{
               if(resolve){
                this.navCtrl.setRoot(HomePage,{userName:this.userName,userID:this.userId});
                this.saveHistory(this.crtdbyId,this.userName,this.userType,"Login Success");//saving user history to server
             
               }else{
                let toast = this.toastCtrl.create({
                  message: 'User roles not found... Please contact Bayer`s Agent',
                  duration: 3000,
                  position: 'top'
                });
              
                toast.onDidDismiss(() => {
                  console.log('Dismissed toast');
                });
              
                toast.present(); 
               }
             });

             
              }else if(this.userType === 3){
              if(this.isAso === 1 || this.isAso === '1'){   
                this.nativeStorage.setItem('EmpIDX2', this.EmpIDX2)
                .then(
                  () => console.log('Stored item!'),
                  error =>{ console.error('Error storing item', error)             
                }
                );
               
                this.nativeStorage.setItem('isloggedIn', 3)
                .then(
                  () => console.log('Stored item!'),
                  error =>{ console.error('Error storing item', error)               
                }
                );//is logeed in ends
                this.getRoles(this.EmpIDX2,'1').then(resolve=>{
                  if(resolve){
                    this.navCtrl.setRoot('AsoHomePage');
                    this.saveHistory(this.crtdbyId,this.userName,this.userType,"Login Success");//saving user history to server
                 
                  }else{
                   let toast = this.toastCtrl.create({
                     message: 'User roles not found... Please contact Bayer`s Agent',
                     duration: 3000,
                     position: 'top'
                   });
                 
                   toast.onDidDismiss(() => {
                     console.log('Dismissed toast');
                   });
                 
                   toast.present(); 
                  }
                });
                }else{
                this.saveHistory("0",this.credentials.email,"0","Login Failed");
                this.custAlert.presentAlert('Bayer','This user type can not be logged in.');
              }

            }else{
              this.saveHistory("0",this.credentials.email,"0","Login Failed");
              this.custAlert.presentAlert('Bayer','You can`t logged in with this userName and passWord :-(');
              // alert("You can`t logged in with this userName and passWord :-(");
              console.log(this.userType);            
            }            
     }
    },err => {
     // alert(err);
      loader.dismiss();
      console.log(err);

     alert(err);

     
    });
 
  }

  sendRequest(ID){
    let loadingg = this.loadingCtrl.create({
      content: 'Please wait ...',
      duration: 3000
    });
    loadingg.present();
    return new Promise((res) => {
    var url = Enums.APIURL.URL+"fetchforgotPassStatus/"+ID;
    let headers1 = new Headers(
      {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      });
      
      
      let options = new RequestOptions({ headers: headers1 });
      
      
      
      // let data = JSON.stringify(
      //   {
          
      //     Name:img3x
          
          
      //   });
        
        //  console.log(data);
        
        return new Promise((resolve, reject) => {
          this.http.post(url, options)
          .toPromise()
          .then((response) =>
          {
            
            console.log('API Response : ', response.json());
            // this.attach2=response.json();
            //  this.showAlert("Bayer","Your feedback has been sent to Bayer.\n Thankyou.");
            // this.navCtrl.setRoot(HomePage);
            
            resolve(response.json());
            loadingg.dismiss();
            if(response.json() === "1"){
              res(true);
            }else{
              res(false);
            }
             
          })
          .catch((error) =>
          {
            loadingg.dismiss();
            console.error('API Error : ', error.status);
            console.error('API Error : ', JSON.stringify(error));
            reject(error.json());
          });
        });
      });

  }

  saveHistory(useridx,userName,type,status){
    // "Login Success"
        let headers1 = new Headers(
          {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
          });
    
    
          let options = new RequestOptions({ headers: headers1 });
           let data = JSON.stringify(
            {
            "UserIdx":useridx,
            "UserName":userName,
            "UserTypeIdx":type,
            "IpAddress":this.userIP,
            "Status" : status } );
            console.log('History: ',data);
          return new Promise((resolve, reject) => {
            this.http.post(Enums.APIURL.URL+'saveloginhistory', data, options)
            .toPromise()
            .then((response) =>
            {
            
              console.log('API Response : ', response.json());
              resolve(response.json());
              var res=JSON.parse(response.json());
              console.log(res);
            })
            .catch((error) =>
            {
              console.error('API Error : ', error.status);
              console.error('API Error : ', JSON.stringify(error));
              reject(error.json());
            });
          });
          
        
         
      }

      // getUserRoles(userName,password){
      //   this.http.get(Enums.APIURL.URL+'fetchuserdetails/'+userName+'/'+password).map(res => res.json()).subscribe(data => {
      //     // debugger;
      //     console.log(data);
      //        var obj = JSON.parse(data);
         
      //        this.roles = obj; 
      //        console.log(this.roles);
      //        this.nativeStorage.setItem('roles',this.roles)
      //        .then(
      //          () => console.log('roles stored!'),
      //          error =>{ console.error('Error storing item', error)
      //          //alert(error);
      //        }
      //        );//is logeed in ends

      //       },err => {
      //         // alert(err);
      //         //  loader.dismiss();
      //          console.log(err);
              
      //        });
      // }

     
  getRoles(IDX,type) {
    return new Promise(resolve=>{
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
  
      });
      loader.present();
      console.log(IDX,type);
      this.http.get(Enums.APIURL.URL + 'getroles/'+ '/'+type+'/'+IDX).map(res => res.json()).subscribe(data => {
        // debugger;
        var obj = JSON.parse(data);
        var roles = obj;
        for(let rol of roles){
          this.roles.push(rol);
          console.log(rol.name);
  
        }
        console.log('Roles : ',this.roles);
        this.events.publish('user:roles',roles);
        this.nativeStorage.setItem('roles',roles)
               .then(
                 () =>{
                  console.log('roles stored!')
                  resolve(true);;
                 } ,
                 
                 error =>{ console.error('Error storing item', error)
                 //alert(error);
                 resolve(false);
               }
               );//is logeed in ends
        loader.dismiss();
  
      }, err => {
        console.log(err);
      });
    })
    

  }

}
