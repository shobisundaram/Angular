import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { CompanyapiService } from '../../company/companyapi.service';

@Component({
  selector: 'ngx-company-login',
  templateUrl: './company-login.component.html',
  styleUrls: ['./company-login.component.scss']
})
export class CompanyLoginComponent implements OnInit {

  // demoEmail = featuresSettings.demoEmail
  // demoPassword = featuresSettings.demoPassword
  loginStatus: any;
  loginStatusMessage: any;
  loginForm = this.fb.group({
    email: [
      "",
      [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
      ],
    ],
    password: ["", [Validators.required]],
  });
  getConfigValue: any;
  showMessages: any;
  errors: any;
  submitted: any;
  messages: any;
  user: any;
  rememberMe: any;
  socialLinks: any;
  form: any;
  constructor(
    public fb: FormBuilder,
    private _service: CompanyapiService,
    private router: Router
  ) { }

  ngOnInit(): void { }
  login() {
    if (this.loginForm.valid) {
      // this._auth.login(this.loginForm.value);
      this._service
        .CommonLoginPostApi(this.loginForm.value, "common/login/admin")
        .subscribe({
          next: (res) => {
            if (res.type == "success") {
              console.log(res.type,"=========================")
              localStorage.setItem(
                "AdminDetails",
                JSON.stringify(res.data.admin)
              );
              localStorage.setItem("token", res.data.token);
              this.loginStatus = res.type;
              this.loginStatusMessage = res.message;
              timer(1000).subscribe((res) => {
                this.router.navigate(["/company/dashboard"]);
              });
              // setTimeout(() => {
              //   this.router.navigate(["/admin/dashboard"]);
              // }, 5000);
            }
          },
          error: (error) => {
            this.loginStatus = error.error.type;
            this.loginStatusMessage = error.error.message;
          },
        });
    }
  }
}
