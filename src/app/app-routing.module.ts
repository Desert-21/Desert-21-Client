import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivateCodeComponent } from './components/activate-code/activate-code.component';
import { GameViewComponent } from './components/game-view/game-view.component';
import { LoginComponent } from './components/login/login.component';
import { AccountComponent } from './components/menu/account/account.component';
import { HomeComponent } from './components/menu/home/home.component';
import { HowToPlayComponent } from './components/menu/how-to-play/how-to-play.component';
import { MenuComponent } from './components/menu/menu.component';
import { PlayGameComponent } from './components/menu/play-game/play-game.component';
import { RegistrationComponent } from './components/registration/registration.component';

const routes: Routes = [
  // { path: '/', redirectTo: 'game'},
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'activate-code/:email/:activationCode', component: ActivateCodeComponent },
  { path: 'menu', component: MenuComponent, children: [
    { path: 'home', component: HomeComponent },
    { path: 'how-to-play', component: HowToPlayComponent },
    { path: 'play-game', component: PlayGameComponent },
    { path: 'account', component: AccountComponent }
  ]},
  { path: 'game', component: GameViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
