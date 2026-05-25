import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="container-pp py-24 text-center">
      <p className="text-brand font-bold">404</p>
      <h1 className="text-3xl font-extrabold mt-2">Page not found</h1>
      <p className="text-ink/60 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Back to home</Link>
    </div>
  );
}