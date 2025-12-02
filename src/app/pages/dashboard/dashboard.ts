import { HttpClient } from '@angular/common/http'; 
import { Component, AfterViewInit } from '@angular/core';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
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
  history: any[] = [];
  loading = false;

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router,
    private riskService: RiskService,
    private authService: AuthService 
  ) {}

isCheckingSession = true; // <-- NUEVO

ngAfterViewInit() {

  console.log("⏳ Esperando sesión (AuthService)...");

  // 👇 Declaramos la variable antes del subscribe
  let sub: any;

  sub = this.authService.currentUser$.subscribe(user => {

    if (!user) {
      console.warn("🚫 No hay sesión, volviendo al login");

      if (sub) sub.unsubscribe();
      this.router.navigate(['/login']);
      return;
    }

    console.log("🔐 Sesión detectada en Dashboard:", user.email);

    // 👇 FIX: evita ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.loading = false;
      this.getUserInfo();
      this.loadHistory();
      this.loadMap();
    }, 0);

    if (sub) sub.unsubscribe();
  });
}










  getUserInfo() {
    this.http.get('http://127.0.0.1:8000/user-info').subscribe({
      next: res => console.log('🟢 Backend respondió:', res),
      error: err => console.error('❌ Error desde backend:', err)
    });
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  loadHistory() {
    this.loading = true;

    this.riskService.getHistory().subscribe({
      next: (res: any) => {
        this.history = res.records || [];
        console.log("📚 Historial cargado:", this.history);
        this.loading = false;
      },
      error: err => {
        console.error("❌ Error cargando historial:", err);
        this.loading = false;
      }
    });
  }

  requestRisk(lat: number, lng: number) {
    const payload = { lat, lng };
    console.log("📡 Consultando riesgo para:", payload);

    this.http.post('http://127.0.0.1:8000/risk-check', payload).subscribe({
      next: (res: any) => {
        console.log("⚠ Riesgo recibido:", res);
        this.riskResult = res;
        this.loadHistory();

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

  getRisk() {
    if (this.selectedLocation) {
      console.log("📌 Usando ubicación seleccionada:", this.selectedLocation);
      this.requestRisk(this.selectedLocation.lat, this.selectedLocation.lng);
      return;
    }

    if (!navigator.geolocation) {
      alert("Tu navegador no soporta GPS.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        console.log("📍 Usando GPS:", coords);

        this.requestRisk(coords.lat, coords.lng);

        if (this.marker) this.marker.setPosition(coords);
        this.map.setCenter(coords);
      },
      (err) => {
        console.error("❌ Error GPS:", err);
        alert("Permite acceso a ubicación para usar SafeRoad.");
      }
    );
  }

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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.marker.setPosition(userLoc);
        this.map.setCenter(userLoc);
      });
    }

    // 🔥 ya no llama a la IA automáticamente
    this.map.addListener("click", (event: any) => {
      this.selectedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };

      console.log("📍 Ubicación seleccionada:", this.selectedLocation);
      this.marker.setPosition(this.selectedLocation);
    });
  }

  // 🛠️ FIX NECESARIO
  trackById(index: number, item: any) {
    return item.id || index;
  }
}
