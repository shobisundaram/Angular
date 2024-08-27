import { Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'ngx-company-custom-filter',
  templateUrl: './company-custom-filter.component.html',
  styleUrls: ['./company-custom-filter.component.scss']
})
export class CompanyCustomFilterComponent implements OnInit {
  inputControl = new FormControl();
  @Output() filter = new EventEmitter<string>();
  placeholder: any;
  constructor() { }

  ngOnInit(): void {
    this.inputControl.valueChanges
    .pipe(debounceTime(2000)) // Adjust the debounce time as needed
    .subscribe((value) => {
      this.filter.emit(value);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.placeholder = changes.column.currentValue.title
  }

}
