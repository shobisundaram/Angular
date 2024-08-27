import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from "moment";
import { ServerDataSource } from 'ng2-smart-table';
import { environment, featuresSettings } from '../../../../environments/environment';
import { CustomFilterComponent } from '../../custom-filter/custom-filter.component';
import { DataService } from '../../data.service';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { PagestateService } from '../../pagestate.service';
@Component({
  selector: 'ngx-view-translation',
  templateUrl: './view-translation.component.html',
  styleUrls: ['./view-translation.component.scss']
})
export class ViewTranslationComponent implements OnInit {
  pageNum: any = 1;
  currentPage: any;
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
      interpret: {
        title: this.translateService.instant("TRANSLATION.INTERPRET"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      "group.interpret":  {
        title: this.translateService.instant("TRANSLATION.GROPUINTERPRET"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
        valuePrepareFunction: (cell, row) => {
            return row.group ? row.group.interpret : "---";
        },
      }
    },
  };
  source: ServerDataSource;
  ng2SmartTableFilterParams: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private translateService: TranslateService,
    private pageStateService: PagestateService,
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
      endPoint: environment.API_ENDPOINT + "module/translation",
      dataKey: "data.translations",
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
  onEdit(event){
    this.router.navigate([
      "admin/translation/add-edit-translation",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }
  onAdd(event){
    // this.router.navigateByUrl("admin/translation/add-edit-translation");
    // this.dataService.setNewRowInfo({});
  }
}
