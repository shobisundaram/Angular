import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private router: Router, private http: HttpClient) {}

  initializeDataSource(endpoint: string, dataKey: string, pagerPageKey: string, pagerLimitKey: string, totalKey: string, filterFieldKey: string) {
    return new ServerDataSource(this.http, {
      endPoint: environment.API_ENDPOINT + endpoint,
      dataKey: dataKey,
      pagerPageKey: pagerPageKey,
      pagerLimitKey: pagerLimitKey,
      totalKey: totalKey,
      filterFieldKey: filterFieldKey,
    });
  }

  handleDataSourceChange(source: ServerDataSource, settings: any) {
    source.onChanged().subscribe((changeEvent) => {
      settings.currentPage = changeEvent.paging.page;
      settings.ng2SmartTableFilterParams = changeEvent.filter.filters;
      this.router.navigate([settings.route, { page: settings.currentPage }]);
      
      // Additional logic based on your specific needs (e.g., update pagination details)
      // settings.allData = source.count();
      // settings.perPageData = settings.pager.perPage;
      // settings.totalPages = Math.ceil(settings.allData / settings.perPageData);
      // settings.pager.page = settings.currentPage;
    });
  }
}
