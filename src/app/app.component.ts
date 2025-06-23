//Angular
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//Externos
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';

//Internos

@Component({
  selector: 'app-root',
  imports: [
    //Angular
    RouterOutlet,

    //Externos
    CardModule,
    DatePickerModule,
    ButtonModule,

    //Internos
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app_jm_perfumaria');
  }
}
