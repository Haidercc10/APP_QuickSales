import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })

export class SvMsgsService {

  constructor(private messages : MessageService) { }

  msgExit = (title : string, msj : string) => this.messages.add({ severity: 'success', summary: title, detail: msj },)

  msgError = (title : string, msj : string) => this.messages.add({ severity: 'error', summary: title, detail: msj },)

  msgAdv = (title : string, msj : string) => this.messages.add({ severity: 'warn', summary: title, detail: msj },)
}
