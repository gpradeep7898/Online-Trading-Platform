import { Component } from '@angular/core';


interface Player {
  name: string;
  balance: number;
  rank: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})

export class LeaderboardComponent {
  players: Player[] = [
    { name: 'Player 1', balance: 100 , rank: 3},
    { name: 'Player 2', balance: 200 , rank: 1},
    { name: 'Player 3', balance: 150 , rank: 2}
  ];

}
