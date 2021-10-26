import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  /**
   * Realiza uma requisição Get
   * @param url 
   * @param params 
   */
  get<T>(url: string): Promise<any>{
    return new Promise(async (res, rej) => {
      try {
        const urlReq = environment.apiHost + url;
        const headers = await this.auth.addAuthHeader({});
        const options = {
          headers
        }

        // Chamo função da api
        this.http.get(urlReq, options).subscribe(
          // Sucesso
          (retorno) => {
            res(retorno);
          }, 
          // Falha
          (error) => {
            rej(error);
          }
        );
      } catch (error) {
        rej(error);
      }
    });
  }

  /**
   * Realiza uma requisição Post
   * @param params 
   */
  post<T>(url: string, body: any = {}): Promise<any>{
    return new Promise(async (res, rej) => {
      try {
        const urlReq = environment.apiHost + url;
        const headers = await this.auth.addAuthHeader({});
        const options = {
          headers
        }

        // Chamo função da api
        this.http.post(urlReq, body, options).subscribe(
          // Sucesso
          (retorno) => {
            res(retorno);
          }, 
          // Falha
          (error) => {
            rej(error);
          }
        );
      } catch (error) {
        rej(error);
      }
    });
  }

  /**
   * Realiza uma requisição Patch
   * @param params 
   */
  patch<T>(url: string, body: any): Promise<any>{
    return new Promise(async (res, rej) => {
      try {
        const urlReq = environment.apiHost + url;
        const headers = await this.auth.addAuthHeader({});
        const options = {
          headers
        }

        // Chamo função da api
        this.http.patch(urlReq, body, options).subscribe(
          // Sucesso
          (retorno) => {
            res(retorno);
          }, 
          // Falha
          (error) => {
            rej(error);
          }
        );
      } catch (error) {
        rej(error);
      }
    });
  }

  /**
   * Realiza uma requisição Delete
   * @param params 
   */
  delete<T>(url: string): Promise<any>{
    return new Promise(async (res, rej) => {
      try {
        const urlReq = environment.apiHost + url;
        const headers = await this.auth.addAuthHeader({});
        const options = {
          headers
        }

        // Chamo função da api
        this.http.delete(urlReq, options).subscribe(
          // Sucesso
          (retorno) => {
            res(retorno);
          }, 
          // Falha
          (error) => {
            rej(error);
          }
        );
      } catch (error) {
        rej(error);
      }
    });
  }
}
