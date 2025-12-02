import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RiskService {

  private baseURL = "http://127.0.0.1:8000"; 

  constructor(private http: HttpClient) {}

  predictRisk(coords: any) {
    return this.http.post(`${this.baseURL}/risk-check`, coords); 
  }

  getHistory() {
    return this.http.get(`${this.baseURL}/history`);
  }
}
