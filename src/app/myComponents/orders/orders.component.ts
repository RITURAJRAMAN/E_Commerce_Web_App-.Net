import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { OrderItem } from 'src/app/myInterface/order-item';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orderItems: any = [];
  token: any;
  email: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    let decoded: any = jwtDecode<JwtPayload>(this.token);
    this.email = decoded.Email;
    this.getOrderList();
  }

  getOrderList() {
    this.http
      .get('https://localhost:7093/api/Orders')
      .subscribe((resultdata: any) => {
        this.orderItems = resultdata.filter(
          (item: any) => item.username === this.email
        );
        // console.log(resultdata);
      });
  }
}
