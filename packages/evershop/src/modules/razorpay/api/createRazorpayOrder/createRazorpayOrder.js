const { select } = require('@evershop/postgres-query-builder');
const smallestUnit = require('zero-decimal-currencies');
const Razorpay = require('razorpay');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { getSetting } = require('../../../setting/services/setting');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const {
  OK,
  INVALID_PAYLOAD
} = require('@evershop/evershop/src/lib/util/httpStatus');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  // eslint-disable-next-line camelcase
  const { order_id } = request.body;
  // Check the order
  const order = await select()
    .from('order')
    .where('uuid', '=', order_id)
    .load(pool);
  console.log('sssssssssss', order);
  if (!order) {
    response.status(INVALID_PAYLOAD);
    response.json({
      error: {
        status: INVALID_PAYLOAD,
        message: 'Invalid order'
      }
    });
  } else {
    const razorpayConfig = getConfig('system.razorpay', {});
    console.log('hkjhkjkj', razorpayConfig)
    let secretKey;
    let publishKey;
    if (razorpayConfig.secretKey) {
      secretKey = razorpayConfig.secretKey;
    } else {
      secretKey = await getSetting('razorpaySecretKey', '');
    }

    if (razorpayConfig.publicKey) {
      publishKey = razorpayConfig.publicKey;
    } else {
      publishKey = await getSetting('razorpayPublishableKey', '');
    }
    console.log(razorpayConfig, secretKey, publishKey)
    const razorpay = new Razorpay({
      key_id: publishKey,
      key_secret: secretKey,
    });
    //smallestUnit.default(order.grand_total, order.currency)
    const options = {
      amount: 2000,
      currency: "INR",
      receipt: getRecieptNumber(),
    }
    console.log(options)
    razorpay.orders.create(options, function (err, order){
      if(err){
        return response.status(500).json(err);
      }
      return response.status(OK).json(order);
    })
  }

  /**
 * 
 * @param {number} min 
 * @param {number} max 
 * 
 * @returns {string}
 */
function getRecieptNumber(min = 0, max = 500000){
  min = Math.ceil(min);
  max = Math.floor(max);
  const num =  Math.floor(Math.random() * (max - min + 1)) + min;
  return num.toString().padStart(6, "0")
};
};
