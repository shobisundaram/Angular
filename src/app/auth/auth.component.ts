import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-auth',
  template: `<nb-layout>
  <nb-layout-column>
    <nb-auth-block class="max d-flex align-items-center justify-content-center h-100">
      <router-outlet></router-outlet>
    </nb-auth-block>
  </nb-layout-column>
</nb-layout>`,
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  ngOnInit(): void {
  }

}
