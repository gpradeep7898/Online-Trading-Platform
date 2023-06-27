import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradeComponent } from './trade/trade.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' }, // default route
  { path: 'trade', component: TradeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'trade', component: TradeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'leaderboard', component: LeaderboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
