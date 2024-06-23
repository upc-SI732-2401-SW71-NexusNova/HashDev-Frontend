import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { HashdevDataService } from "../../services/hashdev-data.service";
import { Profile } from "../../models/profile.model";
import {SidebarComponent} from "../sidebar/sidebar.component";


@Component({
  selector: 'app-profile',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, SidebarComponent]
})
export class ProfileSettingsComponent implements OnInit {
  UserSettingsForm: FormGroup;
  errorMessage: string = '';
  UserId: string = '';
  profileId: string = '';
  snackbarMessage: string = '';

  constructor(private fb: FormBuilder, private api: HashdevDataService, private router: Router) {
    this.UserSettingsForm = this.fb.group({
      Username: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required],
      confirmarpassword: ['', Validators.required],
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

  getUserIdFromSession(): string {
    return localStorage.getItem('UserId') || '';
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
          this.profileId = ''; // No profile found, set profileId to empty string
        }
      },
      error => {
        this.errorMessage = 'Error loading user profile';
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    const formData = this.UserSettingsForm.value;
    if (this.UserSettingsForm.valid) {
      const UserData = {
        id: this.UserId,
        Username: formData.Username,
        Email: formData.Email,
        Password: formData.Password
      };

      const ProfileData: Profile = {
        Id: this.profileId || '', // Use existing profile ID or empty string
        FullName: formData.FullName,
        Bio: formData.Bio,
        Location: formData.Location,
        Website: formData.Website,
        Github: formData.Github,
        ProfilePictureUrl: formData.ProfilePictureUrl,
        UserId: this.UserId
      };

      this.api.updateUser(UserData).subscribe(
        response => {
          this.showSnackbar('User updated successfully');
          setTimeout(() => {
            this.pageSettings();
          }, 3000);
          console.log('User updated successfully', response);
        },
        error => {
          this.showSnackbar('Error updating user credentials');
          this.errorMessage = 'Error updating user credentials';
          console.error(error);
        }
      );

      if (this.profileId && this.profileId.trim() !== '') {
        // Update existing profile
        this.api.updateProfile(ProfileData).subscribe(
          response => {
            this.showSnackbar('Profile updated successfully');
            console.log('Profile updated successfully', response);
          },
          error => {
            this.showSnackbar('Error updating personal information');
            this.errorMessage = 'Error updating personal information';
            console.error(error);
          }
        );
      } else {
        // Create new profile
        this.api.addProfile(ProfileData).subscribe(
          response => {
            this.profileId = response.id; // Update profileId after creating a new profile
            console.log('Profile added successfully', response);
          },
          error => {
            this.errorMessage = 'Error updating personal information';
            console.error(error);
          }
        );
      }
    } else {
      this.errorMessage = 'Form is not valid';
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
