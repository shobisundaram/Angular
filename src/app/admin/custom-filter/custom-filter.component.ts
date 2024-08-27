import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { PagestateService } from "../pagestate.service";
import { ServerDataSource } from "ng2-smart-table";

@Component({
  selector: "ngx-custom-filter",
  templateUrl: "./custom-filter.component.html",
  styleUrls: ["./custom-filter.component.scss"],
})
export class CustomFilterComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  inputControl = new FormControl();
  @Output() filter = new EventEmitter<string>();
  placeholder: any;
  constructor(private pageStateService: PagestateService) {}

  ngOnInit(): void {
    this.pageStateService.clearFilter$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (data) {
          this.inputControl.setValue(null, { emitEvent: false });
        }
      });
    this.inputControl.valueChanges
      .pipe(debounceTime(2000)) // Adjust the debounce time as needed
      .subscribe((value) => {
        if (value) {
          let source: ServerDataSource = this.pageStateService.serverSource;
          source.setPage(1, false);
          this.pageStateService.serverSource = source;
          this.filter.emit(value);
        }
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log("detect changes.......", changes);
    if (changes.query && changes.query.currentValue) {
      this.inputControl.setValue(changes.query.currentValue, { emitEvent: false });
    }
    if (changes.column && changes.column.currentValue) {
      this.placeholder = changes.column.currentValue.settings.placeholder
        ? changes.column.currentValue.settings.placeholder
        : changes.column.currentValue.title;
    }
    // Optionally handle changes in inputs here (e.g., update filter based on columnTitle)
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
