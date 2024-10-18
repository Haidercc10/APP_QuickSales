import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { Model_Products } from 'src/app/Models/Products/Model_Products';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  readonly apiUrl = `http://127.0.0.1:8000/productos`;

  constructor() { }

  get_producto = (id : number) => axios.get(`${this.apiUrl}/${id}`);

  get_productos = () => axios.get(`${this.apiUrl}`);

  post_producto = (data : Model_Products) => axios.post(`${this.apiUrl}`, data);

  put_producto = (id : number, data : Model_Products) => axios.put(`${this.apiUrl}/${id}`, data);

  delete_producto = (id : number) => axios.delete(`${this.apiUrl}/${id}`);
}
