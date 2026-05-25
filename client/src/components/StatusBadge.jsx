const map = {
  'Pending':           'bg-amber-100 text-amber-800',
  'Confirmed':         'bg-blue-100 text-blue-800',
  'Preparing':         'bg-orange-100 text-orange-800',
  'Out for Delivery':  'bg-purple-100 text-purple-800',
  'Delivered':         'bg-emerald-100 text-emerald-800',
  'Cancelled':         'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${map[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}