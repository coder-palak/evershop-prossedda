import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import useRazorpay from "react-razorpay";
import { useCheckout } from '@components/common/context/checkout';
function RazorpayApp({
  orderId,
  orderPlaced
}) {
  const [razorpayOrderId, setRazorpayOrderId] = useState('');
  const { checkoutSuccessUrl } =
    useCheckout();
  useEffect(() => {
    // Create PaymentIntent as soon as the order is placed
    if (orderId) {
      window
        .fetch('/api/razorpay/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ order_id: orderId })
        })
        .then((res) => res.json())
        .then((data) => {
          setRazorpayOrderId(data.id);
        });
    }
  }, [orderId]);

  const Razorpay = useRazorpay();

  const handlePayment = () => {
    const options = {
      key: "rzp_test_5gkWAoRkdBrWAg", // Enter the Key ID generated from the Dashboard
      amount: "3000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: razorpayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
      handler: function (response) {
        // setError(null);
        // setSucceeded(true);
        // Redirect to checkout success page
        window.location.href = `${checkoutSuccessUrl}/${orderId}`;
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name: "Piyush Garg",
        email: "youremail@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new Razorpay(options);

    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });

    rzp1.open();
  };
  if (razorpayOrderId) {
    handlePayment();
  }
  return (
    <div className="p-2 text-center border rounded mt-1 border-divider">
      You will be redirected to PayPal
    </div>
  );
}

RazorpayApp.propTypes = {
  orderId: PropTypes.string.isRequired,
  orderPlaced: PropTypes.bool.isRequired
};

export default function RazorpayMethod({ setting }) {
  const checkout = useCheckout();

  // Get the selected payment 
  const { paymentMethods, setPaymentMethods, orderPlaced, orderId } = checkout;
  console.log(paymentMethods, orderId)
  const selectedPaymentMethod = paymentMethods
    ? paymentMethods.find((paymentMethod) => paymentMethod.selected)
    : undefined;

  return (
    <div>
      <div className="flex justify-start items-center gap-1">
        {(!selectedPaymentMethod ||
          selectedPaymentMethod.code !== 'razorpay') && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPaymentMethods((previous) =>
                  previous.map((paymentMethod) => {
                    if (paymentMethod.code === 'razorpay') {
                      return {
                        ...paymentMethod,
                        selected: true
                      };
                    } else {
                      return {
                        ...paymentMethod,
                        selected: false
                      };
                    }
                  })
                );
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            </a>
          )}
        {selectedPaymentMethod && selectedPaymentMethod.code === 'razorpay' && (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2c6ecb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        )}
        <div>
          {/* <PaypalLogo width={70} /> */}
        </div>
      </div>
      <div>
        {selectedPaymentMethod && selectedPaymentMethod.code === 'razorpay' && (
          <div>
            <RazorpayApp
              orderPlaced={orderPlaced}
              orderId={orderId}
            />
          </div>
        )}
      </div>
    </div>
  );
}

RazorpayMethod.propTypes = {
  setting: PropTypes.shape({
    razorpayPublishableKey: PropTypes.string.isRequired
  }).isRequired
};

export const layout = {
  areaId: 'checkoutPaymentMethodrazorpay',
  sortOrder: 20
};

export const query = `
  query Query {
    setting {
      razorpayDislayName
      razorpayPublishableKey
    }
  }
`;
