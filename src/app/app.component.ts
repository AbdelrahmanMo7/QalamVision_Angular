import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/navBar/navBar.component';
import { ProcessingPageComponent } from './components/processingPage/processingPage.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: 
  [
    RouterOutlet,
    NavBarComponent,
    ProcessingPageComponent

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'task1';
}
