import axios from "axios";
import { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaSpinner } from "react-icons/fa";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { useParams , useNavigate } from "react-router-dom";

const PaymentForm = ({ amount = 0,  bookingId }) => {
  console.log("💰 Amount:", amount);
  console.log("🎟 Booking ID:", bookingId);
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null); // success/failure message
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [paid, setPaid] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem('token'); // Get token from storage
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Valid email is required";
    if (!amount || amount <= 0) newErrors.amount = "Invalid amount";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;
    if (!stripe || !elements) return;

    // Get token for authentication
    const token = getToken();
    if (!token) {
      setMessage({ type: "error", text: "Please login first" });
      return;
    }

    try {
      setLoading(true);

      // 1) Backend: PaymentIntent with authentication
      const { data } = await axios.post(
        "https://localhost:5000/api/v1/payment/pay",
        { amount, bookingId, name},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const { clientSecret, paymentId } = data;

      // 2) Frontend: confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name, email },
        },
        receipt_email: email,
      });

      if (result.error) {
        setMessage({ type: "error", text: result.error.message });
      } else if (result.paymentIntent?.status === "succeeded") {
        // 3) Backend: mark as confirmed with authentication
        await axios.post(
          "https://localhost:5000/api/v1/payment/confirm",
          {
            paymentId,
            paymentIntentId: result.paymentIntent.id,
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setMessage({ type: "success", text: "✅ Payment Successful" });
        setPaid(true);
      } else {
        setMessage({ type: "error", text: "Payment not completed." });
      }
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || err.message 
      });
    } finally {
      setLoading(false);
    }
  };
  
useEffect(() => {
  if (paid) {
    setTimeout(() => {
      navigate(`/my-bookings`);
    }, 8000); // 1 second delay
  }
}, [paid, navigate, id]);

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100 p-6 mt-16 '>
      <div className='bg-white shadow-lg rounded-2xl w-full max-w-md p-8'>
        {/* Heading */}
        <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>
          Payment Checkout
        </h2>
           <div className="mb-6 p-4 rounded-lg bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-sm">
      <strong>Note:</strong> Please make sure your booking details are correct before payment. 
      After payment, you will <span className="font-semibold">not be able to update your booking</span>.
    </div>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm mb-2'>
              Name on Card
            </label>
            <div className='relative'>
              <FaUser className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='John Doe'
                className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400'
              />
            </div>
            {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
          </div>

          {/* Email */}
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm mb-2'>
              Email
            </label>
            <div className='relative'>
              <FaEnvelope className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='johndoe@gmail.com'
                className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400'
              />
            </div>
            {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
          </div>

          {/* StripeCardElement */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm mb-2">
              Card Details
            </label>
            <div className="border rounded-lg px-3 py-3">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          </div>
          
          {/* Amount */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm mb-2">
              Amount
            </label>
            <input
              type="text"
              value={`USD ${amount}`}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
            {errors.amount && <p className='text-red-500 text-sm mt-1'>{errors.amount}</p>}
          </div>

          {/* Alert messages */}
          {message && (
            <p className={`text-center font-medium mb-4 ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}>
              {message.text}
            </p>
          )}

          {/* Pay Button */}
          <button
            type='submit'
            disabled={loading || paid}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2  ${
              paid
                  ? "bg-gray-700 text-white cursor-not-allowed"
                  :
              loading 
                ? "bg-gray-400 cursor-not-allowed text-white" 
                : "bg-black hover:bg-gray-800 text-white"
            }`}
          >
            {loading && <FaSpinner className="animate-spin" />}
            {paid ? "Paid"  :loading ? "Paying..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;