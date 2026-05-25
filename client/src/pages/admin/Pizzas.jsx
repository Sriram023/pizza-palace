import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { listPizzas, createPizza, updatePizza, deletePizza } from '../../api/pizzas';
import { inr } from '../../utils/format';

const empty = { name: '', description: '', price: '', category: 'Veg', imageUrl: '', isAvailable: true };

export default function AdminPizzas() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | {mode, data}

  const refresh = () => listPizzas().then((d) => setPizzas(d.pizzas)).finally(() => setLoading(false));
  useEffect(() => { refresh(); }, []);

  const onSave = async (data) => {
    try {
      const payload = { ...data, price: Number(data.price) };
      if (modal.mode === 'edit') await updatePizza(modal.data._id, payload);
      else                       await createPizza(payload);
      toast.success(`Pizza ${modal.mode === 'edit' ? 'updated' : 'created'}`);
      setModal(null); refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const onDelete = async (p) => {
    if (!confirm(`Delete ${p.name}?`)) return;
    try { await deletePizza(p._id); toast.success('Deleted'); refresh(); }
    catch { toast.error('Delete failed'); }
  };

  const toggleAvail = async (p) => {
    try { await updatePizza(p._id, { isAvailable: !p.isAvailable }); refresh(); }
    catch { toast.error('Update failed'); }
  };

  return (
    <div className="container-pp py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-extrabold">Pizzas</h1>
        <button onClick={() => setModal({ mode: 'create', data: empty })} className="btn-primary">
          <Plus size={16}/> Add pizza
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-ink/60 text-left">
              <tr>
                <th className="p-3">Pizza</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-center">Available</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {loading && <tr><td colSpan={5} className="p-6 text-center text-ink/50">Loading…</td></tr>}
              {!loading && pizzas.map((p) => (
                <tr key={p._id} className="hover:bg-cream/60">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover"/>
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-ink/50 line-clamp-1 max-w-xs">{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 text-right font-bold text-brand">{inr(p.price)}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleAvail(p)}
                      className={`relative w-10 h-6 rounded-full transition ${p.isAvailable ? 'bg-emerald-500' : 'bg-ink/20'}`}
                      aria-label="Toggle availability"
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${p.isAvailable ? 'left-[18px]' : 'left-0.5'}`}/>
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => setModal({ mode: 'edit', data: p })} className="p-2 hover:bg-ink/5 rounded-lg" aria-label="Edit"><Pencil size={14}/></button>
                    <button onClick={() => onDelete(p)} className="p-2 hover:bg-brand-50 hover:text-brand rounded-lg" aria-label="Delete"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <PizzaModal modal={modal} onClose={() => setModal(null)} onSave={onSave}/>}
    </div>
  );
}

function PizzaModal({ modal, onClose, onSave }) {
  const [form, setForm] = useState(modal.data);
  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 grid place-items-center p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold">{modal.mode === 'edit' ? 'Edit pizza' : 'New pizza'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-ink/5 rounded-lg"><X size={16}/></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
          <Field label="Name" value={form.name} onChange={change('name')} required maxLength={100}/>
          <label className="block">
            <span className="block text-sm font-semibold mb-1.5">Description</span>
            <textarea className="input min-h-[80px]" value={form.description} onChange={change('description')} required maxLength={500}/>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (₹)" type="number" min="0" step="0.01" value={form.price} onChange={change('price')} required/>
            <label className="block">
              <span className="block text-sm font-semibold mb-1.5">Category</span>
              <select className="input" value={form.category} onChange={change('category')}>
                <option>Veg</option><option>Non-Veg</option><option>Specialty</option>
              </select>
            </label>
          </div>
          <Field label="Image URL" type="url" value={form.imageUrl} onChange={change('imageUrl')} required/>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-brand w-4 h-4"/>
            Available for ordering
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button className="btn-primary">{modal.mode === 'edit' ? 'Save changes' : 'Create pizza'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1.5">{label}</span>
      <input className="input" {...props}/>
    </label>
  );
}