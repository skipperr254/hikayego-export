import { createClient } from '@supabase/supabase-js';

// This should be your actual Supabase client from your project
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

interface Buyer {
  id: string;
  name: string;
  surname: string;
  gsmNumber: string;
  email: string;
  identityNumber: string;
  ip: string;
}

interface Address {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode?: string;
}

interface BasketItem {
  id: string;
  name: string;
  category1: string;
  itemType: 'PHYSICAL' | 'VIRTUAL';
  price: string;
}

interface PaymentPayload {
  price: string;
  paidPrice: string;
  callbackUrl: string;
  buyer: Buyer;
  shippingAddress: Address;
  billingAddress: Address;
  basketItems: BasketItem[];
}

export async function startIyzicoPayment(payload: PaymentPayload) {
  try {
    const { data, error } = await supabase.functions.invoke('iyzico-payment-start', {
      body: JSON.stringify(payload),
    });

    if (error) {
      console.error('Error invoking Supabase function:', error);
      throw new Error(error.message);
    }

    if (data.error) {
        console.error('Error from Iyzico function:', data.error, data.details);
        throw new Error(data.error);
    }

    return data; // Contains checkoutFormContent and/or paymentPageUrl
  } catch (err) {
    console.error('Failed to start Iyzico payment:', err);
    throw err;
  }
}

// --- Sample Usage ---
/*
async function handlePayment() {
  const payload: PaymentPayload = {
    price: '100',
    paidPrice: '100',
    callbackUrl: 'https://www.yourwebsite.com/payment-callback',
    buyer: {
      id: 'USR-12345',
      name: 'John',
      surname: 'Doe',
      gsmNumber: '+905555555555',
      email: 'john.doe@example.com',
      identityNumber: '11111111111',
      ip: '85.34.78.112',
    },
    shippingAddress: {
      contactName: 'John Doe',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      zipCode: '34732',
    },
    billingAddress: {
      contactName: 'John Doe',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      zipCode: '34732',
    },
    basketItems: [
      {
        id: 'PROD-001',
        name: 'HikayeGO Premium Subscription',
        category1: 'Digital Subscription',
        itemType: 'VIRTUAL',
        price: '100',
      },
    ],
  };

  try {
    const paymentInfo = await startIyzicoPayment(payload);
    console.log('Payment started successfully:', paymentInfo);
    // You can now render the checkoutFormContent or redirect to paymentPageUrl
    if (paymentInfo.checkoutFormContent) {
        const paymentDiv = document.getElementById('iyzico-payment-form');
        if(paymentDiv) {
            paymentDiv.innerHTML = paymentInfo.checkoutFormContent;
        }
    } else if (paymentInfo.paymentPageUrl) {
        window.location.href = paymentInfo.paymentPageUrl;
    }
  } catch (error) {
    console.error('Payment failed:', error.message);
    // Show an error message to the user
  }
}
*/