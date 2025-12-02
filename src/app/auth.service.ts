// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = getAuth();

  // 🔥 undefined = cargando | null = no logged | User = logged
  private currentUserSubject = new BehaviorSubject<User | null | undefined>(undefined);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    setPersistence(this.auth, browserLocalPersistence).then(() => {

      console.log("⏳ Esperando Firebase Auth...");

      onAuthStateChanged(this.auth, (user) => {
        console.log("📌 Firebase respondió:", user);
        this.currentUserSubject.next(user); 
      });

    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) return null;
    return user.getIdToken(true);
  }

  get currentUser(): User | null | undefined {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
