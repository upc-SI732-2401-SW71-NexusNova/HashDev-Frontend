import { Component, OnInit } from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    SidebarComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
