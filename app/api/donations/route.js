// app/api/donations/route.js

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
      .select('title description quantity expiryDate contactNumber area createdAt');

    const total = await Donation.countDocuments();

    return Response.json({
      donations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/donations error:', error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const body = await request.json();
    const { title, description, quantity, expiryDate, contactNumber, area } = body;

    if (!title || !description || !contactNumber || !area) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
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

    return Response.json({ message: 'Donation created successfully' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/donations error:', error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}