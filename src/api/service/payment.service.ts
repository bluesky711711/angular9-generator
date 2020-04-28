import { Injectable } from "@angular/core";
import { Payment } from '../model/payment';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  payments: Payment[] = [];

  addPayment(payment: Payment) {
    this.payments.push(payment);
  }

  getPaymants(): Observable<Payment[]> {
    return of(this.payments);
  }
}
