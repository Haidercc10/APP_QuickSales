import { Routes } from "@angular/router";
import { HomeComponent } from "./Views/home/home.component";
import { InventarioComponent } from "./Views/inventario/inventario.component";
import { LoginComponent } from "./Views/login/login.component";
import { UsuariosComponent } from "./Views/usuarios/usuarios.component";

export const routes: Routes = [
    { path: '', component: LoginComponent, },
    { path: 'home', component: HomeComponent, },
    { path: 'productos', component: InventarioComponent, },
    { path: 'usuarios', component: UsuariosComponent, },
]