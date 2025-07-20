import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { TransactionData, TransactionFormData } from './transaction.data';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private httpClient = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/v1/user/transactions`;

  getTransactions(): Observable<TransactionData[]> {
    return this.httpClient.get<TransactionData[]>(`${this.apiUrl}`);
  }

  createTransaction(data: TransactionFormData): Observable<TransactionData> {
    return this.httpClient.post<TransactionData>(`${this.apiUrl}`, data);
  }

  updateTransaction(id: number, data: TransactionFormData): Observable<TransactionData> {
    return this.httpClient.put<TransactionData>(`${this.apiUrl}/${id}`, data);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
