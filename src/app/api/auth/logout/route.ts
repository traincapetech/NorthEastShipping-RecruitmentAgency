import { apiSuccess } from '@/lib/api/response';

export async function POST() {
  const response = apiSuccess({ message: 'Logged out successfully.' });
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
  return response;
}
