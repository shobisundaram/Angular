import { Component } from "@angular/core";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { ApiService } from "./api.service";

import { MENU_ITEMS } from "./admin-menu";
import { DataService } from "./data.service";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { NbMenuItem, NbMenuService } from "@nebular/theme";
import { PagestateService } from "./pagestate.service";
import { Router ,ActivatedRoute} from "@angular/router";
// import { NbMenuService, NbSidebarService } from '@nebular/theme';

@Component({
  selector: "ngx-admin",
  styleUrls: ["admin.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu autoCollapse="true" [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
  providers: [DataService]
})
export class AdminPanelComponent {
  // menu = MENU_ITEMS;
  menu: any = [];
  pagesArray: any = [];
  AdminDetails = JSON.parse(localStorage.getItem("AdminDetails"));
  lastSelectedItem: NbMenuItem | null = null;
  defaultpage: number;
  constructor(
    private dataservice: DataService,
    private apiservice: ApiService,
    private authService: NbAuthService,
    private menuService: NbMenuService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router,
    private pageservice: PagestateService,
    private translate: TranslateService
  ) {}
  ngOnInit() {
    this.menuService.onItemClick().subscribe(event => {
      this.onMenuClick(event.item);
    });
    this.menuService.onItemSelect().subscribe(event => {
      this.lastSelectedItem = event.item;
    });
    this.menupermissions();
    this.translateMenuItems();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateMenuItems();
    });
  }

  onMenuClick(item: NbMenuItem) {
   
    if (item !== this.lastSelectedItem) {
      this.defaultpage = 1
      console.log('its comming if')
    }else{
      this.defaultpage = null
    }
    if (item.queryParams) {
      const queryParams = { ...item.queryParams };
      console.log(queryParams.page,this.pageservice.getPage(),this.ActivatedRoute.snapshot.queryParams.page)
      let page = this.defaultpage? this.defaultpage: this.ActivatedRoute.snapshot.queryParams.page
      const updatedQueryParams = { ...item.queryParams, page: page? page :this.pageservice.getPage()  };
      this.router.navigate([item.link], { queryParams: updatedQueryParams });
    } else {
      this.router.navigate([item.link]);
    }
  }
  translateMenuItems() {
    let translatedMenuItems = JSON.parse(JSON.stringify(MENU_ITEMS));
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
  menupermissions() {
    if (this.AdminDetails) {
      let permissions = this.AdminDetails.group.permission;
      for (let i = 0; i < permissions.length; i++) {

        if (permissions[i].status == true) {
          let index = MENU_ITEMS.findIndex(
            (actmenu) => actmenu.title == permissions[i].menu
          );
          if (index != -1) {
            let page = { ...MENU_ITEMS[index] };
            if (page) {
              if (permissions[i].subMenu == true && page.children) {

                let allowedSubmenus = permissions[i].subMenuList.map(subMenu => subMenu.menu);
                page.children = page.children.filter(child => allowedSubmenus.includes(child.title));
                for (let j = 0; j < permissions[i].subMenuList.length; j++) {
                  let childindex = page.children.findIndex(
                    (actualMenuChildren) =>
                      actualMenuChildren.title ==
                      permissions[i].subMenuList[j].menu
                  );
                  if (childindex != -1) {
                    if (permissions[i].subMenuList[j].status != true) {
                      page.children.splice(childindex, 1);
                    }
                  }
                }
              }
              this.pagesArray.push(page);
              console.log("MENU_FOUND");
            }
          } else {
            console.log("MENU_NOT_FOUND");
          }
        }
      }

      this.menu = this.showMenus(this.pagesArray);
      console.log(this.menu)
    } else {
      console.log("DETAILS_NOT_FETCHED");
    }
  }

}
