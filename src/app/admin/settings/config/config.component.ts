import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "ngx-config",
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.scss"],
})
export class ConfigComponent implements OnInit {
  baseurl = environment.BASEURL;
  dropdownSettings = {
    singleSelection: false,
    idField: "scId",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  constructor(public translate: TranslateService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
