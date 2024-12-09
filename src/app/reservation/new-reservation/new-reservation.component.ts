import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-new-reservation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.css'],
})
export class NewReservationComponent {
  @Input() tableId!: string; // ID-ul mesei selectate pentru rezervare
  @Output() close = new EventEmitter<void>(); // Eveniment pentru închiderea formularului
  @Output() reservationAdded = new EventEmitter<void>(); // Eveniment pentru rezervare adăugată

  // Variabile pentru formular
  name = '';
  noPersons = 1;
  date = '';
  startTime = '';
  endTime = '';

  private reservationService = inject(ReservationService); // Injectăm serviciul de rezervări
  errorMessage = ''; // Variabilă pentru mesajele de eroare

  onCancel() {
    this.close.emit(); // Emetem evenimentul pentru a închide formularul
  }

  onSubmit() {
    this.errorMessage = ''; // Resetăm mesajele de eroare

    // Validăm intrările
    if (!this.validateInputs()) {
      return;
    }

    try {
      // Adăugăm rezervarea prin serviciu
      this.reservationService.addReservation({
        tableId: this.tableId,
        name: this.name.trim(),
        noPersons: this.noPersons,
        date: this.date,
        startTime: this.startTime,
        endTime: this.endTime,
      });

      // Emit evenimente și închidem formularul
      this.reservationAdded.emit();
      this.close.emit();
    } catch (error: any) {
      this.errorMessage = error.message || 'An unexpected error occurred.';
    }
  }

  validateInputs(): boolean {
    if (!this.name.trim() || !this.date || !this.startTime || !this.endTime || this.noPersons < 1) {
      this.errorMessage = 'Please fill in all fields before submitting.';
      return false;
    }

    const today = new Date();
    const selectedDate = new Date(this.date);

    if (selectedDate.getTime() < today.setHours(0, 0, 0, 0)) {
      this.errorMessage = 'You cannot select a past date.';
      return false;
    }

    if (this.date === this.formatDate(today) && this.startTime < this.formatTime(today)) {
      this.errorMessage = 'Start time cannot be in the past.';
      return false;
    }

    if (this.startTime >= this.endTime) {
      this.errorMessage = 'Start time must be before end time.';
      return false;
    }

    return true;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Formatăm data ca yyyy-MM-dd
  }

  formatTime(date: Date): string {
    return date.toTimeString().split(' ')[0].substring(0, 5); // Formatăm timpul ca HH:mm
  }
}
