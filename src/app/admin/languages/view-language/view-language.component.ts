import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import * as moment from "moment";
import { environment, featuresSettings } from '../../../../environments/environment';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../data.service';
import { CustomFilterComponent } from '../../custom-filter/custom-filter.component';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../api.service';
import { PagestateService } from '../../pagestate.service';

@Component({
  selector: 'ngx-view-language',
  templateUrl: './view-language.component.html',
  styleUrls: ['./view-language.component.scss']
})
export class ViewLanguageComponent implements OnInit {
  pageNum: any = 1;
  currentPage: any;
  @ViewChild("ReloadDialog") ReloadDialog: TemplateRef<any>;
  ReloadDialogClose:  import("@nebular/theme").NbDialogRef<any>;
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
        title: this.translateService.instant("LANGUAGE.NAME"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      status: {
        title: this.translateService.instant("LANGUAGE.STATUS"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
        valuePrepareFunction: (status) => {
          return status == true ? "Active" : "In Active";
        },
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
      updatedAt: {
        title: this.translateService.instant("LANGUAGE.UPDATEDAT"),
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
      },
      file: {
        title: this.translateService.instant("LANGUAGE.FILE"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
        type: "html",
        valuePrepareFunction: (file)=>{
          return `<a href="${file}" download="${file}">${file}</a>`;
        }
      }
    },
  };
  source: ServerDataSource;
  ng2SmartTableFilterParams: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private dataService: DataService,
    private pageStateService: PagestateService,
    private translateService: TranslateService,
    private dialogService: NbDialogService,
    private ActivatedRoute: ActivatedRoute,
  ) {
    Object.keys(this.settings.columns).forEach(key => {
      this.settings.columns[key].sort = featuresSettings.TableSort;
    });
  }

  ngOnInit(): void {
    this.pageNum =
      +this.ActivatedRoute.snapshot.queryParamMap.get("page") ||
      this.pageStateService.getPage();
    this.initialTableDataRender();
  }
  initialTableDataRender(): void {
    this.settings.pager.page = this.pageNum;

    this.source = new ServerDataSource(this.http, {
      endPoint: environment.API_ENDPOINT + "module/translation/language",
      dataKey: "data.language",
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
  onEdit(event) {
    this.router.navigate([
      "admin/languages/add-edit-language",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }
  onAdd(event) {
    this.router.navigateByUrl("admin/languages/add-edit-language");
    this.dataService.setNewRowInfo({});
  }
  generatejson(){
    this.apiservice
    .CommonPostApi('',"module/translation/transcribe/generate")
    .subscribe({
      next: (res) => {
        console.log(res)
        this.toasterService.success(res.data.message);
        this.ReloadDialogClose = this.dialogService.open(this.ReloadDialog, {
          autoFocus: false,
          dialogClass: 'nb-dialog-lg',
          closeOnBackdropClick:
            featuresSettings.Nb_dialogbox_close_while_click_outside,
        });
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    })
  }
  Reload(){
    window.location.reload()
  }
}
