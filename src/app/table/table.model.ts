/**
 * Represents a table in the reservation system.
 * Stores information about the table's ID, reservation status, and associated reservations.
 *
 * @interface Table
 */
export interface Table {
  /**
   * Unique identifier for the table.
   * Typically a string like "t1", "t2", etc.
   *
   * @type {string}
   */
    id: string; 
    /**
   * Indicates whether the table is currently reserved.
   * True if the table is reserved, false otherwise.
   *
   * @type {boolean}
   */
    reserved: boolean; 
    /**
   * List of reservations associated with the table.
   * Each reservation includes details like start time, end time, date, and the name of the person reserving.
   *
   * @type {Array<{ startTime: string; endTime: string; date: string; name?: string; }>}
   * @optional
   */
    reservations?: Array<{
      /**
     * The start time of the reservation (e.g., "14:00").
     *
     * @type {string}
     */
      startTime: string;
      /**
     * The end time of the reservation (e.g., "16:00").
     *
     * @type {string}
     */
      endTime: string;
      /**
     * The date of the reservation in `YYYY-MM-DD` format (e.g., "2024-12-10").
     *
     * @type {string}
     */
      date:string;
      /**
     * Name of the person who made the reservation.
     * This field is optional.
     *
     * @type {string}
     * @optional
     */
      name?: string;
    }>; 
    /**
   * Indicates whether the table's reservation overlaps with another reservation.
   * Typically used for visual or logical distinction.
   *
   * @type {boolean}
   * @optional
   */
    isOverlapping?: boolean;
  }
  