import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import { NgModule } from "@angular/core";
import { ProfileSettingsComponent } from "./pages/profile-settings/profile-settings.component";
import { HomeComponent } from "./pages/home/home.component";
import { ConferencesComponent } from "./pages/eventos/conferences.component";
import { NewConferencesComponent } from "./pages/eventos/neweventos/new-conferences.component";
import { ConferencesIdComponent } from "./pages/eventos/eventosid/conferences-id.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import {AuthGuard} from "./pages/auth/auth.guard";
import {PostComponent} from "./pages/post/post.component";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]  },
  { path: 'profile-settings', component: ProfileSettingsComponent, canActivate: [AuthGuard]  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]  },
  { path: 'conferences', component: ConferencesComponent, canActivate: [AuthGuard]  },
  { path: 'newconferences', component: NewConferencesComponent, canActivate: [AuthGuard]  },
  { path: 'conferences/:id', component: ConferencesIdComponent, canActivate: [AuthGuard]  },
  { path: 'post', component: PostComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
