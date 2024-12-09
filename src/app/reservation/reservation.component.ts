import { Component, Input, signal, computed, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Table } from '../table/table.model';
import { ReservationService } from './reservation.service';
import { NewReservationComponent } from "./new-reservation/new-reservation.component";
/**
 * Component to display and manage table reservations.
 * It includes a grid of tables with their reservation status
 * and provides functionality to reserve or view details of tables.
 *
 * @class ReservationComponent
 */
@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, NewReservationComponent],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent {
  /**
    * The current date selected on the slider.
    * @type {string}
    */
  @Input() sliderDate!: string;
  /**
   * The current time selected on the slider.
   * @type {string}
   */
  @Input() sliderTime!: string;

  /**
   * Signal to store the list of tables with their reservation status.
   * @type {Signal<Table[]>}
   */
  tables = signal<Table[]>([]);
  /**
   * Computed property to organize tables into rows for display in a grid.
   * @returns {Table[][]}
   */
  tableRows = computed(() => {
    const tablesPerRow = 8;
    const rows: Table[][] = [];
    const currentTables = this.tables();
    for (let i = 0; i < currentTables.length; i += tablesPerRow) {
      rows.push(currentTables.slice(i, i + tablesPerRow));
    }
    return rows;
  });
  /**
   * Constructor to inject the ReservationService.
   * @param {ReservationService} reservationService
   */
  constructor(private reservationService: ReservationService) { }

  /**
   * Lifecycle hook to handle changes in input properties.
   * Updates table statuses when sliderDate or sliderTime changes.
   *
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['sliderDate'] || changes['sliderTime']) {
      this.updateTableStatuses();
    }
  }
  /**
   * Updates the reservation status of all tables based on the slider date and time.
   */
  updateTableStatuses() {
    const currentDate = this.sliderDate; // Data curentă de la slider
    const currentTime = this.sliderTime; // Timpul curent de la slider

    this.tables.update((tables) =>
      tables.map((table) => {
        let isReserved = false;

        if (table.reservations && table.reservations.length > 0) {
          for (const reservation of table.reservations) {
            const reservationDate = reservation.date; // Data rezervării
            const reservationStartTime = reservation.startTime; // Start time al rezervării
            const reservationEndTime = reservation.endTime; // End time al rezervării

            // Verificăm dacă rezervarea este activă
            if (
              reservationDate === currentDate && // Datele trebuie să fie egale
              currentTime >= reservationStartTime && // Timpul să fie după start
              currentTime < reservationEndTime // Timpul să fie înainte de end
            ) {
              isReserved = true; // Masa este rezervată
              break; // Oprire, nu mai continuăm verificarea altor rezervări
            }
          }
        }

        // Returnăm starea actualizată a mesei
        return { ...table, reserved: isReserved };
      })
    );

    // Debugging: Afișează stările actualizate ale meselor
    console.log('Updated Tables:', this.tables());
  }




  ngOnInit() {
    this.initializeTables();
    this.updateTableReservations();
  }

  /**
 * Initializes the tables with default values.
 */

  initializeTables() {
    const initialTables = Array.from({ length: 16 }, (_, index) => ({
      id: `t${index + 1}`,
      reserved: false,
      reservations: [],
    }));
    this.tables.set(initialTables); // Set initial state with signal
  }
  /**
     * Updates the table reservations based on the data from the ReservationService.
     */
  updateTableReservations() {
    const reservations = this.reservationService.getReservations();
    this.tables.update((tables) =>
      tables.map((table) => ({
        ...table,
        reserved: reservations.some((r) => r.tableId === table.id),
        reservations: reservations.filter((r) => r.tableId === table.id),
      }))
    );
  }
  selectedTableId = signal<string | null>(null);
  /**
   * Handles the selection of a table by the user.
   * @param {Table} table - The selected table.
   */
  onSelectTable(table: Table) {
    if (!table.reserved) {
      console.log(`Table ${table.id} is available.`);
      this.selectedTableId.set(table.id);
    } else {
      const tableReservations = table.reservations || [];
      console.log(`Reservations for Table ${table.id}:`, tableReservations);
      console.log(`Status ${table.reserved}`);
    }
  }
  /**
  * Closes the reservation form and refreshes the table reservations.
  */
  onCloseForm() {
    this.selectedTableId.set(null); // Close the form
    this.updateTableReservations(); // Refresh table reservations
  }


}
