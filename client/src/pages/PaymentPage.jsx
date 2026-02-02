import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation } from 'react-router-dom'
import PaymentForm from './PaymentForm';

const stripePromise=loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
    const location=useLocation();
    const {amount=0,  bookingId}= location.state || {};
    console.log("💳 PaymentPage:", amount, bookingId);
  return (
    <Elements stripe={stripePromise}> 
    <PaymentForm amount={amount} bookingId={bookingId}/>
    </Elements>
  )
}

export default PaymentPage