import logoPng from './logo.png'
import logoEvent from './logoEvent.png'
import searchIcon from './searchIcon.svg'
import userIcon from './userIcon.svg'
import calenderIcon from './calenderIcon.svg'
import locationIcon from './locationIcon.svg'
import starIconFilled from './starIconFilled.svg'
import arrowIcon from './arrowIcon.svg'
import nextArrow from './nextArrow.svg'
import prevArrow from './prevArrow.svg'
import food from './food.avif'
import decor from './decor.jpg'
import music from './music.jpg'
import silver from './silver.jpeg'
import custom from './custom.jpeg'

import starIconOutlined from './starIconOutlined.svg'
import instagramIcon from './instagramIcon.svg'
import facebookIcon from './facebookIcon.svg'
import twitterIcon from './twitterIcon.svg'
import linkendinIcon from './linkendinIcon.svg'
import freeWifiIcon from './freeWifiIcon.svg'
import freeBreakfastIcon from './freeBreakfastIcon.svg'
import roomServiceIcon from './roomServiceIcon.svg'
import mountainIcon from './mountainIcon.svg'
import poolIcon from './poolIcon.svg'
import homeIcon from './homeIcon.svg'
import closeIcon from './closeIcon.svg'
import locationFilledIcon from './locationFilledIcon.svg'
import heartIcon from './heartIcon.svg'
import badgeIcon from './badgeIcon.svg'
import menuIcon from './menuIcon.svg'
import closeMenu from './closeMenu.svg'
import guestsIcon from './guestsIcon.svg'
import galleryImg1 from './galleryImg1.jpg';
import galleryImg2 from './galleryImg2.jpg';
import galleryImg3 from './galleryImg3.jpg';
import galleryImg4 from './galleryImg4.jpg';
import galleryImg5 from './galleryImg5.jpg';
import galleryImg6 from './galleryImg6.jpg';
import galleryImg7 from './galleryImg7.jpg';
import galleryImg8 from './galleryImg8.jpg';
import galleryImg9 from './galleryImg9.jpg';
import galleryImg10 from './galleryImg10.jpg';
import galleryImg11 from './galleryImg11.jpg';
import galleryImg12 from './galleryImg12.jpg';
import galleryImg13 from './galleryImg13.jpg';
import galleryImg14 from './galleryImg14.jpg';
import galleryImg15 from './galleryImg15.jpg';
import galleryImg16 from './galleryImg16.jpg';

import regImage from './regImage.png'
import addIcon from "./addIcon.svg";
import dashboardIcon from "./dashboardIcon.svg";
import listIcon from "./listIcon.svg";
import uploadArea from "./uploadArea.svg";
import totalBookingIcon from "./totalBookingIcon.svg";
import totalRevenueIcon from "./totalRevenueIcon.svg";


export const assets = {
    logoPng,
    logoEvent,
    food,
    silver,
    custom,
    decor, 
    music,
    searchIcon,
    userIcon,
    calenderIcon,
    locationIcon,
    starIconFilled,
    arrowIcon,
    nextArrow,
    prevArrow,
    starIconOutlined,
    instagramIcon,
    facebookIcon,
    twitterIcon,
    linkendinIcon,
    freeWifiIcon,
    freeBreakfastIcon,
    roomServiceIcon,
    mountainIcon,
    poolIcon,
    closeIcon,
    homeIcon,
    locationFilledIcon,
    heartIcon,
    badgeIcon,
    menuIcon,
    closeMenu,
    guestsIcon,
    regImage,
    addIcon,
    dashboardIcon,
    listIcon,
    uploadArea,
    totalBookingIcon,
    totalRevenueIcon,
   
    
}

export const eventTypes = [
    "Birthday Party",
    "Wedding Reception",
    "Engagement",
   " Anniversary",
    "WorkShop",
    "Seminar",
    "Business Meeting",
    "Eid Milan Party",
    "Graduation Ceremony"
];

//Check Availability of Events
export const availableEvents = [
  { id: 1, eventType: "Birthday Party", date: "2025-08-20", time: "18:00", maxGuests: 100 },
  { id: 2, eventType: "Wedding", date: "2025-08-25", time: "12:00", maxGuests: 200 },
  { id: 3, eventType: "Corporate Event", date: "2025-08-22", time: "15:00", maxGuests: 150 },
];

// ✅ Gallery Images Export
export const galleryImages = [
    {
    _id: 1,title: "Birthday Celebration",image: galleryImg1,
  },
  {
    _id: 2,title: "Elegant Wedding Hall",description: "Beautifully decorated wedding hall with floral arrangements",image: galleryImg2,
  },
  
  {
    _id: 3,title: "Engagement Ceremony",image: galleryImg3,
  },
  {
    _id: 4,title: "Social Event Party", image: galleryImg4,
  },
  {
    _id: 5,title: "Corporate Event", image: galleryImg5,
  },
  {
    _id: 6,title: "Concert Event", image: galleryImg6,
  },
  {
    _id: 7,title: "Buffet Food",image: galleryImg7,
  },
  {
    _id: 8,title: "High Tea Snacks",image: galleryImg8,
  },
  {
    _id: 9,title: "Birthday Cake Table",image: galleryImg9,
  },
  {
    _id: 10,title: "OutDoor Decor",image: galleryImg10,
  },
  {
    _id: 11,title: "VIP Seating Area",image: galleryImg11,
  },
  {
    _id: 12,title: "OutDoor Seating Arrangements with flower decor",image: galleryImg12,
  },
  {
    _id: 13,title: "Wedding Dinner Setup",image: galleryImg13,
  },
  {
    _id: 14,title: "Round Table Setup",image: galleryImg14,
  },
  {
    _id: 15,title: "Lighting Decoration",description: "Casual decoration and dining setup for family gatherings",image: galleryImg15,
  },
  {
    _id: 16,title: "Photo Booth Setup",description: "Casual decoration and dining setup for family gatherings",image: galleryImg16,
  },
];









// User Dummy Data
export const userDummyData = {
    "_id": "user_2unqyL4diJFP1E3pIBnasc7w8hP",
    "username": "Great Stack",
    "email": "user.greatstack@gmail.com",
    "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2N2c5YVpSSEFVYVUxbmVYZ2JkSVVuWnFzWSJ9",
    "role": "hotelOwner",
    "createdAt": "2025-03-25T09:29:16.367Z",
    "updatedAt": "2025-04-10T06:34:48.719Z",
    "__v": 1,
    "recentSearchedCities": [
        "New York"
    ]
}

// User Bookings Dummy Data
export const userBookingsDummyData = [
    {
    id: "BKG001",
    eventName: "Birthday Party",
    date:"2025-08-25 ",
    time: "06:00 PM",
    guests: 50,
    food: "Veg & BBQ",
    decoration: "Balloon + Flowers",
    status: "Confirmed",
    paymentStatus: "Paid"
  },
  {
    id: "BKG002",
    eventName: "Corporate Meeting",
    date:"2025-08-25 ",
    time: "06:00 PM",
    guests: 20,
    food: "Tea & Snacks",
    decoration: "Minimal Theme",
    status: "Pending",
    paymentStatus: "Pending"
  },
  {
    id: "BKG003",
    eventName: "Wedding Reception",
    date:"2025-08-25 ",
    time: "06:00 PM",
    guests: 200,
    food: "Full Course Buffet",
    decoration: "Royal Theme",
    status: "Cancelled",
    paymentStatus: "Refunded"
  }
]


