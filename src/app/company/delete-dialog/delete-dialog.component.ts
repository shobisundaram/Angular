import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {
  @Input() PData: any;
  @Output() childEvent = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  onClick(value: string) {
    this.childEvent.emit(value);
  }
}
