import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  constructor(private http: HttpClient) {}

  product: any;
  quantity: any;
  price: any;
  category: any;
  imageurl: any;
  description: any;

  ngOnInit(): void {}

  addproduct() {
    let bodyData = {
      product: this.product,
      quantity: this.quantity,
      price: this.price,
      category: this.category,
      imageurl: this.imageurl,
      description: this.description,
    };

    this.http
      .post('https://localhost:7093/api/Products', bodyData)
      .subscribe(() => {
        // alert('Product Added!');
      });
    this.product = '';
    this.quantity = null;
    this.price = null;
    this.category = '';
    this.imageurl = '';
    this.description = '';
  }
}
