import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { NgSelectModule } from "@ng-select/ng-select";
@Injectable()
export class DataService {
  private MenuData: Subject<any> = new Subject<any>();
  MenuData$: Observable<any> = this.MenuData.asObservable();
  constructor() { }
  private myBehaviorSubject = new BehaviorSubject<any>({});
  private rowData = new BehaviorSubject<any>({});
  private driverData = new BehaviorSubject<any>({});
  private Ng2SmartTableFilterOption = new BehaviorSubject<any>({});

  // private addGroupToggle = new BehaviorSubject<any>({});
  setNewRowInfo(data: any) {
    this.rowData.next(data);
  }

  getNewRowInfo() {
    return this.rowData.asObservable();
  }

  setDriverDataInfo(data: any) {
    this.driverData.next(data);
  }

  getDriverDataInfo() {
    return this.driverData.asObservable();
  }

  setNg2SmartTableFilterOption(data: any) {
    this.Ng2SmartTableFilterOption.next(data);
  }

  getNg2SmartTableFilterOption() {
    return this.Ng2SmartTableFilterOption.asObservable();
  }

  // menu_service




  setMenuInfo(updatedData) {
    this.MenuData.next(updatedData);
  }

}
