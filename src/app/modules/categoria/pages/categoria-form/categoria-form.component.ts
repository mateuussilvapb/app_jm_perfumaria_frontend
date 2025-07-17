import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoria-form',
  imports: [],
  templateUrl: './categoria-form.component.html',
})
export class CategoriaFormComponent implements OnInit {
  constructor(private readonly router: Router) {}

  ngOnInit(): void {

  }
}
