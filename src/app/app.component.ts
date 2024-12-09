import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { TimeSliderComponent } from "./time-slider/time-slider.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ReservationComponent, TimeSliderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TableReservation';
  sliderDate: string = this.formatDate(new Date()); // Initialize sliderDate as a string
  sliderTime = '00:00'; // Ora curentă
  // Utility method to format a date as yyyy-MM-dd
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Method to handle changes from the time slider
  onSliderChange(time: string, date: string) {
    console.log(`Time changed to: ${time}, Date changed to: ${date}`);
    this.sliderDate = date; // Update the sliderDate value
    this.sliderTime = time;
  }
}
