import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HashdevDataService } from '../../../services/hashdev-data.service';
import { Events } from '../../../models/events.model';
import {SidebarComponent} from "../../sidebar/sidebar.component";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-eventos-id',
  templateUrl: './eventos-id.component.html',
  standalone: true,
  imports: [
    SidebarComponent,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./eventos-id.component.css']
})
export class EventosIdComponent implements OnInit {
  evento: Events | undefined;
  amount: string = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: HashdevDataService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      this.dataService.getEventsById(eventId).subscribe(event => {
        this.evento = event;
        this.amount = event.price;
      });
    });
  }

  submitRegistrationForm(): void {
    const nombres = (document.getElementById('Nombres') as HTMLInputElement).value;
    const apellidos = (document.getElementById('Apellidos') as HTMLInputElement).value;
    const cardNumber = (document.getElementById('CardNumber') as HTMLInputElement).value;
    const currency = (document.getElementById('Currency') as HTMLInputElement).value;
    const cvv = (document.getElementById('CardCvv') as HTMLInputElement).value;

    const payment: { CardNumber: string; Amount: string; Currency: string; CardCVV: string } = {
      Amount: this.amount,
      Currency: currency,
      CardNumber: cardNumber,
      CardCVV: cvv
    };

    this.dataService.savePayment(payment).subscribe(result => {
      console.log('Pago registrado exitosamente:', result);
    }, error => {
      console.error('Error al registrar el pago:', error);
    });
  }
}
