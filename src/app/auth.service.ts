import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = getAuth();

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  onAuthState(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }
}
