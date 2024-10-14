import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';


@Injectable({
  providedIn: 'root'
})
export class SvUsuariosService {

  readonly apiUrl = `http://127.0.0.1:8000/usuario`;

  constructor() { }

  get_usuario = (id : number) => axios.get(`${this.apiUrl}/${id}`);

}
