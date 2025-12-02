import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async savePrediction(prediction: any) {
    const user = this.auth.currentUser;

    if (!user) {
      console.warn("⚠ No hay usuario autenticado para guardar datos.");
      return;
    }

    const ref = collection(this.firestore, "predictions");

    await addDoc(ref, {
      uid: user.uid,
      prediction,
      timestamp: new Date().toISOString()
    });

    console.log("📌 Predicción guardada en Firestore");
  }
}
