import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { showCustomToast } from "../utils/toastUtils";

const UpdateBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    eventType: "",
    guests: "",
    foodPackage: "",
    decoration: "",
    selectedDishes: [], // ✅ Will be [{ food, category }]
  });

  const [allDishes, setAllDishes] = useState({
    starters: [],
    salads: [],
    mainCourse: [],
    desserts: [],
    drinks: [],
    beverages: [],
  });

  const packageLimits = {
    silver: 2,
    gold: 3,
    custom: null,
  };

  // ✅ Fetch booking + dishes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Booking detail
        const bookingRes = await axios.get(
          `http://localhost:5000/api/v1/customers/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const booking = bookingRes.data;

        // ✅ Ensure selectedDishes format
        const formattedDishes = booking.selectedDishes?.map((d) => ({
          food: d.food?._id || d.food, // handle both populated & plain IDs
          category: d.category,
        })) || [];

        setFormData({ ...booking, selectedDishes: formattedDishes });

        // Dishes categories fetch
        const categories = [
          "starters",
          "salads",
          "mainCourse",
          "desserts",
          "drinks",
          "beverages",
        ];

        const requests = categories.map((cat) =>
          axios.get(`http://localhost:5000/api/v1/foods/category/${cat}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const responses = await Promise.all(requests);

        setAllDishes({
          starters: responses[0].data.foods,
          salads: responses[1].data.foods,
          mainCourse: responses[2].data.foods,
          desserts: responses[3].data.foods,
          drinks: responses[4].data.foods,
          beverages: responses[5].data.foods,
        });
      } catch (err) {
        console.error("❌ Error fetching data:", err);
         showCustomToast("Unable to load your booking details. Please try again later.", "error");

      }
    };

    fetchData();
  }, [id, navigate]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle dish toggle
  const toggleDish = (dishId, category) => {
    let updated = [...formData.selectedDishes];

    const exists = updated.find((d) => d.food === dishId && d.category === category);

    if (exists) {
      updated = updated.filter((d) => !(d.food === dishId && d.category === category));
    } else {
      const limit = packageLimits[formData.foodPackage];

      if (limit) {
        const categoryCount = updated.filter((d) => d.category === category).length;
        if (categoryCount >= limit) {
         showCustomToast(
    `You can only select ${limit} ${category}(s) in the ${formData.foodPackage} package.`,
    "warning"
  );
          return;
        }
      }

      updated.push({ food: dishId, category });
    }

    setFormData({ ...formData, selectedDishes: updated });
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/v1/customers/update/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
     showCustomToast("Your booking has been updated successfully 🎉", "success");
      navigate("/my-bookings");
    } catch (err) {
      console.error("❌ Error updating booking:", err);
      showCustomToast("Something went wrong while updating. Please try again.", "error");
    }
  };

  // ✅ Render categories
  const renderCategory = (label, key, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-3">
        <h4 className="font-medium">{label}</h4>
        <div className="flex flex-wrap gap-2">
          {items.map((dish, i) => {
            const checked = formData.selectedDishes.some(
              (d) => d.food === dish._id && d.category === key
            );

            return (
              <label
                key={dish._id || i}
                className={`px-3 py-1 border rounded cursor-pointer ${
                  checked ? "bg-cyan-100 border-cyan-400" : "bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() => toggleDish(dish._id, key)}
                />
                {dish.name} ({dish.price} $)
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Booking</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Event Type */}
        <input
          type="text"
          name="eventType"
          placeholder="Event Type"
          value={formData.eventType || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Guests */}
        <input
          type="number"
          name="guests"
          placeholder="Guests"
          value={formData.guests || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Food Package */}
        <div className="space-y-3">
          <p className="font-medium">Food Package</p>
          {["silver", "gold", "custom"].map((pkg) => (
            <label
              key={pkg}
              className="block border rounded-lg p-3 cursor-pointer"
            >
              <input
                type="radio"
                name="foodPackage"
                value={pkg}
                checked={formData.foodPackage === pkg}
                onChange={handleChange}
              />
              <span className="ml-2 font-semibold capitalize">
                {pkg} Package
              </span>
            </label>
          ))}
        </div>

        {/* Dishes */}
        {formData.foodPackage && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Select Dishes
            </h3>
            {renderCategory("Starters", "starters", allDishes.starters)}
            {renderCategory("Salads", "salads", allDishes.salads)}
            {renderCategory("Main Course", "mainCourse", allDishes.mainCourse)}
            {renderCategory("Desserts", "desserts", allDishes.desserts)}
            {renderCategory("Drinks", "drinks", allDishes.drinks)}
            {renderCategory("Beverages", "beverages", allDishes.beverages)}
          </div>
        )}

        {/* Decoration */}
        <select
          name="decoration"
          onChange={handleChange}
          value={formData.decoration || ""}
          className="w-full border rounded-lg p-2 mt-1"
          required
        >
          <option value="">Select Decoration</option>
          <option value="flowers">Flowers only</option>
          <option value="balloons">Balloons only</option>
          <option value="candles">Candles / Lights</option>
          <option value="weddingTheme">Wedding Theme</option>
          <option value="birthdayTheme">Birthday Theme</option>
          <option value="corporateTheme">Corporate Theme</option>
          <option value="bridalShowerTheme">Bridal Shower Theme</option>
          <option value="concertTheme">Concert Theme</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-700"
        >
          Update Booking
        </button>
      </form>
    </div>
  );
};

export default UpdateBooking;
