import * as UnitPay from 'unitpay';

const u = new UnitPay({
  secretKey: process.env.PAYMENT_SIGNATURE,
  publicKey: process.env.PAYMENT_ID,
});

export const VALUTE_TYPE = {
  DOLLAR: 'USD',
  EURO: 'EUR',
};

export const generatePaymentLink = ({
  price,
  id,
  description = '',
  currency = VALUTE_TYPE.EURO,
  locale = 'en',
}): string => {
  const priceNum = Number(price);

  return u.form(priceNum, id, description, VALUTE_TYPE[currency], locale);
};
