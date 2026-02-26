import dbConnect from '@/lib/mongodb';
import Donation from '@/models/Donation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });

    const body = await request.json();
    const { title, description, quantity, expiresAt, contactNumber, area } = body;

    if (!title || !description || !contactNumber || !area) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    await dbConnect();

    const donation = new Donation({
      title,
      description,
      quantity,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      contactNumber,
      area,
      donor: decoded.userId,
    });

    await donation.save();

    return new Response(JSON.stringify({ message: 'Donation created successfully' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
