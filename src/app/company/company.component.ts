import { Component, OnInit } from '@angular/core';
import { COMPANY_MENU_ITEMS } from './company-menu';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  menu: any = [];
  pagesArray: any = [];

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    console.log(COMPANY_MENU_ITEMS)
    this.menupermissions();
    this.translateMenuItems();
  }
  translateMenuItems() {
    let translatedMenuItems = JSON.parse(JSON.stringify(COMPANY_MENU_ITEMS));
    translatedMenuItems.forEach(item => {
      item.title = this.translate.instant(`MENU_ITEMS.${item.title.toUpperCase()}`);
      if (item.children) {
        item.children.forEach(child => {
          child.title = this.translate.instant(`MENU_ITEMS.${child.title.toUpperCase()}`);
        });
      }
    });

    this.menu = translatedMenuItems;
  }
  showMenus(menuArray: any[]): any[] {
    return menuArray;
  }
  menupermissions(){
    this.pagesArray.push(...COMPANY_MENU_ITEMS)
    console.log(this.pagesArray)
    this.menu = this.showMenus(this.pagesArray);
  }
}
