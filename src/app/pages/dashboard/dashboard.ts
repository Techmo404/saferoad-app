import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements AfterViewInit {

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {

    // 🔥 Test conexión al backend
    this.http.get('http://127.0.0.1:8000/user-info').subscribe({
      next: (res) => console.log('🟢 Backend respondió:', res),
      error: (err) => console.error('❌ Error desde backend:', err)
    });

    // 📝 Guardar en Firestore
    this.http.post('http://127.0.0.1:8000/save-data', {
      timestamp: new Date().toISOString(),
      action: "user_logged_in"
    }).subscribe({
      next: (res) => console.log('📌 Guardado en Firestore:', res),
      error: (err) => console.error('❌ Error guardando:', err)
    });

    this.loadMap();
  }

  async loadMap() {
    try {
      if (!document.querySelector('#google-maps-script')) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAfkDtw12JqtZFbN74hgMjUGg4ADKEiTK0`;
        document.body.appendChild(script);

        script.onload = () => {
          this.initMap();
        };
      } else {
        this.initMap();
      }
    } catch (error) {
      console.error("Error cargando Google Maps:", error);
    }
  }

  initMap() {
    // @ts-ignore
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.4489, lng: -70.6693 },
      zoom: 12,
    });

    // @ts-ignore
    new google.maps.Marker({
      position: { lat: -33.4489, lng: -70.6693 },
      map,
      title: "Santiago",
    });
  }
}
