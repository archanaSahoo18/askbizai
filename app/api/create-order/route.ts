import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json(); // ₹99 from frontend
    
    const order = await razorpay.orders.create({
      amount: amount * 100,  // 9900 paise = ₹99 ✓
      currency: 'INR',
      receipt: `askbizai_${Date.now()}`,
    });

    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount 
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Razorpay error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}


// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     const { amount } = await req.json();
    
//     // Mock Razorpay response (100% works locally)
//     const orderId = `order_${Date.now()}`;
    
//     console.log('✅ Mock order created:', amount);
    
//     return NextResponse.json({ 
//       orderId,
//       amount: amount * 100  // Paise
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }