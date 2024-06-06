import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {CartstateService} from 'src/app/myServices/state/cartstate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  ProductArray: any = [];
  ifresult: boolean = false;
  token: any;
  email: any;
  searchTerm: any;
  mensArray: any[] = [];
  womensArray: any[] = [];
  kidsArray: any[] = [];
  showsearch: boolean = false;
  filteredArray: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartState: CartstateService
  ) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token !== null) {
      let decoded: any = jwtDecode<JwtPayload>(this.token);
      this.email = decoded.Email;
    }
    this.getProductsWithCart();
    // this.getproduct();
  }

  getProductsWithCart() {
    this.http
      .get('https://localhost:7093/api/Products')
      .subscribe((resultdata: any) => {
        this.ProductArray = resultdata;
        this.mensArray = this.ProductArray.filter((product: any) => {
          return product.category == 'men';
        });
        this.womensArray = this.ProductArray.filter((product: any) => {
          return product.category == 'women';
        });
        this.kidsArray = this.ProductArray.filter((product: any) => {
          return product.category == 'Kids';
        });
        if (this.ProductArray.length > 0) {
          this.ifresult = true;
        }

        this.http
          .get('https://localhost:7093/api/Carts')
          .subscribe((resultCart: any) => {
            for (
              let product = 0;
              product < this.ProductArray.length;
              product++
            ) {
              resultCart.forEach((cart: any) => {
                if (
                  cart.cartId == this.ProductArray[product].id &&
                  this.email == cart.username
                ) {
                  this.ProductArray[product].addedtocart = true;
                }
              });
            }
          });
      });
  }

  getproduct() {
    this.http
      .get('https://localhost:7093/api/Products')
      .subscribe((resultdata: any) => {
        this.ProductArray = resultdata;
        this.ifresult = true;
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

  buyed(product: any) {
    let ordered: any = {
      username: this.email,
      product: product.product,
      quantity: 1,
      price: product.price,
      imageurl: product.imageurl,
    };
    this.http
      .post('https://localhost:7093/api/Orders', ordered)
      .subscribe(() => {
        alert('Order Placed!');
        this.router.navigateByUrl('/order');
      });
  }

  searchProduct() {
    this.showsearch = true;
    if (this.searchTerm == '') {
      this.showsearch = false;
      this.getproduct();
      return;
    } else {
      this.filteredArray = this.ProductArray.filter((product: any) => {
        return (
          product.product
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        );
      });
    }
  }
}
