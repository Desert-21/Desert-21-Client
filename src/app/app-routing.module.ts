import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateCodeComponent } from './components/activate-code/activate-code.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { GameViewComponent } from './components/game-view/game-view.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/menu/home/home.component';
import { HowToPlayComponent } from './components/menu/how-to-play/how-to-play.component';
import { LeaderboardComponent } from './components/menu/leaderboard/leaderboard.component';
import { MenuComponent } from './components/menu/menu.component';
import { PlayGameComponent } from './components/menu/play-game/play-game.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  {
    path: 'activate-code/:email/:activationCode',
    component: ActivateCodeComponent,
  },
  {
    path: 'reset-password/:linkId/:linkCode/:email',
    component: ResetPasswordComponent,
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'menu',
    component: MenuComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      { path: 'home', component: HomeComponent },
      { path: 'how-to-play', component: HowToPlayComponent },
      { path: 'play-game', component: PlayGameComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
    ],
  },
  { path: 'game/:gameId', component: GameViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
