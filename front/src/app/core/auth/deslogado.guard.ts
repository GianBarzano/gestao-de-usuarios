import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeslogadoGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.iniciado) {
      return !this.auth.logado;
    } else {
      return new Observable<boolean>((observer) => {
        this.auth.iniciar()
          .then(() => {
            if (!this.auth.logado) {
              observer.next(true);
              observer.complete();
            } else {
              observer.next(false);
              observer.complete();
              this.router.navigate(['']);
            }
          })
          .catch(() => {
            observer.next(true);
            observer.complete();
            this.router.navigate(['/login']);
          })
      });
    }
  }
  
}
