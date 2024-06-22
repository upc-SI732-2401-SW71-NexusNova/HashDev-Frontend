import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '../../../models/events.model';
import { HashdevDataService } from '../../../services/hashdev-data.service';
import {FormsModule} from "@angular/forms";
import {SidebarComponent} from "../../sidebar/sidebar.component";

@Component({
  selector: 'app-new-events',
  templateUrl: './new-eventos.component.html',
  standalone: true,
  imports: [
    FormsModule,
    SidebarComponent
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
    location: '',
    UserId: ''
  };

  constructor(
    private dataService: HashdevDataService,
    private router: Router
  ) {}

  onSubmit() {
    const userId = this.getUserId();

    if (userId) {
      const eventToCreate: Omit<Events, 'id'> = {
        ...this.newEvent,
        UserId: userId
      };

      this.dataService.createEvent(eventToCreate).subscribe(
        (response) => {
          console.log('Evento creado exitosamente', response);
          this.router.navigate(['/eventos']);
        },
        (error) => {
          console.error('Error al crear el evento', error);
        }
      );
    } else {
      console.error('Error: No se pudo obtener el UserId del usuario autenticado');
    }
  }

  private getUserId(): string | null {
    return localStorage.getItem('UserId');
  }
}
