import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { DataService } from "../data.service";
import { DefaultFilter } from "ng2-smart-table";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { PagestateService } from "../pagestate.service";

@Component({
  selector: "ngx-ng-select",
  templateUrl: "./ng-select.component.html",
  styleUrls: ["./ng-select.component.scss"],
})
export class NgSelectComponent
  extends DefaultFilter
  implements OnInit, OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @Input() column: any;
  options: any;
  selectValue = new FormControl();
  // filterOption: any;
  display: any;
  body: any;
  placeholder: any;

  constructor(private dataService: DataService, private pageStateService: PagestateService) {

    super();
  }

  ngOnInit(): void {
    this.pageStateService.clearFilter$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (data) {
          this.selectValue.setValue(null, { emitEvent: false });
        }
      });
    if (this.column && this.column.filter && this.column.filter.config) {
      this.options = this.column.filter.config.options || [];
      console.log(this.options)
    }
    // this.filterOption = this.dataService
    //   .getNg2SmartTableFilterOption()
    //   .subscribe((data) => {
    //     this.options = data;
    //   });
    this.selectValue.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(this.delay))
      .subscribe((value: string) => {
        this.query =
          value && this.selectValue.value ? this.selectValue.value : "";
        this.setFilter();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.query = changes.query.currentValue ? changes.query.currentValue : "";
      this.selectValue.setValue(this.query, { emitEvent: false })
      // this.inputControl.setValue(this.query);
    }
    // if (changes.currentValue) {
    // this.placeholder = changes.column.currentValue.title
    // }
  }

  // ngOnDestroy(): void {
  //   this.filterOption.unsubscribe();
  // }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
