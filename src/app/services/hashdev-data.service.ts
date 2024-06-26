import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {forkJoin, Observable, switchMap, throwError} from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Profile } from '../models/profile.model';
import { Conference } from "../models/conference.model";
import {Comentario} from "../models/comment.model";
import {Post} from "../models/post.model";

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
    return this.http.get<User[]>(this.base_url + "/User").pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  createUser(data: Omit<User, 'Id'>): Observable<User> {
    return this.http.post<User>(`${this.base_url + "/user-api"}/User/register`, data, this.httpOptions).pipe(
      map(user => {
        user.Id = +user.Id;
        return user;
      }),
      catchError(this.handleError)
    );
  }

  getUserForLogin(Email: string, Password: string): Observable<any> {
    return this.http.get(`${this.base_url + "/user-api"}/User?Email=${Email}&Password=${Password}/login`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.base_url + "/user-api"}/User/${id}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateUser(user: { Email: any; Username: any; id: number; Password: any }): Observable<User> {
    return this.http.put<User>(`${this.base_url + "/user-api"}/User/${user.id}`, user, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addProfile(data: any): Observable<Profile> {
    return this.http.post<Profile>(`${this.base_url + "/user-api"}/Profile`, JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateProfile(UserId: number, data: any): Observable<Profile> {
    return this.http.put<Profile>(`${this.base_url+ "/user-api"}/Profile/${UserId}`, JSON.stringify(data), this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getProfileByUserId(UserId: number): Observable<Profile | null> {
    return this.http.get<Profile[]>(`${this.base_url + "/user-api"}/Profile/${UserId}`).pipe(
      retry(2),
      catchError(this.handleError),
      map(profiles => profiles.length > 0 ? profiles[0] : null)
    );
  }

  getAllConferences(): Observable<Conference[]> {
    return this.http.get<Conference[]>(`${this.base_url + "/conf-api"}/conferences`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getConferencesById(id: number): Observable<Conference> {
    return this.http.get<Conference>(`${this.base_url + "/conf-api" }/conferences/${id}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  createConference(conferences: Omit<Conference, "id">): Observable<Conference> {
    return this.http.post<Conference>(`${this.base_url + "/conf-api"}/conferences`, conferences, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  savePayment(payment: {
    CardNumber: number;
    Amount: string | undefined;
    Currency: string;
    CardCVV: number
  }): Observable<any> {
    return this.http.post(`${this.base_url}/Payment`, payment, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  saveRegistration(registration: { conferenceId: number | undefined; Apellidos: string; Nombres: string }): void {
    localStorage.setItem('registration', JSON.stringify(registration));
  }

  getRegistration(): { Nombres: string, Apellidos: string, conferenceId: number } | null {
    const registration = localStorage.getItem('registration');
    return registration ? JSON.parse(registration) : null;
  }

  createPost(post: { Content: any; UserId: string; ImageUrl: any; Id: number }): Observable<Post> {
    return this.http.post<Post>(`${this.base_url}/Post`, post, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.base_url}/Post`).pipe(
      switchMap(posts => {
        const requests: Observable<Post>[] = posts.map(post => {
          return this.getProfileByUserId(+post.UserId).pipe(
            map(profile => {
              if (profile) {
                post.author = profile.FullName; // Asignar el nombre completo del perfil al post
                post.authorProfilePictureUrl = profile.ProfilePictureUrl; // Asignar la URL de la imagen de perfil
              }
              return post;
            })
          );
        });
        return forkJoin(requests);
      }),
      catchError(this.handleError)
    );
  }

  getCommentsByPostId(postId: any): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.base_url}/Comment?PostId=${postId}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  addComment(comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.base_url}/Comment`, comentario, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
