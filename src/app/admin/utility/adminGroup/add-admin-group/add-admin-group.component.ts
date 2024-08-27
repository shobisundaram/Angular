import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "../../../data.service";
import {
  environment,
  featuresSettings,
} from "../../../../../environments/environment";
import { ApiService } from "../../../api.service";
import {
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { AdminGroup } from "../../../../@theme/interface/interface";

@Component({
  selector: "ngx-add-admin-group",
  templateUrl: "./add-admin-group.component.html",
  styleUrls: ["./add-admin-group.component.scss"],
})
export class AddAdminGroupComponent implements OnInit {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    {
      icon: "trash-2",
      title: this.translate.instant("ADMINGROUP.DELETEADMINGROUP"),
    },
  ];
  adminGroupmenu: any;
  menuList: any;

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title ===
          this.translate.instant("ADMINGROUP.DELETEADMINGROUP")
        ) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  adminGroupDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  adminGroupForm: FormGroup;
  dataServiceSubscition: any;
  permission: any = [];

  constructor(
    private dataService: DataService,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private location: Location,
    public translate: TranslateService,
    private dialogService: NbDialogService,
    private menuService: NbMenuService,
    private ActivatedRoute: ActivatedRoute
  ) { }
  dialogObservable: any;

  ngOnInit(): void {
    this.initializeAdminGroupForm();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.adminGroupDeleteDialogClose) {
      this.adminGroupDeleteDialogClose.close();
    }
  }

  initializeAdminGroupForm() {
    this.adminGroupForm = new FormGroup({
      id: new FormControl(""),
      group: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
    });
    this.apiservice.CommonGetApi("common/admin/menusList").subscribe({
      next: (res) => {
        this.menuList = res.data.menuList;
        this.patchAdminGroupForm();
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  get group() {
    return this.adminGroupForm.get("group");
  }
  get description() {
    return this.adminGroupForm.get("description");
  }

  patchAdminGroupForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const rowData: AdminGroup = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.adminGroupForm.patchValue({
            id: rowData._id,
            group: rowData.group,
            description: rowData.description,
          });
          this.adminGroupmenu = data.permission;
          this.permissionloop();
          // debugger;
        } else {
          this.dataFetchWhileReload();
        }
      });
  }
  permissionloop(){
    for (const menuItem of this.menuList) {
      let found = false;
      
      for (const adminItem of this.adminGroupmenu) {
          if (menuItem.menu === adminItem.menu) {
              let matchedSubMenu = [];
              let foundsubmenu = false;
              
              for (const subMenuItem of menuItem.subMenuList) {
                  let subMenuFound = adminItem.subMenuList.some((adminSubMenu) => {
                      if (adminSubMenu.menu === subMenuItem.menu) {
                          matchedSubMenu.push(adminSubMenu);
                          foundsubmenu = true;
                          return true; // Exiting the some() loop when a match is found
                      }
                      return false; // Need to return false explicitly for each iteration
                  });
                  
                  if (!subMenuFound) {
                      // If no matching submenu found, you can either skip or handle it accordingly.
                      // Here, I'm just logging a message.
                       matchedSubMenu.push(subMenuItem);
                      console.log(`No matching submenu found for ${subMenuItem.menu}`);
                  }
              }
              
              // Only update adminItem.subMenuList if there are matched submenus
              if (foundsubmenu) {
                  adminItem.subMenuList = matchedSubMenu;
              }
              
              this.permission.push(adminItem);
              found = true;
              break;
          }
      }
    
      if (!found) {
          this.permission.push(menuItem);
      }
  }
  
  console.log(this.permission);
  }
  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice
        .CommonGetApi("common/adminGroup/" + id)
        .subscribe((res) => {
          const data = res.data.adminGroup[0];
          this.dataService.setNewRowInfo(data);
        });
    }
  }

  goBackBtn() {
    this.location.back();
  }

  addOrEditAdminGroup() {
    if (this.adminGroupForm.invalid) {
      this.adminGroupForm.markAllAsTouched();
    } else {
      const payload = {
        group: this.adminGroupForm.value.group,
        description: this.adminGroupForm.value.description,
        permission: this.permission,
      };

      if (this.adminGroupForm.value.id) {
        this.apiservice
          .CommonPutApi(
            "common/adminGroup/" + this.adminGroupForm.value.id,
            payload
          )
          .subscribe({
            next: (res) => {
              const data = res.data;
              console.log(data, "==========>")
              this.toasterService.success(res.type, data.message);

              const menudetails = JSON.parse(localStorage.getItem('AdminDetails'))
              menudetails.group.permission = data.adminGroup.permission
              localStorage.setItem("AdminDetails", JSON.stringify(menudetails))
              window.location.reload()

            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      } else {
        this.apiservice.CommonPostApi(payload, "common/adminGroup").subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
            this.goBackBtn();
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        });
      }
    }
  }

  deleteAdminGroup() {
    this.apiservice
      .CommonDeleteApi(this.adminGroupForm.value.id, "common/adminGroup")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.adminGroupDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("ADMINGROUP.DELETEADMINGROUP"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("ADMINGROUP.ADMINGROUP"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.adminGroupDeleteDialogClose.close();
    } else {
      this.deleteAdminGroup();
    }
  }

  onParentMenuChange(parentMenuIndex: number, event: Event) {
    if (this.permission[parentMenuIndex]) {
      if (!this.permission[parentMenuIndex].status) {
        this.permission[parentMenuIndex].status = true;

        if (this.permission[parentMenuIndex].subMenuList.length != 0) {
          this.permission[parentMenuIndex].subMenuList.forEach((element) => {
            element.status = true;

            if (element.subMenuList.length != 0) {
              element.subMenuList.forEach((el) => {
                el.status = true;
              });
            }
          });
        }
      } else {
        this.permission[parentMenuIndex].status = false;

        if (this.permission[parentMenuIndex].subMenuList.length != 0) {
          this.permission[parentMenuIndex].subMenuList.forEach((element) => {
            element.status = false;

            if (element.subMenuList.length != 0) {
              element.subMenuList.forEach((el) => {
                el.status = false;
              });
            }
          });
        }
      }
    }
  }
  onChildMenuChange(
    parentMenuIndex: number,
    childMenuIndex: number,
    event: Event) {
    if (!this.permission[parentMenuIndex].subMenuList[childMenuIndex].status) {
      this.permission[parentMenuIndex].subMenuList[childMenuIndex].status =
        true;
      this.permission[parentMenuIndex].status = true;

      if (
        this.permission[parentMenuIndex]
          .subMenuList.length != 0
      ) {
        this.permission[parentMenuIndex].subMenuList[childMenuIndex].forEach((element) => {
          element.status = true;
        });
      }
    }
    else {
      this.permission[parentMenuIndex].subMenuList[childMenuIndex].status =
        false;
      console.log(this.permission[parentMenuIndex].subMenuList[childMenuIndex].status)
      console.log(this.permission[parentMenuIndex].subMenuList)
      let filter_data = this.permission[parentMenuIndex].subMenuList.some(item => item.status)
      console.log(filter_data)
      this.permission[parentMenuIndex].status = filter_data;
    }
  }
  // onChildMenuChange(
  //   parentMenuIndex: number,
  //   childMenuIndex: number,
  //   event: Event
  // ) {
  //   if (
  //     this.permission[parentMenuIndex] &&
  //     this.permission[parentMenuIndex].subMenuList[childMenuIndex]
  //   ) {
  //     if (
  //       !this.permission[parentMenuIndex].subMenuList[childMenuIndex].status
  //     ) {
  //       this.permission[parentMenuIndex].subMenuList[childMenuIndex].status =
  //         true;

  //       this.permission[parentMenuIndex].status = true;

  //       if (
  //         this.permission[parentMenuIndex].subMenuList[childMenuIndex]
  //           .subMenuList.length != 0
  //       ) {
  //         this.permission[parentMenuIndex].subMenuList[
  //           childMenuIndex
  //         ].subMenuList.forEach((element) => {
  //           element.status = true;
  //         });
  //       }
  //     } else {
  //       this.permission[parentMenuIndex].subMenuList[childMenuIndex].status =
  //         false;

  //       if (
  //         this.permission[parentMenuIndex].subMenuList[childMenuIndex]
  //           .subMenuList.length != 0
  //       ) {
  //         this.permission[parentMenuIndex].subMenuList[
  //           childMenuIndex
  //         ].subMenuList.forEach((element) => {
  //           element.status = false;
  //         });
  //       }
  //     }
  //   }
  // }

}
