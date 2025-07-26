import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { TransactionData, TransactionFormData, TransactionsPaginatedData } from './transaction.data';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private httpClient = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/user/transactions`;

  getTransactions(page: number): Observable<TransactionsPaginatedData> {
    return this.httpClient.get<TransactionsPaginatedData>(`${this.apiUrl}?page=${page}`);
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
