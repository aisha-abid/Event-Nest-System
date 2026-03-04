import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { showCustomToast } from "../utils/toastUtils";


const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const formData = location.state?.formData;
  const [formData, setFormData] = useState(location.state?.formData || {});

  // Foods states
  const [starters, setStarters] = useState([]);
  const [salads, setSalads] = useState([]);
  const [mainCourse, setMainCourse] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [beverages, setBeverages] = useState([]);

  // UI states
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedDishes, setSelectedDishes] = useState({});
  const [foodPackage, setFoodPackage] = useState(""); // silver | gold | custom

  // Toggle dropdown
  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  // Handle selection with package rules
  const handleSelect = (category, itemId) => {
    if (!foodPackage) {
    alert("Please select a food package first!");
    return;
    }
    setSelectedDishes((prev) => {
      const prevCategory = prev[category] || [];
      let newCategory;

      // Limit rules
      const limit =
        foodPackage === "silver"
          ? 2
          : foodPackage === "gold"
          ? 3
          : null; // custom unlimited

      if (prevCategory.includes(itemId)) {
        // Deselect
        newCategory = prevCategory.filter((id) => id !== itemId);
      } else {
        if (limit && prevCategory.length >= limit) {
          // alert(
          //   `You can select maximum ${limit} items from ${category} in ${foodPackage} package`
          // );
          showCustomToast(`You can select maximum ${limit} items from ${category} in ${foodPackage} package`);
          return prev;
        }
        newCategory = [...prevCategory, itemId];
      }

      return { ...prev, [category]: newCategory };
    });
  };

  // Render category
  const renderCategory = (title, category, items) => (
    <div className="mb-3 border rounded p-2" key={category}>
      <h4
        className="font-medium cursor-pointer bg-gray-100 p-2 rounded"
        onClick={() => toggleCategory(category)}
      >
        {title} {openCategory === category ? "▲" : "▼"}
      </h4>
      {openCategory === category && (
        <div className="pl-4 mt-2">
          {items.map((item) => (
            <label key={item._id} className="block">
              <input
                type="checkbox"
                checked={selectedDishes[category]?.includes(item._id) || false}
                onChange={() => handleSelect(category, item._id)}
              />
              {item.name} - $ {item.price}
            </label>
          ))}
        </div>
      )}
    </div>
  );


  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

      // 👇 saari categories ek array me merge kar li
  const allDishes = [
    ...starters,
    ...salads,
    ...mainCourse,
    ...desserts,
    ...drinks,
    ...beverages,
  ];

  // 👇 EventType ka final value set karo
  const finalEventType =
    formData.eventType === "Other" ? formData.customEvent || "Other" : formData.eventType;


    const data = {
      name: form.name.value,
      phone: form.phone.value,
      eventType: finalEventType,
      guests: Number(form.guests.value),
      foodPackage,
      selectedDishes: Object.entries(selectedDishes).flatMap(([category, ids]) =>
      ids.map(id => {
      const dish = allDishes.find(d => d._id === id); // 👈 dish object nikala
    return {
      food: id,
      category,
      quantity: 1,
    };
  })
),
      decoration: form.decoration.value,
      date: form.date.value,
      time: form.time.value,
    };
    console.log("Booking data before sending:", data); 

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/v1/bookings/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        const booking = res.data.booking;
        showCustomToast("🎉 Booking successful!");
        navigate("/summary-booking", {
          state: { bookingData: booking, totalPrice: booking.totalPrice },
        });
      }
    } catch (error) {
      console.error("Booking failed:", error.response?.data || error.message);
     showCustomToast(error.response?.data?.message || "Failed to book event.");

    }
  };

  // Fetch foods
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const categories = [
          "starters",
          "salads",
          "mainCourse",
          "desserts",
          "drinks",
          "beverages",
        ];
        
        const requests = categories.map((cat) =>
          axios.get(`http://localhost:5000/api/v1/foods/category/${cat}`)
        );

        const responses = await Promise.all(requests);

console.log("Starters:", responses[0].data);
console.log("Main Course:", responses[2].data);

        setStarters(responses[0].data.foods);
        setSalads(responses[1].data.foods);
        setMainCourse(responses[2].data.foods);
        setDesserts(responses[3].data.foods);
        setDrinks(responses[4].data.foods);
        setBeverages(responses[5].data.foods);
      } catch (err) {
        console.error("Error fetching foods:", err);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 mt-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-2xl w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Event Booking Form
        </h2>

        {/* Full Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-gray-700 font-medium"
          >
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="Enter your Phone no."
            pattern="[0-9]{10,15}"
            required
          />
        </div>
<div className="mb-4">
  <label
    htmlFor="eventType"
    className="block text-gray-700 font-medium"
  >
    Event Type
  </label>
  <select
    name="eventType"
    id="eventType"
    className="w-full border rounded-lg p-2 mt-1"
    value={formData.eventType || ""}
    onChange={(e) =>
      setFormData({ ...formData, eventType: e.target.value })
    }
    required
  >
    <option value="">Select Event</option>
    <option value="Birthday Party">Birthday Party</option>
    <option value="Wedding Reception">Wedding Reception</option>
    <option value="Engagement">Engagement</option>
    <option value="Anniversary">Anniversary</option>
    <option value="WorkShop">WorkShop</option>
    <option value="Seminar">Seminar</option>
    <option value="Business Meeting">Business Meeting</option>
    <option value="Eid Milan Party">Eid Milan Party</option>
    <option value="Graduation Ceremony">Graduation Ceremony</option>
    <option value="Conference">Conference</option>
    <option value="Concert">Concert</option>
    <option value="Exhibition">Exhibition</option>
    <option value="Charity Event">Charity Event</option>
    <option value="Cultural Festival">Cultural Festival</option>
    <option value="Farewell Party">Farewell Party</option>
    <option value="Sports Event">Sports Event</option>
    <option value="Music Festival">Music Festival</option>
    <option value="Product Launch">Product Launch</option>
    <option value="Family Gathering">Family Gathering</option>
    <option value="Other">Other</option>
  </select>

  {/* ✅ Show input if Other selected */}
  {formData.eventType === "Other" && (
    <input
      type="text"
      className="w-full border rounded-lg p-2 mt-2"
      placeholder="Enter your event type"
      value={formData.customEvent || ""} // separate state field
      onChange={(e) =>
        setFormData({ ...formData, customEvent: e.target.value })
      }
    />
  )}
</div>
        {/* Guests */}
        <div className="mb-4">
          <label
            htmlFor="guests"
            className="block text-gray-700 font-medium"
          >
            No. of Guests
          </label>
          <input
            type="number"
            name="guests"
            id="guests"
            min={1}
            max={2000}
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="Number of guests"
            required
          />
        </div>

        {/* Food Package */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Food Package
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="border rounded-lg p-4 cursor-pointer hover:shadow-md">
              <input
                type="radio"
                name="foodPackage"
                value="silver"
                checked={foodPackage === "silver"}
                onChange={(e) => setFoodPackage(e.target.value)}
                required
              />
              <span className="font-semibold">Silver Package</span>
              <p className="text-sm text-gray-500">
                2 Starters, 2 Main Course, 2 Salads, 2 Desserts, 2 Drinks 2 Beverage
              </p>
            </label>

            <label className="border rounded-lg p-4 cursor-pointer hover:shadow-md">
              <input
                type="radio"
                name="foodPackage"
                value="gold"
                checked={foodPackage === "gold"}
                onChange={(e) => setFoodPackage(e.target.value)}
              />
              <span className="font-semibold">Gold Package</span>
              <p className="text-sm text-gray-500">
                3 Starters, 3 Main Course, 3 Salads, 3 Desserts, 3 Drinks 3 Beverage
              </p>
            </label>

            <label className="border rounded-lg p-4 cursor-pointer hover:shadow-md">
              <input
                type="radio"
                name="foodPackage"
                value="custom"
                checked={foodPackage === "custom"}
                onChange={(e) => setFoodPackage(e.target.value)}
              />
              <span className="font-semibold">Custom Package</span>
              <p className="text-sm text-gray-500">
                Choose freely from all dishes
              </p>
            </label>
          </div>
        </div>

        {/* Dishes Dropdowns */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Select Dishes
          </h3>

          {renderCategory("Starters", "starters", starters)}
          {renderCategory("Salads", "salads", salads)}
          {renderCategory("Main Course", "mainCourse", mainCourse)}
          {renderCategory("Desserts", "desserts", desserts)}
          {renderCategory("Drinks", "drinks", drinks)}
          {renderCategory("Beverages", "beverages", beverages)}
        </div>

        {/* Decoration */}
        <div className="mb-4">
          <label
            htmlFor="decoration"
            className="block text-gray-700 font-medium"
          >
            Decoration Preference
          </label>
          <select
            name="decoration"
            id="decoration"
            className="w-full border rounded-lg p-2 mt-1"
            required
          >
            <option value="" disabled hidden>
              Select Decoration
            </option>
            {/* Individual */}
    <option value="flowers">Flowers</option>
    <option value="balloons">Balloons only</option>
    <option value="candles">Candles / Lights</option>

    {/* Themes */}
    <option value="birthdayTheme">Birthday Theme</option>
    <option value="weddingTheme">Wedding Theme</option>
    <option value="engagementTheme">Engagement Theme</option>
    <option value="anniversaryTheme">Anniversary Theme</option>
    <option value="workshopTheme">Workshop Theme</option>
    <option value="seminarTheme">Seminar Theme</option>
    <option value="businessMeetingTheme">Business Meeting Theme</option>
    <option value="eidMilanTheme">Eid Milan Theme</option>
    <option value="graduationTheme">Graduation Theme</option>
    <option value="bridalShowerTheme">Bridal Shower Theme</option>
    <option value="corporateTheme">Corporate Theme</option>
    <option value="concertTheme">Concert Theme</option>

    {/* Mix */}
    <option value="flowersCandles">Flowers + Candles</option>
    <option value="flowersBalloons">Flowers + Balloons</option>
    <option value="candlesBalloons">Candles + Balloons</option>
    <option value="flowersCandlesBalloons">Full Combo</option>
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="date"
              className="block text-gray-700 font-medium"
            >
              Event Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              className="w-full border rounded-lg p-2 mt-1"
              min={new Date().toISOString().split("T")[0]}
              defaultValue={formData?.eventDate || ""}
              readOnly={!!formData?.eventDate}
              required
            />
          </div>
          <div>
            <label
              htmlFor="time"
              className="block text-gray-700 font-medium"
            >
              Event Time
            </label>
            <input
              type="time"
              name="time"
              id="time"
              className="w-full border rounded-lg p-2 mt-1"
              defaultValue={formData?.eventTime || ""}
              readOnly={!!formData?.eventTime}
              required
            />
          </div>
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingPage;

