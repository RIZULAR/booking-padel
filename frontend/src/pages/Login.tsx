import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  // Auto redirect if already logged in (Section 2: Login & Redirect)
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/staff');
      else navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        login(data.data.token, data.data.user);

        // Section 2: Role-based Redirect Logic
        const role = data.data.user.role;
        if (role === 'admin') {
          // Admin always goes to Admin Dashboard unless returnTo is customer checkout
          if (returnTo && (returnTo.startsWith('/book') || returnTo.startsWith('/payment'))) {
            navigate(decodeURIComponent(returnTo));
          } else {
            navigate('/admin');
          }
        } else if (role === 'staff') {
          navigate('/staff');
        } else if (returnTo) {
          navigate(decodeURIComponent(returnTo));
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Email atau password salah');
      }
    } catch {
      setLoading(false);
      setError('Gagal terhubung ke server');
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 px-4">
      <Card className="border border-neutral-200 shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-neutral-900">Selamat Datang</CardTitle>
          <p className="text-sm text-neutral-500 mt-1">Masuk ke akun Padel Booking Anda</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
              Email
              <Input 
                type="email" 
                placeholder="nama@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
              Password
              <Input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </label>
            <Button type="submit" className="mt-2 bg-brand-600 hover:bg-brand-700 w-full" disabled={loading}>
              {loading ? "Masuk..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600 border-t border-neutral-100 pt-4">
            Belum punya akun?{' '}
            <Link 
              to={returnTo ? `/register?returnTo=${encodeURIComponent(returnTo)}` : '/register'} 
              className="text-brand-600 font-semibold hover:underline"
            >
              Daftar di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
