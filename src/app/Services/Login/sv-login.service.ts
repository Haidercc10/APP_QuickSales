import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginRequest {
  Usu_Id : number;
  Usu_Password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SvLoginService {

  readonly apiUrl = `http://127.0.0.1:8000/login`;

  constructor(private readonly http: HttpClient) { }

  login = (data: LoginRequest): Observable<any> => this.http.post<any>(`${this.apiUrl}`, data);
}
