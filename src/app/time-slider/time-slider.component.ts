import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-time-slider',
  standalone: true,
  imports: [],
  templateUrl: './time-slider.component.html',
  styleUrl: './time-slider.component.css'
})
export class TimeSliderComponent {
  @Input() selectedDate: string = this.formatDate(new Date());
  @Output() dateChange = new EventEmitter<string>();
  @Output() timeChange = new EventEmitter<{ time: string; date: string }>();

  sliderValue = 0; // Slider value in minutes
  sliderTime = '00:00'; // Formatted time

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.dateChange.emit(this.selectedDate);
  }

  onTimeChange(event: Event) {
    const slider = event.target as HTMLInputElement;
    this.sliderValue = +slider.value;
    this.sliderTime = this.formatSliderTime(this.sliderValue);
    this.timeChange.emit({
      time: this.sliderTime,
      date: this.selectedDate
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format date as yyyy-MM-dd
  }

  formatSliderTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
  }
}
