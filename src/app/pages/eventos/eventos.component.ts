import { Component, OnInit } from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";
import {HashdevDataService} from "../../services/hashdev-data.service";
import {Events} from "../../models/events.model";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    RouterLink
  ],
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventos: Events[] = [];

  constructor(private dataService: HashdevDataService) {}

  ngOnInit(): void {
    this.dataService.getAllEvents().subscribe((data: Events[]) => {
      this.eventos = data;
    });
  }
}
