import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: "Rebustar V3",
  //   icon: "star",
  //   link: "/",
  // },
  {
    title: "Dashboard",
    icon: "monitor-outline",
    link: "/admin/dashboard",
    home: true,
  },
  {
    title: "Site Statistics",
    icon: "trending-up-outline",
    link: "/admin/site-statistics",
  },
  {
    title: "Admin",
    icon: "lock-outline",
    link: "/admin/admin/view-admin",
    queryParams: { page: 1 }
  },
  // {
  //   title: "Company",
  //   icon: "shield-outline",
  //   link: "/admin/company/view-company",
  // },
  {
    title: "Partner",
    icon: "hard-drive-outline",
    link: "/admin/partner/view-partner",
    queryParams: { page: 1 }
  },
  {
    title: "Vehicle",
    icon: "car-outline",
    link: "/admin/company-vehicle/view-vehicle",
    queryParams: { page: 1 }
  },
  {
    title: "Customer",
    icon: "people-outline",
    link: "/admin/customer/view-customer",
    queryParams: { page: 1 }
  },
  {
    title: "Trips",
    icon: "briefcase-outline",
    link: "/admin/trips/all-trips",
    queryParams: { page: 1 }
    // children: [
    //   {
    //     title: "All Trips",
    //     link: "/admin/trips/all-trips",
    //   },
    //   {
    //     title: "Ongoing Trips",
    //     link: "/admin/trips/ongoing-trips",
    //   },
    //   {
    //     title: "Upcoming Trips",
    //     link: "/admin/trips/upcoming-trips",
    //   },
    //   {
    //     title: "No Response Trips",
    //     link: "/admin/trips/no-response-trips",
    //   },
    //   {
    //     title: "Past Trips",
    //     link: "/admin/trips/past-trips",
    //   },
    // ],
  },
  {
    title: "Taxi Dispatch",
    icon: "pin-outline",
    link: "/admin/dispatch/manual-taxi-dispatch",
  },
  {
    title: "Map Views",
    icon: "map-outline",
    children: [
      {
        title: "Partner Tracking",
        link: "/admin/map-views/partner-tracking",
      },
      {
        title: "Heat Map",
        link: "/admin/map-views/heat-map",
      },
    ],
  },
  {
    title: "Partner Payment",
    icon: "credit-card-outline",
    children: [
      {
        title: "Package List",
        link: "/admin/payment/package-list/view-package-list",
        queryParams: { page: 1 }
      },
      {
        title: "Subscription",
        link: "/admin/payment/subscription/view-partner-subscription",
        queryParams: { page: 1 }
      },
      {
        title: "Settlement",
        link: "/admin/settlement/partner-settlement",
        queryParams: { page: 1 }
      },
    ],
  },
  {
    title: "Coupons",
    icon: "shopping-cart-outline",
    link: "/admin/coupons/view-coupons",
    queryParams: { page: 1 }
  },
  {
    title: "Offers",
    icon: "gift-outline",
    link: "/admin/offers/view-offer",
    queryParams: { page: 1 }
  },
  {
    title: "Reports",
    icon: "file-text-outline",
    children: [
      {
        title: "Trip Payments",
        link: "/admin/reports/trip-payment",
        queryParams: { page: 1 }
      },
      {
        title: "Partner Attendence",
        link: "/admin/reports/partner-attendence",
        queryParams: { page: 1 }
      },
      {
        title: "Expired Partners",
        link: "/admin/reports/partner-expiry",
        queryParams: { page: 1 }
      },
      {
        title: "Expired Vehicles",
        link: "/admin/reports/vehicle-expiry",
        queryParams: { page: 1 }
      },
      {
        title: "Reviews",
        link: "/admin/reports/reviews",
        queryParams: { page: 1 }
      },
    ],
  },
  {
    title: "Services",
    icon: "globe-outline",
    children: [
      {
        title: "Areas",
        link: "/admin/services/view-service-available-citys",
        queryParams: { page: 1 }
      },
      {
        title: "Services",
        link: "/admin/services/view-list-services",
        queryParams: { page: 1 }
      },
      {
        title: "Pricing",
        link: "/admin/services/view-priceing",
        queryParams: { page: 1 }
      },
      {
        title: "Outstation",
        link: "/admin/services/view-outstation-package",
        queryParams: { page: 1 }
      },
    ],
  },
  {
    title: "Utility",
    icon: "clipboard-outline",
    children: [
      {
        title: "Onboard",
        link: "/admin/utility/view-onboard",
        queryParams: { page: 1 }
      },
      {
        title: "Admin Group",
        link: "/admin/utility/view-amdin-group",
        queryParams: { page: 1 }
      },
      {
        title: "Countries",
        link: "/admin/utility/view-country",
        queryParams: { page: 1 }
      },
      {
        title: "States",
        link: "/admin/utility/view-state",
        queryParams: { page: 1 }
      },
      {
        title: "Cities",
        link: "/admin/utility/view-city",
        queryParams: { page: 1 }
      },
      {
        title: "Currencies",
        link: "/admin/utility/view-currency",
        queryParams: { page: 1 }
      },
      {
        title: "Makes",
        link: "/admin/utility/view-make",
        queryParams: { page: 1 }
      },
      {
        title: "Models",
        link: "/admin/utility/view-model",
        queryParams: { page: 1 }
      },
    ],
  },
  {
    title: "Settings",
    icon: "settings-2-outline",
    link: "/admin/settings/config",
  },
  {
    title: "Multilingual",
    icon: "globe-2-outline",
    children: [
      {
        title: "Languages",
        icon: "hard-drive-outline",
        link: "/admin/languages/view-language",
        queryParams: { page: 1 }
      },
      {
        title: "Translations",
        icon: "hard-drive-outline",
        link: "/admin/translation/view-translation",
        queryParams: { page: 1 }
      },
    ]
  },
];
