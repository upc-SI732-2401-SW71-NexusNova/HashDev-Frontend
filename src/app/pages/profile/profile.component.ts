import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HashdevDataService } from "../../services/hashdev-data.service";
import { Profile } from '../../models/profile.model'; // Asegúrate de importar el modelo

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css'],
  standalone: true
})
export class ProfileComponent implements OnInit {
  Profile: Profile | null = null;

  constructor(private api: HashdevDataService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.params.subscribe(params => {
      this.getProfile(params['id']);
    });
  }

  ngOnInit(): void {}

  getProfile(id: string) {
    this.api.getProfileByUserId(id).subscribe(
      (res: Profile | null) => {
        if (res) {
          console.log("Profile detail:", res);
          this.Profile = res;
        }
      },
      err => {
        console.log("Error:", err);
      }
    );
  }

  pageSettings() {
    const UserId = this.Profile?.UserId;
    if (UserId) {
      this.router.navigateByUrl(`/client-settings/${UserId}`);
    }
  }
}
