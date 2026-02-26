import dbConnect from '@/lib/mongodb';
import Donation from '@/models/Donation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

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
      // Make sure you select expiryDate, not expiresAt
      .select('title description quantity expiryDate contactNumber area createdAt');

    const total = await Donation.countDocuments();

    return new Response(
      JSON.stringify({
        donations,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('GET /api/donations error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error while fetching donations' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized: No token provided' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized: Invalid token' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await request.json();
    const { title, description, quantity, expiryDate, contactNumber, area } = body;

    if (!title || !description || !contactNumber || !area) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    await dbConnect();

    const donation = new Donation({
      title,
      description,
      quantity: quantity || 0,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      contactNumber,
      area,
      donor: decoded.userId,
    });

    await donation.save();

    return new Response(
      JSON.stringify({ message: 'Donation created successfully' }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('POST /api/donations error:', error);
    return new Response(
      JSON.stringify({ message: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
