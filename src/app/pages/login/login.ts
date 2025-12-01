import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';   // ⬅ IMPORTANTE

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],  // ⬅ AGREGA RouterModule AQUÍ
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.error = '';

    try {
      console.log('🔐 Intentando iniciar sesión...');
      await this.authService.login(this.email, this.password);
      console.log('✅ Login correcto, redirigiendo...');
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      console.error("❌ Firebase error:", err.message ?? err);
      this.error = err.message ?? 'Correo o contraseña incorrectos';
    }
  }
}
