import dbConnect from '@/lib/mongodb';
import Donation from '@/models/Donation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized: No token provided' }), { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: 'Unauthorized: Invalid token' }), { status: 401 });
    }

    const body = await request.json();

    const { title, description, quantity, expiresAt, contactNumber, area } = body;

    if (!title || !description || !contactNumber || !area) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    await dbConnect();

    let expiryDate = null;
    if (expiresAt) {
      const d = new Date(expiresAt);
      if (isNaN(d.getTime())) {
        return new Response(JSON.stringify({ message: 'Invalid expiry date format' }), { status: 400 });
      }
      expiryDate = d;
    }

    const donation = new Donation({
      title,
      description,
      quantity: quantity || 0,
      expiresAt: expiryDate,
      contactNumber,
      area,
      donor: decoded.userId,
    });

    await donation.save();

    return new Response(JSON.stringify({ message: 'Donation created successfully' }), { status: 201 });
  } catch (error) {
    console.error('POST /api/donations error:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const skip = (page - 1) * limit;

    const donations = await Donation.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title description quantity expiresAt contactNumber area createdAt');

    const total = await Donation.countDocuments();

    return new Response(
      JSON.stringify({
        donations,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/donations error:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
