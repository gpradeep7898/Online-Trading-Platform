import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Stock, Holding, StockService } from '../services/stock.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit, OnDestroy {
  balance: number = 0;
  stocks: Stock[] = [];
  selectedStock: Stock | null = null;
  quantity: number = 0;
  holdings: Holding[] = [];
  isLoading: boolean = false;
  message: string = '';
  logoUrl: string = 'assets/your_logo.png'; 
  
  get total(): number { return (this.selectedStock?.price ?? 0) * this.quantity; }

  balanceSubscription: Subscription = new Subscription();
  holdingsSubscription: Subscription = new Subscription();

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.stockService.getStocks().subscribe(stocks => this.stocks = stocks);
    this.balanceSubscription = this.stockService.getBalance().subscribe(balance => this.balance = balance);
    this.holdingsSubscription = this.stockService.getHoldings().subscribe(holdings => this.holdings = holdings);
  }

  ngOnDestroy(): void {
    this.balanceSubscription.unsubscribe();
    this.holdingsSubscription.unsubscribe();
  }

  buy(): void {
    this.stockService.buy(this.selectedStock, this.quantity).subscribe(() => this.message = 'Buy operation successful!');
  }

  sell(): void {
    this.stockService.sell(this.selectedStock, this.quantity).subscribe(() => this.message = 'Sell operation successful!');
  }

  shortSell(): void {
    this.stockService.shortSell(this.selectedStock, this.quantity).subscribe(() => this.message = 'Short sell operation successful!');
  }

  buyToCover(): void {
    this.stockService.buyToCover(this.selectedStock, this.quantity).subscribe(() => this.message = 'Buy to cover operation successful!');
  }

  submitOrder(): void {
    this.message = 'Please select an operation.';
  }
}
