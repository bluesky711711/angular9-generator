import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/api/service/payment.service';
import { GeneratorService } from 'src/api/service/generator.service';
import { Payment } from '../../api/model/payment';
import { Generator } from '../../api/model/generator';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  paymentList: Payment[] = [];
  payment_name: string = '';
  payment_amount: number = 0;

  generator: Generator;

  constructor(
    private paymentService: PaymentService,
    private generatorService: GeneratorService
  ) {
  }

  ngOnInit(): void {
    this.getPayments();
    this.getGenerator();
  }

  getPayments() {
    this.paymentService.getPaymants().subscribe(data => this.paymentList = data);
  }

  getGenerator() {
    this.generatorService.getGeneratorData().subscribe(data => {
      this.generator = data;
    });
  }

  addPayment() {
    this.paymentService.addPayment({
      name: this.payment_name,
      amount: this.payment_amount,
      code: this.generator.code,
      grid: 64
    });
  }

}
