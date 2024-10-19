import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './Views/login/login.component';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Views/home/home.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InventarioComponent } from './Views/inventario/inventario.component';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

const routes : Routes = [
  { path : '', component : LoginComponent,   },
  { path : 'inventory', component : AppComponent,  },
  { path : 'home', component : HomeComponent,  },
  { path : 'inventario', component : InventarioComponent,  },
]

@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    HomeComponent,
    InventarioComponent,
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
    DropdownModule
  ],
  exports : [RouterModule],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
