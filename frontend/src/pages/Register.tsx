import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        // Auto-login (Section 10)
        login(data.data.token, data.data.user);
        
        // Redirect to returnTo if coming from booking flow
        if (returnTo) {
          navigate(decodeURIComponent(returnTo));
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Registrasi gagal');
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
          <CardTitle className="text-2xl font-bold text-neutral-900">Buat Akun Baru</CardTitle>
          <p className="text-sm text-neutral-500 mt-1">Daftar untuk melakukan pemesanan lapangan</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
              Nama Lengkap
              <Input 
                type="text" 
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </label>

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
              Nomor Telepon / WA
              <Input 
                type="tel" 
                placeholder="081234567890"
                value={phone}
                onChange={e => setPhone(e.target.value)}
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

            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
              Konfirmasi Password
              <Input 
                type="password" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </label>

            <Button type="submit" className="mt-2 bg-brand-600 hover:bg-brand-700 w-full" disabled={loading}>
              {loading ? "Medaftarkan..." : "Daftar Akun"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600 border-t border-neutral-100 pt-4">
            Sudah punya akun?{' '}
            <Link 
              to={returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login'} 
              className="text-brand-600 font-semibold hover:underline"
            >
              Login di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
