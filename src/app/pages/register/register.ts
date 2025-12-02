import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from '@angular/fire/auth';

import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  name: string = '';
  email: string = '';
  password: string = '';
  loading: boolean = false;
  success: string = '';
  error: string = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  async register() {

    this.error = '';
    this.success = '';

    // 🔍 Validaciones
    if (!this.name || !this.email || !this.password) {
      this.error = "Por favor completa todos los campos.";
      return;
    }

    if (this.password.length < 6) {
      this.error = "La contraseña debe tener al menos 6 caracteres.";
      return;
    }

    this.loading = true;

    try {

      console.log("▶ Creando usuario Firebase...");
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email.trim(),
        this.password
      );

      const user = userCredential.user;
      const uid = user.uid;

      console.log("✔ Usuario creado:", uid);

      // 🌟 Enviar email de verificación
      await sendEmailVerification(user);

      // 💾 Guardar datos del usuario en Firestore
      await setDoc(doc(this.firestore, 'users', uid), {
        uid,
        name: this.name,
        email: this.email,
        verified: false,
        createdAt: new Date(),
      });

      this.success = "Cuenta creada 🎉 Revisa tu correo para verificar tu cuenta.";

      // 🔁 Redirigir luego de 2.5 seg
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);

    } catch (err: any) {
      console.error("❌ ERROR:", err);

      switch (err.code) {
        case "auth/email-already-in-use":
          this.error = "Este correo ya está registrado.";
          break;

        case "auth/invalid-email":
          this.error = "Correo electrónico inválido.";
          break;

        case "auth/weak-password":
          this.error = "La contraseña es demasiado débil.";
          break;

        default:
          this.error = "Error al registrar usuario.";
          break;
      }

    } finally {
      this.loading = false;
    }
  }
}
