import { useEffect, useState } from 'react';

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Pizza,
  Image as ImageIcon,
} from 'lucide-react';

import toast from 'react-hot-toast';

import {
  listPizzas,
  createPizza,
  updatePizza,
  deletePizza,
} from '../../api/pizzas';

import { inr } from '../../utils/format';

const empty = {
  name: '',
  description: '',
  price: '',
  category: 'Veg',
  imageUrl: '',
  isAvailable: true,
};

export default function AdminPizzas() {

  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);

  // =========================================
  // FETCH
  // =========================================

  const refresh = () =>
    listPizzas()
      .then((d) => setPizzas(d.pizzas))
      .finally(() => setLoading(false));

  useEffect(() => {
    refresh();
  }, []);

  // =========================================
  // SAVE
  // =========================================

  const onSave = async (data) => {

    try {

      const payload = {
        ...data,
        price: Number(data.price),
      };

      if (modal.mode === 'edit') {

        await updatePizza(modal.data._id, payload);

      } else {

        await createPizza(payload);
      }

      toast.success(
        `Pizza ${
          modal.mode === 'edit'
            ? 'updated'
            : 'created'
        } successfully`
      );

      setModal(null);

      refresh();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        'Save failed'
      );
    }
  };

  // =========================================
  // DELETE
  // =========================================

  const onDelete = async (pizza) => {

    if (!confirm(`Delete ${pizza.name}?`))
      return;

    try {

      await deletePizza(pizza._id);

      toast.success('Pizza deleted');

      refresh();

    } catch {

      toast.error('Delete failed');
    }
  };

  // =========================================
  // TOGGLE AVAILABILITY
  // =========================================

  const toggleAvail = async (pizza) => {

    try {

      await updatePizza(pizza._id, {
        isAvailable: !pizza.isAvailable,
      });

      refresh();

    } catch {

      toast.error('Update failed');
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="container-pp py-10">

      {/* HEADER */}

      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-extrabold text-ink dark:text-white">
            Pizza management
          </h1>

          <p className="mt-1 text-ink/60 dark:text-white/60">
            Create, update and manage your pizza menu.
          </p>

        </div>

        <button
          onClick={() =>
            setModal({
              mode: 'create',
              data: empty,
            })
          }
          className="
            btn-primary
            flex items-center gap-2
            shadow-lg shadow-brand/20
          "
        >
          <Plus size={16} />
          Add pizza
        </button>

      </div>

      {/* TABLE CARD */}

      <div
        className="
          rounded-3xl
          overflow-hidden

          bg-white
          border border-ink/5
          shadow-sm

          dark:bg-[#0f172a]
          dark:border-white/10
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* HEAD */}

            <thead
              className="
                bg-black/[0.03]

                dark:bg-white/[0.03]
              "
            >
              <tr>

                <th className="p-4 text-left text-ink/60 dark:text-white/60">
                  Pizza
                </th>

                <th className="p-4 text-left text-ink/60 dark:text-white/60">
                  Category
                </th>

                <th className="p-4 text-right text-ink/60 dark:text-white/60">
                  Price
                </th>

                <th className="p-4 text-center text-ink/60 dark:text-white/60">
                  Available
                </th>

                <th className="p-4 text-right text-ink/60 dark:text-white/60">
                  Actions
                </th>

              </tr>
            </thead>

            {/* BODY */}

            <tbody className="divide-y divide-ink/5 dark:divide-white/10">

              {/* LOADING */}

              {loading && (

                <tr>
                  <td
                    colSpan={5}
                    className="
                      p-10
                      text-center

                      text-ink/50
                      dark:text-white/50
                    "
                  >
                    Loading pizzas...
                  </td>
                </tr>
              )}

              {/* PIZZAS */}

              {!loading &&
                pizzas.map((pizza) => (

                  <tr
                    key={pizza._id}
                    className="
                      transition-all duration-300

                      hover:bg-black/[0.02]

                      dark:hover:bg-white/[0.03]
                    "
                  >

                    {/* PIZZA */}

                    <td className="p-4">

                      <div className="flex items-center gap-4">

                        <img
                          src={pizza.imageUrl}
                          alt={pizza.name}
                          className="
                            w-14 h-14
                            rounded-2xl
                            object-cover
                            shadow-md
                          "
                        />

                        <div>

                          <div className="font-bold text-base text-ink dark:text-white">
                            {pizza.name}
                          </div>

                          <div
                            className="
                              text-xs mt-1
                              max-w-xs line-clamp-2

                              text-ink/50
                              dark:text-white/50
                            "
                          >
                            {pizza.description}
                          </div>

                        </div>

                      </div>

                    </td>

                    {/* CATEGORY */}

                    <td className="p-4">

                      <span
                        className="
                          px-3 py-1.5
                          rounded-full
                          text-xs font-semibold

                          bg-brand/10
                          text-brand
                        "
                      >
                        {pizza.category}
                      </span>

                    </td>

                    {/* PRICE */}

                    <td
                      className="
                        p-4
                        text-right

                        font-extrabold
                        text-brand
                        text-lg
                      "
                    >
                      {inr(pizza.price)}
                    </td>

                    {/* AVAIL */}

                    <td className="p-4 text-center">

                      <button
                        onClick={() =>
                          toggleAvail(pizza)
                        }
                        className={`
                          relative
                          w-12 h-7
                          rounded-full
                          transition-all duration-300

                          ${
                            pizza.isAvailable
                              ? 'bg-emerald-500'
                              : 'bg-gray-300 dark:bg-white/20'
                          }
                        `}
                      >

                        <span
                          className={`
                            absolute top-1
                            w-5 h-5
                            rounded-full
                            bg-white
                            shadow-md
                            transition-all duration-300

                            ${
                              pizza.isAvailable
                                ? 'left-6'
                                : 'left-1'
                            }
                          `}
                        />

                      </button>

                    </td>

                    {/* ACTIONS */}

                    <td className="p-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            setModal({
                              mode: 'edit',
                              data: pizza,
                            })
                          }
                          className="
                            p-3 rounded-2xl

                            hover:bg-brand/10
                            hover:text-brand

                            text-ink/60
                            dark:text-white/60

                            transition-all duration-300
                          "
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() =>
                            onDelete(pizza)
                          }
                          className="
                            p-3 rounded-2xl

                            hover:bg-red-500/10
                            hover:text-red-500

                            text-ink/60
                            dark:text-white/60

                            transition-all duration-300
                          "
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              {/* EMPTY */}

              {!loading &&
                pizzas.length === 0 && (

                  <tr>
                    <td
                      colSpan={5}
                      className="
                        p-12
                        text-center
                      "
                    >

                      <div className="flex flex-col items-center gap-3">

                        <div
                          className="
                            w-16 h-16
                            rounded-3xl
                            grid place-items-center

                            bg-brand/10
                            text-brand
                          "
                        >
                          <Pizza size={30} />
                        </div>

                        <div className="text-lg font-bold text-ink dark:text-white">
                          No pizzas yet
                        </div>

                        <div className="text-sm text-ink/50 dark:text-white/50">
                          Start by creating your first pizza.
                        </div>

                      </div>

                    </td>
                  </tr>
                )}

            </tbody>

          </table>

        </div>
      </div>

      {/* MODAL */}

      {modal && (
        <PizzaModal
          modal={modal}
          onClose={() => setModal(null)}
          onSave={onSave}
        />
      )}

    </div>
  );
}

// =========================================
// MODAL
// =========================================

function PizzaModal({
  modal,
  onClose,
  onSave,
}) {

  const [form, setForm] = useState(
    modal.data
  );

  const change = (key) => (e) =>
    setForm({
      ...form,
      [key]: e.target.value,
    });

  return (

    <div
      className="
        fixed inset-0 z-50
        bg-black/60
        backdrop-blur-sm

        grid place-items-center
        p-4
      "
      onClick={onClose}
    >

      <div
        className="
          w-full max-w-2xl
          rounded-3xl
          p-6

          bg-white
          border border-ink/5

          dark:bg-[#0f172a]
          dark:border-white/10
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* TOP */}

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-extrabold text-ink dark:text-white">
              {modal.mode === 'edit'
                ? 'Edit pizza'
                : 'Create pizza'}
            </h2>

            <p className="text-sm mt-1 text-ink/50 dark:text-white/50">
              Manage pizza information and pricing.
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              p-3 rounded-2xl

              hover:bg-black/5

              dark:hover:bg-white/10

              transition-all duration-300
            "
          >
            <X
              size={18}
              className="text-ink dark:text-white"
            />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="space-y-5"
        >

          <Field
            label="Pizza name"
            value={form.name}
            onChange={change('name')}
            required
          />

          {/* DESCRIPTION */}

          <label className="block">

            <span className="block mb-2 text-sm font-semibold text-ink dark:text-white">
              Description
            </span>

            <textarea
              value={form.description}
              onChange={change('description')}
              required
              className="
                w-full
                rounded-2xl
                px-4 py-3
                min-h-[110px]

                bg-white
                border border-ink/10
                outline-none

                dark:bg-[#111827]
                dark:border-white/10
                dark:text-white
              "
            />

          </label>

          {/* GRID */}

          <div className="grid md:grid-cols-2 gap-5">

            <Field
              label="Price (₹)"
              type="number"
              value={form.price}
              onChange={change('price')}
              required
            />

            {/* CATEGORY */}

            <label className="block">

              <span className="block mb-2 text-sm font-semibold text-ink dark:text-white">
                Category
              </span>

              <select
                value={form.category}
                onChange={change('category')}
                className="
                  w-full
                  rounded-2xl
                  px-4 py-3

                  bg-white
                  border border-ink/10
                  outline-none

                  dark:bg-[#111827]
                  dark:border-white/10
                  dark:text-white
                "
              >

                <option>
                  Veg
                </option>

                <option>
                  Non-Veg
                </option>

                <option>
                  Specialty
                </option>

              </select>

            </label>

          </div>

          {/* IMAGE */}

          <Field
            label="Image URL"
            type="url"
            value={form.imageUrl}
            onChange={change('imageUrl')}
            required
            icon={<ImageIcon size={16} />}
          />

          {/* CHECKBOX */}

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm({
                  ...form,
                  isAvailable:
                    e.target.checked,
                })
              }
              className="
                accent-brand
                w-5 h-5
              "
            />

            <span className="text-sm text-ink dark:text-white">
              Available for ordering
            </span>

          </label>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Cancel
            </button>

            <button className="btn-primary">

              {modal.mode === 'edit'
                ? 'Save changes'
                : 'Create pizza'}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

// =========================================
// FIELD
// =========================================

function Field({
  label,
  icon,
  ...props
}) {

  return (

    <label className="block">

      <span className="block mb-2 text-sm font-semibold text-ink dark:text-white">
        {label}
      </span>

      <div className="relative">

        {icon && (
          <div
            className="
              absolute left-4 top-1/2
              -translate-y-1/2

              text-ink/40
              dark:text-white/40
            "
          >
            {icon}
          </div>
        )}

        <input
          {...props}
          className={`
            w-full
            rounded-2xl
            px-4 py-3
            outline-none

            bg-white
            border border-ink/10

            dark:bg-[#111827]
            dark:border-white/10
            dark:text-white

            ${
              icon
                ? 'pl-11'
                : ''
            }
          `}
        />

      </div>

    </label>
  );
}
