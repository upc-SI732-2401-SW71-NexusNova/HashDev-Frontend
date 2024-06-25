import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HashdevDataService } from '../../../services/hashdev-data.service';
import { FormsModule } from "@angular/forms";
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { Conference } from "../../../models/conference.model";

@Component({
  selector: 'app-new-conferences',
  templateUrl: './new-conferences.component.html',
  standalone: true,
  imports: [
    FormsModule,
    SidebarComponent
  ],
  styleUrls: ['./new-conferences.component.css']
})
export class NewConferencesComponent {
  newConference: Omit<Conference, 'id'> = {
    name: '',
    image: '',
    description: '',
    price: '',
    date: '',
    time: '',
    location: '',
    UserId: 0
  };

  constructor(
    private dataService: HashdevDataService,
    private router: Router
  ) {}

  onSubmit() {
    const userId = this.getUserId();

    if (userId !== null) {
      const conferenceToCreate: Omit<Conference, 'id'> = {
        ...this.newConference,
        UserId: userId
      };

      this.dataService.createConference(conferenceToCreate).subscribe(
        (response) => {
          console.log('Conferencia creada exitosamente', response);
          this.router.navigate(['/conferences']);
        },
        (error) => {
          console.error('Error al crear la conferencia', error);
        }
      );
    } else {
      console.error('Error: No se pudo obtener el UserId del usuario autenticado');
    }
  }

  private getUserId(): number | null {
    const userIdString = localStorage.getItem('UserId');
    return userIdString ? Number(userIdString) : null;
  }
}
