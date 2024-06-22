import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HashdevDataService} from "../../services/hashdev-data.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class RegisterComponent {
  UserRegistrationForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private api:HashdevDataService) {
    this.UserRegistrationForm = this.fb.group({
      Username: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{12,}$/)]],
    });
  }

  onSubmit(){
    this.errorMessage = '';
    const formData = this.UserRegistrationForm.value;
    let warnings = '';

    if (!formData.Username || !formData.Email || !formData.Password) {
      warnings += 'Todos los campos son obligatorios. <br>';
    }

    if (!formData.Password || formData.Password.length < 6) {
      warnings += 'La contraseña debe tener al menos una letra en mayúscula, 12 caracteres y al menos 2 números.<br>';
    }

    this.errorMessage = warnings;

    if (this.errorMessage == '') { // Si no hay errores, se registra el usuario
      const UserData={
        Username: formData.Username,
        Email: formData.Email,
        Password: formData.Password,
      }
      this.api.createUser(UserData).subscribe((UserResponse: any) => {
        if (UserResponse && UserResponse.id) { //se crea automaticamente el id del cliente
          this.router.navigate(['login']);
        }
      });

    }

  }

  cancelar(){
    this.router.navigate(["login"]);
  }
}
