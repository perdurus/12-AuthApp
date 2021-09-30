import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, } from 'rxjs/operators'
import { environment } from '../../../environments/environment.prod';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario(){
    return {...this._usuario};
  }

  constructor(private http:HttpClient) { }


  //Crea el usuario
  registro(name:string, email:string, password:string){
   
    const url = `${this.baseUrl}/auth/new`;
    const body = { name, email, password};

    console.log('registro:', url);

    //Retornamos el observable
    return this.http.post<AuthResponse>(url, body).
        pipe(
          tap(resp=> {
            if (resp.ok){
              localStorage.setItem('token', resp.token!);
              //this._usuario = {name: resp.name!, uid: resp.uid!, email: resp.email!};
              //console.log('Registro: ', this._usuario);
            }
          }),
          map(resp => resp.ok),
          //catchError(err => of('Error al crear usuario'))
          catchError(err => of(err.error.msg))
        );
  }


  login(email:string, password:string){

    const url = `${this.baseUrl}/auth`;
    const body = { email, password};

    //Retornamos el observable
    return this.http.post<AuthResponse>(url, body).
        pipe(
          tap(resp=> {
            console.log('Login Resp: ', resp);
            if (resp.ok){
              //console.log('Login resp: ', resp);
              localStorage.setItem('token', resp.token!);
              //this._usuario = {name: resp.name!, uid: resp.uid!, email: resp.email!};
              //console.log('login: ', this._usuario);
            }
          }),
          map(resp => resp.ok),
          catchError(err => of(err.error.msg))
        );
  }

  validarToken():Observable<boolean>{

    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');

    return this.http.get<AuthResponse>(url, {headers: headers}).pipe(
      map( resp=>{
        console.log('Validar resp: ', resp);
        localStorage.setItem('token', resp.token!);
        this._usuario = {name: resp.name!, uid: resp.uid!, email: resp.email!};
        console.log('Validar token: ', this._usuario);
        return resp.ok;
      }),
      catchError( err => of(false))
    )
  }


  logOut(){

    localStorage.clear();
  }
}
