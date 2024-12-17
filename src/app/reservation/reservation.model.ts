// src/app/models/reservation.model.ts

/**
 * Represents a reservation in the reservation system.
 *
 * @interface Reservation
 */
export interface Reservation {
    /**
     * Unique identifier for the reservation.
     * Typically generated based on timestamp or UUID.
     *
     * @type {string}
     */
    id: string;
  
    /**
     * The ID of the table associated with this reservation.
     *
     * @type {string}
     */
    tableId: string;
  
    /**
     * Name of the person making the reservation.
     *
     * @type {string}
     */
    name: string;
  
    /**
     * The number of persons for the reservation.
     *
     * @type {number}
     */
    noPersons: number;
  
    /**
     * The date of the reservation in `YYYY-MM-DD` format (e.g., "2024-12-10").
     *
     * @type {string}
     */
    date: string;
  
    /**
     * The start time of the reservation in `HH:mm` format (e.g., "14:00").
     *
     * @type {string}
     */
    startTime: string;
  
    /**
     * The end time of the reservation in `HH:mm` format (e.g., "16:00").
     *
     * @type {string}
     */
    endTime: string;
  }
  