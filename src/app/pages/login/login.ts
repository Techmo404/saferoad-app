import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  error = '';

  private auth = getAuth();  // ⬅ Ya no se injecta, se obtiene directo

  constructor(private router: Router) {}

  async login() {
    try {
      this.error = '';
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('✅ Usuario autenticado');

      this.router.navigate(['/dashboard']);
    } catch {
      this.error = 'Correo o contraseña incorrectos';
    }
  }
}

