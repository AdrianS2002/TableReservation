// src/app/reservation/new-reservation-on-button/new-reservation-on-button.component.ts

import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService} from '../reservation.service';
import {  Reservation } from '../reservation.model';
import { Table } from '../../table/table.model';
import { CommonModule } from '@angular/common';

/**
 * Component for creating a new reservation via the "Reserve a Table" button.
 * Provides a form with a dropdown of available tables based on selected date and time.
 *
 * @class NewReservationOnButtonComponent
 */
@Component({
  selector: 'app-new-reservation-on-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-reservation-on-button.component.html',
  styleUrls: ['./new-reservation-on-button.component.css'],
})
export class NewReservationOnButtonComponent implements OnInit {
  /**
   * Event emitted when the reservation form is closed without submitting.
   *
   * @event close
   */
  @Output() close = new EventEmitter<void>();

  /**
   * Event emitted after a reservation has been successfully added.
   *
   * @event reservationAdded
   */
  @Output() reservationAdded = new EventEmitter<void>();

  /**
   * The name of the person making the reservation.
   * @type {string}
   */
  name: string = '';

  /**
   * The number of persons for the reservation.
   * @type {number}
   */
  noPersons: number = 1;

  /**
   * The selected date for the reservation in `YYYY-MM-DD` format.
   * @type {string}
   */
  date: string = '';

  /**
   * The start time of the reservation in `HH:mm` format.
   * @type {string}
   */
  startTime: string = '';

  /**
   * The end time of the reservation in `HH:mm` format.
   * @type {string}
   */
  endTime: string = '';

  /**
   * The list of all tables.
   * @type {Table[]}
   */
  allTables: Table[] = [];

  /**
   * The list of available tables based on the selected date and time.
   * @type {Table[]}
   */
  availableTables: Table[] = [];

  /**
   * The ID of the selected table from the dropdown.
   * @type {string | null}
   */
  selectedTableId: string | null = null;

  /**
   * Handles interaction with the reservation backend service.
   * @private
   * @type {ReservationService}
   */
  private reservationService = inject(ReservationService);

  /**
   * Stores error messages for validation or service failures.
   * @type {string}
   */
  errorMessage: string = '';

  /**
   * Lifecycle hook called after data-bound properties are initialized.
   */
  ngOnInit() {
    this.initializeAllTables();
  }

  /**
   * Initializes the list of all tables.
   * In a real application, this might come from a service or API.
   */
  initializeAllTables() {
    // Assuming there are 16 tables as per ReservationComponent
    this.allTables = Array.from({ length: 16 }, (_, index) => ({
      id: `t${index + 1}`,
      reserved: false,
      reservations: [],
    }));
  }

  /**
   * Handles the cancellation of the form by emitting the `close` event.
   */
  onCancel() {
    this.close.emit();
  }

  /**
   * Submits the reservation form.
   * Validates input, interacts with the service, and emits the
   * `reservationAdded` event if successful.
   */
  onSubmit() {
    this.errorMessage = ''; // Reset error messages

    // Validate inputs
    if (!this.validateInputs()) {
      return;
    }

    // Ensure a table is selected
    if (!this.selectedTableId) {
      this.errorMessage = 'Please select a table.';
      return;
    }

    try {
      // Add the reservation via the service
      this.reservationService.addReservation({
        tableId: this.selectedTableId,
        name: this.name.trim(),
        noPersons: this.noPersons,
        date: this.date,
        startTime: this.startTime,
        endTime: this.endTime,
      });

      // Emit events and close the form
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

    if (selectedDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
      this.errorMessage = 'You cannot select a past date.';
      return false;
    }

    if (this.date === this.formatDate(new Date()) && this.startTime < this.formatTime(new Date())) {
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
    return date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
  }

  /**
   * Formats a Date object into an `HH:mm` string.
   *
   * @param {Date} date - The date to format.
   * @returns {string} The formatted time string.
   */
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // Format as HH:mm
  }

  /**
   * Fetches available tables based on the selected date and time.
   */
  fetchAvailableTables() {
    if (this.date && this.startTime && this.endTime) {
      this.availableTables = this.reservationService.getAvailableTables(
        this.date,
        this.startTime,
        this.endTime,
        this.allTables
      );
    } else {
      this.availableTables = this.allTables;
    }
  }

  /**
   * Watches for changes in date, startTime, and endTime to update available tables.
   */
  onDateTimeChange() {
    this.fetchAvailableTables();
  }
}
