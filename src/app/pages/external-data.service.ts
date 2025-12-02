import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExternalDataService {

  constructor(private http: HttpClient) {}

  getWeather(lat: number, lng: number) {
    return this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=TU_API_KEY&units=metric`
    );
  }
}
