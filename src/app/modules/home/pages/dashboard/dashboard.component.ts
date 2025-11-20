//Angular
import { Component } from '@angular/core';

//Internos
import { IndicadoresComponent } from '@home/components/indicadores/indicadores.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    //Internos
    IndicadoresComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
