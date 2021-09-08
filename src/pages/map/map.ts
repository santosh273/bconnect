import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { NativeStorage } from '@ionic-native/native-storage';
import * as Enums from '../../models/interfaces/enums';

import { Http } from '@angular/http';





/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {

  markerlatlong: any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;


  position: Geoposition;
  lat;
  latlng: any;
  lng;
  customerData: any = [];
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public nativeStorage: NativeStorage, public navCtrl: NavController, public geolocation: Geolocation, private http: Http) {


    // this.customerData = [
    //   {
    //     name: "test1",
    //     id: "10000",
    //     latitude: "24.8280874",
    //     longitude: "67.0730589",
    //   },
    //   {
    //     name: "test2",
    //     id: "20000",
    //     latitude: "24.838614",
    //     longitude: "67.079865",
    //   },
    //   {
    //     name: "test3",
    //     id: "30000",
    //     latitude: "24.8395779",
    //     longitude: "67.0810604",
    //   },
    //   {
    //     name: "test4",
    //     id: "40000",
    //     latitude: "24.8817276",
    //     longitude: "67.1094612",
    //   }
    // ];


  }
  ionViewDidLeave() {

    this.save(this.lat, this.lng);
  }
  openmap() {
    // the url,html tag should be called from here , how ?

    window.open("https://www.google.com/maps", '_system');
  }
  filldealerdata(map) {

    this.http.get(Enums.APIURL.URL + 'getdealermapdata').map(res => res.json()).subscribe(data => {

      var obj = JSON.parse(data);
      this.customerData = obj;

      console.log(this.customerData);
      console.log('data for map');
      var infowindow = new google.maps.InfoWindow();
      var marker, i;

      for (i = 0; i < this.customerData.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.customerData[i].lat, this.customerData[i].lng),
          map: map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
          return function () {
            infowindow.setContent(this.customerData[i].customerno + '<br>' + this.customerData[i].customername);
            infowindow.open(map, marker);
          }
        })(marker, i));
      }

    });

  }
  ionViewDidLoad() {
    //this.loadMap();
    // this.themap();
    this.getlocation();
  }

  getlocation() {

    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;

    }, (err) => {
      console.log(err);
    });


  }
  loadMap() {
    const loader = this.loadingCtrl.create({
      content: "Loading Map...",

    });
    loader.present();
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;

      loader.dismissAll();
      let mapOptions = {
        center: latLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarker();
      this.filldealerdata(this.map);
    }, (err) => {
      console.log(err);
    });
  }
  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      icon: {
        url: 'assets/imgs/marker.png',
        scaledSize: {
          width: 80,
          height: 85
        }
      },
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
      //  position: {
      //   lat: 24.8328808,
      //   lng: 67.071798
      // }

    });

    // this.lat=lat;
    // this.lng=lng;

    // var lat = marker.getPosition().lat();
    // var lng = marker.getPosition().lng();
    console.log(marker.Geoposition);

    // console.log("loc", lat, lng);
    console.log("Taimoor");
    let content = "<h4>Lat: " + this.lat + "<br>Lng: " + this.lng + "</h4>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    infoWindow.open(this.map, marker);
    this.addInfoWindow(marker, content);

    this.save(this.lat, this.lng);
    this.presentToast('Your Location has been saved');
  }
  addInfoWindow(marker, content) {



    google.maps.event.addListener(marker, 'drag', () => {
      var lat = marker.getPosition().lat();
      var lng = marker.getPosition().lng();
      this.lat = lat;
      this.lng = lng;
      let content = "<h4>Lat: " + lat + "<br>Lng: " + lng + "</h4>";
      //  var mmm= marker.getPosition()
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });


      console.log(marker.Geoposition);
      console.log("loc", lat, lng);
      this.save(lat, lng);
      //   this.presentToast('Your Location has been saved')
      infoWindow.open(this.map, marker);
    });
    this.presentToast('Your Location has been saved')

  }
  done() {
    console.log(this.latlng, 'this.latlng')

    if(this.latlng != null)
    {
    if (this.latlng.includes(',')) {

      var latlngv = this.latlng.split(',');

      this.lat = latlngv[0];
      console.log(this.lat, 'this.lat modified')
      this.lng = latlngv[1];
      console.log(this.lng, 'this.lng modified')
      this.navCtrl.pop();
    }
    else {
      this.presentToast('Ordinates must contains comma (Latitude,Longitude)')
    }
  }
  else
  {
    this.presentToast('Please enter lattitude and longitude')

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

  save(lat, lng) {
    this.nativeStorage.setItem('loc', { lat: lat, lng: lng }).then(
      () => console.log('Stored loc! lat , lng ' + lat + ' ,' + lng),
      error => console.error('Error storing loc', error),

    );
  }

}
