import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  readonly apiUrl = `http://127.0.0.1:8000/roles`;

  constructor(private readonly http: HttpClient) { }

  get_roles = (): Observable<any> => this.http.get<any>(`${this.apiUrl}`);
}
