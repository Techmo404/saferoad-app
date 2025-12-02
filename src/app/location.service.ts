import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocationService {

  getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("GPS no soportado");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => reject(err)
      );
    });
  }
}
