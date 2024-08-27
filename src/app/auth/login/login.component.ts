import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NbAuthService } from "@nebular/auth";
import { timer } from "rxjs";
import { AuthService } from "../../../app/auth.service";
import { environment, featuresSettings } from "../../../environments/environment";
import { ApiService } from "../../admin/api.service";
import { DataService } from "../../admin/data.service";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  // providers: [AuthService],
})
export class LoginComponent implements OnInit {
  isdownload = featuresSettings.isdownload
  // Rider_App_Link = environment.rider_App_link;
  // Rider_Android_Link = environment.rider_Android_link;
  // Driver_App_Link = environment.driver_App_link;
  // Driver_Android_Link = environment.driver_Android_link
  demoEmail = featuresSettings.demoEmail
  demoPassword = featuresSettings.demoPassword
  loginStatus: any;
  loginStatusMessage: any;
  loginForm = this.fb.group({
    email: [
      this.demoEmail,
      [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
      ],
    ],
    password: [this.demoPassword, [Validators.required]],
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
  activeTab: any = 'driver';
  item: any;
  link = "productLinks";
  constructor(
    public fb: FormBuilder,
    private nbauthservice: NbAuthService,
    private _service: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getLink()
  }

  login() {
    if (this.loginForm.valid) {
      // this._auth.login(this.loginForm.value);
      this._service
        .CommonLoginPostApi(this.loginForm.value, "common/login/admin")
        .subscribe({
          next: (res) => {
            if (res.type == "success") {
              console.log(res.type, "=========================")
              localStorage.setItem(
                "AdminDetails",
                JSON.stringify(res.data.admin)
              );
              localStorage.setItem("token", res.data.token);
              this.loginStatus = res.type;
              this.loginStatusMessage = res.message;
              timer(500).subscribe((res) => {
                this.router.navigate(["/admin/dashboard"]);
              });
            }
          },
          error: (error) => {
            this.loginStatus = error.error.type;
            this.loginStatusMessage = error.error.message;
          },
        });
    }
  }

  getLink() {
    this._service.CommonGetApi("common/configuration/public?required[]=" + this.link)
      .subscribe(data => {
        this.item = data.data
        console.log(this.item, "dataa")
      })
  }

  downloadsection(value: any) {
    this.activeTab = value
  }
}
