import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogadoGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.iniciado) {
      if (this.auth.logado) {
        return true;
      } else {
        this.router.navigate(['login']);
        return false;
      }
    } else {
      return new Observable<boolean>((observer) => {
        this.auth.iniciar()
          .then(() => {
            if (this.auth.logado) {
              observer.next(true);
            } else {
              this.router.navigate(['login']);
              observer.next(false);
            }
            observer.complete();
          })
          .catch(() => {
            observer.next(false);
            observer.complete();
          })
      });
    }
  }
  
}
