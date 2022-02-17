import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivateCodeComponent } from './components/activate-code/activate-code.component';
import { GameViewComponent } from './components/game-view/game-view.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { RegistrationComponent } from './components/registration/registration.component';

const routes: Routes = [
  // { path: '/', redirectTo: 'game'},
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'activate-code/:email/:activationCode', component: ActivateCodeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'game', component: GameViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
