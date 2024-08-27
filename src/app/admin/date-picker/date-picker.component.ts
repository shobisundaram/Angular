import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DefaultFilter } from "ng2-smart-table";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { PagestateService } from "../pagestate.service";

@Component({
  selector: "ngx-date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.scss"],
})
export class DatePickerComponent
  extends DefaultFilter
  implements OnInit, OnChanges {
  private unsubscribe$ = new Subject<void>();
  inputControl = new FormControl();

  constructor(private pageStateService: PagestateService) {
    super();
  }

  ngOnInit(): void {
    this.pageStateService.clearFilter$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (data) {
          this.inputControl.setValue(null, { emitEvent: false });
        }
      });
    this.inputControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(this.delay))
      .subscribe((value: string) => {
        console.log(value, "====78")
        // debugger;
        // this.query =
        //   value instanceof Date ? this.inputControl.value.toISOString() : "";
        this.query =
          value && this.inputControl.value
            ? new Date(this.inputControl.value).toISOString()
            : "";
        this.setFilter();
        console.log(this.query,"===========0")
      });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes.query && changes.query.currentValue != "") {
  //     this.query = new Date(changes.query.currentValue).toISOString();
  //     // // this.inputControl.setValue(this.query);
  //     // return this.inputControl.value instanceof Date
  //     //   ? this.inputControl.value.toISOString()
  //     //   : "";
  //   }
  // }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.query = changes.query.currentValue
        ? new Date(changes.query.currentValue).toISOString()
        : "";
      this.inputControl.setValue(this.query, { emitEvent: false });
    }
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
