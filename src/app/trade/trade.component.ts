import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
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
    if (this.total <= this.balance) {
      this.isLoading = true;
      this.stockService.buy(this.selectedStock, this.quantity).pipe(
        tap(() => {
          this.balance -= this.total;
          this.message = 'Buy operation successful!';
        })
      ).subscribe(() => this.isLoading = false);
    } else {
      this.message = 'Insufficient balance for this operation.';
    }
  }

  sell(): void {
    this.isLoading = true;
    this.stockService.sell(this.selectedStock, this.quantity).pipe(
      tap(() => {
        this.balance += this.total;
        this.message = 'Sell operation successful!';
      })
    ).subscribe(() => this.isLoading = false);
  }

  shortSell(): void {
    // Assuming for this example that you can always short sell.
    this.isLoading = true;
    this.stockService.shortSell(this.selectedStock, this.quantity).pipe(
      tap(() => {
        this.balance -= this.total; // Update with the proper calculation for short selling
        this.message = 'Short sell operation successful!';
      })
    ).subscribe(() => this.isLoading = false);
  }

  buyToCover(): void {
    // Assuming for this example that you can always buy to cover.
    this.isLoading = true;
    this.stockService.buyToCover(this.selectedStock, this.quantity).pipe(
      tap(() => {
        this.balance += this.total; // Update with the proper calculation for buy to cover
        this.message = 'Buy to cover operation successful!';
      })
    ).subscribe(() => this.isLoading = false);
  }

  submitOrder(): void {
    this.message = 'Please select an operation.';
  }
}
