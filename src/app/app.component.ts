import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events,  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SignInPage } from '../pages/sign-in/sign-in';
import { NativeStorage } from '@ionic-native/native-storage';
import { SalesPage } from '../pages/sales/sales';
import { SchemePage } from '../pages/scheme/scheme';
import { Agrement } from '../providers/agrement/agrement';
// import { ContactUsPage } from '../pages/contact-us/contact-us';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  showCPBP:boolean;
  showDocs: boolean;
  showScheme: boolean;
  showSales: boolean;
  showReturn: boolean;
  showDocs_loyalty:boolean;
  roles: any;
  Euser: any;
  showDocs_gift:boolean;
  Etime: any;
  @ViewChild(Nav) nav: Nav;

  rootPage: any ;
  isLoggedIn:any;
  pages: Array<{title: string, component: any}>;
  rewards: any;

  constructor(public events: Events,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private nativeStorage: NativeStorage,private agrement:Agrement) {
    this.initializeApp();
    //used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
      
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.events.subscribe('user:roles', (roles) => {
        this.roles=roles;
        // user and time are the same arguments passed in `events.publish(user, time)`
        console.log('Welcome', roles,);
        for(let rol of roles){
          if(rol.name=='Customer- SalesReturn (Make a Request)-SR'){
            this.showReturn=true;
          }
          else if(rol.name=='Customer- SalesReturn (Make a Request)-SR'){
            this.showReturn=true;
          }else if(rol.name=='Customer- Sales Order (View Requests)-SO'){
            this.showSales=true;
          }else if(rol.name=='Customer- Schemes'){
            this.showScheme=true;
          }else if(rol.name=='Customer-MyDocs'){
            this.showDocs=true;
          }else if(rol.name=='BusinessPlan-CPBP'){
            this.showCPBP=true;
          }
          
          // else if(rol.name=='Customer- Gift Request')
          // {
          //   this.showDocs_gift=true;
          // }
          // else if(rol.name=='Customer-LoyaltyPointsForMobile'){
          //   this.showDocs_loyalty=true;
          // }
        }
      
      });
      this.events.subscribe('user:reward', (reward) => {
        this.rewards=reward;
        // user and time are the same arguments passed in `events.publish(user, time)`
        console.log('Welcome', reward);
        if (this.rewards ===1 || this.rewards === '1')
        {
          console.log('REWARD 1', reward);
          this.showDocs_loyalty=true;
          this.showDocs_gift=true;
    
        }
        else{
          console.log('REWARD 0', reward);
          this.showDocs_loyalty=false;
          this.showDocs_gift=false;
        }
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      
    this.agrement.CheckAgrement().then(
      sucess=>{
        if(!sucess)
        {
         this.agrement.showTandCPrompt();
        }
       },
      error=>{
        this.agrement.showTandCPrompt();
      }
    );
      this.nativeStorage.getItem('isloggedIn')
      .then(
      data => {
        console.log("login " + data);
        this.isLoggedIn = data;
        console.log("login Id:" + this.isLoggedIn);
        if(this.isLoggedIn === 4){
          console.log('loggin');
          // this.navCtrl.setRoot(HomePage);
          this.rootPage=HomePage;
           this.splashScreen.hide();
        }
        else if(this.isLoggedIn === 3){
          this.nav.setRoot('AsoHomePage');
          this.splashScreen.hide();
        }else{
          // StatusCRequestPage
         // this.rootPage='StatusCRequestPage';
          this.rootPage=SignInPage;
           this.splashScreen.hide();
        }
      },
      error => {
       // this.rootPage='StatusCRequestPage';
        this.rootPage=SignInPage;
         this.splashScreen.hide();
        console.error(error);}
      );
    });
    this.splashScreen.hide();
   
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout(){
    this.nativeStorage.setItem('isloggedIn', false)
    .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
    );
    this.nav.setRoot(SignInPage);
  }


  salesorder(){
    this.nativeStorage.setItem('salesType', 'order')
    .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
    );
    //end
    this.nav.push(SalesPage);
  }
  salesreturn(){
     this.nativeStorage.setItem('salesType', 'return')
    .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
    );
    //end
    this.nav.push(SalesPage);
  }
  scheme(){
    this.nav.push(SchemePage);
  }

  profile(){
    this.nav.push("ViewProfilePage");
  }
  complains(){
    this.nav.push('ComplainsPage');

  }
  stock(){
    this.nav.push('StockEnteryPage');
  }
  myDoc(){
    this.nav.push('MyDocPage');
  }
  contactUs() {
    this.nav.push('ContactUsPage');
  }
  CPBP() { 
    this.nav.push("ViewPlanePage")
  }
  loyalityPoints() { 
    this.nav.push("LoylityPointsPage")
  }
  gifts(){
    this.nav.push("GiftsPage"); 
  }
  cridt(){
    this.nav.push("CustomerCreditLimitPage")
  }
  
  giftsStatus(){
    this.nav.push("GiftsStatusPage")
    
  }
  
  // getroles(){
  //   this.events.subscribe('user:roles', (roles) => {
  //     this.roles=roles;
  //     // user and time are the same arguments passed in `events.publish(user, time)`
  //     console.log('Welcome', roles,);
  //     for(let rol of roles){
  //       if(rol.name=='Customer- SalesReturn (Make a Request)-SR'){
  //         this.showReturn=true;
  //       }
  //       else if(rol.name=='Customer- SalesReturn (Make a Request)-SR'){
  //         this.showReturn=true;
  //       }else if(rol.name=='Customer- Sales Order (View Requests)-SO'){
  //         this.showSales=true;
  //       }else if(rol.name=='rCustomer- Schemes'){
  //         this.showScheme=true;
  //       }else if(rol.name=='Customer-MyDocs'){
  //         this.showDocs=true;
  //       }

  //     }
  //   });
  // }
}
