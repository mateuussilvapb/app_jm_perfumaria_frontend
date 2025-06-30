//Angular
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//Externos
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

//Internos
import { UTILS_COMPONENTS } from './utils/utils-components';

@Component({
  selector: 'app-root',
  imports: [
    //Angular
    RouterOutlet,

    //Externos
    DatePickerModule,
    ConfirmDialogModule,

    //Internos
    UTILS_COMPONENTS,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
