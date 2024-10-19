//*Prime NG
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router'
import { PanelMenuModule } from 'primeng/panelmenu'
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
//*Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './Views/login/login.component';
import { HomeComponent } from './Views/home/home.component';
import { InventarioComponent } from './Views/inventario/inventario.component';
import { HeaderComponent } from './Views/header/header.component';
import { UsuariosComponent } from './Views/usuarios/usuarios.component';

const routes : Routes = [
  { path : '', component : LoginComponent,   },
  { path : 'inventory', component : AppComponent,  },
  { path : 'home', component : HomeComponent,  },
  { path : 'productos', component : InventarioComponent,  },
  { path : 'usuarios', component : UsuariosComponent,  },
]

@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    HomeComponent,
    InventarioComponent,
    HeaderComponent,
    UsuariosComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    MessagesModule,
    ToastModule,
    RouterModule.forRoot(routes),
    PanelMenuModule,
    CardModule,
    DividerModule,
    TableModule,
    DialogModule,
    InputNumberModule,
    DropdownModule,
    ProgressSpinnerModule,
    ChipModule,
    InputTextModule
  ],
  exports : [RouterModule],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
