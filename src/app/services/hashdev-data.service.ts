import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Profile } from '../models/profile.model';
import {Events} from "../models/events.model";

@Injectable({
  providedIn: 'root'
})
export class HashdevDataService {
  base_url = environment.baseURL;

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`Ocurrió un error: ${error.status}, el cuerpo fue: ${error.error}`);
    } else {
      console.log(`El servidor respondió con el código ${error.status}, el cuerpo fue: ${error.error}`);
    }
    return throwError('Ha ocurrido un problema con la solicitud, por favor inténtalo de nuevo más tarde');
  }

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(this.base_url + "/User").pipe(retry(2), catchError(this.handleError));
  }

  createUser(data: any): Observable<any> {
    return this.http.post<User>(`${this.base_url}/User`, data, this.httpOptions);
  }

  getUserForLogin(Email: string, Password: string): Observable<any> {
    return this.http.get(`${this.base_url}/User?Email=${Email}&Password=${Password}`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.base_url}/User/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  updateUser(User: any): Observable<any> {
    return this.http.put(`${this.base_url}/User/${User.id}`, User);
  }

  addProfile(Profile: Profile): Observable<any> {
    return this.http.post<Profile>(`${this.base_url}/Profile`, Profile, this.httpOptions);
  }

  updateProfile(Profile: Profile): Observable<any> {
    return this.http.put(`${this.base_url}/Profile/${Profile.Id}`, Profile, this.httpOptions);
  }

  getProfileByUserId(UserId: string): Observable<Profile | null> {
    return this.http.get<Profile[]>(`${this.base_url}/Profile?UserId=${UserId}`).pipe(
      retry(2),
      catchError(this.handleError),
      map(profiles => profiles.length > 0 ? profiles[0] : null)
    );
  }

  getAllEvents(): Observable<Events[]> {
    return this.http.get<Events[]>(`${this.base_url}/Events`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getEventsById(id: any): Observable<Events> {
    return this.http.get<Events>(`${this.base_url}/Events/${id}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  createEvent(event: Omit<Events, "id">): Observable<Events> {
    return this.http.post<Events>(`${this.base_url}/Events`, event, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  savePayment(payment: {
    CardNumber: string;
    Amount: string | undefined;
    Currency: string;
    CardCVV: string
  }): Observable<any> {
    return this.http.post(`${this.base_url}/Payment`, payment, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  saveRegistration(registration: { eventId: number | undefined; Apellidos: string; Nombres: string }): void {
    localStorage.setItem('registration', JSON.stringify(registration));
  }

  getRegistration(): { Nombres: string, Apellidos: string, eventId: string } | null {
    const registration = localStorage.getItem('registration');
    return registration ? JSON.parse(registration) : null;
  }
}
