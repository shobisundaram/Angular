import { Injectable } from "@angular/core";
import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class GoogleMapsLoaderService {
  private loader: Loader;

  constructor() {
    const loaderOptions: LoaderOptions = {
      apiKey: environment.GoogleMapKey,
      version: "weekly",
      libraries: ["places", "geometry", "drawing"], // Include required libraries here
    };
    this.loader = new Loader(loaderOptions);
  }

  load(): Promise<any> {
    if (window.google && window.google.maps) {
      console.log("Google Maps API is already loaded.");
      return Promise.resolve();
    }
    return this.loader.importLibrary('places');
    // return this.loader.load().then(() => {
    //   console.log("Google Maps API loaded successfully.");
    // }).catch(error => {
    //   console.error("Error loading Google Maps API:", error);
    //   throw error; // Rethrow the error to propagate it to the caller
    // });
  }
}
