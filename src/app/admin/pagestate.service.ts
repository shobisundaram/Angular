import { EventEmitter, Injectable, Output } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagestateService {
  private filterState: { [key: string]: string } = {};
  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$: Observable<number> = this.currentPageSubject.asObservable();
  private dataSource: ServerDataSource | null = null;

  private clearFilter = new BehaviorSubject<Boolean>(false);
  clearFilter$ = this.clearFilter.asObservable();
  constructor(private router: Router, private ActivatedRoute: ActivatedRoute) {}

  get serverSource(): ServerDataSource{
    return this.dataSource;
  }

  set serverSource(source:ServerDataSource){
    this.dataSource = source
  }

  setPage(pageNum: number): void {
    this.currentPageSubject.next(pageNum);
  }

  getPage(): number {
    return this.currentPageSubject.getValue();
  }

  refreshTableSource(): void {
    if (this.dataSource) {
      this.dataSource.refresh();
    }
  }

  handlePageChange(change: any, activatedRoute: any): void {
    console.log(change, "changes happens");

    const pageNum = change.paging.page;
    this.setPage(pageNum);
    if (change.action === "page") {
      const navigationExtras: NavigationExtras = {
        queryParams: { ...activatedRoute.snapshot.queryParams, page: pageNum },
        queryParamsHandling: "merge",
      };
      this.router.navigate([], navigationExtras);

    } else if (change.action === "filter") {
      if (change.filter.filters.length) {
        let filter = JSON.stringify(change.filter.filters);
        const navigationExtras: NavigationExtras = {
          queryParams: {
            ...this.ActivatedRoute.snapshot.queryParams,
            page: pageNum,
            filter: filter,
          },
          queryParamsHandling: "merge",
        };
        this.router.navigate([], navigationExtras);
      } else{
        const navigationExtras: NavigationExtras = {
          queryParams: {
            page: pageNum,
          },
        };
        this.router.navigate([], navigationExtras);
        this.clearFilter.next(true)
      }
    }
  }
}
