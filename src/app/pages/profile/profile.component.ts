import { Component, OnInit } from '@angular/core';
import { HashdevDataService } from "../../services/hashdev-data.service";
import { Profile } from "../../models/profile.model";
import { Router } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NgIf } from "@angular/common";
import {AuthGuard} from "../auth/auth.guard";

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

  constructor(private hashdevDataService: HashdevDataService, private router: Router, private authService: AuthGuard) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId = this.authService.getCurrentUserId();
    console.log('Cargando perfil para el usuario con ID:', userId);
    this.hashdevDataService.getProfileByUserId(userId).subscribe(
      (profile) => {
        this.profile = profile;
      },
      (error) => {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    );
  }

  addProfile() {
    this.router.navigate(['/profile-settings']);
  }

  editProfile() {
    this.router.navigate(['/profile-settings']);
  }
}
