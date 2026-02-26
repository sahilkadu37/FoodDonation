import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });

    const { name, email, contactNumber } = await request.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ message: 'Name and email are required' }), { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(decoded.userId);
    if (!user) return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });

    // Update fields
    user.name = name;
    user.email = email;
    if (contactNumber) user.contactNumber = contactNumber;

    await user.save();

    return new Response(JSON.stringify({ message: 'Profile updated successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
