import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbThemeService,
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
} from "@nebular/theme";
import { AppSettings, environment } from "../../../../../environments/environment";

@Component({
  selector: "ngx-lowrated-users",
  templateUrl: "./lowrated-users.component.html",
  styleUrls: ["./lowrated-users.component.scss"],
})
export class LowratedUsersComponent implements OnInit, OnDestroy {
  defaultProfileImage: string =  AppSettings.defaultProfileImage;
  contacts: any = [
    {
      profile: "public/file-default.png",
      _id: "65ae094647bb1a2008c3664a",
      fname: "QATESTING",
      email: "qatesting65@gmail.com",
      phone: "9000000000",
    },
    {
      profile: "public/file-default.png",
      _id: "65aa18bd5df5a3f75168b64b",
      fname: "QATesting",
      email: "qatesting77@vmakl.com",
      phone: "8232323332",
    },
    {
      profile: "public/file-default.png",
      _id: "65a8c6ccbe64d2e98cbc31c8",
      fname: "Ytt",
      email: "rst@gmail.com",
      phone: "8496116211",
    },
    {
      profile: "public/file-default.png",
      _id: "65a8c515be64d2e98cbc310a",
      fname: "QATesting",
      email: "atesting77@gmail.com",
      phone: "6000000000",
    },
    {
      profile: "public/file-default.png",
      _id: "65a8b64cbe64d2e98cbc2443",
      fname: "QATESTING",
      email: "qatesting@gmail.com",
      phone: "6969696969",
    },
    {
      profile: "public/file-default.png",
      _id: "65a8b600be64d2e98cbc2425",
      fname: "QATesting",
      email: "qatesting56@gmail.com",
      phone: "6363636363",
    },
    {
      profile: "public/file-default.png",
      _id: "65a7b60fb6877ba8946f02f5",
      fname: "test",
      email: "absapp@co.in",
      phone: "7476797675",
    },
    {
      profile: "public/file-1705559142686.jpg",
      _id: "65a7a6ffb6877ba8946ed4d7",
      fname: "QATesting",
      email: "qesting123@gmail.com",
      phone: "9633693693",
    },
    {
      profile: "public/file-default.png",
      _id: "65a7709090529768f5dfc033",
      fname: "driver",
      email: "demo@gmail.co.in",
      phone: "9089080989",
    },
    {
      profile: "public/file-default.png",
      _id: "65a657d190529768f5defe09",
      fname: "qwerty",
      email: "towner@wwwwwwwwwwwwwwwwwwwwqwertyuiopgmail.com",
      phone: "0000000001",
    },
  ];
  recent: any = [
    {
      profile: "public/file-default.png",
      _id: "65adfd3b6f2d31f9d99f0582",
      fname: "QAtesting",
      email: "qatestin56g@gmail.com",
      phone: "5000000000",
    },
    {
      profile: "public/file-default.png",
      _id: "65adf3846f2d31f9d99f0124",
      fname: "QAtesting",
      email: "atesting34@gmail.com",
      phone: "6969696966",
    },
    {
      profile: "public/file-default.png",
      _id: "65ab96ba6f2d31f9d99ea04e",
      fname: "QATesting",
      email: "qatesting33@gmail.com",
      phone: "0080000000",
    },
    {
      profile: "public/file-default.png",
      _id: "65ab3dc46f2d31f9d99e65e1",
      fname: "Raghu",
      email: "raghuss4188@gmail.com",
      phone: "6496116214",
    },
    {
      profile: "public/file-default.png",
      _id: "65aa1015b707d4ed0a7ca95f",
      fname: "Kedar",
      email: "kedar@taxiondc.com",
      phone: "9970299004",
    },
    {
      profile: "public/file-default.png",
      _id: "65a91c16b707d4ed0a7c6fbb",
      fname: "restart",
      email: "asd@getnada.com",
      phone: "9067902669",
    },
    {
      profile: "public/file-default.png",
      _id: "65a8fd1a9f7faeec76337bae",
      fname: "fahaj",
      email: "ghwjs@gmail.com",
      phone: "0000041100",
    },
    {
      profile: "public/file-default.png",
      _id: "65a7d556ddad67afa6687ad6",
      fname: "QATesting",
      email: "qatesting123@gmail.com",
      phone: "8000000000",
    },
    {
      profile: "public/file-default.png",
      _id: "65a783d7b6877ba8946e6338",
      fname: "Hiii",
      email: "ASDF@hjvbn.hjni",
      phone: "0000000009",
    },
    {
      profile: "public/file-default.png",
      _id: "65a77d61b6877ba8946e4ebb",
      fname: "iytf",
      email: "WE@qw.com",
      phone: "8765678987",
    },
  ];
  breakpoint: NbMediaBreakpoint;
  breakpoints: any;
  themeSubscription: any;
  temp: string = environment.BASEURL;

  constructor(
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService
  ) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeSubscription = this.themeService
      .onMediaQueryChange()
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  ngOnInit(): void {
    // this.apiservice.CommonGetApi("recentUsers").subscribe((res) => {
    //   this.contacts = res[0];
    //   this.recent = res[1];
    // });
  }

  RouteToDrivers(path: String): void {
    // this.router.navigate(["admin/tables/driver-table", { _id: path }]);
  }
  RouteToRider(path: String): void {
    // this.router.navigate(["admin/tables/rider-table", { _id: path }]);
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
