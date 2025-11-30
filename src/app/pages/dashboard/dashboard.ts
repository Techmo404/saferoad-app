import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements AfterViewInit {

  ngAfterViewInit() {
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
    // @ts-ignore (porque Google no expone tipos nativos aquí)
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.4489, lng: -70.6693 }, // Chile 🇨🇱
      zoom: 12,
    });

    // Marcador inicial
    // @ts-ignore
    new google.maps.Marker({
      position: { lat: -33.4489, lng: -70.6693 },
      map,
      title: "Santiago",
    });
  }
}
