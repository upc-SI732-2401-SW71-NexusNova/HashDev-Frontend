import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import {Events} from "../../../models/events.model";
import {HashdevDataService} from "../../../services/hashdev-data.service";

@Component({
  selector: 'app-new-events',
  templateUrl: './new-eventos.component.html',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./new-eventos.component.css']
})
export class NewEventosComponent {
  newEvent: Omit<Events, 'id'> = {
    name: '',
    image: '',
    description: '',
    date: '',
    time: '',
    location: ''
  };

  constructor(
    private dataService: HashdevDataService,
    private router: Router
  ) {}

  onSubmit() {
    this.dataService.createEvent(this.newEvent as Events).subscribe(
      (response) => {
        console.log('Evento creado exitosamente', response);
        this.router.navigate(['/eventos']);  // Navega de vuelta a la lista de eventos después de crear uno nuevo
      },
      (error) => {
        console.error('Error al crear el evento', error);
      }
    );
  }
}
