import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Model_Users } from 'src/app/Models/Model_Users';


@Injectable({
  providedIn: 'root'
})
export class SvUsuariosService {

  readonly apiUrl = `http://127.0.0.1:8000/usuarios`;

  constructor(private readonly http: HttpClient) { }

  get_usuario = (id : number): Observable<any> => this.http.get<any>(`${this.apiUrl}/${id}`);

  get_usuarios = (): Observable<any> => this.http.get<any>(`${this.apiUrl}`);

  post_usuario = (data : Model_Users): Observable<any> => this.http.post<any>(`${this.apiUrl}`, data);

  put_usuario = (id : number, data : Model_Users): Observable<any> => this.http.put<any>(`${this.apiUrl}/${id}`, data);

  delete_usuario = (id : number): Observable<any> => this.http.delete<any>(`${this.apiUrl}/${id}`);
}
