import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Nueva importación
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonToast,
  IonInput,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { map, save } from 'ionicons/icons';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule, // <-- Agregado aquí
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonToast,
    IonInput,
    IonItem,
    IonLabel
  ],
})
export class HomePage {
  latitude: number | null = null;
  longitude: number | null = null;
  locationName: string = '';
  showToast = false;
  toastMessage = '';
  private firestore: Firestore = inject(Firestore);

  constructor() {
    addIcons({ map, save });
    this.getCurrentLocation();
  }
  openGoogleMaps() {
    if (this.latitude && this.longitude) {
      const url = `https://www.google.com/maps?q=${this.latitude},${this.longitude}`;
      window.open(url, '_blank');
    }
  }

  async saveLocationToFirebase() {
    if (!this.latitude || !this.longitude) {
      this.toastMessage = 'No location data available';
      this.showToast = true;
      return;
    }

    if (!this.locationName.trim()) {
      this.toastMessage = 'Please enter a name for the location';
      this.showToast = true;
      return;
    }

    const url = `https://www.google.com/maps?q=${this.latitude},${this.longitude}`;
    const locationsCollection = collection(this.firestore, 'savedLocations');

    try {
      await addDoc(locationsCollection, {
        name: this.locationName,
        url,
        latitude: this.latitude,
        longitude: this.longitude,
        timestamp: new Date()
      });
      this.toastMessage = 'Location saved successfully!';
      this.showToast = true;
      this.locationName = ''; // Clear the input after saving
    } catch (error) {
      console.error('Error saving location:', error);
      this.toastMessage = 'Error saving location';
      this.showToast = true;
    }
  }

  getCurrentLocation() {
    if (!navigator.geolocation) {
      console.error('Geolocalización no está soportada en este navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log('Ubicación obtenida: ', this.latitude, this.longitude);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }
}