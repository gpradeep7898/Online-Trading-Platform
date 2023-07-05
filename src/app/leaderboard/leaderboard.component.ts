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
    { name: 'Player 3', balance: 150 , rank: 2},
    { name: 'Player 4', balance: 300 , rank: 2},
    { name: 'Player 5', balance: 450 , rank: 2},
    { name: 'Player 6', balance: 250 , rank: 2},
    { name: 'Player 7', balance: 350 , rank: 2},
    { name: 'Player 8', balance: 400 , rank: 2}
  ];
  
  sortBybal() {
    this.players.sort((a, b) => b.balance - a.balance);
    console.log(this.players)
  }
  ngOnInit(): void {
    this.sortBybal()
  }

}
