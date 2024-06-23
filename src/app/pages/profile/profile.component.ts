import { Component, OnInit } from '@angular/core';
import { HashdevDataService } from "../../services/hashdev-data.service";
import { Profile } from "../../models/profile.model";
import { Router } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    SidebarComponent,
    NgIf
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;

  constructor(private hashdevDataService: HashdevDataService, private router: Router) { }

  ngOnInit(): void {
    // Obtener ID de usuario desde localStorage
    const userId = localStorage.getItem('UserId');

    if (userId) {
      // Obtener perfil del usuario por su ID
      this.hashdevDataService.getProfileByUserId(userId).subscribe(
        (profile: Profile | null) => {
          if (profile) {
            this.profile = profile;
          } else {
            console.warn('Perfil no encontrado para el usuario con id:', userId);
          }
        },
        error => {
          console.error('Error al obtener perfil:', error);
        }
      );
    } else {
      console.error('ID de usuario no encontrado en localStorage');
    }
  }

  addProfile() {
    this.router.navigate(['/profile-settings']);
  }

  editProfile() {
    this.router.navigate(['/profile-settings']);
  }
}

