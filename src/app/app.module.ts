import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SignInPage } from '../pages/sign-in/sign-in';
import { SalesPage } from '../pages/sales/sales';

import { NativeStorage } from '@ionic-native/native-storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ApiProvider } from '../providers/api/api';
import { ViewDetailsPage } from '../pages/view-details/view-details';
import { MakeNewOrderPage } from '../pages/make-new-order/make-new-order';
import { SchemePage } from '../pages/scheme/scheme';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { CustAlert } from '../providers/cust-alert/cust-alert';
import { HttpInterceptor } from '../providers/http-interceptor/http-interceptor';
import { InfoPage } from '../pages/info/info';
import { Agrement } from '../providers/agrement/agrement';
import { InfoPageModule } from '../pages/info/info.module';
import { Badge } from '@ionic-native/badge';
import { Geolocation } from '@ionic-native/geolocation';
// import { PipesModule } from '../pipes/pipes.module';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { PipesModule } from '../pipes/pipes.module';
// import { ContactUsPage } from '../pages/contact-us/contact-us';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    SignInPage,
    SalesPage,
    ViewDetailsPage,
    MakeNewOrderPage,
    SchemePage,
 
  
    // ContactUsPage
    //PendingPage,
   // CompletedPage,
   // RejectedPage,
   
  ],
  imports: [
    BrowserModule,
    HttpModule,
    InfoPageModule,
    SelectSearchableModule,
     PipesModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top', tabsHideOnSubPages: true,})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SignInPage,
    SalesPage,
    ViewDetailsPage,
    MakeNewOrderPage,
    SchemePage,
    InfoPage,
    // SafePipe
    // ContactUsPage
    //PendingPage,
   // CompletedPage,
    //RejectedPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    InAppBrowser,
    File,
    Transfer,
    Camera,
    FilePath,
    Base64,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    CustAlert,
    HttpInterceptor,
    Agrement,
    Agrement,
    Badge,
    Geolocation
  ]
})
export class AppModule {}
