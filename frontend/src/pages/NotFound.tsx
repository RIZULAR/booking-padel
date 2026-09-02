import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto my-16 text-center px-4">
      <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">404 Not Found</h1>
      <p className="text-neutral-600 mb-6">
        Halaman tidak ditemukan.
      </p>
      <Link to="/">
        <Button className="bg-brand-600 hover:bg-brand-700">Kembali ke Home</Button>
      </Link>
    </div>
  );
}
