import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServerDataSource } from 'ng2-smart-table';
import * as moment from "moment";
import { environment, featuresSettings } from '../../../../environments/environment';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { NbToastrService } from '@nebular/theme';
import { CustomFilterComponent } from '../../custom-filter/custom-filter.component';
import { PagestateService } from '../../pagestate.service';

@Component({
  selector: 'ngx-partner-settlement',
  templateUrl: './partner-settlement.component.html',
  styleUrls: ['./partner-settlement.component.scss']
})
export class PartnerSettlementComponent implements OnInit {
  pageNum: any = 1;
  selecteduserType: any = 'CUSTOMER';
  driverSettlementForm: FormGroup;
  paymentTypeDropDownData: any[] = featuresSettings.paymentType;
  source: ServerDataSource;
  source1: ServerDataSource;
  userType = [
    {
      label: 'Customer',
      value: 'CUSTOMER'
    },
    {
      label: 'Partner',
      value: 'PARTNER'
    }
  ]
  settings = {
    pager: {
      display: true,
      perPage: 10,
      page: this.pageNum,
    },
    mode: "external",

    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    // },
    edit: {
      editButtonContent: '<i class="fa fa-edit table-edit-icon"></i>',
    },
    actions: { add: false,delete: false },
    columns: {
      child: {
        title: this.translateService.instant("SETTLEMENT.VIEWTRANSACTION"),
        type: "html",
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, row) => {
          return `<a title="Partner Transaction">
                  <i class="table-edit-icon ion-clipboard"></i></a>`;
        },
        // valuePrepareFunction: (cell, row) => {
        //   return `<a title="Partner Transaction" href="admin/settlement/view-transaction;id=${row._id}">
        //           <i class="table-edit-icon ion-clipboard"></i></a>`;
        // },
      },
      "userData.uniCode":  {
        title: this.translateService.instant("SETTLEMENT.CODE"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
        valuePrepareFunction: (cell, row) => {
            return row.userData ? row.userData.uniCode : "---";
        },
      },
      balance: {
        title: this.translateService.instant("SETTLEMENT.BALANCE"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
        valuePrepareFunction: (balance) => {
          return balance.toFixed(2);
        }
      },
      updatedAt:{
        title: this.translateService.instant("SETTLEMENT.UPDATEDAT"),
        valuePrepareFunction: (lastUpdate) => {
          //return lastUpdate;
          if (lastUpdate) {
            return moment(lastUpdate).format(
              featuresSettings.DateFormatWithTime
            );
          } else return "";
        },
        filter: {
          type: "custom",
          component: DatePickerComponent,
        },
      }
    },
  };
  settings1 = {
    pager: {
      display: true,
      perPage: 10,
    },
    actions: {
      edit: false,
      add: false,
      delete: false,
    },
    columns: {
      transactionDate: {
        title: this.translateService.instant("SETTLEMENT.PAYMENTDATE"),
        valuePrepareFunction: (createdAt) => {
          //return createdAt;
          if (createdAt) {
            return moment(createdAt).format(
              featuresSettings.DateFormatWithTime
            );
          } else return "";
        },
        filter: {
          type: "custom",
          component: DatePickerComponent,
        },
      },
      transactionType:{
        title: this.translateService.instant("SETTLEMENT.TRANSACTIONTYPE"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      amount:{
        title: this.translateService.instant("SETTLEMENT.AMOUNT"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      balance: {
        title: this.translateService.instant("SETTLEMENT.BALANCE"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
        valuePrepareFunction: (balance) => {
          return balance.toFixed(2);
        }
      },
      createdAt: {
        title: this.translateService.instant("LANGUAGE.CREATEDAT"),
        valuePrepareFunction: (createdAt) => {
          //return createdAt;
          if (createdAt) {
            return moment(createdAt).format(
              featuresSettings.DateFormatWithTime
            );
          } else return "";
        },
        filter: {
          type: "custom",
          component: DatePickerComponent,
        },
      },
      updatedAt:{
        title: this.translateService.instant("SETTLEMENT.UPDATEDAT"),
        valuePrepareFunction: (lastUpdate) => {
          //return lastUpdate;
          if (lastUpdate) {
            return moment(lastUpdate).format(
              featuresSettings.DateFormatWithTime
            );
          } else return "";
        },
        filter: {
          type: "custom",
          component: DatePickerComponent,
        },
      }
    },
  };
  ng2SmartTableFilterParams: any;
  initial = 0;
  packageFor: any;
  partnerCode: any;
  partnerTransactionDetails: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private translateService: TranslateService,
    private _service: ApiService,
    private pageStateService: PagestateService,
    private toasterService: NbToastrService,
    private ActivatedRoute: ActivatedRoute,
  ) {
    Object.keys(this.settings.columns).forEach(key => {
      this.settings.columns[key].sort = featuresSettings.TableSort;
    });
    Object.keys(this.settings1.columns).forEach(key => {
      this.settings1.columns[key].sort = featuresSettings.TableSort;
    });
   }

  ngOnInit(): void {
    this.initializeDriverSettlementForm()
    this.pageNum = +this.ActivatedRoute.snapshot.queryParamMap.get('page') || this.pageStateService.getPage();
    this.initialTableDataRender()
    this.source.onChanged().subscribe((change) => {
      this.pageStateService.handlePageChange(change, this.ActivatedRoute);
    });
    if (this.driverSettlementForm.value.id == "" || undefined) {
      this.autoGenerateCode();
    }
  }
  autoGenerateCode(): void {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.driverSettlementForm.patchValue({
      generateCode: text,
    });
  }

  initialTableDataRender(): void{

  this.settings.pager.page = this.pageNum;
  this.source = new ServerDataSource(this.http, {
    endPoint: environment.API_ENDPOINT + `module/payment/merchant?userType=${this.selecteduserType}`,
    dataKey: "data.transaction",
    pagerPageKey: "page",
    pagerLimitKey: "limit",
    totalKey: "data.total",
    filterFieldKey: "#field#",
  });
}
  get generateCode() {
    return this.driverSettlementForm.get("generateCode");
  }
  get indexName() {
    return this.driverSettlementForm.get("trxId");
  }
  get name() {
    return this.driverSettlementForm.get("name");
  }
  get file() {
    return this.driverSettlementForm.get("amount");
  }
  get status() {
    return this.driverSettlementForm.get("paymentDate");
  }
  initializeDriverSettlementForm() {
    this.driverSettlementForm = new FormGroup({
      id: new FormControl(""),
      generateCode: new FormControl("", Validators.required),
      partnerId: new FormControl(null, Validators.required),
      userId:new FormControl(null, Validators.required),
      userType: new FormControl(null, Validators.required),
      // package: new FormControl(null, Validators.required),
      name: new FormControl(""),
      paymentType: new FormControl(null, Validators.required),
      transactionId: new FormControl(""),
      trxId: new FormControl(""),
      amount: new FormControl(0),
      paymentDate: new FormControl(""),
      description: new FormControl("")
      // credits: new FormControl(0),
      // limit: new FormControl(0),
      // purchaseDate: new FormControl("", Validators.required),
      // start_date: new FormControl(""),
      // endDate: new FormControl(""),
      // status: new FormControl(""),
      // serviceArea: new FormControl(""),
    });
  }
  onEdit(event,data,packageFor){
    console.log(event)
    this.packageFor = packageFor;
    this.initialValueChange(data);
    this.driverSettlementForm.patchValue({
      partnerId: event._id,
      userId : event.userId,
      userType: event.userType,
      name:  event.userData.fname
    });
    console.log(event)
    this.partnerCode = event.userData.uniCode;
  }
  onAdd(event,data,packageFor){
    this.packageFor = packageFor;
    this.initialValueChange(data);
  }
  onRowSelect(event) {
    console.log(event)
    this.partnerTransactionDetails = event.data.userData
    this.initialTableDataRender1(event);
  }
  initialTableDataRender1(event): void {
    this.initialValueChange(2);
    this.source1 = new ServerDataSource(this.http, {
      endPoint:
        environment.API_ENDPOINT +
        "module/payment/transactions/" +
        event.data._id,
      dataKey: "data.transaction",
      pagerPageKey: "page",
      pagerLimitKey: "limit",
      totalKey: "data.total",
      filterFieldKey: "#field#",
    });
  }

  initialValueChange(data) {
    this.initializeDriverSettlementForm();
    this.initial = data;
    this.settings.pager.page = this.pageNum;
  }
  addTransaction(){
    const payload = {
      referenceId : this.driverSettlementForm.value.generateCode,
      module: "TRIP",
      userId: this.driverSettlementForm.value.userId,
      userType: this.driverSettlementForm.value.userType?this.driverSettlementForm.value.userType: "PARTNER",
      description: this.driverSettlementForm.value.description,
      mode: this.driverSettlementForm.value.paymentType,
      amount: this.driverSettlementForm.value.amount
    }
    console.log(payload)
    this._service.CommonPostApi(payload,"module/payment/merchantTransaction")
    .subscribe({
      next: (res) => {
        this.toasterService.success(res.type, res.data.message);
        this.initialValueChange(0)
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    })
  }
  changeUserType(data){
    console.log(data)
    this.selecteduserType = data;
    this.initialTableDataRender();
  }
}
