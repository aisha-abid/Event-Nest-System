import Booking from "../models/Booking.js";
import Food from "../models/food.js"
import { packageRules } from "../config/packages.js"; // or DB

// Decoration cost mapping
const decorationPrices = {
  // Individual Items
  flowers: 15,
  balloons: 10,
  candles: 10,

  // Event Themes
  birthdayTheme: 12,            // Birthday Party
  weddingTheme: 15,             // Wedding Reception
  engagementTheme:  14,          // Engagement
  anniversaryTheme: 12,         // Anniversary
  workshopTheme: 8,            // Workshop
  seminarTheme: 8,             // Seminar
  businessMeetingTheme: 8,     // Business Meeting
  eidMilanTheme: 10,            // Eid Milan Party
  graduationTheme: 12,          // Graduation Ceremony
  bridalShowerTheme: 12,        // Bridal Shower
  corporateTheme: 12,           // Corporate Event
  concertTheme: 14,             // Concert

  // Mix Categories
  flowersCandles: 9,           // Flowers + Candles
  flowersBalloons: 8,          // Flowers + Balloons
  candlesBalloons: 10,          // Candles + Balloons
  flowersCandlesBalloons: 12    // Full combo (Flowers + Candles + Balloons)
};


  // Create Booking
export const createBooking = async (req, res) => {
  try {
    const { guests, selectedDishes,  decoration, date, time,eventType, name, phone, foodPackage } = req.body;

    // ⏳ 1. Calculate booking start & end
    const newStart = new Date(`${date}T${time}:00`);
    const newEnd = new Date(newStart.getTime() + 6 * 60 * 60 * 1000);

    // ⏳ 2. Check overlap in DB
    const bookings = await Booking.find({ date });
    let conflict = false;
    bookings.forEach((booking) => {
      const existingStart = new Date(`${booking.date}T${booking.time}:00`);
      const existingEnd = new Date(existingStart.getTime() + 6 * 60 * 60 * 1000);
      if (newStart < existingEnd && newEnd > existingStart) conflict = true;
    });

    if (conflict) {
      return res.status(400).json({
        message: "This time slot is already booked. Please choose another.",
      });
    }

 let dishDetails = [];
let foodTotalPerGuest = 0;

if (foodPackage === "custom" && Array.isArray(selectedDishes) && selectedDishes.length > 0) {
  const dishIds = selectedDishes.map(d => d.food);
  const dishesFromDB = await Food.find({ _id: { $in: dishIds } });

  dishDetails = selectedDishes.map(d => {
    const dbDish = dishesFromDB.find(f => f._id.toString() === d.food);
    if (!dbDish) return null;

    const qty = 1;
    foodTotalPerGuest += dbDish.price * qty;

    return {
      food: dbDish._id,
      quantity: qty,
      category: d.category || "N/A",
    };
  }).filter(Boolean);
}else if (foodPackage === "silver" || foodPackage === "gold") {
  const packageInfo = packageRules[foodPackage];
 

  if (Array.isArray(selectedDishes) && selectedDishes.length > 0) {
    // ✅ Use user selections, but validate against limits
    for (const [category, limit] of Object.entries(packageInfo.limits)) {
      const count = selectedDishes.filter(d => d.category === category).length;
      if (count > limit) {
        return res.status(400).json({
          message: `In ${foodPackage} package you can only select max ${limit} from ${category}.`
        });
      }
    }

 const dishIds = selectedDishes.map(d => d.food);
    const dishesFromDB = await Food.find({ _id: { $in: dishIds } });
dishDetails = selectedDishes.map(d => {
      const dbDish = dishesFromDB.find(f => f._id.toString() === d.food);
      if (!dbDish) return null;
      return {
        food: dbDish._id,
        quantity: 1,
        category: d.category || "N/A",
      };
    }).filter(Boolean);

    // price per head fixed from package rule
    foodTotalPerGuest = packageInfo.pricePerHead;
  } else {
    return res.status(400).json({ message: "Please select dishes for the package." });
  }
}



 //Calculate total food & total price
const totalFoodCost = foodTotalPerGuest * guests;
const decorationCost = decorationPrices[decoration] || 0;
const totalPrice = totalFoodCost + decorationCost;


    // Save Booking 
    const newBooking = await Booking.create({
      ...req.body,
      userId: req.user._id,
      name,
      phone,
      eventType,
      guests,
      decoration,
      date,
      time,
      selectedDishes: dishDetails,
      pricePerGuest: foodTotalPerGuest,
      decorationCost,
      totalPrice,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
      totalPrice,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create booking", error: err.message });
  }
}
// Get logged-in user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
    .populate("selectedDishes.food", "name price category")
    .sort({ createdAt: -1 })
    
   console.log("📌 My bookings data:", JSON.stringify(bookings, null, 2));

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

// Check hall availability
export const checkAvailability = async (req, res) => {
  try {
    const { eventDate, eventTime } = req.body;
    const newStart = new Date(`${eventDate}T${eventTime}:00`);
    const newEnd = new Date(newStart.getTime() + 6 * 60 * 60 * 1000);

    const bookings = await Booking.find({ date: eventDate });

    let conflict = false;
    bookings.forEach((booking) => {
      const existingStart = new Date(`${booking.date}T${booking.time}:00`);
      const existingEnd = new Date(existingStart.getTime() + 6 * 60 * 60 * 1000);
      if (newStart < existingEnd && newEnd > existingStart) conflict = true;
    });

    if (conflict) {
      return res.json({ available: false, message: "Hall is already booked during this time slot." });
    }

    res.json({ available: true, message: "Hall is available!" });
  } catch (err) {
    res.status(500).json({ message: "Error checking availability", error: err.message });
  }
};

