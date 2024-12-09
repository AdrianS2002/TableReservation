import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../reservation.service';
/**
 * Component for creating a new reservation for a selected table.
 * Provides a form for user input, validates the data, and interacts
 * with the ReservationService to save the reservation.
 *
 * @class NewReservationComponent
 */
@Component({
  selector: 'app-new-reservation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.css'],
})
export class NewReservationComponent {
    /**
   * The ID of the table for which the reservation is being made.
   * Passed from the parent component.
   *
   * @type {string}
   */
  @Input() tableId!: string; // ID-ul mesei selectate pentru rezervare
   /**
   * Event emitted when the reservation form is closed without submitting.
   *
   * @event close
   */
  @Output() close = new EventEmitter<void>(); // Eveniment pentru închiderea formularului
   /**
   * Event emitted after a reservation has been successfully added.
   *
   * @event reservationAdded
   */
  @Output() reservationAdded = new EventEmitter<void>(); // Eveniment pentru rezervare adăugată

  /**
   * The name of the person making the reservation.
   * @type {string}
   */
  name = '';
   /**
   * The number of persons for the reservation.
   * @type {number}
   */
  noPersons = 1;
  /**
   * The selected date for the reservation in `YYYY-MM-DD` format.
   * @type {string}
   */
  date = '';
  /**
   * The start time of the reservation in `HH:mm` format.
   * @type {string}
   */
  startTime = '';
  /**
   * The end time of the reservation in `HH:mm` format.
   * @type {string}
   */
  endTime = '';
 /**
   * Handles interaction with the reservation backend service.
   * @private
   * @type {ReservationService}
   */
  private reservationService = inject(ReservationService); // Injectăm serviciul de rezervări
    /**
   * Stores error messages for validation or service failures.
   * @type {string}
   */
  errorMessage = ''; // Variabilă pentru mesajele de eroare
/**
   * Handles the cancellation of the form by emitting the `close` event.
   */
  onCancel() {
    this.close.emit(); // Emetem evenimentul pentru a închide formularul
  }
/**
   * Submits the reservation form.
   * Validates input, interacts with the service, and emits the
   * `reservationAdded` event if successful.
   */
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
/**
   * Validates the input fields of the form.
   * Ensures all fields are filled, times are in valid order, and no past dates are allowed.
   *
   * @returns {boolean} True if the input is valid, false otherwise.
   */
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
/**
   * Formats a Date object into a `YYYY-MM-DD` string.
   *
   * @param {Date} date - The date to format.
   * @returns {string} The formatted date string.
   */
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Formatăm data ca yyyy-MM-dd
  }
  /**
   * Formats a Date object into an `HH:mm` string.
   *
   * @param {Date} date - The date to format.
   * @returns {string} The formatted time string.
   */
  formatTime(date: Date): string {
    return date.toTimeString().split(' ')[0].substring(0, 5); // Formatăm timpul ca HH:mm
  }
}
