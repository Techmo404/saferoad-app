import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = '';
  email = '';
  password = '';
  loading = false;
  success = '';
  error = '';

  constructor(
    private auth: Auth,
    private http: HttpClient,
    private router: Router
  ) {}

  async register() {
    this.error = '';
    this.success = '';
    this.loading = true;

    if (!this.name || !this.email || !this.password) {
      this.error = 'Por favor completa todos los campos.';
      this.loading = false;
      return;
    }

    try {
      // 🔥 1. Crear cuenta en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );

      const uid = userCredential.user.uid;

      // 📩 2. Guardar en tu backend
      await this.http.post('http://127.0.0.1:8000/register', {
        uid,
        name: this.name,
        email: this.email,
        password: this.password
      }).toPromise();

      this.success = 'Cuenta creada correctamente 🎉';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);

    } catch (err: any) {
      this.error = err?.message || 'Error al registrar usuario.';
    }

    this.loading = false;
  }
}
