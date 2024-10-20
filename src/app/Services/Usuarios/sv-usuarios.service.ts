import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { Model_Users } from 'src/app/Models/Model_Users';


@Injectable({
  providedIn: 'root'
})
export class SvUsuariosService {

  readonly apiUrl = `http://127.0.0.1:8000/usuarios`;

  constructor() { }

  get_usuario = (id : number) => axios.get(`${this.apiUrl}/${id}`);

  get_usuarios = () => axios.get(`${this.apiUrl}`);

  post_usuario = (data : Model_Users) => axios.post(`${this.apiUrl}`, data);

  put_usuario = (id : number, data : Model_Users) => axios.put(`${this.apiUrl}/${id}`, data);

  delete_usuario = (id : number) => axios.delete(`${this.apiUrl}/${id}`);
}
