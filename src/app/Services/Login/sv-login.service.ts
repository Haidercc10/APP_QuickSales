import { Injectable } from '@angular/core';
import axios from 'axios';

export interface LoginRequest {
  Usu_Id : number;
  Usu_Password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SvLoginService {

  readonly apiUrl = `http://127.0.0.1:8000/login`;

  constructor() { }

  login = (data: LoginRequest) => axios.post(`${this.apiUrl}`, data);
}
