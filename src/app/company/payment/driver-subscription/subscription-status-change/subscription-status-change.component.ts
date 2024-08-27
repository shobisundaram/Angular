import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

import { NbToastrService } from "@nebular/theme";
import { CompanyapiService } from "../../../companyapi.service";

@Component({
  selector: "ngx-subscription-status-change",
  templateUrl: "./subscription-status-change.component.html",
  styleUrls: ["./subscription-status-change.component.scss"],
})
export class SubscriptionStatusChangeComponent implements OnInit {
  @Input() value: any;
  @Input() rowData: any;

  checkActiveOption: boolean = false;
  checkDeactiveOption: boolean = false;
  notAvailableOption: boolean = false;

  @Output() emitBack = new EventEmitter();

  constructor(
    private apiservice: CompanyapiService,
    private toasterService: NbToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.rowData.status)
    if(this.rowData.type == 'SUBSCRIPTION'){
      if (this.rowData.status === "INACTIVE") {
        this.notAvailableOption = true;
      } else if (this.rowData.status === "ACTIVE") {
        this.checkDeactiveOption = true;
          // this.notAvailableOption = true;
      } else if (
        this.rowData.status === "PENDING"
      ) {
        // this.notAvailableOption = true;
        this.checkActiveOption = true;
        // this.checkDeactiveOption = true;
      }
    }else{
      this.notAvailableOption = true;
    }

    // if (this.rowData.status === "Inactivated") {
    //   this.checkActiveOption = true;
    // } else if (this.rowData.status === "Activated") {
    //   this.checkDeactiveOption = true;
    // } else if (
    //   this.rowData.status === "Expired" ||
    //   this.rowData.status === "Deactivated"
    // ) {
    //   this.notAvailableOption = true;
    // }
  }

  activeDeactivateCall(status) {
    const payload = {
      status: status,
    };
    this.apiservice
      .CommonPutApi(
        "module/subscription/purchasePackage/" + this.rowData._id,
        payload
      )
      .subscribe({
        next: (res) => {
          const data = res.data;
          this.toasterService.success(res.type, data.message);
          this.emitBack.emit();
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }
}
