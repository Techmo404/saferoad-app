import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;  

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.error = '';
    this.loading = true;

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/dashboard']);

    } catch (err: any) {
      console.error(err);

      switch (err.code) {
        case "auth/invalid-email":
          this.error = "El correo no es válido.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          this.error = "Correo o contraseña incorrectos.";
          break;
        case "auth/too-many-requests":
          this.error = "Demasiados intentos. Intenta más tarde.";
          break;
        default:
          this.error = "Error al iniciar sesión.";
      }

    } finally {
      this.loading = false;
    }
  }
}
