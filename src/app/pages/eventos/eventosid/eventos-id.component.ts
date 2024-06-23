import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HashdevDataService } from '../../../services/hashdev-data.service';
import { Events } from '../../../models/events.model';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

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
  isRegistered: boolean = false;
  registrationDetails: { Nombres: string, Apellidos: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private dataService: HashdevDataService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      this.dataService.getEventsById(eventId).subscribe(event => {
        this.evento = event;

        const registration = this.dataService.getRegistration();
        if (registration && registration.eventId === eventId) {
          this.isRegistered = true;
          this.registrationDetails = {
            Nombres: registration.Nombres,
            Apellidos: registration.Apellidos
          };
        }
      });
    });
  }

  submitRegistrationForm(): void {
    const nombres = (document.getElementById('Nombres') as HTMLInputElement).value;
    const apellidos = (document.getElementById('Apellidos') as HTMLInputElement).value;
    const cardNumber = (document.getElementById('CardNumber') as HTMLInputElement).value;
    const currency = (document.getElementById('Currency') as HTMLInputElement).value;
    const cvv = (document.getElementById('CardCvv') as HTMLInputElement).value;

    const payment = {
      Amount: this.evento?.price,
      Currency: currency,
      CardNumber: cardNumber,
      CardCVV: cvv
    };

    this.dataService.savePayment(payment).subscribe(result => {
      console.log('Pago registrado exitosamente:', result);
      this.dataService.saveRegistration({
        Nombres: nombres,
        Apellidos: apellidos,
        eventId: this.evento?.id
      });
      this.isRegistered = true;
      this.registrationDetails = { Nombres: nombres, Apellidos: apellidos };
    }, error => {
      console.error('Error al registrar el pago:', error);
    });
  }
  printTicket(): void {
    const printContent = document.querySelector('.ticket');
    const printWindow = window.open('', '', 'height=600,width=800');
    const currentDate = new Date().toLocaleString(); // Obtener la fecha y hora actual

    if (printWindow && printContent) {
      printWindow.document.write('<html><head><title>Print Ticket</title>');
      printWindow.document.write(`
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f1f1f1;
        }
        .ticket-print {
          background-color: #fff;
          border: 1px solid #ccc;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .ticket-print h2 {
          margin-top: 0;
        }
        .ticket-print .details {
          margin-top: 20px;
          text-align: left;
        }
        .ticket-print .details p {
          margin: 5px 0;
        }
        .no-print {
          display: none;
        }
      </style>
    </head><body onload="window.print(); window.close();">`); // Ejecutar la impresión automáticamente y cerrar la ventana
      printWindow.document.write(`
      <div class="ticket-print">
        <h2>Boleto de Compra</h2>
        <p>Fecha y hora de compra: ${currentDate}</p>
        <div class="details">
          ${printContent.innerHTML}
        </div>
      </div>
    `);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
    }
  }
}
