import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "ngx-firebase-settings",
  templateUrl: "./firebase-settings.component.html",
  styleUrls: ["./firebase-settings.component.scss"],
})
export class FirebaseSettingsComponent implements OnInit {
  baseurl = environment.BASEURL;
  firebaseSettingsForm: FormGroup;
  constructor(private location: Location, public translate: TranslateService) {}

  ngOnInit(): void {
    this.initializeFirebaseSettingsForm();
  }

  initializeFirebaseSettingsForm() {
    this.firebaseSettingsForm = new FormGroup({
      project_id: new FormControl(""),
      default_app_name: new FormControl(""),
      auth_domain: new FormControl(""),
      database_url: new FormControl(""),
      storage_bucket: new FormControl(""),
      fcm_server: new FormControl(""),
      google_api_key: new FormControl(""),
    });
  }

  goBackBtn() {
    this.location.back();
  }
}
