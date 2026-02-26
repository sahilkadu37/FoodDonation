import ProfileEdit from '@/components/ProfileEdit';

export default function ProfilePage({ searchParams }) {
  // Get token from cookie/localStorage or pass as prop
  const token = localStorage.getItem('token'); // or pass as prop if server components

  if (!token) return <p>Please login to edit your profile.</p>;

  return <ProfileEdit token={token} />;
}
