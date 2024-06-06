import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { AuthStateService } from 'src/app/myServices/state/auth-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  token: any;
  loginstat: boolean = false;
  UserArray: any = [];
  email: any;
  edits = true;

  constructor(
    private http: HttpClient,
    private authState: AuthStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authState.currAuthState.subscribe((state) => (this.loginstat = state));
    this.token = localStorage.getItem('token');
    let decoded: any = jwtDecode<JwtPayload>(this.token);
    this.email = decoded.Email;
    if (this.token != null) {
      this.authState.changeAuthState(true);
    }
    this.getprofile();
  }

  getprofile() {
    this.http
      .get(`https://localhost:7093/api/Users/${this.email}`)
      .subscribe((resultdata: any) => {
        this.UserArray = resultdata;
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.authState.changeAuthState(false);
    this.router.navigateByUrl('');
  }

  editprofile() {
    this.edits = !this.edits;
  }

  saveprofile() {
    this.http
      .put(
        `https://localhost:7093/api/Users?id=${this.UserArray.id}`,
        this.UserArray
      )
      .subscribe((resultdata: any) => {
        this.UserArray = resultdata;
        console.log(resultdata);
      });
    this.editprofile();
    window.location.reload();
  }
}
