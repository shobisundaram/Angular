import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFilter } from 'ng2-smart-table';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CompanyDataService } from '../company-data.service';

@Component({
  selector: 'ngx-company-ng-select',
  templateUrl: './company-ng-select.component.html',
  styleUrls: ['./company-ng-select.component.scss']
})
export class CompanyNgSelectComponent extends DefaultFilter implements OnInit {
  filterOption: any;
  options: any;
  selectValue = new FormControl();
  delay: number;
  constructor(
    private dataService: CompanyDataService
  ) {
    super();
   }

  ngOnInit(): void {
    // this.filterOption = this.dataService
    // .getNg2SmartTableFilterOption()
    // .subscribe((data) => {
    //   this.options = data;
    // });
    if (this.column && this.column.filter && this.column.filter.config) {
      this.options = this.column.filter.config.options || [];
      console.log(this.options)
    }
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
      // this.inputControl.setValue(this.query);
    }
  }

  // ngOnDestroy(): void {
  //   this.filterOption.unsubscribe();
  // }
}
