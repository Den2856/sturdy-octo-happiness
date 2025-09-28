import { useEffect, useState } from "react";
import { api } from "../../api";
import Select from "../../ui/Select";

type Movie = {
  _id: string;
  title: string;
  status: "draft" | "published";
  coverUrl?: string;
  year?: string; // год остается как строка
  price?: number;
  rm?: string; // валюта всегда USD
  startDate?: string; // дата начала
  endDate?: string; // дата окончания
  description?: string; // описание
  runtime?: string; // продолжительность в строковом формате (например, "120 min")
  genres?: string[]; 
};

export default function Movies() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Movie[]>([]);
  const [form, setForm] = useState<Partial<Movie> | null>(null);

  // Загрузка фильмов
  async function load() {
    const { data } = await api.get("/admin/movies", { params: { q } });
    setItems(data.items);
  }

  useEffect(() => {
    load();
  }, []);

  // Сохранение фильма
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    if (form._id) await api.put(`/admin/movies/${form._id}`, form);
    else await api.post(`/admin/movies`, { ...form, status: form.status || "draft" });
    setForm(null);
    await load();
  }

  // Удаление фильма
  async function del(id: string) {
    if (!confirm("Delete movie?")) return;
    await api.delete(`/admin/movies/${id}`);
    await load();
  }

  // Функция для получения постера, описания, года и продолжительности фильма через OMDb API
  const fetchMovieData = async (title: string) => {
    try {
      const response = await api.get(`http://localhost:5174/api/tmdb`, {
        params: { title },
      });

      const poster = response.data.Poster || '';  // Получаем URL постера
      const description = response.data.Plot || '';  // Получаем описание
      const year = response.data.Year || '';  // Получаем год фильма
      const runtime = response.data.Runtime || '';  // Получаем продолжительность фильма
      const genres = response.data.Genre ? response.data.Genre.split(', ') : [];  // Получаем жанры
      return { poster, description, year, runtime, genres };  // Возвращаем данные
    } catch (error) {
      console.error('Error fetching movie data:', error);
      return { poster: '', description: '', year: '', runtime: '', genres: [] };  // В случае ошибки возвращаем пустые строки
    }
  };

  // useEffect для автозаполнения постера, описания, года, продолжительности и жанра
  const handleTitleBlur = async () => {
    if (form?.title && !form.coverUrl) {
      const { poster, description, year, runtime, genres } = await fetchMovieData(form.title);
      setForm((prevForm) => ({
        ...prevForm,
        coverUrl: poster,
        description: description,
        year: year,
        runtime: runtime,
        genres: genres,  // Автозаполнение жанра
      }));
    }
  };

  return (
    <div className="p-4">
      {/* Поиск */}
      <div className="mb-4 flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <input
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full sm:w-auto rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          onClick={load}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
        >
          Find
        </button>
        <button
          onClick={() => setForm({ title: "", status: "draft" })}
          className="ml-auto sm:ml-0 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400"
        >
          + Create new
        </button>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[720px] w-full">
          <thead className="text-sm bg-white/5">
            <tr>
              <th className="p-3 text-left w-12">#</th>
              <th className="p-3 text-left">Cover</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Start Date</th>
              <th className="p-3 text-left">End Date</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left w-48">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m, i) => (
              <tr key={m._id} className="border-t border-white/10">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">
                  {m.coverUrl && (
                    <img
                      src={m.coverUrl}
                      alt="Cover"
                      className="h-16 rounded-lg object-cover"
                    />
                  )}
                </td>
                <td className="p-3">{m.title}</td>
                <td className="p-3 capitalize">{m.status}</td>
                <td className="p-3">{m.startDate}</td>
                <td className="p-3">{m.endDate}</td>
                <td className="p-3">{m.price}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setForm(m)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => del(m._id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:brightness-110"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td className="p-6 text-center opacity-70" colSpan={7}>
                  No movies
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Форма создания/редактирования */}
      {form && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center">
          <form
            onSubmit={save}
            className="w-full max-w-lg bg-[#0E141B] p-5 rounded-2xl border border-white/10"
          >
            <h2 className="text-lg font-semibold mb-3">
              {form._id ? "Edit movie" : "Create movie"}
            </h2>

            {/* Название */}
            <label className="block text-sm mb-1">Title</label>
            <input
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
              value={form.title || ""}
              onChange={(e) => setForm((f) => ({ ...f!, title: e.target.value }))}
              onBlur={handleTitleBlur}
              required
            />

            {/* Жанры (автозаполнение) */}
            <label className="block text-sm mb-1">Genres</label>
            <input
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              value={form.genres?.join(", ") || ""}
              disabled
            />


            {/* Год */}
            <label className="block text-sm mb-1">Year</label>
            <input
              type="text"
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              value={form.year || ""}
              onChange={(e) => setForm((f) => ({ ...f!, year: e.target.value }))}
            />

            {/* Продолжительность */}
            <label className="block text-sm mb-1">Runtime</label>
            <input
              type="text"
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              value={form.runtime || ""}
              onChange={(e) => setForm((f) => ({ ...f!, runtime: e.target.value }))}
            />

            {/* Дата начала */}
            <label className="block text-sm mb-1">Start Date</label>
            <input
              type="date"
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              value={form.startDate || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f!, startDate: e.target.value }))
              }
            />

            {/* Дата окончания */}
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="date"
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              value={form.endDate || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f!, endDate: e.target.value }))
              }
            />

            {/* Цена */}
            <label className="block text-sm mb-1">Price</label>
            <input
              type="number"
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              value={form.price || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f!, price: Number(e.target.value) }))
              }
            />

            {/* Валюта */}
            <label className="block text-sm mb-1">Currency</label>
            <input
              type="text"
              value="USD"
              disabled
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
            />

            {/* URL постера */}
            <label className="block text-sm mb-1">Cover URL</label>
            <input
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              value={form.coverUrl || ""}
              onChange={(e) => setForm((f) => ({ ...f!, coverUrl: e.target.value }))}
            />

           {/* Описание */}
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              value={form.description || ""}
              onChange={(e) => setForm((f) => ({ ...f!, description: e.target.value }))}
              rows={4}
            />

            {/* Статус */}
            <Select
              label="Status"
              value={form.status || "published"}
              onChange={(value) => setForm((f) => ({ ...f!, status: value as any }))}
              options={["published", "draft"]}
            />

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
