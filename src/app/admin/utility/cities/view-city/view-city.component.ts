import { HttpClient } from "@angular/common/http";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServerDataSource } from "ng2-smart-table";
import {
  CommonData,
  environment,
  featuresSettings,
} from "../../../../../environments/environment";
import { DataService } from "../../../data.service";
import { TranslateService } from "@ngx-translate/core";
import { NgSelectComponent } from "../../../ng-select/ng-select.component";
import { CustomFilterComponent } from "../../../custom-filter/custom-filter.component";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { ApiService } from "../../../api.service";
import { PagestateService } from "../../../pagestate.service";

@Component({
  selector: "ngx-view-city",
  templateUrl: "./view-city.component.html",
  styleUrls: ["./view-city.component.scss"],
})
export class ViewCityComponent implements OnInit {
  @ViewChild("ImportDialog") ImportDialog: TemplateRef<any>;
  ImportDialogClose:  import("@nebular/theme").NbDialogRef<any>;
  pageNum: any = 1;
  currentPage: number;

  settings = {
    pager: {
      display: true,
      perPage: 10,
      page: this.pageNum,
    },
    mode: "external",

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="fa fa-edit table-edit-icon"></i>',
    },
    actions: { delete: false },
    columns: {
      name: {
        title: this.translateService.instant("CITY.CITYNAME"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      code: {
        title: this.translateService.instant("CITY.CITYCODE"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      status: {
        title: this.translateService.instant("COMMON.STATUS"),
        valuePrepareFunction: (status) => {
          return status == true ? "Active" : "In Active";
        },
        filter: {
          type: "custom",
          component: NgSelectComponent,
          config: {
            options: CommonData.activeInactive
          }
        },
      },
    },
  };
  baseurl = environment.BASEURL;
  source: ServerDataSource;
  FileuploadForm: FormGroup;
  files: any;
  constructor(
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
    private translateService: TranslateService,
    private dialogService: NbDialogService,
    private pageStateService: PagestateService,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private ActivatedRoute: ActivatedRoute
  ) {
    Object.keys(this.settings.columns).forEach(key => {
      this.settings.columns[key].sort = featuresSettings.TableSort;
    });
  }

  ngOnInit(): void {
    this.pageNum = +this.ActivatedRoute.snapshot.queryParamMap.get('page') || this.pageStateService.getPage();
    this.initialTableDataRender();
    this.initializeForm();
    // this.dataService.setNg2SmartTableFilterOption(CommonData.activeInactive);
  }
  get file() {
    return this.FileuploadForm.get("file");
  }
  initializeForm(): void {
    this.FileuploadForm = new FormGroup({
      file: new FormControl(null, [Validators.required,  this.validateFileType.bind(this)]) // Option 1
    });
  }

  validateFileType(control: FormControl)  {
    const file: File = control.value; // Get the file object from the form control
    console.log(file)
    if (file && file.type !== 'text/csv') {
      return { invalidFileType: true };
    }
    return null;
  }
  initialTableDataRender(): void {
    this.settings.pager.page = this.pageNum;

    this.source = new ServerDataSource(this.http, {
      endPoint: environment.API_ENDPOINT + "common/city",
      dataKey: "data.cities",
      pagerPageKey: "page",
      pagerLimitKey: "limit",
      totalKey: "data.total",
      filterFieldKey: "#field#",
    });
    this.source.setPage(this.pageNum, false);
    if (this.ActivatedRoute.snapshot.queryParams.filter) {
      this.source.setFilter(
        JSON.parse(this.ActivatedRoute.snapshot.queryParams.filter),
        true,
        false
      );
    }
    this.pageStateService.serverSource = this.source;
    this.source.onChanged().subscribe((change) => {
      this.pageStateService.handlePageChange(change, this.ActivatedRoute);
    });
  }


  onAdd(event: Event) {
    this.router.navigateByUrl("admin/utility/add-edit-city");
    this.dataService.setNewRowInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "admin/utility/add-edit-city",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }
  importFile(){
    this.ImportDialogClose = this.dialogService.open(this.ImportDialog, {
      autoFocus: false,
      dialogClass: 'nb-dialog-lg',
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }
  onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files[0];
    this.files = files;
    console.log(this.files)
    this.FileuploadForm.get('file').setValue(this.files);
    this.FileuploadForm.get('file').markAsTouched();
  }
  fileEvent(file: any) {
    this.files = file[0];
    this.FileuploadForm.get('file').setValue(this.files);
    this.FileuploadForm.get('file').markAsTouched();
  }

  updateRecord() {
    const formData = new FormData();
    if (this.FileuploadForm.value.file) {
      formData.append("file", this.files); // Use `this.files` to append the actual file
    }
    this.apiservice.CommonPostApi(formData, "/common/import/cities")
      .subscribe({
        next: (res) => {
          const data = res.data;
          this.toasterService.success(res.type, data.message);
          this.ImportDialogClose.close()
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        }
      });
  }
  onClose() {
    this.FileuploadForm.reset();
    this.files = null; // Optionally clear the displayed file name as well
    this.ImportDialogClose.close();
  }
}
