import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { AppSettings, environment } from '../../../../environments/environment';
import { ApiService } from '../../api.service';
import { GoogleMapsLoaderService } from '../../google-maps-loader.service';
import MarkerClusterer from '@googlemaps/markerclustererplus';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent implements OnInit {
  points: any = [];
  mapData: any = [];
  baseurl = environment.BASEURL;
  requestCount: any;
  filterdate: any
  mapFilterForm: FormGroup;
  constructor(
    private mapsLoader: GoogleMapsLoaderService,
    private apiservice: ApiService,
    private datePipe: DatePipe,
    private toasterService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.processData();
    this.initializeMapFilterForm()
  }
  initializeMapFilterForm(): void {
    this.mapFilterForm = new FormGroup({
      dateTimeRange: new FormControl(null),
    })
  }
  processData() {
    this.apiservice.CommonGetApi("services/request/heatMap").subscribe({
      next: (res) => {
        console.log('API response:', res);
        if (res && res.data && res.data.mapData) {
          this.mapData = res.data.mapData.map(item => ({
            lat: item.lat[1],  // Correctly assigning latitude
            lng: item.lat[0]   // Correctly assigning longitude
          }));
          this.requestCount = this.mapData.length;
          console.log(this.requestCount)
          this.loadMap();
        } else {
          console.warn('Invalid map data format:', res);
        }
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
        console.error('API error:', error);
      },
    });
  }

  loadMap() {
    this.mapsLoader.load().then(() => {
      this.initializeMap();
    }).catch((err) => {
      console.error("Error loading Google Maps API:", err);
    });
  }

  initializeMap(): void {
    const geocoder = new google.maps.Geocoder();
    const placeName = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;

    geocoder.geocode({ address: placeName }, (results: any, status: string) => {
      if (status === "OK") {
        const centerCoords = results[0].geometry.location;

        const map = new google.maps.Map(document.getElementById("trackerMap") as HTMLElement, {
          center: centerCoords,
          zoom: AppSettings.MAP_ZOOM,
          mapId: "243c43004ef20f68",
          streetViewControl: false
        });
        const markers = [];
        let openInfoWindow: google.maps.InfoWindow | null = null;
        if (this.mapData.length > 0) {
          this.mapData.forEach(data => {

            const marker = new google.maps.Marker({
              position: {
                lat: data.lat,
                lng: data.lng,
              },
              map: map,
              title: "Marker Title",
              icon: {
                url: 'assets/images/pin.svg', // Path to your custom black map pin icon
                scaledSize: new google.maps.Size(20, 20), // Adjust the size as needed
              },
            });
            markers.push(marker);

          });
          const markerCluster = new MarkerClusterer(map, markers, {
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
            gridSize: 60,
            maxZoom: 15, // Adjust as needed
          });
        } else {
          console.warn("No map data available to display markers.");
        }
      } else {
        console.error("Geocode was not successful for the following reason: " + status);
      }
    });
  }
  filterAPI() {
    const fromdate =  this.mapFilterForm.value.dateTimeRange.start
    const todate =  this.mapFilterForm.value.dateTimeRange.end
    const transformFromDate = this.datePipe.transform(fromdate, 'yyyy-MM-dd')
    const transformToDate = this.datePipe.transform(todate, 'yyyy-MM-dd')
    let queryParams = 'services/request/heatMap'

    if (fromdate && todate) {
      queryParams += "?createdAt_gte=" + transformFromDate + '&createdAt_lte=' + transformToDate;
      console.log(queryParams)
    }
    this.apiservice.CommonGetApi(queryParams).subscribe({
      next: (res) => {
        console.log('API response:', res);
        if (res && res.data && res.data.mapData) {
          this.mapData = res.data.mapData.map(item => ({
            lat: item.lat[1],  // Correctly assigning latitude
            lng: item.lat[0]   // Correctly assigning longitude
          }));
          this.requestCount = this.mapData.length;
          console.log(this.requestCount)
          this.loadMap();
        } else {
          console.warn('Invalid map data format:', res);
        }
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
        console.error('API error:', error);
      },
    });
  }
  clear() {
    this.initializeMapFilterForm()
    this.processData()
  }
}
