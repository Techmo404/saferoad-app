import { HttpClient } from '@angular/common/http'; 
import { Component, AfterViewInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RiskService } from '../../risk.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements AfterViewInit {

  riskResult: any = null;
  map: any;
  marker: any;

  selectedLocation: { lat: number, lng: number } | null = null;
  loading = false;

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router,
    private riskService: RiskService,
    private authService: AuthService 
  ) {}

ngAfterViewInit() {
  const sub = this.authService.currentUser$.subscribe(user => {
    if (!user) {
      this.router.navigate(['/login']);
      sub.unsubscribe();
      return;
    }

    setTimeout(() => {
      this.loadMap();
      this.getUserInfo();
    }, 0);

    sub.unsubscribe();
  });
}

  getUserInfo() {
    this.http.get('http://127.0.0.1:8000/user-info').subscribe({
      next: res => console.log('🟢 Usuario:', res),
      error: err => console.error('❌ Error usuario:', err)
    });
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  /** proceso de resultados */
  requestRisk(lat: number, lng: number) {

    const payload = { lat, lng };
    console.log("📡 Consultando riesgo para:", payload);

    this.http.post('http://127.0.0.1:8000/risk-check', payload).subscribe({
      next: (res: any) => {
        console.log("⚠ Datos recibidos:", res);

        // guardar resultado
        this.riskResult = {
          ...res,
          extra: {
            feels_like: res.weather.main.feels_like,
            humidity: res.weather.main.humidity,
            pressure: res.weather.main.pressure,
            clouds: res.weather.clouds?.all ?? 0,
            wind: res.weather.wind?.speed ?? 0,
            sunrise: res.weather.sys?.sunrise,
            sunset: res.weather.sys?.sunset
          }
        };

        // Targetas de color segun riesgo
        if (this.marker && res.predicted_risk) {
          let color = "green";
          if (res.predicted_risk === "Medio") color = "yellow";
          if (res.predicted_risk === "Alto" || res.predicted_risk === "Crítico") color = "red";

          this.marker.setIcon(`http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`);
        }
      },
      error: (err) => console.error("❌ Error al obtener riesgo:", err)
    });
  }

  /** ubicaciones */
  getRisk() {
    if (this.selectedLocation) {
      this.requestRisk(this.selectedLocation.lat, this.selectedLocation.lng);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        console.log("📍 GPS detectado:", coords);

        this.requestRisk(coords.lat, coords.lng);

        if (this.marker) this.marker.setPosition(coords);
        this.map.setCenter(coords);
      },
      (err) => {
        console.error("❌ GPS bloqueado:", err);
        alert("⚠ Necesitamos tu ubicación para analizar el riesgo.");
      }
    );
  }

  /** inicio mapa Google maps */
  async loadMap() {
    if (!document.querySelector('#google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAfkDtw12JqtZFbN74hgMjUGg4ADKEiTK0`;
      document.body.appendChild(script);
      script.onload = () => this.initMap();
    } else {
      this.initMap();
    }
  }

  initMap() {
    // @ts-ignore
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.4489, lng: -70.6693 },
      zoom: 13,
    });

    // @ts-ignore
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(this.map);

    // @ts-ignore
    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: false
    });

    // Seleccionar ubicacion
    this.map.addListener("click", (event: any) => {
      this.selectedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };

      this.marker.setPosition(this.selectedLocation);
    });
  }
}
