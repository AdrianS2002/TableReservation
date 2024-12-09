import { Component } from '@angular/core';
/**
 * The HeaderComponent displays a styled header for the table reservation application.
 * It includes a logo image and a title.
 *
 * @class HeaderComponent
 * @selector app-header
 * @templateUrl ./header.component.html
 * @styleUrls ./header.component.css
 */
@Component({
  selector: 'app-header', // The tag used in the HTML template to include this component
  standalone: true, // Indicates this component is a standalone component
  imports: [], // No additional Angular modules are imported
  templateUrl: './header.component.html', // HTML template for the header
  styleUrls: ['./header.component.css'], // Associated CSS file for styling
})
export class HeaderComponent {

}
