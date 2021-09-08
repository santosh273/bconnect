import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ToastController, Platform, LoadingController, Toast } from 'ionic-angular';
import { Base64 } from '@ionic-native/base64';
import { NativeStorage } from '@ionic-native/native-storage';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { Camera } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';

import * as Enums from '../../models/interfaces/enums'
import { CustAlert } from '../../providers/cust-alert/cust-alert';
import { catchError } from 'rxjs/operators';
import { SelectSearchableComponent } from 'ionic-select-searchable';


/**
 * Generated class for the CustomerRegPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-customer-reg',
  templateUrl: 'customer-reg.html',
})
export class CustomerRegPage {
  buttonText="Resubmit "
  showreSubmitField=false;
  reSubmitCNIC=""
  rejectedCust: any;
  salesPlane: any;
  waitingIn="";
  allAttachments: any;
  passwordPolicy: any;
  customerIdx: any;
  rejectedattachedobj: any;
  
  custidx(arg0: any): any {
    throw new Error("Method not implemented.");
  }
 
  asoIdx2: any;
  
 
  Plant: any;
 
  latitude: any;
  longitude: any;
  lastImage: any;
  todo = {
    title: '',
    description: ''
  };
  border = ""
  title: any;
 
  //////New Bayer Form/////

  OwnerOption="No";
  OwnerName="-"
  selection = 0;
  available: boolean;
  salesCircles:any;
  selectedSalesCircle:any;
  zones:any;
  selectedZone:any
  regions:any;
  selectedregion:any;
  territory:any;
  selectedTerritory:any;
  shopName="";
  nameOfProprietor="";
  proprietorCNIC="";
  cell="";
  banks:any;
  selectedBank:any;
  AccountTitle = "";
  BranchCode = "";
  AccountNo = "";
  DMN = "-";//desision maker Name
  businessAddress="";
  teshsils:any;
  selectedTehsil:any;
  districts:any;
  selectedDistrict:any;
  cities: any;
  selectedcity:any;
  Dob='' ;
  dobmax;
  Education = "";
  RunPesticidebusiness = "No";
  Siblings = "No";
  durationPB="";//pesticide business.
  NoOfYearsInMarket=""//no of years 2nd field in form 
  BlacklistBCS="No";
  WorkingwithBCS = "No";
  BCSID="";
  Category: any;
  selectedCategory = "";
  businessPlanYear1="";
  businessPlanYear2="";
  WorkingCapital = "";
  cc1=""; //compitition companies
  C1sale="";
  C2sale="-";
  C3sale="-";
  cc2="-";
  cc3="-";
  TotalPesticidesPreviousYear = "";
  SLPesticideMarket="";
  grainMarket="-";
  sunMarket="-";
  OtherSL="-";
  GovLicenseNo = "";
  ValidupTo = "";
  Pocket: any;
  selectedPocket :any;
  ///internal use only.
  reasonForOpeningAC="";
  closestBDealerKM="";
  closestDealerName="";
  closestDealerCode="";
  LYSales="";
  salesPlan="";
  closestBDealerKM2="-";
  closestDealerName2="-";
  closestDealerCode2="-";
  LYSales2="-";
  salesPlan2="-";
  negitiveConflictNo="-"
  negitiveConflictYes="-"
  impactValue="";
  date:any;
  attachments=[];
  contactattachments="";
  count:number = 0;
  checksubmit=true;
  crtdbyId:any;
  resubmit = false;


  constructor(private custAlert:CustAlert,private geolocation: Geolocation, public loadingCtrl: LoadingController, private http: HttpInterceptor, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, private nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams, private base64: Base64, public alertCtrl: AlertController, ) {

    this.nativeStorage.setItem('loc', { lat: '', lng: '' })
      .then(
        () => console.log('Stored loc!'),
        error => console.error('Error storing loc', error)
      );
      this.getApiData();
      var d = new Date()
      this.date=d.toISOString();
      var dt = new Date();
      dt.setFullYear(new Date().getFullYear() - 18);
      console.log('date:',dt.toISOString());
      this.dobmax=dt.toISOString();
 
      this.nativeStorage.getItem('crtdbyID')
      .then(
      data => {
        this.crtdbyId = data;
        console.log("CREATED BY ID--" +this.crtdbyId )
      },
      error => console.error(error)
      
      ); 



      //////useridx////
      this.nativeStorage.getItem('EmpIDX2')
      .then(
      data => {
        console.log("URID from page sigin" + data);
        this.asoIdx2 = data;
 
        console.log(this.asoIdx2);
       this.getZones();
       this.getBanks()
      //  this.getDistricts();
      //  this.getTehsils();
       this.getWaitingIn();
      },
      error => console.error(error)
      ); 
  }
  openInput(){
    if(this.showreSubmitField){
        this.showreSubmitField=false;
        this.buttonText="Resubmit "
    }else{
      this.showreSubmitField=true
      this.buttonText="Close Resubmit"
    }
  }
  reSubmit(){
    const prompt = this.alertCtrl.create({
      title: 'Resubmit',
      message: "Enter CNIC of the rejected customer",
      inputs: [
        {
          name: 'cnic ',
          placeholder: '1234512345683',
         
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
          text: 'Search',
          handler: data => {
            console.log('data:',data.cnic);
            if(data.cnic !== ""){
              this.reSubmitMethod(data.cnic);
            }else{
              this.presentToast('Please Insert Valid CNIC.');
            }
            console.log('search clicked');
          }
        }
      ]
    });
    prompt.present();
  }
  // private cnic(): string {
  //   const config: BrMaskModel = new BrMaskModel();
  //   config.phone = true;
  //   return this.brMaskerIonic3.writeCreateValue('45201-9282686-3', config);
  // }
  reSubmitMethod(cnic){
    
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      
    });
    loader.present();
    ///*****getZones****/////
    this.http.get(Enums.APIURL.URL+'getresubmitcustomerrequest/'+cnic).map(res => res.json()).subscribe(data => {
      var obj = JSON.parse(data);
      this.rejectedCust=obj;
      loader.dismiss();
      console.log('rejected Customer',obj);
      if(this.rejectedCust.length>0){
        this.showreSubmitField=false;
        this.buttonText="Resubmit"
        this.shopName=this.rejectedCust[0].customerName;
        this.selectedZone=this.rejectedCust[0].zone;
        this.customerIdx = this.rejectedCust[0].idx;
        this.getresubmitattachments();
        this.selectedregion=this.rejectedCust[0].region;
        console.log(this.selectedregion,'region',this.rejectedCust[0].region);
        if(this.selectedZone != null){
          this.getRegions(this.selectedZone);
        }
        this.selectedSalesCircle=this.rejectedCust[0].salescircle;
        this.selectedTerritory=this.rejectedCust[0].territroy;
        this.selectedPocket=this.rejectedCust[0].pocketIdx;
        this.nameOfProprietor=this.rejectedCust[0].propretiorName;
        this.proprietorCNIC=this.rejectedCust[0].cnic;
        this.cell=this.rejectedCust[0].phoneNo1;
        this.selectedBank=this.rejectedCust[0].bankName;
        console.log(this.selectedBank,'bank',this.rejectedCust[0].bankName);
        this.AccountNo=this.rejectedCust[0].accountNo;
        this.BranchCode=this.rejectedCust[0].branchCode;
        this.AccountTitle=this.rejectedCust[0].accountTitle;
        this.DMN=this.rejectedCust[0].decisionMaker;
        this.businessAddress=this.rejectedCust[0].address;
        this.selectedTehsil=this.rejectedCust[0].tehsil;
        this.selectedDistrict=this.rejectedCust[0].district;
        this.selectedcity=this.rejectedCust[0].city;
        this.Dob=this.rejectedCust[0].dob;
        this.Education=this.rejectedCust[0].education;
        this.RunPesticidebusiness=this.rejectedCust[0].runPesticidebusiness;
        this.NoOfYearsInMarket=this.rejectedCust[0].noOfYearsWithBayer;
        this.durationPB=this.rejectedCust[0].noOfYearsInMarket;
        this.Siblings=this.rejectedCust[0].siblings;
        this.BlacklistBCS=this.rejectedCust[0].blacklistBCS;
        this.WorkingwithBCS=this.rejectedCust[0].workingwithBCS;
        this.OwnerName=this.rejectedCust[0].ownerName;
        this.OwnerOption=this.rejectedCust[0].ownerNameOption;
        this.selectedCategory=this.rejectedCust[0].category;
        this.WorkingCapital=this.rejectedCust[0].workingCapital;
        this.businessPlanYear1=this.rejectedCust[0].bp1st;
        this.businessPlanYear2=this.rejectedCust[0].bp2nd;
        this.cc1=this.rejectedCust[0].competitionCompanies
        this.cc2=this.rejectedCust[0].competitionCompanies1
        this.cc3=this.rejectedCust[0].competitionCompanies2
        this.C1sale=this.rejectedCust[0].c1sale
        this.C2sale=this.rejectedCust[0].c2sale
        this.C3sale=this.rejectedCust[0].c3sale

        this.TotalPesticidesPreviousYear=this.rejectedCust[0].totalPesticidesPreviousYear;
        this.SLPesticideMarket=this.rejectedCust[0].market;
        this.grainMarket=this.rejectedCust[0].grainMarket;
        this.sunMarket=this.rejectedCust[0].addaSun;
        this.OtherSL=this.rejectedCust[0].other;
        this.GovLicenseNo=this.rejectedCust[0].govLicenseNo;
        this.ValidupTo=this.rejectedCust[0].validupTo;
        this.reasonForOpeningAC=this.rejectedCust[0].justificationsReasonsForAppoint;
        this.closestBDealerKM=this.rejectedCust[0].distance1;
        this.closestBDealerKM2=this.rejectedCust[0].distance2;
        this.closestDealerName=this.rejectedCust[0].dealerName1;
        this.closestDealerName2=this.rejectedCust[0].dealerName2;
        this.closestDealerCode=this.rejectedCust[0].dealerCode1;
        this.closestDealerCode2=this.rejectedCust[0].dealerCode2;
        this.LYSales=this.rejectedCust[0].lySales1;
        this.LYSales2=this.rejectedCust[0].lySales2;
        this.salesPlan=this.rejectedCust[0].salesPlan1;
        this.salesPlan2=this.rejectedCust[0].salesPlan2
        this.negitiveConflictNo=this.rejectedCust[0].negativeImpactNo;
        this.negitiveConflictYes=this.rejectedCust[0].negativeImpactYes;
        this.impactValue=this.rejectedCust[0].impactValue;
        this.latitude=this.rejectedCust[0].latitude;
        this.longitude=this.rejectedCust[0].longitude;
        if(this.selectedregion != null ){
          this.getSalesCircles(this.selectedregion);
        }
        if(this.selectedSalesCircle != null){
          this.getTerritory(this.selectedSalesCircle);
        }
          if(this.selectedTerritory != null){
          this.getPocket(this.selectedTerritory);
        }
        if(this.selectedcity != null){
          this.getDistricts(this.selectedcity);
        }
        if(this.selectedDistrict != null){
          this.getTehsils(this.selectedDistrict);
        }
         this.BCSID=this.rejectedCust[0].BCSYesNo;

      }else{
        this.presentToast('No rejected customer found with this cnic.');
      
        
        this.shopName = "";
        this.nameOfProprietor = "";
        this.proprietorCNIC = "";
        this.cell = "";
          
         
      }
      
    }, err => {
      loader.dismiss()
      this.presentToast('Sorry! got an error.');
      console.log(err);
     
    });

    //end

// attachment api start





  }
  getresubmitattachments() {

//     let filePath: string = 'https://bconnect.com.pk/filesfolder/303eb809dad5436cba1635509305face.jpg';

// this.base64.encodeFile(filePath).then((base64File: string) => {
//   console.log(base64File);
// }, (err) => {
//   console.log(err);
// });

this.http.get(Enums.APIURL.URL+'getresubmitattachments/'+this.customerIdx).map(res => res.json()).subscribe(data => {
  
var obj2 = JSON.parse(data);
this.rejectedattachedobj = obj2;

for(var i=0;i<this.rejectedattachedobj.length;i++)
{
  this.attachments.push(Enums.APIURL.WEB_APP_URL+'/filesfolder/'+this.rejectedattachedobj[i].attachments);
  console.log('attachments:'+this.rejectedattachedobj[i].attachments);
}


//   for (var i = 0; i <= obj.length; i++) {
//     var attachobj = obj[i];
//  this.rejectedCustAttach.push(attachobj[i].attachments);
//   }
// console.log('rejectedCustAttach:'+this.rejectedCustAttach);

});
  }


  /////******Data*******/////
  getApiData() {
    return new Promise((resolve, reject) => {
      // this.http.get(Enums.APIURL.URL + 'fetchemployeepocket ').map(res => res.json()).subscribe(data => {
      //   var obj = JSON.parse(data);
      //   this.Pocket=obj;
      //   console.log("Pockets",obj);
        ///*****plant****/////
        this.http.get(Enums.APIURL.URL + 'fetchemployeeplant ').map(res => res.json()).subscribe(data => {
          var obj = JSON.parse(data);
          this.Plant=obj;
          console.log("Plant",obj);
          ///*****category****/////
          this.http.get(Enums.APIURL.URL + 'fetchemployeecategory ').map(res => res.json()).subscribe(data => {
            var obj = JSON.parse(data);
            this.Category=obj;
            console.log('Categories',obj);
            ///*****cities****/////
            this.http.get(Enums.APIURL.URL + 'fetchEmployeeCityName ').map(res => res.json()).subscribe(data => {
              var obj = JSON.parse(data);
              this.cities=obj;
              console.log('Categories',obj);
            
              
            
            }, err => {
              console.log(err);
             
            });
            //end
          
          }, err => {
            console.log(err);
           
          });
          //end
         
        }, err => {
          console.log(err);
         
        });
        //end
        
      // }, err => {//pocket
      //   console.log(err);
       
      // });
    });
  }


  /////Data end

  // (
  getBanks(){
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      
    });
    loader.present();
    ///*****getZones****/////
    this.http.get(Enums.APIURL.URL+'fetchbank').map(res => res.json()).subscribe(data => {
       var obj = JSON.parse(data);
      this.banks=obj;
      loader.dismiss();
      console.log('banks',obj);
      
    }, err => {
      loader.dismiss()
      console.log(err);
     
    });
    //end
}
getWaitingIn(){
  ///*****getZones****/////
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
    
  });
  loader.present();
  this.http.get(Enums.APIURL.URL+'fetchCustomerRegDesignation').map(res => res.json()).subscribe(data => {
     var obj = JSON.parse(data);
     for(let o of obj){
      this.waitingIn=o.designation;
     }
   
    console.log('waiting',this.waitingIn);
    loader.dismiss();
  }, err => {
    loader.dismiss();
    console.log(err);
   
  });
  //end
}
getTehsils(distIDX){
  this.teshsils=[];
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
   
  });
  loader.present();
  ///*****populatetehsil****/////
  this.http.get(Enums.APIURL.URL+'populatetehsildistrict/'+distIDX).map(res => res.json()).subscribe(data => {
    // var obj = JSON.parse(data);
    loader.dismiss();
    this.teshsils=data;
    console.log('teshsils',data);
    
  }, err => {
    this.presentToast('No related Tehsils found.');
    loader.dismiss();
    console.log(err);
   
  });
  //end
}
public getDealerName1(number){
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
   
  });
  loader.present();
  ///*****getZones****/////
  this.http.get(Enums.APIURL.URL+'getcustomername/'+number).map(res => res.json()).subscribe(data => {
    // var obj = JSON.parse(data);
    loader.dismiss();
    console.log('dealer Name : ',data);
    // this.teshsils=data;
    if(data ==""){
    this.closestDealerName= "No Dealer Found"
    }else{
      this.closestDealerName= data
    }
   
    
  }, err => {
    loader.dismiss();
    console.log(err);
   
  });
  //end
}
public getDealerName2(number){
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
   
  });
  loader.present();
  ///*****getZones****/////
  this.http.get(Enums.APIURL.URL+'getcustomername/'+number).map(res => res.json()).subscribe(data => {
    // var obj = JSON.parse(data);
    loader.dismiss();
    console.log('dealer Name : ',data);
    // this.teshsils=data;
    if(data ==""){
    this.closestDealerName2= "No Dealer Found"
    }else{
      this.closestDealerName2= data
    }
   
    
  }, err => {
    loader.dismiss();
    console.log(err);
   
  });
  //end
}


getDistricts(cityIdx){
  this.districts=[];
  ///*****getZones****/////
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
    
  });
  loader.present();
  // populatedistrict
  this.http.get(Enums.APIURL.URL+'populatedistrictcity/'+cityIdx).map(res => res.json()).subscribe(data => {
    console.log(Enums.APIURL.URL+'populatedistrictcity/'+cityIdx);
    // var obj = JSON.parse(data);
    loader.dismiss()
    this.districts=data;

    console.log('districts',data);
    
  }, err => {
    this.presentToast('No related districts found.');
    loader.dismiss();
    console.log(err);
   
  });
  //end
}
getZones(){
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
    
  });
  loader.present();
    ///*****getZones****/////
    this.http.get(Enums.APIURL.URL +'/populatezone').map(res => res.json()).subscribe(data => {
      // var obj = JSON.parse(data);
      loader.dismiss();
      this.zones=data;
      console.log('zones',data);
      
    }, err => {
      loader.dismiss();
      console.log(err);
     
    });
    //end
}
getRegions(zoneidx){
  console.log(this.selectedZone);
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
   
  });
  loader.present();
  ///*****getZones****/////
  this.http.get(Enums.APIURL.URL +'/populateregions/'+zoneidx).map(res => res.json()).subscribe(data => {
    // var obj = JSON.parse(data);
    loader.dismiss();
    this.regions=data;
    console.log('regions',data);
 
    
  }, err => {
    this.presentToast('No related districts found.');
    loader.dismiss();
    console.log(err);
   
  });
  //end
}
// getPockets(territoryidx){
//   console.log(this.selectedTerritory);
//   const loader = this.loadingCtrl.create({
//     content: "Please wait...",
   
//   });
//   loader.present();
//   ///*****getZones****/////
//   this.http.get(Enums.APIURL.URL +'/fetchemployeepocket/'+territoryidx).map(res => res.json()).subscribe(data => {
//     // var obj = JSON.parse(data);
//     loader.dismiss();
//     this.Pocket=data;
//    console.log("Pockets",this.Pocket);
 
    
//   }, err => {
//     loader.dismiss();
//     console.log(err);
   
//   });
//   //end
// }
getSalesCircles(regionidx){
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
   
  });
  loader.present();
  ///*****getZones****/////
  this.http.get(Enums.APIURL.URL +'/populatesalescircle/'+regionidx).map(res => res.json()).subscribe(data => {
    // var obj = JSON.parse(data);
    loader.dismiss();
    this.salesCircles=data;
    console.log('salesCircles',data);
   
   
    
  }, err => {
    this.presentToast('No related districts found.');
    loader.dismiss();
    console.log(err);
   
  });
  //end
}
getTerritory(circleidx){
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
   
  });
  loader.present();
  ///*****getZones****/////
  this.http.get(Enums.APIURL.URL +'/populateterritory/'+circleidx).map(res => res.json()).subscribe(data => {
    // var obj = JSON.parse(data);
    loader.dismiss();
    this.territory=data;
    console.log('territory',data);
    // this.selectedTerritory=undefined;
   
    
  }, err => {
    loader.dismiss();
    console.log(err);
   
  });
  //end
}
getPocket(territoryidx){
 this.Pocket=[];
  console.log(this.selectedTerritory);
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
  
  });
  loader.present();
  this.http.get(Enums.APIURL.URL +'/populatepockets/'+territoryidx).map(res => res.json()).subscribe(data => {
    // var obj = JSON.parse(data);
    loader.dismiss();
    this.Pocket=data;
    console.log('Pocket',data);
   
    
  }, err => {
    this.presentToast('No related districts found.');
    loader.dismiss()
    console.log(err);
   
  });
  //end
}


  ionViewDidLoad() {
    cordova.plugins.diagnostic.isLocationAvailable(available => {
      console.log("Location is " + (available ? "available" : "not available"));
      if (!available) {
        this.available = false;
        console.log("loc", available);

      } else {
        console.log("loc", available);
      }
    }, function (error) {
      console.error("The following error occurred: " + error);
    });
    //this.getLoc()
    console.log('ionViewDidLoad CustomerRegPage');
  }
  alert() {
    if (this.available) {
      this.getLoc();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Location',
        message: 'Bayer needs your location to register new customer',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              // reject(false);
              this.getLoc();
            }
          },
          {
            text: 'settings',
            handler: () => {
              cordova.plugins.diagnostic.switchToLocationSettings();
              this.getLoc();
              // console.log('Buy clicked');
              //  resolve(true);
            }
          }
        ]
      });
      alert.present();
    }
    // return new Promise((resolve, reject) => {

    // });

  }
  location() {
    cordova.plugins.diagnostic.isLocationAvailable(available => {
      console.log("Location is " + (available ? "available" : "not available"));
      if (!available) {
        this.available = false;
        console.log("loc", available);
        this.alert();

      } else {
        console.log("loc", available);
        this.getLoc();
      }
    }, function (error) {
      console.error("The following error occurred: " + error);
    });
  }
  getLoc() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude
      this.longitude = resp.coords.longitude
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
      this.presentToast('Your Location has been saved');
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   // data.coords.latitude
    //   // data.coords.longitude
    //   console.log(data.coords.latitude);
    //   console.log(data.coords.longitude)
    // });
  }
  logForm() {
    // console.log(form.value);
    console.log(this.title);
  }


  //////IMAGE////
  public presentActionSheet(selection: number) {
    console.log('selection', selection);
    this.selection = selection;
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 70,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)

          .then(filePath => {
            console.log('img:', imagePath);
            console.log('path:', filePath);
            // this.converttobase( filePath)
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }



  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      // console.log('last img',this.lastImage);
      if (this.selection == 1) { //profile Image    
        this.base64.encodeFile(this.pathForImage(this.lastImage)).then((base64File: string) => {
         // this.profileByte = base64File;
         console.log(base64File);
         this.attachments.push(base64File);
          // console.log('profil:', this.profileByte);

          //this.profileImg = this.lastImage;
          // console.log(this.profileImg);
          console.log(this.attachments);
        }, (err) => {
          console.log(err);
          alert(err);
        });

      }
      //  else if (this.selection == 2) { //dealer agreement
      //   this.base64.encodeFile(this.pathForImage(this.lastImage)).then((base64File: string) => {
      //     this.agreementByte = base64File;
      //     console.log('base:', this.agreementByte);
      //     this.agreementImg = this.lastImage;
      //   }, (err) => {
      //     console.log(err);
      //     alert(err);
      //   });
      // } else if (this.selection == 3) { //utility bill
      //   this.base64.encodeFile(this.pathForImage(this.lastImage)).then((base64File: string) => {
      //     this.utilityByte = base64File;
      //     console.log('base:', this.utilityByte);
      //     this.utilityImg = this.lastImage;
      //   }, (err) => {
      //     console.log(err);
      //     alert(err);
      //   });
      // } else if (this.selection == 4) { //frontPictureByte
      //   this.base64.encodeFile(this.pathForImage(this.lastImage)).then((base64File: string) => {
      //     this.frontPictureByte = base64File;
      //     // console.log('base:', this.utilityByte);
      //     this.frontPicture = this.lastImage;
      //   }, (err) => {
      //     console.log(err);
      //     alert(err);
      //   });
      // } else if (this.selection == 5) { // CNICbyte
      //   this.base64.encodeFile(this.pathForImage(this.lastImage)).then((base64File: string) => {
      //     this.CNICbyte = base64File;
      //     // console.log('base:', this.CNICbyte);
      //     this.CNICImg = this.lastImage;
      //   }, (err) => {
      //     console.log(err);
      //     alert(err);
      //   });
      // } else if (this.selection == 6) { //vpLicenseByte 
      //   this.base64.encodeFile(this.pathForImage(this.lastImage)).then((base64File: string) => {
      //     this.vpLicenseByte = base64File;
      //     console.log('base:', this.vpLicenseByte);
      //     this.vpLicenseImg = this.lastImage;
      //   }, (err) => {
      //     console.log(err);
      //     alert(err);
      //   });
      // } else if (this.selection == 7) { //CPBPByte 
      //   this.base64.encodeFile(this.pathForImage(this.lastImage)).then((base64File: string) => {
      //     this.CPBPByte = base64File;
      //     console.log('base:', this.CPBPByte);
      //     this.CPBPImg = this.lastImage;
      //   }, (err) => {
      //     console.log(err);
      //     alert(err);
      //   });
      // } else if (this.selection == 8) { //bankLetterByte 
      //   this.base64.encodeFile(this.pathForImage(this.lastImage)).then((base64File: string) => {
      //     this.bankLetterByte = base64File;
      //     console.log('base:', this.bankLetterByte);
      //     this.bankLetterImg = this.lastImage;
      //   }, (err) => {
      //     console.log(err);
      //     alert(err);
      //   });
      // } else if (this.selection == 9) { //RegistrationByte 
      //   this.base64.encodeFile(this.pathForImage(this.lastImage)).then((base64File: string) => {
      //     this.RegistrationByte = base64File;
      //     console.log('base:', this.bankLetterByte);
      //     this.RegistrationImg = this.lastImage;
      //   }, (err) => {
      //     console.log(err);
      //     alert(err);
      //   });
      // }


    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
  loo(a,loadingg){

   
    var imgggg = a;
    var img2 = imgggg.split("base64,");
    var img3 = img2[1];
    // console.log(img2);
    // console.log(img3);
  
 
  var url = Enums.APIURL.URL + "SavePng";
  let headers1 = new Headers(
    {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  let options = new RequestOptions({ headers: headers1 });
  let data = JSON.stringify(
    {
      Name: img3
    });

  return new Promise((resolve, reject) => {
   
    this.http.post(url, data, options)
      .toPromise()
      .then((response) => {
        console.log('API Response : ', response.json());
        this.contactattachments= this.contactattachments.concat(response.json()+',');
        console.log( this.contactattachments);
       
        // setTimeout(() => {

        // }, 3000);
      
        this.count=this.count+1;
    
        if(this.count !== this.attachments.length){
         
          console.log(this.count ,'==',this.attachments.length);
          
        }else{
          loadingg.dismissAll();
// This part is Added By Mohsin Ali to disapper submit button while uploading to prevent  from duplicate  entry 
// EDITED on : 16-04-2019
          this.checksubmit=true; 
          this.postAttachments(this.custidx,this.contactattachments).then(xx=>{
            if(xx){
              this.presentToast('Request for new customer registration has been sent to administration.');
              this.navCtrl.pop();
            }
          });
          console.log(this.count ,'==',this.attachments.length,'done');
          
         
        }
       
       })
        .catch((error) => {
          loadingg.dismiss();
       
          console.log('API Error : ', error.status);
          console.log('API Error : ', JSON.stringify(error));
          reject(false);
        });
        
// this.uploadImageBytes(a,1);

});


  }

  letslook(){
   
    let loadingg = this.loadingCtrl.create({
      content: 'wait please...',
    });
    loadingg.present();
    this.checksubmit=false;
    // This part is Added By Mohsin Ali to disapper submit button while uploading to prevent  from duplicate  entry 
// EDITED on : 16-04-2019

    for(let a of this.attachments ){
     this.loo(a,loadingg)
      
    
    
  }
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'center'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
 
  showImgg(image) {
    let alert = this.alertCtrl.create({
      // title: 'Image',
      message: '<div> <img style="border-radius: 50%" width="200px" height="auto" src="' + image + '" > </div>',
      buttons: ['Close']
    });
    alert.present();
  }

  //////END

  // public uploadImageBytes(bytes,value) {
  //   return new Promise((resolvee => {
  //     console.log(bytes);
  //     if(bytes != ""){
  //       let loadingg = this.loadingCtrl.create({
  //         content: 'wait please...',
  //       });
  //       loadingg.present();
  //       if(bytes ==""){

  //       }else{
  //         var imgggg = bytes;
  //         var img2 = imgggg.split("base64,");
  //         var img3 = img2[1];
  //         console.log(img2);
  //         console.log(img3);
  //       }
       
  //       var url = Enums.APIURL.URL + "SavePng";
  //       let headers1 = new Headers(
  //         {
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json'
  //         });
  //       let options = new RequestOptions({ headers: headers1 });
  //       let data = JSON.stringify(
  //         {
  //           Name: img3
  //         });
  
  //       return new Promise((resolve, reject) => {
  //         this.http.post(url, data, options)
  //           .toPromise()
  //           .then((response) => {
  //             console.log('API Response : ', response.json());
  //             this.contactattachments= this.contactattachments.concat(response.json()+',');
  //             console.log( this.contactattachments);
  //             loadingg.dismiss();
  //             //this.attach2 = response.json();
  //             //debugger;
  //             if(value==1){
  //               // this.imageP  = response.json()
  //               // this.contactattachments.concat(response.json());
  //               // console.log( this.contactattachments);
  //               //this.allAttachments.push(response.json());
  //               resolve(response.json());
  //             resolvee(true);
  //             }else if(value==2){
  //               this.aggrement  = response.json()
  //               resolve(response.json());
  //             resolvee(true);
  //             }else if(value==3){
  //               this.utility = response.json()
  //               resolve(response.json());
  //             resolvee(true);
  //             }else if(value==4){
  //               this.frontpic = response.json()
  //               resolve(response.json());
  //             resolvee(true);
  //             }else if(value==5){
  //               resolve(response.json());
  //             resolvee(true);
  //               this.cnic = response.json()
  //               resolve(response.json());
  //             resolvee(true);
  //             }else if(value==6){
  //               this.vplnc = response.json()
  //               resolve(response.json());
  //             resolvee(true);
  //             }else if(value==7){
  //               this.cpbp = response.json()
  //               resolve(response.json());
  //             resolvee(true);
  //             }else if(value==8){
  //               this.acletter = response.json()
  //               resolve(response.json());
  //               resolvee(true);
  //             }else if(value==9){
  //               this.req = response.json()
  //               resolve(response.json());
  //             resolvee(true);
  //             }
  //             loadingg.dismiss();
              
  //             return response.json();
  
  //           })
  //           .catch((error) => {
  //             loadingg.dismiss();
  //             resolvee(true);
  //             console.log('API Error : ', error.status);
  //             console.log('API Error : ', JSON.stringify(error));
  //             reject(false);
  //           });
  //       });
  //     }else{
  //       resolvee(true);
  //     }
     


  //   }));


  // }//uplod end

  uploadattach(IDX){
    console.log('API Response : ');
   
    for(let a of this.attachments ){
     
      
      var imgggg = a;
          var img2 = imgggg.split("base64,");
          var img3 = img2[1];
          // console.log(img2);
          // console.log(img3);
        
       
        var url = Enums.APIURL.URL + "SavePng";
        let headers1 = new Headers(
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          });
        let options = new RequestOptions({ headers: headers1 });
        let data = JSON.stringify(
          {
            Name: img3
          });
  
        return new Promise((resolve, reject) => {
          let loadingg = this.loadingCtrl.create({
            content: 'wait please...',
          });
          loadingg.present();
          this.http.post(url, data, options)
            .toPromise()
            .then((response) => {
              console.log('API Response : ', response.json());
              this.contactattachments= this.contactattachments.concat(response.json()+',');
              console.log( this.contactattachments);
             
              loadingg.dismiss(); 
          
          
            
             
             })
              .catch((error) => {
                loadingg.dismiss();
             
                console.log('API Error : ', error.status);
                console.log('API Error : ', JSON.stringify(error));
                reject(false);
              });
              
      // this.uploadImageBytes(a,1);
      
    });
   
    
  }
}
  remove(index){
    this.attachments.splice(index,1);

  }
  postCustomerInfoNProfile(){
    // if(this.profileByte != ""){
    //   this.uploadImageBytes(this.profileByte,1).then(x => {
    //     if(x){
    //       this.uploadAllInfo(this.imageP).then(y=>{
    //         if(y){
    //           this.uploadAllAttachments(this.custidx);
    //         }
    //       });
    //     }else{
    //       this.uploadAllInfo('').then(y=>{
    //         if(y){
    //           this.uploadAllAttachments(this.custidx);
    //         }
    //       });
    //     }
    //   });
    // }else{
      this.uploadAllInfo('').then(y=>{
        if(y){
          this.letslook( );
        }
      });
    // }
   
  }
  // public uploadAllAttachments(IDX) {
   
  
  //   this.uploadImageBytes(this.utilityByte,3).then(x => {
  //     this.uploadImageBytes(this.agreementByte,2).then(x => {
  //       this.uploadImageBytes(this.frontPictureByte,4).then(x => {
  //         this.uploadImageBytes(this.CNICbyte,5).then(x => {
  //          this.uploadImageBytes(this.vpLicenseByte,6).then(x => {
  //             this.uploadImageBytes(this.CPBPByte,7).then(x => {
  //               this.uploadImageBytes(this.bankLetterByte,8).then(x => {
  //                 this.uploadImageBytes(this.RegistrationByte,9).then(x => {
                   
                    
  //                 });
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });
  //   });

  
   
  // }
 postAttachments(custIDX,attaments){
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
    duration: 3000
  });
  loader.present();
  return new Promise((resol)=>{
    var attachment=attaments;
  let headers1 = new Headers(
    {
    'Accept' : 'application/json',
    'Content-Type' : 'application/json'
  });
  
  let options = new RequestOptions({ headers: headers1 });
  
  let data;
  // if(this.attach2 === "-"){
    data = JSON.stringify(
      {
        CustomerIdx:custIDX,
        Attachments:attachment,
       
      });
      console.log("Customer Complain JsonFormat................")
      console.log(data);
  // }
    return new Promise((resolve, reject) => {
      this.http.post(Enums.APIURL.URL+'savecustomerattachment', data, options)
      .toPromise()
      .then((response) =>
      {
        
        console.log('API Response : ', response.json());
        loader.dismissAll();
        resol(true);
        resolve(response.json());
      })
      .catch((error) =>
      {
        loader.dismissAll();
        console.error('API Error : ', error.status);
        console.error('API Error : ', JSON.stringify(error));
        reject(error.json());
      });
    });
      });
  
 }
  
  uploadAllInfo(profile){
      return new Promise((resol,reject)=>{
        
  let headers1 = new Headers(
    {
    'Accept' : 'application/json',
    'Content-Type' : 'application/json'
  });
  
  let options = new RequestOptions({ headers: headers1 });
  
  let data;
  // if(this.attach2 === "-"){
    data = JSON.stringify(
      {
        "CreatedBy":this.crtdbyId,
        "CustomerName":this.shopName,
        "Zone": this.selectedZone,
        "Region": this.selectedregion,
        "Territroy": this.selectedTerritory,
        "Salescircle": this.selectedSalesCircle,
        "PropretiorName": this.nameOfProprietor,
        "Cnic": this.proprietorCNIC,
        "PhoneNo1": this.cell,
        "BankName": this.selectedBank,
        "AccountTitle": this.AccountTitle,
        "BranchCode": this.BranchCode,
        "AccountNo": this.AccountNo,
        "DecisionMaker": this.DMN,
        "Address": this.businessAddress,
        "Tehsil": this.selectedTehsil,
        "District": this.selectedDistrict,
        "City": this.selectedcity,
        "Dob": this.Dob,
        "Education": this.Education,
        "RunPesticidebusiness": this.RunPesticidebusiness,
        "NoOfYearsInMarket": this.durationPB,//duration of pesticides business
        "NoOfYearsWithBayer": this.NoOfYearsInMarket,// no of years
        "Siblings": this.Siblings,
        "BlacklistBCS": this.BlacklistBCS,
        "WorkingwithBCS": this.WorkingwithBCS,
        "BCSYesNo": this.BCSID,
        "OwnerName" : this.OwnerName,
        "OwnerOption":this.OwnerOption,
        "Category": this.selectedCategory,
        "Bp1st": this.businessPlanYear1,
        "Bp2nd": this.businessPlanYear2,
        "WorkingCapital": this.WorkingCapital,
        "CompetitionCompanies": this.cc1,
        "CompetitionCompanies1": this.cc2,
        "CompetitionCompanies2": this.cc3,
        "C1sale":this.C1sale,
        "C2sale":this.C2sale,
        "C3sale":this.C3sale,
        "TotalPesticidesPreviousYear": this.TotalPesticidesPreviousYear,
        "GovLicenseNo": this.GovLicenseNo,
        "ValidupTo": this.ValidupTo,
        "PocketIdx": this.selectedPocket,
        "Useridx":"0",
        "Latitude": this.latitude,
        "Longitude": this.longitude,
        "WaitingIn": this.waitingIn,
        "PesticideBusiness": "particular",
        "JustificationsReasonsForAppoint": this.reasonForOpeningAC,
        "Distance1": this.closestBDealerKM,
        "Distance2": this.closestBDealerKM2,
        "DealerCode1": this.closestDealerCode,
        "DealerCode2": this.closestDealerCode2,
        "LySales1": this.LYSales,
        "LySales2": this.LYSales2,
        "Salesplan1": this.salesPlan,
        "Salesplan2": this.salesPlan2,
        "NegativeImpactNo": this.negitiveConflictNo,
        "NegativeImpactYes": this.negitiveConflictYes,
        "ImpactValue": this.impactValue,
        "DealerName1":this.closestDealerName,
        "DealerName2":this.closestDealerName2,
         "Market":this.SLPesticideMarket,
        "GrainMarket":this.grainMarket,
        "AddSun" : this.sunMarket,
        "Other":this.OtherSL,
        "PlantIdx": '0',
      
       
      });
      console.log("Customer Complain JsonFormat................")
      console.log(data);
  // }
    return new Promise((resolve, reject) => {
      this.http.post(Enums.APIURL.URL+'savecustomer', data, options)
      .toPromise()
      
      .then((response) =>
      {

        this.custidx= response.json()

        
        resol(true);
       // var obj = JSON.parse(data);,res
        console.log('API Response : ', response.json());
        // this.uploadString();
       // this.custAlert.presentAlert("Bayer","Your feedback has been sent to Bayer.\nSupport No: \n Thankyou.");
      
        
        resolve(response.json());
      })
      .catch((error) =>
      {
        console.error('API Error : ', error.status);
        console.error('API Error : ', JSON.stringify(error));
        reject(error.json());
      });
    });
      });
  }
  uploadCustumerInfo() {
    console.log( "createdBy:",this.asoIdx2,
    "CustomerName:",this.shopName,
    "Zone:", this.selectedZone,
    "Region:", this.selectedregion,
    "Territroy:", this.selectedTerritory,
    "Salescircle:", this.selectedSalesCircle,
    "PropretiorName:", this.nameOfProprietor,
    "Cnic:", this.proprietorCNIC,
    "PhoneNo1:", this.cell,
    "BankName:", this.selectedBank,
    "AccountTitle:", this.AccountTitle,
    "BranchCode:", this.BranchCode,
    "AccountNo:", this.AccountNo,
    "DecisionMaker:", this.DMN,
    "Address:", this.businessAddress,
    "Tehsil:", this.selectedTehsil,
    "District:", this.selectedDistrict,
    "City:", this.selectedcity,
    "Dob:", this.Dob,
    "Education:", this.Education,
    "RunPesticidebusiness:", this.RunPesticidebusiness,
    "NoOfYearsInMarket:", this.durationPB,//duration of pesticides business
    "NoOfYearsWithBayer:", this.NoOfYearsInMarket,// no of years
    "Siblings:", this.Siblings,
    "BlacklistBCS:", this.BlacklistBCS,
    "WorkingwithBCS:", this.WorkingwithBCS,
    "BCSYesNo:", this.BCSID,
    "OwnerName:" , this.OwnerName,
    "OwnerOption:",this.OwnerOption,
    "Category:", this.selectedCategory,
    "Bp1st:", this.businessPlanYear1,
    "Bp2nd:", this.businessPlanYear2,
    "WorkingCapital:", this.WorkingCapital,
    "CompetitionCompanies:", this.cc1,
    "CompetitionCompanies1:", this.cc2,
    "CompetitionCompanies2:", this.cc3,
    "TotalPesticidesPreviousYear:", this.TotalPesticidesPreviousYear,
    "GovLicenseNo:", this.GovLicenseNo,
    "ValidupTo:", this.ValidupTo,
    "PocketIdx:", this.selectedPocket,
    "Useridx:","0",
    "Latitude:", this.latitude,
    "Longitude:", this.longitude,
    "WaitingIn:", this.waitingIn,
    "PesticideBusiness:", "particular",
    "JustificationsReasonsForAppoint:", this.reasonForOpeningAC,
    "Distance1:", this.closestBDealerKM,
    "Distance2:", this.closestBDealerKM2,
    "DealerCode1:", this.closestDealerCode,
    "DealerCode2:", this.closestDealerCode2,
    "LySales1:", this.LYSales,
    "LySales2:", this.LYSales2,
    "Salesplan1:", this.salesPlan,
    "Salesplan2:", this.salesPlan2,
    "NegativeImpactNo:", this.negitiveConflictNo,
    "NegativeImpactYes:", this.negitiveConflictYes,
    "ImpactValue:", this.impactValue,
    "DealerName1:",this.closestDealerName,
    "DealerName2:",this.closestDealerName2,
     "Market:",this.SLPesticideMarket,
    "GrainMarket:",this.grainMarket,
    "AddSun:" , this.sunMarket,
    "Other:",this.OtherSL,
    "PlantIdx:", '0',);
   if(this.attachments.length > 0){

   
   
  
    console.log( this.shopName,
      this.selectedZone ,
      this.selectedregion ,
      this.selectedTerritory ,
      this.selectedSalesCircle ,
      this.nameOfProprietor,
      this.proprietorCNIC,
      this.cell,
     this.selectedBank ,
     this.AccountTitle,
     this.BranchCode,
     this.AccountNo,
     this.DMN,
     this.businessAddress,
     this.selectedTehsil ,
     this.selectedDistrict ,
     this.selectedcity ,
     this.Dob,
     this.Education,
     this.RunPesticidebusiness,
     this.durationPB,
     this.NoOfYearsInMarket,
     this.Siblings,
     this.BlacklistBCS,
     this.WorkingwithBCS,
     this.OwnerName,
     this.OwnerOption,
     this.selectedCategory,
     this.businessPlanYear1,
     this.businessPlanYear2,
     this.WorkingCapital,
     this.cc1,
     this.cc2,
     this.cc3,
     this.C1sale,
     this.C2sale,
     this.C3sale,
     this.TotalPesticidesPreviousYear,
     this.GovLicenseNo,
     this.ValidupTo,
     this.selectedPocket ,
     this.asoIdx2,
     this.latitude ,
     this.longitude ,
     this.waitingIn,
     this.reasonForOpeningAC,
     this.closestBDealerKM,
     this.closestBDealerKM2,
     this.closestDealerCode,
     this.closestDealerCode2,
     this.LYSales,
     this.LYSales2,
     this.salesPlan,
     this.salesPlan2,
     this.negitiveConflictNo,
     this.negitiveConflictYes,
     this.impactValue,
     this.closestDealerName,
     this.closestDealerName2,
     this.SLPesticideMarket,
     this.grainMarket,
     this.sunMarket,
     this.OtherSL ,);
    // 
    
    // 
    // 
    // this.Dob == "" ||
    // this.Education == "" ||
   
    // 
    // 
    // 
    // this.selectedPocket == undefined ||
    // this.asoIdx2 == "" ||
    // this.latitude == undefined ||
    // this.longitude == undefined ||
    // this.waitingIn == "" ||
    // this.reasonForOpeningAC == "" ||
    // this.closestBDealerKM == "" ||
    // this.closestBDealerKM2 == "" ||
    // this.closestDealerCode == "" ||
    // this.closestDealerCode2 == "" ||
    // this.LYSales == "" ||
    // this.LYSales2 == "" ||
    // this.salesPlan == "" ||
    // this.salesPlan2 == "" ||
    // this.negitiveConflictNo == "" ||
    // this.negitiveConflictYes == "" ||
    // this.impactValue == "" ||
    // this.closestDealerName == "" ||
    // this.closestDealerName2 == "" ||
   
    
    // this.AccountTitle == "" ||
    // this.BranchCode == "" ||
    // this.AccountNo == "" ||
    // this.DMN == "" ||
    // 
    // //  
    
    if (
     
   
      
       this.selectedZone == undefined ||
       this.selectedregion == undefined ||
       this.selectedTerritory == undefined ||
       this.selectedSalesCircle == undefined ||
       this.selectedBank == undefined ||
       this.selectedPocket == undefined ||
       this.selectedTehsil == undefined ||
       this.selectedDistrict == undefined ||
       this.selectedcity == undefined ||
      this.shopName ===""|| 
      this.nameOfProprietor === "" ||  
      this.proprietorCNIC == ""||
      this.cell == "" ||
      this.AccountTitle == "" ||
      this.BranchCode == "" ||
      this.AccountNo == "" ||
      this.DMN == "" ||
      this.businessAddress == "" ||
      this.Dob == "" ||
      this.Education == "" ||
     this.RunPesticidebusiness == "" ||
    this.durationPB == "" ||
    this.NoOfYearsInMarket == "" ||
    this.Siblings == "" ||
    this.BlacklistBCS == "" ||
    this.WorkingwithBCS == "" ||
    this.OwnerName == "" ||
    this.OwnerOption == "" ||
   
    this.businessPlanYear1 == "" ||
    this.businessPlanYear2 == "" ||
    this.WorkingCapital == "" ||
    this.cc1 == "" ||
    this.cc2 == "" ||
    this.cc3 == "" ||
    this.C1sale == "" ||
    this.C2sale == "" ||
    this.C3sale == "" ||
    this.TotalPesticidesPreviousYear == "" ||
    this.GovLicenseNo == "" ||
    this.ValidupTo == "" ||
     this.SLPesticideMarket == "" ||
    this.grainMarket == "" ||
    this.sunMarket == "" ||
    this.OtherSL == "" ||
     this.selectedPocket == undefined ||
    this.asoIdx2 == "" ||
    this.latitude == undefined ||
    this.longitude == undefined ||
    this.waitingIn == "" ||
    this.reasonForOpeningAC == "" ||
    this.closestBDealerKM == "" ||
    this.closestBDealerKM2 == "" ||
    this.closestDealerCode == "" ||
    this.closestDealerCode2 == "" ||
    this.LYSales == "" ||
    this.LYSales2 == "" ||
    this.salesPlan == "" ||
    this.salesPlan2 == "" ||
    this.negitiveConflictNo == "" ||
    this.negitiveConflictYes == "" ||
    this.impactValue == "" ||
    this.closestDealerName == "" ||
    this.closestDealerName2 == "" ||
    this.BCSID ==""
     
    ) {
      // console.log(this.LoginID);  this.selectedCategory == "" ||
      this.presentToast('Bayer:Please fill all the required info.');
      console.log("logi "+this.longitude)
      //this.border = 'yellow';
    } else {
      if(this.latitude == ""  || this.longitude==""){
        this.presentToast('Bayer:Please provide your location by clicking Map button');
      }else{
        // if(this.isValid(this.Password,this.cPassword)){
         
        // }else{



// This part is Added By Mohsin Ali to prevent from duplicate cnic entry 
// EDITED on : 16-04-2019


          this.http.get(Enums.APIURL.URL+'getduplicatecheck/'+this.proprietorCNIC).map(res => res.json()).subscribe(data => {
            if(data.length > 2)
            {
              this.presentToast('CNIC ALREADY EXISTS');
            }
            else
            {
              this.postCustomerInfoNProfile();

            }

          }, err => {
            console.log(err);
          });
  








         
      
        // }
     
      }
    }
  }else{
    this.presentToast('Please add requested attachments');
  }
  }

  map() {
    cordova.plugins.diagnostic.isLocationAvailable(available => {
      console.log("Location is " + (available ? "available" : "not available"));
      if (!available) {
     
        this.alert();

      } else {
        this.navCtrl.push('MapPage');
      }
    }, function (error) {
      console.error("The following error occurred: " + error);
    });
   
    
  }
  ionViewWillEnter() {
    let loader=this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    this.http.get(Enums.APIURL.URL+'setPasswordPolicy').map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
      loader.dismiss();
        this.passwordPolicy=obj[0].RegularExp;
        console.log("passPolicy",this.passwordPolicy)
        //  this.loading.dismiss();
    // resolve(true);
        },err => {
          console.log(err);
          loader.dismiss();
          // resolve(false);
          // alert(err);
        });
    this.nativeStorage.getItem('loc')
      .then(
        data => {
          this.latitude = data.lat;
          this.longitude = data.lng;
          console.log(data.lat, data.lng)
        },

        error => console.error(error)
      );
  }

  public isValid(pass,cpass){
    console.log(pass,"___",cpass)
 
       if(pass === cpass){
         var regexx  = this.passwordPolicy;
         var str =  regexx.toString();
 
         var parts = /\/(.*)\/(.*)/.exec(str);
       var restoredRegex = new RegExp(parts[1], parts[2]);
 
      
         // console.log(this.passwordPolicy);
 
         if(restoredRegex.test(pass)){
        return true;
          
         }else{
           this.custAlert.presentAlert('Bad Password','Password must contains special characters and not be less than 8 characters.');
           return false;
          
         }
        
         
       }else{
         this.custAlert.presentAlert('Wrong Password','Password not matched with confrim Password field.');
          
         return false;
       }
 
     }
}
