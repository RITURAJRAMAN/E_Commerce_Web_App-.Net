// import {HttpClient} from '@angular/common/http';
// import {Component, OnInit} from '@angular/core';
// import {FormControl, Validators} from '@angular/forms';
// import {Router} from '@angular/router';
//
// @Component({
//   selector: 'app-signup',
//   templateUrl: './signup.component.html',
//   styleUrls: ['./signup.component.css'],
// })
// export class SignupComponent implements OnInit {
//
//   username = new FormControl('', Validators.required);
//   email = new FormControl('', [
//     Validators.required,
//     Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
//     Validators.email,
//   ]);
//   phone = new FormControl('', Validators.required);
//   age = new FormControl('', Validators.required);
//   role: string = 'user';
//   password = new FormControl('', [
//     Validators.required,
//     Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{5,}'),
//   ]);
//
//   constructor(private http: HttpClient, private router: Router) {
//   }
//
//   ngOnInit(): void {
//   }
//
//   adduser() {
//     let bodyData = {
//       userName: this.username,
//       password: this.password,
//       email: this.email,
//       phone: this.phone,
//       role: this.role,
//       age: this.age,
//     };
//     console.log(bodyData);
//     this.http
//       .post('https://localhost:7093/api/Users', bodyData)
//       .subscribe((resultData: any) => {
//         console.log(resultData);
//         alert('SignUp Successfull!');
//         this.router.navigateByUrl('/login');
//       });
//   }
// }


import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup | any;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      phone: ['', Validators.required],
      age: ['', Validators.required],
      role: ['user'],  // the role is set as the default value
      password: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{5,}')
      ]]
    });
  }

  addUser() {
    if (this.signupForm.valid) {
      const bodyData = this.signupForm.value;
      console.log(bodyData);
      this.http
        .post('https://localhost:7093/api/Users', bodyData)
        .subscribe((resultData: any) => {
          console.log(resultData);
          alert('SignUp Successfull!');
          this.router.navigateByUrl('/login').then(() => console.log('Navigated to login page'));
        });
    } else {
      console.log('Form data is not valid');
    }
  }
}
