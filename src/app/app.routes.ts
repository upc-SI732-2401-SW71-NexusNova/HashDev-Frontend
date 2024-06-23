import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import { NgModule } from "@angular/core";
import { ProfileSettingsComponent } from "./pages/profile-settings/profile-settings.component";
import { HomeComponent } from "./pages/home/home.component";
import { EventosComponent } from "./pages/eventos/eventos.component";
import { NewEventosComponent } from "./pages/eventos/neweventos/new-eventos.component";
import {EventosIdComponent} from "./pages/eventos/eventosid/eventos-id.component";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile-settings', component: ProfileSettingsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'neweventos', component: NewEventosComponent },
  { path: 'eventos/:id', component: EventosIdComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
