/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export class AppSettings {
  public static production = false;
  public static APPNAME = "Rebustar V3";
  public static APPYEAR = new Date().getFullYear();
  public static defaultPhoneCode = "91";
  public static defaultlang = "EN";
  public static defaultcur = "₹";
  public static defaultCountryId = "63"; //Ecuador
  public static defaultStateId = "1022"; //TN
  public static GOOGLE_MAP_DEFAULT_LOCATION = "Madurai, India"; // It is used for showing default location of google map to show the location details*/
  public static MAP_ZOOM = 10;
  public static GoogleMapKey = "AIzaSyA44g-d_HVBtccWniZP7ZHrbY6bGiwPUv8";
  public static logo_URL = "assets/images/logo.svg";
  public static defaultProfileImage = 'assets/images/defaultUser.svg';
  public static version = "2.0.4";
  public static showLogo = false;
  public static showTitle = true;
  public static logo_height = 57;
  public static logo_width = 198;
  public static secondCurrency = "INR";
}

export const environment = {
  production: false,
  // API_ENDPOINT: "http://10.1.1.37:3004/",
  // BASEURL: "http://10.1.1.37:3004/",
  // API_ENDPOINT: "http://10.1.1.28:3000/",
  // BASEURL: "http://10.1.1.28:3000/",
  API_ENDPOINT: "https://rebustarv3api.abservetechdemo.com/",
  BASEURL: "https://rebustarv3api.abservetechdemo.com/",
  GoogleMapKey: "AIzaSyA44g-d_HVBtccWniZP7ZHrbY6bGiwPUv8",
  defaultCountryLat: 9.924,
  defaultCountryLan: 78.1222,
};

export class featuresSettings {
  public static demoEmail = "admin@rebustar.com"
  public static demoPassword = "123456"
  public static isDTS = false;
  public static isCityWise = true; //Vehicle and Fare etc act citywise  0/1
  public static isHotel = false; //Vehicle and Fare etc act citywise  0/1
  public static isServiceAvailable = true; //if not modify in getServiceBasicfare
  public static isCommisionToAdmin = true; //is at end of trip Commision need to take
  public static isMultipleCompaniesAvailable = false;
  public static isDoubleChargeNeeded = false; //is isDoubleChargeNeeded for crossing City limit
  public static applyNightCharge = true;
  public static applyPeakCharge = true;
  public static applyWaitingTime = true; //waiting time charge
  public static applyTax = true;
  public static applyCommission = true;
  public static applyPickupCharge = true;
  public static isRiderCancellationAmtApplicable = true;
  public static isDriverCancellationAmtApplicable = false;
  public static applyBlockOldCancellationAmt = true;
  public static isDriverCreditModuleEnabled = true; //Helps to show alert if credits are low, reduce commision from credits, etc
  public static adminCommision = "driverWallet"; //From Driver Wallet (driverWallet)
  public static payoutType = "driverPostpaid"; //Driver Have to Recharge to Take Trip. (driverPrepaidWallet,driverPostpaidWallet)
  public static deductAmountFromDriverWallet = "commision"; //this amount will be decuted from Wallet (totalFare,commision)
  public static isRiderReferalCodeAvailable = false;
  public static isPromoCodeAvailable = true;
  public static isOffersForRideAvailable = false;
  public static tripsAvailable = ["Daily", "rental", "outstation"]; //USED
  public static fareCalculationType = "normal"; //{indiaGst,normal}
  public static distanceUnit = "Miles"; //KM or Miles
  public static showHailTrips = false; //show hail related stuffs
  public static paymentType = ["credit", "debit"];
  public static payPackageTypes = ["TOPUP", "SUBSCRIPTION"];
  public static paymentTypes = ["TOPUP", "SUBSCRIPTION"];
  public static subPackageTypes = ["subscription"]; // 'subscription,commission,topup' - DRIVER SUBSCRIPTION MENU
  public static shareTaxi = false; // Is Vehicle Sharing Available in Vehicle Type
  public static taxFeeLabel = "Tax"; // Access Fee or Tax
  public static showDeliveryTrips = false; // Delivery Trips and Report
  public static isVehicleTypeAvailableInPackages = false; // Vehicle Type while adding package in Driver Credits.
  // public static defaultVehicleInMap = 'Sedan'; // Gods View and Tracking
  public static defaultVehicleInMap = "ALL"; // Gods View and Tracking
  public static referenceCode = false;
  public static langAvailable = ["en", "es"];
  public static DefaultCountry = "63";
  public static DefaultState = "1022";
  public static ServiceAvailableCity = localStorage.getItem("cityType");
  public static Nb_dialogbox_close_while_click_outside = false;
  public static DateFormatWithTime = "DD-MM-YYYY H:mm:ss";
  public static DateFormat = "DD-MM-YYYY";
  public static TimeFormat = "h:mm a";
  public static TableSort = false;
  public static PasswordPattern =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=]).{8,}$";
  public static NoPlatePattern =
    "^[A-Z]{2}[\\ -]{0,1}[0-9]{1,2}[\\ -]{0,1}[A-Z]{1,2}[\\ -]{0,1}[0-9]{4}$";
}
export class Year_selection {
  public static year = () => {
    let startYear = new Date().getFullYear();
    let range = [];
    for (let i = 0; i < 24; i++) {
      range.push(startYear - i);
    }
    return range.map(String);
  };
}

export class LanguageSettings {
  public static languages = ["en", "es"];
  public static defaultSelectedLang = "en";
  public static setLanguageForMenus = false;
  public static showTranslateOption = false;
  public static fetchTranslateFilesFromAPI = false;
}

export class CommonData {
  public static currency = [
    { value: "INR", label: "India - INR" },
    { value: "US", label: "USA - $" },
  ];
  public static language = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    // { value: "ta", label: "Tamil" },
  ];
  public static adminType = [
    { value: "superadmin", title: "Super Admin" },
    // { value: "citywiseadmin", label: "City Wise Admin" },
  ];
  public static ownertype = [
    { value: "COMPANY", label: "Company" },
    { value: "PARTNER", label: "Partner" },
  ];
  public static gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Others", label: "Others" },
  ];
  public static genders = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Others", label: "Others" },
    { value: "All", label: "All" },
  ];
  public static LowerServiceTypes = [
    { value: 0, label: "Mini" },

  ];
  public static tripType = [
    { value: "daily", label: "Daily" },
    // { value: "rental", label: "Rental" },
    // { value: "outstation", label: "Outstation" },
  ];
  public static tripType1 = [
    { value: "DAILY", label: "Daily" },
    // { value: "rental", label: "Rental" },
    // { value: "outstation", label: "Outstation" },
  ];
  public static offerTypes = [
    { value: "Flatrate", label: "Flat Rate" },
    { value: "Percentage", label: "Percentage" },
  ];
  public static true_or_false = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];
  public static zero_or_one = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];
  public static available_or_unavailable = [
    { value: "Available", label: "Yes" },
    { value: "UnAvailable", label: "No" },
  ];
  public static status = [
    { value: true, label: "Enable" },
    { value: false, label: "Disable" },
  ];
  public static category = [
    { value: "Promotion", label: "Promotion" },
    { value: "Promocode", label: "PromoCode" },
  ];
  public static apply_type = [
    { value: "Auto", label: "Auto" },
    { value: "Manual", label: "Manual" },
  ];
  public static fareType0 = [
    { value: "unitRate", label: "Unit Rate" },
    { value: "flatRate", label: "Flat Rate" },
  ];
  public static fareType1 = [
    { value: "amount", label: "Amount" },
    { value: "percentage", label: "Percentage" },
  ];

  //ng2-smart-table drop down options
  public static accountStatus = [
    { value: "", title: "All" },
    { value: "Pending", title: "Pending" },
    { value: "Active", title: "Active" },
    { value: "Inactive", title: "Inactive" },
    { value: "Blocked", title: "Blocked" },
  ];
  public static onlineStatus = [
    { value: "", title: "All" },
    { value: "1", title: "Online" },
    { value: "0", title: "Offline" },
  ];
  public static tripsStatus = [
    { value: "", title: "All" },
    { value: "Processing", title: "Processing" },
    { value: "Accepted", title: "Accepted" },
    { value: "Arrived", title: "Arrived" },
    { value: "Progress", title: "Progress" },
    { value: "Finished", title: "Finished" },
    { value: "Cancelled", title: "Cancelled" },
    { value: "Noresponse", title: "Noresponse" },
  ];
  public static paymentMode = [
    { value: "", title: "All" },
    { value: "Cash", title: "Cash" },
    // { value: "Card", title: "Card" },
  ];
  public static packageType = [
    { value: "", title: "All" },
    { value: "TOPUP", title: "TOPUP" },
    { value: "SUBSCRIPTION", title: "SUBSCRIPTION" },
  ];
  public static subscriptionStatus = [
    { value: "", title: "All" },
    { value: "Active", title: "Active" },
    { value: "Inactive", title: "In Active" },
    { value: "Pending", title: "Pending" },
  ];
  public static activeInactive = [
    { value: "true", title: "Active" },
    { value: "false", title: "In Active" },
  ];
  public static bookingType = [
    {
      disabled: false,
      value: "rideNow",
      label: "Ride Now",
    },
    {
      disabled: true,
      value: "rideLater",
      label: "Ride Later (Scheduled Trip)",
    },
  ];
  public static AssignmentType = [
    {
      disabled: false,
      value: "auto-assign",
      label: "Auto Assign",
    },
    {
      disabled: false,
      value: "manual-assign",
      label: "Manual Assign",
    },
  ];
}
