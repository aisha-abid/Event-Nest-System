import Booking from "../models/Booking.js";
import Food from "../models/food.js";
import { packageRules } from "../config/packages.js";

// Decoration cost mapping
const decorationPrices = {
  // Individual Items
  flowers: 25000,
  balloons: 20000,
  candles: 15000,

  // Event Themes
  birthdayTheme: 15000,            // Birthday Party
  weddingTheme: 30000,             // Wedding Reception
  engagementTheme: 22000,          // Engagement
  anniversaryTheme: 23000,         // Anniversary
  workshopTheme: 15000,            // Workshop
  seminarTheme: 18000,             // Seminar
  businessMeetingTheme: 20000,     // Business Meeting
  eidMilanTheme: 22000,            // Eid Milan Party
  graduationTheme: 20000,          // Graduation Ceremony
  bridalShowerTheme: 16000,        // Bridal Shower
  corporateTheme: 18000,           // Corporate Event
  concertTheme: 35000,             // Concert

  // Mix Categories
  flowersCandles: 35000,           // Flowers + Candles
  flowersBalloons: 42000,          // Flowers + Balloons
  candlesBalloons: 30000,          // Candles + Balloons
  flowersCandlesBalloons: 50000    // Full combo (Flowers + Candles + Balloons)
};

// 1️⃣ Get all confirmed bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?._id;
    console.log("Fetching bookings for userId:", userId); 
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const bookings = await Booking.find({ userId});
    console.log("Bookings found:", bookings); 
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};


// 2️⃣ Update a booking
export const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    console.log("Booking ID from params:", bookingId);
    console.log("Body data:", req.body);


    

    const booking = await Booking.findById(bookingId);
     console.log("Booking found in DB:", booking);

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.paymentStatus === "Success") {
  return res.status(400).json({ message: "Booking cannot be edited after payment" });
}

    // Update allowed fields
    const { name, phone, eventType, guests,  decoration,selectedDishes, foodPackage } = req.body;
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

   

    booking.name = name || booking.name;
    booking.eventType = eventType || booking.eventType;
    booking.phone = phone || booking.phone;
    booking.guests = guests || booking.guests;

    booking.selectedDishes = dishDetails;

    // booking.selectedDishes = selectedDishes || booking.dishDetails;
    booking.decoration = decoration || booking.decoration;
booking.decorationCost = decorationCost || booking.decorationCost;
   booking.foodCost = totalFoodCost;
booking.totalPrice = totalPrice;
    
// ✅ Save food package
booking.foodPackage = foodPackage || booking.foodPackage;

    await booking.save();
    res.status(200).json({ message: "Booking updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error });
  }
};

// 🔹 Get single booking by ID
export const getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    console.log("Booking status:", booking.status, "Payment status:", booking.paymentStatus);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
};
// 3️⃣ Cancel/Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const {bookingId} = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
     return res.status(404).json({ message: "Booking not found" });
    }
     
      // Case 1: Payment nahi hua → direct cancel
    if (booking.paymentStatus !== "Success") {
      await booking.deleteOne();
      return res.status(200).json({
        message: "Booking canceled successfully (no payment made)",
        cancelRequest: "None", 
      });
    }
    // Case 2: Payment ho chuka hai → Request admin approval
    if (booking.cancelRequest === "Pending") {
       return res.status(200).json({
        message: "Cancellation already requested. Waiting for admin approval.",
        cancelRequest: "Pending",
      });
    }
      booking.cancelRequest = "Pending"; // Mark request as pending
      await booking.save();
      
      return res.status(200).json({
        message: "Cancellation request sent to admin. Waiting for approval." ,
        cancelRequest: "Pending",
      });
    } catch (error) {
      
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: "Error canceling booking", error });
  }
};



// Admin approves/rejects cancel request
export const handleCancelRequest = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action } = req.body; // "Approved" or "Rejected"

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.cancelRequest !== "Pending") {
      return res.status(400).json({ message: "No pending cancel request" });
    }

    if (action === "Approved") {
      booking.cancelRequest = "Approved";
      // 👉 Yahan refund ka logic call hoga (Stripe API refund)
      await booking.deleteOne();
      return res.status(200).json({ message: "Cancel request approved & booking canceled with refund." });
    }

    if (action === "Rejected") {
      booking.cancelRequest = "Rejected";
      await booking.save();
      return res.status(200).json({ message: "Cancel request rejected by admin." });
    }

  } catch (error) {
    res.status(500).json({ message: "Error handling cancel request", error });
  }
};
