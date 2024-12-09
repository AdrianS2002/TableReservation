import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private reservations: Array<{
    id: string;
    tableId: string;
    name: string;
    noPersons: number;
    date: string;
    startTime: string;
    endTime: string;
  }> = []; // Lista de rezervări este goală

  getReservations() {
    return this.reservations;
  }
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
      id: `r${new Date().getTime()}`,
    });
  }
  
}