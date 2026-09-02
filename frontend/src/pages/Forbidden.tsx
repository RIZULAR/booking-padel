import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Forbidden() {
  return (
    <div className="max-w-md mx-auto my-16 text-center px-4">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">403 Forbidden</h1>
      <p className="text-neutral-600 mb-6">
        Kamu tidak memiliki akses ke halaman ini.
      </p>
      <Link to="/">
        <Button className="bg-brand-600 hover:bg-brand-700">Kembali ke Home</Button>
      </Link>
    </div>
  );
}
