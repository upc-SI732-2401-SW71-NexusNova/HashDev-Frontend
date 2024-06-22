import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HashdevDataService } from "../../services/hashdev-data.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class LoginComponent {
  Email: string = '';
  Password: string = '';
  errorMessage: string = '';

  constructor(private hashdevService: HashdevDataService, private router: Router) { }

  ngOnInit(): void { }

  onSubmit() {
    this.errorMessage = '';
    if (!this.Email || !this.Password) {
      this.errorMessage = 'Por favor, ingrese su usuario y contraseña.';
      return;
    }

    this.hashdevService.getUserForLogin(this.Email, this.Password).subscribe((UserResponse: any) => {
      if (UserResponse && UserResponse.length > 0) {
        localStorage.setItem('UserId', UserResponse[0].id);
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Usuario no encontrado';
      }
    }, error => {
      this.errorMessage = 'Error al intentar iniciar sesión';
    });
  }
}
