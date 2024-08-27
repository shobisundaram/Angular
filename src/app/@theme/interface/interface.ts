export interface Admin {
  _id: string;
  fname: string;
  lname: string;
  phoneCode: number;
  phone: number;
  email: string;
  password: string;
  confirmPassword: string;
  profile: string;
  group: any;
  scIds: string;
}
export interface Company {
  _id: string;
  fname: string;
  lname: string;
  phoneCode: number;
  phone: number;
  email: string;
  password: string;
  confirmPassword: string;
  profile: string;
}
export interface Partner {
  _id: string;
  fname: string;
  lname: string;
  phoneCode: string;
  phone: number;
  email: string;
  gender: string;
  currency: string;
  language: string;
  country: string;
  state: string;
  city: string;
  password: string;
  confirmPassword: string;
  profile: any;
  scId: string;
  taxis: string;
  status: string;
  uniCode: string;
}
export interface Vehicle {
  _id: string;
  registrationnumber: string;
  makeid: string;
  model: string;
  servicetype: string;
  year: number;
  color: string;
  ownerType: string;
  ownerId: string;
  partnerId: string;
}
export interface Rider {
  _id: string;
  fname: string;
  lname: string;
  phoneCode: string;
  phone: string;
  email: string;
  gender: string;
  currency: string;
  language: string;
  country: string;
  state: string;
  city: string;
  password: string;
  confirmPassword: string;
  profile: string;
}

export interface Package {
  _id: string;
  name: string;
  description: string;
  type: string;
  amount: number;
  credits: number;
  validity: number;
  limit: number;
  serviceArea: string;
  image: string;
}

export interface Subscription {
  _id: string;
}
export interface Coupons {
  _id: string;
  code: string;
  // offerType: string;
  // offer_rate: string;
  // percentage: string;
  start: string;
  end: string;
  startTime: string;
  endTime: string;
  limit: string;
  userLimit: string;
  offerValue: string;
  offerLimit: string;
  scIds: string;
  tripType: string;
  status: string;
  // category: string;
  applyType: string;
}
export interface Offer {
  _id: string;
  scIds: string;
  start: string;
  end: string;
  title: string;
  description: string;
  offerImg: string;
  hasCoupon: boolean;
  couponId: string;
}
export interface Service_Available_City {
  _id: string;
  name: string;
  countryId: string;
  stateId: string;
  cityId: string;
  centerPoint: string;
  customerPrefix: string;
  partnerPrefix: string;
  tripPrefix: string;
  status: string;
  polygon: any;
}
export interface list_Services {
  partnerId: any;
  riderLater: any;
  lowerServicesType: any;
  scheduleLater: any;
  _id: any;
  name: any;
  id: any;
  order: string;
  // cities: string;
  serviceType: any;
  rideLater: any;
  description: string;
  status: string;
  seats: string;
  image: string;
  topViewImage: string;
  gender: string;
  features: string;
}
export interface Priceing {
  _id: string;
  serviceId: any;
  serviceAreaId: any;
  currencyId: any;
  fare: any;
  baseFare: number;
  bookingFare: number;
  minimumFare: number;
  commision: number;
  timeFare: string;
  additional: any;
  taxFare: any;
  cancelationFare: any;
  waitingFare: any;
}

export interface AdminGroup {
  _id: string;
  group: string;
  description: string;
  permission: any;
}
export interface Onboard {
  _id: string;
  title: string;
  description: string;
  image: string;
}
export interface Country {
  _id: string;
  name: string;
  code: string;
  phonecode: string;
}
export interface State {
  _id: string;
  name: string;
  code: string;
  country_id: string;
}
export interface City {
  _id: string;
  country_id: string;
  state_id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number
}
export interface Make {
  _id: string;
  name: string;
}
export interface Model {
  _id: string;
  name: string;
  year: number;
  make_id: string;
}
export interface Currencies {
  _id: string;
  name: string;
  code: any;
  country: any;
  symbol: any;
}

export interface Language {
  _id: string;
  name: string;
  indexName: string
  file: string;
  status: boolean
}

export interface translation {
  _id: string;
  interpret: string
  group: any
}

export interface tripDetails1 {
  _id: string,
  module: string,
  requestFrom: string,
  scheduleOn: string
  service: string,
  currency: string,
  customer: {
    id: string,
    name: string,
    profile: string,
    rating: string,
    cmts: string,
    tripOTP: [string],
    cancelReason: string
  },
  partner: {
    name: string,
    profile: string,
    vehicleId: string,
    vehicle: string,
    vehicleNo: string,
    rating: string,
    cmts: string,
    startTime: string,
    endTime: string,
    id: string,
    cancelReason: string
  },
  estimation: {
    baseFare: number,
    bookingFare: number,
    timeFare: number,
    minimumFare: number,
    commision: number,
    fareType: string,
    fareAmt: number,
    waitingFare: number,
    taxFare: number,
    additionalFare: number,
    additional: [],
    actualFare: number,
    discountFare: number,
    totalFare: number,
    distanceKM: number,
    estTime: number,
    start: string,
    end: string,
    startcoords: [number],
    endcoords: [number],
    _id: string
  },
  invoice: {
    baseFare: number,
    bookingFare: number,
    timeFare: number,
    minimumFare: number,
    commision: number,
    fareType: string,
    fareAmt: number,
    waitingFare: number,
    taxFare: number,
    additionalFare: number,
    additional: [],
    actualFare: number,
    discountFare: number,
    totalFare: number,
    distanceKM: number,
    estTime: number,
    start: string,
    end: string,
    startcoords: [number],
    endcoords: [number],
    _id: string
  },
  review: string,
  routeImage: string,
  status: string,
  partnerList: [
    {
      partnerId: string,
      partnerUniCode: string,
      serviceTypeName: string,
      status: string,
      distance: number,
      _id: string
    }
  ],
  referenceNo: number
  vehicleImage: string,
  partnerProfile: string,
  partnerPhoneCode: string,
  partnerPhone: string,
  customerProfile: string,
  customerPhoneCode: string,
  customerPhone: string,
  partnerRating: {
    totalValue: number,
    totalCount: number
  },
  customerRating: {
    totalValue: number,
    totalCount: number
  },
  shareLink: string
}
export interface tripDetails {

  _id: string,
  requestFrom: string,
  module: string,
  serviceType: string,
  serviceTypeName: string,
  scheduleOn: string,
  timeZone: string,
  currency: string,
  distanceMetric: string
  customer: {
    id: string,
    name: string,
    code: string,
    email: string,
    phoneNo: string,
    phoneCode: string,
    profile: string,
    experience: number,
    myRating: number,
    requestPin: string,
    rating: number,
    comment: string,
    cancelReason: string
  },
  partner: {
    id: string,
    name: string,
    code: string,
    email: string,
    phoneNo: string,
    phoneCode: string,
    profile: string,
    vehicle: string,
    vehicleNo: string,
    serviceType: string,
    serviceTypeName: string,
    experience: number,
    myRating: number,
    acceptTime: string,
    acceptLocation: any[],
    arriveTime: string,
    arriveLocation: any[],
    startTime: string,
    startLocation: any[],
    endTime: string,
    endLocation: any[],
    rating: number,
    comment: number,
    cancelReason: number
  },
  estimation: {
    distance: number,
    estTime: number,
    start: string,
    end: string,
    startcoords: any[],
    endcoords: any[],
    baseFare: number,
    bookingFare: number,
    timeFare: number,
    minimumFare: number,
    fareType: string,
    fareAmt: number,
    waitingFare: number,
    taxFare: number,
    additionalFare: number,
    additional: [
      {
        name: string,
        fareType: string,
        actual: number,
        fare: number,
        _id: string
      }
    ],
    actualFare: number,
    discountFare: number,
    wallet: number,
    offers: [],
    coupon: string,
    roundOff: number,
    totalFare: number,
    commision: number,
    earnings: number,
    payable: number,
    _id: string
  },
  invoice: {
    distance: number,
    estTime: number,
    start: string,
    end: string,
    startcoords: any[],
    endcoords: any[],
    baseFare: number,
    bookingFare: number,
    timeFare: number,
    minimumFare: number,
    fareType: string,
    fareAmt: number,
    waitingFare: number,
    taxFare: number,
    additionalFare: number,
    additional: [
      {
        name: string,
        fareType: string,
        actual: number,
        fare: number,
        _id: string
      }
    ],
    actualFare: number,
    discountFare: number,
    wallet: number,
    offers: any[],
    coupon: string,
    roundOff: number,
    totalFare: number,
    commision: number,
    earnings: number,
    payable: number,
    _id: string
  },
  review: string,
  routeImage: string,
  status: string,
  paymentMethod: string,
  partnerList: [
    {
      partnerId: string,
      partnerUniCode: string,
      serviceTypeName: string,
      status: string,
      distance: number,
      requestTime: string,
      _id: string
    }
  ],
  referenceNo: number,
  vehicleImage: string,
  partnerProfile: string,
  partnerPhoneCode: string,
  partnerPhone: string,
  customerProfile: string,
  customerPhoneCode: string,
  customerPhone: string,
  partnerRating: {
    totalValue: number,
    totalCount: number
  },
  customerRating: {
    totalValue: number,
    totalCount: number
  },
  shareLink: string

}