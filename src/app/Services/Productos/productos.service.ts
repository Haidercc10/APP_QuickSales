import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Model_Products } from 'src/app/Models/Products/Model_Products';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  readonly apiUrl = `http://127.0.0.1:8000/productos`;

  constructor(private readonly http: HttpClient) { }

  get_producto = (id : number): Observable<any> => this.http.get<any>(`${this.apiUrl}/${id}`);

  get_productos = (): Observable<any> => this.http.get<any>(`${this.apiUrl}`);

  post_producto = (data : Model_Products): Observable<any> => this.http.post<any>(`${this.apiUrl}`, data);

  put_producto = (id : number, data : Model_Products): Observable<any> => this.http.put<any>(`${this.apiUrl}/${id}`, data);

  delete_producto = (id : number): Observable<any> => this.http.delete<any>(`${this.apiUrl}/${id}`);
}
