import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Stock {
  name: string;
  price: number;
}

export interface Holding {
  stock: Stock;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private alphaVantageApiKey: string = '67868ISXYQBXB2O7';
  private stockSymbols: string[] = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'FB', 'TSLA', 'BRK.B', 'JPM', 'JNJ', 'V'];

  private balance$: BehaviorSubject<number> = new BehaviorSubject<number>(10000);
  private stocks$: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  private holdings$: BehaviorSubject<Holding[]> = new BehaviorSubject<Holding[]>([]);

  constructor(private http: HttpClient) {
    this.updateStockPrices();
  }

  updateStockPrices(): void {
    this.stockSymbols.forEach(symbol => {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageApiKey}`;

      this.http.get(url).pipe(
        map((response: any) => ({
          name: response['Global Quote']['01. symbol'],
          price: +response['Global Quote']['05. price']
        }))
      ).subscribe(stock => {
        let currentStocks = this.stocks$.value;
        const stockIndex = currentStocks.findIndex(s => s.name === stock.name);

        if (stockIndex > -1) {
          currentStocks[stockIndex] = stock;
        } else {
          currentStocks.push(stock);
        }

        this.stocks$.next(currentStocks);
      });
    });
  }
  

  getBalance(): Observable<number> {
    return this.balance$.asObservable();
  }

  getStocks(): Observable<Stock[]> {
    return this.stocks$.asObservable();
  }

  getHoldings(): Observable<Holding[]> {
    return this.holdings$.asObservable();
  }

  buy(stock: Stock | null, quantity: number): Observable<void> {
    this.performTrade(stock, quantity, false, true);
    return of();
  }

  sell(stock: Stock | null, quantity: number): Observable<void> {
    this.performTrade(stock, quantity, true, false);
    return of();
  }

  shortSell(stock: Stock | null, quantity: number): Observable<void> {
    this.performTrade(stock, quantity, true, true);
    return of();
  }

  buyToCover(stock: Stock | null, quantity: number): Observable<void> {
    this.performTrade(stock, quantity, false, false);
    return of();
  }

  private performTrade(stock: Stock | null, quantity: number, isCredit: boolean, isBuy: boolean) {
    if (stock) {
      let currentBalance = this.balance$.value;
      let cost = stock.price * quantity;

      if (isCredit) {
        currentBalance += cost;
      } else {
        if (currentBalance >= cost) {
          currentBalance -= cost;
        } else {
          // Not enough balance
          return;
        }
      }
      this.balance$.next(currentBalance);

      if (isBuy) {
        this.addHolding(stock, quantity);
      } else {
        this.removeHolding(stock, quantity);
      }
    }
  }

  private addHolding(stock: Stock, quantity: number) {
    let currentHoldings = this.holdings$.value;
    let holding = currentHoldings.find(h => h.stock.name === stock.name);
    if (holding) {
      holding.quantity += quantity;
    } else {
      currentHoldings.push({stock: stock, quantity: quantity});
    }
    this.holdings$.next(currentHoldings);
  }

  private removeHolding(stock: Stock, quantity: number) {
    let currentHoldings = this.holdings$.value;
    let holding = currentHoldings.find(h => h.stock.name === stock.name);
    if (holding) {
      holding.quantity -= quantity;
      if (holding.quantity <= 0) {
        currentHoldings = currentHoldings.filter(h => h.stock.name !== stock.name);
      }
    }
    this.holdings$.next(currentHoldings);
  }
}
