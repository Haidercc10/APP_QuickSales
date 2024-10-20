import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  readonly apiUrl = `http://127.0.0.1:8000/roles`;

  constructor() { }

  get_roles = () => axios.get(`${this.apiUrl}`);
}
