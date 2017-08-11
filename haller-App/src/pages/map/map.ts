import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  CameraPosition,
  MarkerOptions,
  Marker,
  Geocoder
} from '@ionic-native/google-maps';
/**
 * Generated class for the Map page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  mapData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps, private geocoder: Geocoder) {
    this.mapData = this.navParams.data.mapData;
    console.log('this.mapData', this.mapData);
    // console.log('this.mapData', JSON.parse(this.mapData.location).location);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad Map');
    if (this.mapData.location) {
      if (typeof this.mapData.location == 'string')
        this.createMap(JSON.parse(this.mapData.location).location);
      else {
        let obj = this.mapData.location;
        this.createMap(obj);
      }
    } else if (this.mapData.address) {
      //{ address: '1450 Jayhawk Blvd, Lawrence, KS 66045, USA' }
      this.geocoder.geocode({ address: this.mapData.address }).then((res: any) => {
        console.log('res', res);
        this.createMap(res[0].position);
      })
    }
  }

  createMap(mapLoc) {
    console.log('mapLoc', mapLoc);
    let element: HTMLElement = document.getElementById('gglchatmap');
    let map: GoogleMap = this.googleMaps.create(element);
    map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        // console.log('Map is ready!');
        element.classList.add('show-map');
        // create CameraPosition
        let position: CameraPosition = {
          target: mapLoc,
          zoom: 18,
          tilt: 30
        };

        map.moveCamera(position);
        //1450 Jayhawk Blvd, Lawrence, KS 66045, USA

        // create new marker
        let markerOptions: MarkerOptions = {
          position: mapLoc
        };

        map.addMarker(markerOptions)
          .then((marker: Marker) => {
            marker.showInfoWindow();
          });
      }
    );
  }

}
