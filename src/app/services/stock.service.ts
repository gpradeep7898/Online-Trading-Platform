import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, interval, forkJoin } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';

export interface Stock {
  id: string;
  name: string;
  price: number;
}

export interface Holding {
  stock: Stock;
  quantity: number;
}

export interface HistoricalData {
  date: string;
  close: number;  
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private alphaVantageApiKey: string = '67868ISXYQBXB2O7';
  private stockSymbols: string[] = [
    'AAPL',  // Apple Inc.
    'MSFT',  // Microsoft Corporation
    'AMZN',  // Amazon.com, Inc.
    'GOOGL', // Alphabet Inc. (Google)
    'FB',    // Facebook, Inc.
    'TSLA',  // Tesla, Inc.
    'BRK.B', // Berkshire Hathaway Inc.
    'JPM',   // JPMorgan Chase & Co.
    'JNJ',   // Johnson & Johnson
    'V',     // Visa Inc.
    'WMT',   // Walmart Inc.
    'PG',    // Procter & Gamble Co.
    'MA',    // Mastercard Incorporated
    'INTC',  // Intel Corporation
    'UNH',   // UnitedHealth Group Incorporated
    'VZ',    // Verizon Communications Inc.
    'HD',    // The Home Depot, Inc.
    'KO',    // The Coca-Cola Company
    'DIS',   // The Walt Disney Company
    'PFE'    // Pfizer Inc.
  ];
  
  private balance$: BehaviorSubject<number> = new BehaviorSubject<number>(10000);
  private stocks$: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  private holdings$: BehaviorSubject<Holding[]> = new BehaviorSubject<Holding[]>([]);
  private historicalData$: BehaviorSubject<HistoricalData[]> = new BehaviorSubject<HistoricalData[]>([]);

  constructor(private http: HttpClient) {
    interval(60000)
      .pipe(
        startWith(0),
        switchMap(() => this.updateStockPrices())
      )
      .subscribe();
  }

  updateStockPrices(): Observable<void> {
    const requests = this.stockSymbols.map(symbol => {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageApiKey}`;

      return this.http.get(url).pipe(
        map((response: any) => ({
          id: symbol,
          name: response['Global Quote']['01. symbol'],
          price: +response['Global Quote']['05. price']
        })),
        tap(stock => {
          let currentStocks = this.stocks$.value;
          const stockIndex = currentStocks.findIndex(s => s.id === stock.id);

          if (stockIndex > -1) {
            currentStocks[stockIndex] = stock;
          } else {
            currentStocks.push(stock);
          }

          this.stocks$.next(currentStocks);
        })
      )
    });

    return forkJoin(requests).pipe(
      map(() => {})
    );
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

  getHistoricalData(symbol: string, start: string, end: string): Observable<HistoricalData[]> {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${this.alphaVantageApiKey}`;

    return this.http.get(url).pipe(
        map((response: any) => {
            let data = [];
            for (let date in response['Time Series (Daily)']) {
                if (date >= start && date <= end) {
                    data.push({
                        date: date,
                        close: +response['Time Series (Daily)'][date]['4. close']  // Changed 'price' to 'close' to match the interface.
                    });
                }
            }
            return data;
        })
    );
}



calculatePortfolioValueByDate(date: string): Observable<number> {
  let portfolioValue = 0;

  const requests = this.holdings$.value.map(holding => {
      return this.getHistoricalData(holding.stock.id, date, date).pipe(
          map(historicalData => {
              if (historicalData.length > 0) {
                  portfolioValue += holding.quantity * historicalData[0].close;  
              }
          })
      );
  });

  return forkJoin(requests).pipe(map(() => portfolioValue));
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
    let holding = currentHoldings.find(h => h.stock.id === stock.id);
    if (holding) {
      holding.quantity += quantity;
    } else {
      currentHoldings.push({stock: stock, quantity: quantity});
    }
    this.holdings$.next(currentHoldings);
  }

  private removeHolding(stock: Stock, quantity: number) {
    let currentHoldings = this.holdings$.value;
    let holding = currentHoldings.find(h => h.stock.id === stock.id);
    if (holding) {
      holding.quantity -= quantity;
      if (holding.quantity <= 0) {
        currentHoldings = currentHoldings.filter(h => h.stock.id !== stock.id);
      }
    }
    this.holdings$.next(currentHoldings);
  }
}
