import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Location } from "@angular/common";
@Component({
  selector: "ngx-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm = this.fb.group({
    email: [
      "",
      [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
      ],
    ],
  });
  translate: "COMMON.GoBack";
  // location: any;

  constructor(public fb: FormBuilder, private location: Location,) { }
  goBackBtn() {
    this.location.back();
  }

  ngOnInit(): void {

  }

  requestPassword() {
    if (this.forgetPasswordForm.valid) {
    }
  }
}
