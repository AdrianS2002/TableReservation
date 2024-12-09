import { Component, EventEmitter, Input, Output } from '@angular/core';
/**
 * Component for selecting a date and time using a slider.
 * Emits events to notify the parent component of changes in the selected date or time.
 *
 * @class TimeSliderComponent
 */
@Component({
  selector: 'app-time-slider',
  standalone: true,
  imports: [],
  templateUrl: './time-slider.component.html',
  styleUrl: './time-slider.component.css'
})
export class TimeSliderComponent {
    /**
   * The currently selected date in `YYYY-MM-DD` format.
   * Defaults to today's date if not provided.
   *
   * @type {string}
   */
  @Input() selectedDate: string = this.formatDate(new Date());
  /**
   * Event emitted when the selected date changes.
   *
   * @event dateChange
   * @type {EventEmitter<string>}
   */
  @Output() dateChange = new EventEmitter<string>();
  /**
   * Event emitted when the selected time changes.
   * Includes the formatted time (`HH:mm`) and the selected date (`YYYY-MM-DD`).
   *
   * @event timeChange
   * @type {EventEmitter<{ time: string; date: string }>}
   */
  @Output() timeChange = new EventEmitter<{ time: string; date: string }>();
  /**
   * The current value of the time slider in minutes since midnight.
   *
   * @type {number}
   */

  sliderValue = 0; // Slider value in minutes
  /**
   * The formatted time (`HH:mm`) based on the current slider value.
   *
   * @type {string}
   */
  sliderTime = '00:00'; // Formatted time
/**
   * Handles changes to the selected date.
   * Updates the `selectedDate` property and emits the `dateChange` event.
   *
   * @param {Event} event - The input event triggered by the date picker.
   */
  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.dateChange.emit(this.selectedDate);
  }
/**
   * Handles changes to the time slider value.
   * Updates the `sliderTime` property and emits the `timeChange` event.
   *
   * @param {Event} event - The input event triggered by the time slider.
   */
  onTimeChange(event: Event) {
    const slider = event.target as HTMLInputElement;
    this.sliderValue = +slider.value;
    this.sliderTime = this.formatSliderTime(this.sliderValue);
    this.timeChange.emit({
      time: this.sliderTime,
      date: this.selectedDate
    });
  }
/**
   * Formats a given `Date` object into `YYYY-MM-DD` format.
   *
   * @param {Date} date - The date to format.
   * @returns {string} The formatted date string.
   */
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format date as yyyy-MM-dd
  }
/**
   * Converts a number of minutes since midnight into `HH:mm` format.
   *
   * @param {number} minutes - The number of minutes since midnight.
   * @returns {string} The formatted time string.
   */
  formatSliderTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
  }
}
