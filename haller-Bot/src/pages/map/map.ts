import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  CameraPosition,
  MarkerOptions,
  Marker,
  Geocoder,
  ILatLng
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  mapData: any;
  position: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps,
    private geocoder: Geocoder, private platform: Platform) {
    this.mapData = this.navParams.data.mapData;
  }

  getDirection() {
    let destination = this.position.lat + ',' + this.position.lng;
    console.log('ios', this.platform.is('ios'));
    console.log('destination', destination);
    if (this.platform.is('ios')) {
      window.open('maps://?q=' + destination, '_system');
    } else {
      let label = encodeURI('My Label');
      window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
    }
  }

  ionViewDidLoad() {
    if (this.mapData.location) {
      if (typeof this.mapData.location == 'string')
        this.createMap(JSON.parse(this.mapData.location).location);
      else {
        let obj = this.mapData.location;
        this.createMap(obj);
      }
    } else if (this.mapData.address) {
      this.geocoder.geocode({ address: this.mapData.address }).then((res: any) => {
        this.position = res[0].position;
        this.createMap(res[0].position);
      })
    }
  }

  createMap(mapLoc) {
    let element: HTMLElement = document.getElementById('gglchatmap');
    let map: GoogleMap = this.googleMaps.create(element);
    map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        element.classList.add('show-map');
        let latlng: ILatLng = {
          lat: mapLoc.lat,
          lng: mapLoc.lng
        }
        let position: CameraPosition<ILatLng> = {
          target: latlng,
          zoom: 18,
          tilt: 30
        };

        map.moveCamera(position);
        let markerOptions: MarkerOptions = {
          position: mapLoc
        };
        if (this.mapData.address) {
          markerOptions.title = this.mapData.address;
        }

        map.addMarker(markerOptions)
          .then((marker: Marker) => {
            marker.showInfoWindow();
          });
      }
    );
  }
}
