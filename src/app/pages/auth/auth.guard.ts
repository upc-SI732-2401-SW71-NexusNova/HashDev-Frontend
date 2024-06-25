import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {HashdevDataService} from "../../services/hashdev-data.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private hashdevService: HashdevDataService) {}

  getCurrentUserId(): number {
    const userId = localStorage.getItem('UserId');
    if (userId) {
      return parseInt(userId, 10);
    } else {
      console.error('No se encontró el ID del usuario en el almacenamiento local.');
      this.router.navigate(['/home']);
      return 0;
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userId = localStorage.getItem('UserId');

    if (userId) {
      return this.hashdevService.getUserById(+userId).pipe(
        map(user => {
          if (user) {
            return true;
          } else {
            return this.router.createUrlTree(['/login']);
          }
        }),
        catchError(() => {
          return of(this.router.createUrlTree(['/login']));
        })
      );
    } else {
      return of(this.router.createUrlTree(['/login']));
    }
  }
}

