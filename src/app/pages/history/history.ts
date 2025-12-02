import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History implements OnInit {

  history: any[] = [];
  loading = true;
  chart: any;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadHistory();
    setTimeout(() => this.buildChart(), 1200);
  }

  loadHistory() {
    this.http.get('http://127.0.0.1:8000/history').subscribe({
      next: (data: any) => {

        const list = data.records || data.history || [];

        // 👇 Protege datos antiguos
        this.history = [...list].reverse().map(item => ({
          ...item,
          alerts: item.alerts ?? [],
          traffic: item.traffic ?? { level: 0, status: "desconocido" }
        }));

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("❌ Error cargando historial", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  buildChart() {
    const canvas: any = document.getElementById('riskChart');

    if (!canvas) return;

    const labels = this.history.map(r => r.datetime);
    const values = this.history.map(r => r.traffic?.level || 0);

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Historial de Nivel de Tráfico',
          data: values,
          borderWidth: 3
        }]
      }
    });
  }

  trackById(index: number, item: any) {
    return item.id || index;
  }

}
