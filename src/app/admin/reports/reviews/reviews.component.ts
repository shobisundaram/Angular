import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServerDataSource } from 'ng2-smart-table';
import { featuresSettings } from '../../../../environments/environment';
import { CustomFilterComponent } from '../../custom-filter/custom-filter.component';
import { TableService } from '../../table.service';
import { PagestateService } from '../../pagestate.service';

@Component({
  selector: 'ngx-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  currentPage: any;
  pageNum: any = 1;
  source: ServerDataSource;
  selecteduserType: any = 'CUSTOMER';
  selectedreportType: any = 'GIVEN';
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
  reportType = [
    {
      label: 'Given',
      value: 'GIVEN'
    },
    {
      label: 'Get',
      value: 'GET'
    }
  ]
  settings = {
    actions: { add: false,edit:false, delete: false },
    pager: {
      display: true,
      perPage: 10,
      page: this.pageNum,
    },
    columns: {
      referenceNo:{
        title: this.translateService.instant("COMMON.REFERENCE_NO"),
        type: 'html',
        valuePrepareFunction: (cell,row) => {
          console.log(row)
          let id = row._id
          return `<a href="admin/trips/invoice-details;id=${id};page=${this.settings.pager.page};newTab=true" target="_blank">${row.referenceNo}</a>`; 
        },
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      code:{
        title: this.translateService.instant("COMMON.CODE"),
        type: 'html',
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
        valuePrepareFunction: (cell,row) => {
          console.log(row)
          let id = row.id
          if(this.selecteduserType == 'CUSTOMER'){
            return `<a href="admin/customer/add-edit-customer;id=${id};page=${this.settings.pager.page};newTab=true" target="_blank">${row.code}</a>`; 
          }else{
            return `<a href="admin/partner/add-edit-partner;id=${id};page=${this.settings.pager.page};newTab=true" target="_blank">${row.code}</a>`; 
          }
        },
      },
      rating:{
        title: this.translateService.instant("COMMON.RATINGS"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      comment:{
        title: this.translateService.instant("COMMON.COMMENETS"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      }
    }
  }
  ng2SmartTableFilterParams: any;
  dataSourceSubscription: any;
  // userType: string = 'CUSTOMER';
  // reportType: string = 'GIVEN';
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private pageStateService: PagestateService,
    private commonTableService: TableService
  ) { 
    Object.keys(this.settings.columns).forEach(key => {
      this.settings.columns[key].sort = featuresSettings.TableSort;
    });
  }

  ngOnInit(): void {
    this.pageNum = +this.ActivatedRoute.snapshot.queryParamMap.get('page') || this.pageStateService.getPage();
    this.initialTableDataRender();
    this.source.onChanged().subscribe((change) => {
      this.pageStateService.handlePageChange(change, this.ActivatedRoute);
    });
  }
  initialTableDataRender() {

  this.settings.pager.page = this.pageNum;
    this.source = this.commonTableService.initializeDataSource(
      `services/request/reviews?userType=${this.selecteduserType}&reportType=${this.selectedreportType}`,
      'data.ratings', 'page', 'limit', 'data.total', '#field#'
    );

    const settings = {
      currentPage: this.currentPage,
      ng2SmartTableFilterParams: this.ng2SmartTableFilterParams,
      route: 'admin/reports/reviews' // Adjust based on your route
      // Add more settings as needed
    };

    this.dataSourceSubscription = this.commonTableService.handleDataSourceChange(this.source, settings);
    
  }
  ngOnDestroy(): void {
    if (this.dataSourceSubscription) {
      this.dataSourceSubscription.unsubscribe();
    }
  }
  changeUserType(data){
    console.log(data)
    this.selecteduserType = data;
    this.initialTableDataRender();
  }
  changereportType(data){
    console.log(data)
    this.selectedreportType = data;
    this.initialTableDataRender();
  }
  refreshData() {
    this.selecteduserType = 'CUSTOMER';
    this.selectedreportType = 'GIVEN';
    this.initialTableDataRender();
  }
  redirectto(data){
    console.log(data)
  }
}
// ngOnDestroy(): void {
//   if (this.dataSourceSubscription) {
//     this.dataSourceSubscription.unsubscribe();
//   }
// }

// initializeTable() {
//   this.pageNum =
//   +this.ActivatedRoute.snapshot.paramMap.get("page") || this.pageNum;

// this.settings.pager.page = this.pageNum;
//   this.source = this.commonTableService.initializeDataSource(
//     'common/partner', 'data.partner', 'page', 'limit', 'data.total', '#field#'
//   );

//   const settings = {
//     currentPage: this.currentPage,
//     ng2SmartTableFilterParams: this.ng2SmartTableFilterParams,
//     route: 'admin/partner/view-partner' // Adjust based on your route
//     // Add more settings as needed
//   };

//   this.dataSourceSubscription = this.commonTableService.handleDataSourceChange(this.source, settings);
// }