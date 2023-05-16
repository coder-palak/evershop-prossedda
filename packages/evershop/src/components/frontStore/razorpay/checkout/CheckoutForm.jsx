import React, { useState, useEffect } from 'react';
import { useQuery } from 'urql';
import { useCheckout } from '@components/common/context/checkout';
import Button from '@components/common/form/Button';
import { Field } from '@components/common/form/Field';

const cartQuery = `
  query Query($cartId: String) {
    cart(id: $cartId) {
      billingAddress {
        cartAddressId
        fullName
        postcode
        telephone
        country {
          name
          code
        }
        province {
          name
          code
        }
        city
        address1
        address2
      }
      shippingAddress {
        cartAddressId
        fullName
        postcode
        telephone
        country {
          name
          code
        }
        province {
          name
          code
        }
        city
        address1
        address2
      }
      customerEmail
    }
  }
`;

const cardStyle = {
  style: {
    base: {
      color: '#737373',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#737373'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  },
  hidePostalCode: true
};

export default function CheckoutForm() {
  const [, setSucceeded] = useState(false);
  const [cardComleted, setCardCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [, setDisabled] = useState(true);
  const [razorpayOrderId, setRazorpayOrderId] = useState('');
  const [showTestCard, setShowTestCard] = useState('success');
  const { cartId, orderId, orderPlaced, paymentMethods, checkoutSuccessUrl } =
    useCheckout();
    console.log(cartId, orderId, orderPlaced, paymentMethods, checkoutSuccessUrl)

  const [result] = useQuery({
    query: cartQuery,
    variables: {
      cartId
    },
    pause: orderPlaced === true
  });

  useEffect(() => {
    // Create PaymentIntent as soon as the order is placed
    if (orderId) {
      window
        .fetch('/api/razorpay/create/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ order_id: orderId })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log('razorPay', data);
            setRazorpayOrderId(data.id);
        });
    }
  }, [orderId]);

//   useEffect(() => {
//     const pay = async () => {
//       const billingAddress =
//         result.data.cart.billingAddress || result.data.cart.shippingAddress;
//       const payload = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: billingAddress.fullName,
//             email: result.data.cart.customerEmail,
//             phone: billingAddress.telephone,
//             address: {
//               line1: billingAddress.address1,
//               country: billingAddress.country.code,
//               state: billingAddress.province.code,
//               postal_code: billingAddress.postcode,
//               city: billingAddress.city
//             }
//           }
//         }
//       });

//       if (payload.error) {
//         setError(`Payment failed ${payload.error.message}`);
//       } else {
//         setError(null);
//         setSucceeded(true);
//         // Redirect to checkout success page
//         window.location.href = `${checkoutSuccessUrl}/${orderId}`;
//       }
//     };

//     if (orderPlaced === true && clientSecret) {
//       pay();
//     }
//   }, [orderPlaced, clientSecret, result]);

//   const handleChange = (event) => {
//     // Listen for changes in the CardElement
//     // and display any errors as the customer types their card details
//     setDisabled(event.empty);
//     if (event.complete === true && !event.error) {
//       setCardCompleted(true);
//     }
//   };

//   const testSuccess = () => {
//     setShowTestCard('success');
//   };

//   const testFailure = () => {
//     setShowTestCard('failure');
//   };

//   if (result.error) {
//     return (
//       <p>
//         Oh no...
//         {error.message}
//       </p>
//     );
//   }
//   // Check if the selected payment method is Stripe
//   const stripePaymentMethod = paymentMethods.find(
//     (method) => method.code === 'stripe' && method.selected === true
//   );
//   if (!stripePaymentMethod) return null;

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>Hello</div>
  );
}
