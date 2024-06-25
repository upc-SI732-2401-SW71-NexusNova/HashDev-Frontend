import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HashdevDataService } from "../../services/hashdev-data.service";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, SidebarComponent]
})
export class ProfileSettingsComponent implements OnInit {
  UserSettingsForm: FormGroup;
  errorMessage: string = '';
  UserId: number = 0;
  profileId: number = 0;
  snackbarMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private api: HashdevDataService,
    private router: Router
  ) {
    this.UserSettingsForm = this.fb.group({
      FullName: ['', Validators.required],
      Bio: ['', Validators.required],
      Location: ['', Validators.required],
      Website: ['', Validators.required],
      Github: ['', Validators.required],
      ProfilePictureUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.UserId = this.getUserIdFromSession();
    if (!this.UserId) {
      this.router.navigate(['/login']);
    } else {
      console.log('User ID:', this.UserId);
      this.loadUserProfile();
    }
  }

  getUserIdFromSession(): number {
    const userIdString = localStorage.getItem('UserId');
    if (!userIdString) {
      console.error('UserId no encontrado en localStorage');
      return 0;
    }
    return Number(userIdString);
  }

  loadUserProfile(): void {
    this.api.getProfileByUserId(this.UserId).subscribe(
      profile => {
        if (profile) {
          this.profileId = profile.Id;
          this.UserSettingsForm.patchValue({
            FullName: profile.FullName,
            Bio: profile.Bio,
            Location: profile.Location,
            Website: profile.Website,
            Github: profile.Github,
            ProfilePictureUrl: profile.ProfilePictureUrl
          });
        } else {
          this.profileId = 0;
        }
      },
      error => {
        this.errorMessage = 'Error cargando el perfil del usuario';
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    this.errorMessage = '';
    const formData = this.UserSettingsForm.value;
    if(this.errorMessage == ''){
      const UserSettingsForm = {
        FullName: formData.FullName,
        Bio: formData.Bio,
        Location: formData.Location,
        Website: formData.Website,
        Github: formData.Github,
        ProfilePictureUrl: formData.ProfilePictureUrl,
        UserId: this.UserId
      };

      if (this.profileId && this.profileId !== 0) {
        this.api.updateProfile(this.UserId, UserSettingsForm).subscribe(
          response => {
            this.profileId = response.Id;
            this.showSnackbar('Perfil actualizado exitosamente');
            console.log('Profile updated successfully', response);
          },
          error => {
            this.errorMessage = 'Error actualizando la información personal';
            console.error(error);
          }
        );
      } else {
        this.api.addProfile(UserSettingsForm).subscribe(
          response => {
            this.profileId = response.Id;
            this.showSnackbar('Perfil creado exitosamente');
            console.log('Profile added successfully', response);
          },
          error => {
            this.errorMessage = 'Error creando el perfil';
            console.error(error);
          }
        );
      }
    } else {
      this.errorMessage = 'El formulario no es válido';
    }
  }

  pageSettings(): void {
    this.router.navigate(['/profile']);
  }

  showSnackbar(message: string): void {
    this.snackbarMessage = message;
    const snackbar = document.getElementById('snackbar');
    if (snackbar) {
      snackbar.className = 'snackbar show';
      setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '');
      }, 3000);
    }
  }
}
