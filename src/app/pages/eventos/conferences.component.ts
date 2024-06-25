import { Component, OnInit } from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";
import {HashdevDataService} from "../../services/hashdev-data.service";
import {Conference } from "../../models/conference.model";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-conferences',
  templateUrl: './conferences.component.html',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    RouterLink
  ],
  styleUrls: ['./conferences.component.css']
})
export class ConferencesComponent implements OnInit {
  conferences: Conference[] = [];

  constructor(private dataService: HashdevDataService) {}

  ngOnInit(): void {
    this.dataService.getAllConferences().subscribe((data: Conference[]) => {
      this.conferences = data;
    });
  }
}
