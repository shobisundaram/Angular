import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Directive({
  selector: "[debounceFilter]",
})
export class DebounceFilterDirective {
  @Input() delay: number = 500; // Debounce delay (default 500ms)
  @Output() search = new EventEmitter<any>(); // Corrected type

  private timer: any = null;

  constructor(private el: ElementRef) {}

  @HostListener("keyup")
  onKeyUp() {
    const searchText = this.el.nativeElement.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.search.emit({ search: searchText }); // Corrected emission
    }, this.delay);
  }
}
