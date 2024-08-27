import { NbMenuItem } from "@nebular/theme";

export const COMPANY_MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Dashboard",
    icon: "monitor-outline",
    link: "/company/dashboard",
    home: true,
  },
  {
    title: "Partner",
    icon: "hard-drive-outline",
    link: "/company/partner/view-partner",
  },
  {
    title: 'Vehicle',
    icon: 'car-outline',
    link: "/company/vehicle/view-vehicle",
  },
  {
    title: "Trips",
    icon: "briefcase-outline",
    link: "/company/trips/all-trips",
  },
  {
    title: "Taxi Dispatch",
    icon: "pin-outline",
    link: "/company/dispatch/manual-taxi-dispatch",
  },
  {
    title: "Map Views",
    icon: "map-outline",
    children: [
      {
        title: "Partner Tracking",
        link: "/company/map-views/partner-tracking",
      },
    ],
  },
  {
    title: "Partner Payment",
    icon: "credit-card-outline",
    children: [
      {
        title: "Package List",
        link: "/company/payment/package-list/view-package-list",
      },
      {
        title: "Subscription",
        link: "/company/payment/subscription/view-partner-subscription",
      },
      {
        title: "Settlement",
        link: "/company/settlement/partner-settlement",
      },
    ],
  },
  {
    title: "Reports",
    icon: "file-text-outline",
    children: [
      {
        title: "Trip Payments",
        link: "/company/reports/trip-payment",
      },
      {
        title: "Partner Attendence",
        link: "/company/reports/partner-attendence",
      },
      {
        title: "Expired Partners",
        link: "/company/reports/partner-expiry",
      },
      {
        title: "Expired Vehicles",
        link: "/company/reports/vehicle-expiry",
      },
    ],
  },
]