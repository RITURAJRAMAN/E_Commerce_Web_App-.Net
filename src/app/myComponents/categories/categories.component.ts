import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartstateService } from 'src/app/myServices/state/cartstate.service';
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  buyed(product: any) {
    let ordered: any = {
      username: this.email,
      product: product.product,
      quantity: 1,
      price: product.price,
      imageurl: product.imageurl,
    };
    // console.log(ordered);
    this.http
      .post('https://localhost:7093/api/Orders', ordered)
      .subscribe(() => {
        alert('Order Placed!');
        this.router.navigateByUrl('/order');
      });
  }
  addtocart(item: any) {
    let product: any = {
      username: this.email,
      product: item.product,
      quantity: 1,
      price: item.price,
      imageurl: item.imageurl,
      cartId: item.id,
    };
    if (this.token) {
      this.http
        .post('https://localhost:7093/api/Carts', product)
        .subscribe(() => {
          alert('Product added to cart');
          this.cartState.increaseCartSize();
        });
    } else {
      alert('You are not logged in!');
      this.router.navigateByUrl('/login');
    }
    this.getProductsWithCart();
  }
  cname: any;
  catdata: any[] = [];
  token: any;
  email: any;
  constructor(
    private ar: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cartState: CartstateService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token !== null) {
      let decoded: any = jwtDecode<JwtPayload>(this.token);
      this.email = decoded.Email;
    }
    this.ar.paramMap.subscribe((par) => {
      this.cname = par.get('cname');
      this.http
        .get('https://localhost:7093/api/Products')
        .subscribe((resultdata: any) => {
          this.catdata = resultdata.filter(
            (pro: any) => pro.category == this.cname
          );
          this.getProductsWithCart();
        });
    });
  }

  getProductsWithCart() {
    this.http
      .get('https://localhost:7093/api/Products')
      .subscribe((resultdata: any) => {
        this.catdata = resultdata;
        this.catdata = resultdata.filter(
          (pro: any) => pro.category == this.cname
        );
        this.http
          .get('https://localhost:7093/api/Carts')
          .subscribe((resultCart: any) => {
            for (let product = 0; product < this.catdata.length; product++) {
              resultCart.forEach((cart: any) => {
                if (
                  cart.cartId == this.catdata[product].id &&
                  this.email == cart.username
                ) {
                  this.catdata[product].addedtocart = true;
                }
              });
            }
          });
      });
  }
}
