import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-allorders',
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.css'],
})
export class AllordersComponent implements OnInit {
  orderItems: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getOrderList();
  }

  getOrderList() {
    this.http
      .get('https://localhost:7093/api/Orders')
      .subscribe((resultdata: any) => {
        this.orderItems = resultdata;
        console.log(resultdata);
      });
  }
  calculateTotal(): number {
    let total = 0;
    for (const item of this.orderItems) {
      total += item.price * item.quantity;
    }
    return total;
  }
}
