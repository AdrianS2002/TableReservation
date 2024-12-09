import { Injectable } from '@angular/core';
/**
 * Service to manage table reservations.
 * Handles storage and retrieval of reservations for the application.
 *
 * @class ReservationService
 * @providedIn root
 */
@Injectable({ providedIn: 'root' })
export class ReservationService {
  /**
   * Stores the list of reservations.
   * Each reservation includes table ID, reservation details, and timings.
   *
   * @private
   * @type {Array<{
  *   id: string;
  *   tableId: string;
  *   name: string;
  *   noPersons: number;
  *   date: string;
  *   startTime: string;
  *   endTime: string;
  * }>}
  */
  private reservations: Array<{
    id: string;
    tableId: string;
    name: string;
    noPersons: number;
    date: string;
    startTime: string;
    endTime: string;
  }> = []; // Lista de rezervări este goală

  /**
   * Returns the list of all reservations.
   *
   * @returns {Array<{
  *   id: string;
  *   tableId: string;
  *   name: string;
  *   noPersons: number;
  *   date: string;
  *   startTime: string;
  *   endTime: string;
  * }>} The list of reservations.
  */
  getReservations() {
    return this.reservations;
  }

  /**
   * Adds a new reservation to the list.
   * Automatically generates a unique ID for the reservation.
   *
   * @param {Object} reservation The reservation details.
   * @param {string} reservation.tableId - The ID of the reserved table.
   * @param {string} reservation.name - The name of the person making the reservation.
   * @param {number} reservation.noPersons - The number of persons for the reservation.
   * @param {string} reservation.date - The date of the reservation (YYYY-MM-DD).
   * @param {string} reservation.startTime - The start time of the reservation (HH:mm).
   * @param {string} reservation.endTime - The end time of the reservation (HH:mm).
   */
  addReservation(reservation: {
    tableId: string;
    name: string;
    noPersons: number;
    date: string;
    startTime: string;
    endTime: string;
  }) {
    this.reservations.push({
      ...reservation,
      id: `r${new Date().getTime()}`, // Unique ID generated based on timestamp
    });
  }
  
}