import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFilter } from 'ng2-smart-table';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ngx-company-date-picker',
  templateUrl: './company-date-picker.component.html',
  styleUrls: ['./company-date-picker.component.scss']
})
export class CompanyDatePickerComponent extends DefaultFilter implements OnInit {
  inputControl = new FormControl();
  constructor() {
    super();
   }

  ngOnInit(): void {
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
  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.query = changes.query.currentValue
        ? new Date(changes.query.currentValue).toISOString()
        : "";
      // this.inputControl.setValue(this.query);
    }
  }
}
