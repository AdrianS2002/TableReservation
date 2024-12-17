import { Injectable } from '@angular/core';
import { Table } from '../table/table.model';
/**
 * Interface representing a reservation.
 */
export interface Reservation {
  id: string;
  tableId: string;
  name: string;
  noPersons: number;
  date: string;      // Format: YYYY-MM-DD
  startTime: string; // Format: HH:mm
  endTime: string;   // Format: HH:mm
}

/**
 * Service to manage table reservations.
 * Handles storage and retrieval of reservations using localStorage.
 *
 * @class ReservationService
 * @providedIn root
 */
@Injectable({ providedIn: 'root' })
export class ReservationService {
  /**
   * Key used for storing reservations in localStorage.
   */
  private readonly STORAGE_KEY = 'reservations';

  /**
   * Stores the list of reservations.
   * Initialized from localStorage if available.
   *
   * @private
   * @type {Reservation[]}
   */
  private reservations: Reservation[] = [];

  constructor() {
    this.loadReservations();
  }

  /**
   * Loads reservations from localStorage.
   * If no reservations are found, initializes with an empty array.
   */
  private loadReservations(): void {
    const storedReservations = localStorage.getItem(this.STORAGE_KEY);
    if (storedReservations) {
      try {
        this.reservations = JSON.parse(storedReservations);
        console.log('Reservations loaded from localStorage:', this.reservations);
      } catch (error) {
        console.error('Error parsing reservations from localStorage:', error);
        this.reservations = [];
      }
    } else {
      this.reservations = [];
    }
  }

  /**
   * Saves the current reservations to localStorage.
   */
  private saveReservations(): void {
    try {
      const reservationsString = JSON.stringify(this.reservations);
      localStorage.setItem(this.STORAGE_KEY, reservationsString);
      console.log('Reservations saved to localStorage:', this.reservations);
    } catch (error) {
      console.error('Error saving reservations to localStorage:', error);
    }
  }

  /**
   * Retrieves all reservations.
   *
   * @returns {Reservation[]} The list of all reservations.
   */
  getReservations(): Reservation[] {
    return this.reservations;
  }

  /**
   * Adds a new reservation and updates localStorage.
   * Automatically generates a unique ID for the reservation.
   *
   * @param {Omit<Reservation, 'id'>} reservation The reservation details without the ID.
   * @returns {Reservation} The newly added reservation with an ID.
   */
  addReservation(reservation: Omit<Reservation, 'id'>): Reservation {
    const newReservation: Reservation = {
      ...reservation,
      id: `r${new Date().getTime()}`, // Unique ID based on timestamp
    };
    this.reservations.push(newReservation);
    this.saveReservations(); // Persist changes to localStorage
    console.log('Added new reservation:', newReservation);
    return newReservation;
  }

  /**
   * Removes a reservation by its ID and updates localStorage.
   *
   * @param {string} reservationId - The ID of the reservation to remove.
   * @returns {boolean} True if removal was successful, false otherwise.
   */
  removeReservation(reservationId: string): boolean {
    const initialLength = this.reservations.length;
    this.reservations = this.reservations.filter(r => r.id !== reservationId);
    const wasRemoved = this.reservations.length < initialLength;
    if (wasRemoved) {
      this.saveReservations();
      console.log(`Removed reservation with ID: ${reservationId}`);
    } else {
      console.warn(`No reservation found with ID: ${reservationId}`);
    }
    return wasRemoved;
  }

  /**
   * Retrieves reservations for a specific table.
   *
   * @param {string} tableId - The ID of the table.
   * @returns {Reservation[]} Reservations associated with the specified table.
   */
  getReservationsByTable(tableId: string): Reservation[] {
    return this.reservations.filter(r => r.tableId === tableId);
  }

  /**
   * Clears all reservations from localStorage.
   * Use with caution.
   */
  clearAllReservations(): void {
    this.reservations = [];
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('All reservations have been cleared from localStorage.');
  }
   /**
   * Retrieves available tables based on the desired date and time.
   *
   * @param {string} desiredDate - The desired reservation date (YYYY-MM-DD).
   * @param {string} desiredStartTime - The desired start time (HH:mm).
   * @param {string} desiredEndTime - The desired end time (HH:mm).
   * @param {Table[]} allTables - The list of all tables.
   * @returns {Table[]} The list of available tables.
   */
   getAvailableTables(
    desiredDate: string,
    desiredStartTime: string,
    desiredEndTime: string,
    allTables: Table[]
  ): Table[] {
    // Filter tables that have no overlapping reservations
    return allTables.filter(table => {
      const tableReservations = this.getReservationsByTable(table.id);
      // Check for time overlaps
      const hasOverlap = tableReservations.some(reservation => {
        if (reservation.date !== desiredDate) {
          return false;
        }
        return (
          (desiredStartTime >= reservation.startTime && desiredStartTime < reservation.endTime) ||
          (desiredEndTime > reservation.startTime && desiredEndTime <= reservation.endTime) ||
          (desiredStartTime <= reservation.startTime && desiredEndTime >= reservation.endTime)
        );
      });
      return !hasOverlap;
    });
  }
}
