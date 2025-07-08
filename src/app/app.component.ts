//Angular
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//Externos
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

//Internos
import { UTILS_COMPONENTS } from './utils/utils-components';
import { setupFixedTheme } from './config/primeNG/simple-theme';
import { LayoutService } from './core/services/layout.service';

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
export class AppComponent implements OnInit {
  constructor(public readonly layoutService: LayoutService) {}

  ngOnInit(): void {
    setupFixedTheme();
    this.layoutService.onToggleTheme();
  }
}
