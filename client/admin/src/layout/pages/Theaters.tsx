import { useState, useEffect } from 'react';
import { api } from '../../api';

type Theater = {
  _id: string;
  name: string;
  status: string;
};

type Seat = {
  _id: string;
  name: string;
  type: string;
};

export default function Theaters() {
  const [q, setQ] = useState('');
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [form, setForm] = useState<Partial<Theater> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSeatForm, setShowSeatForm] = useState(false); // For seat form visibility
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(null);
  const [seatForm, setSeatForm] = useState({ name: '', type: '', theaterId: '' });

  // Load theaters
  const loadTheaters = async () => {
    const { data } = await api.get('/theaters', { params: { q } });
    setTheaters(data);
  };

  // Close form for theater
  const closeForm = () => {
    setForm(null);
  };

  // Load seats for selected theater
  const loadSeats = async (theaterId: string) => {
    try {
      const { data } = await api.get('/seats', { params: { theaterId } });
      setSeats(data);
      setSelectedTheaterId(theaterId);
    } catch (err) {
      console.error('Failed to load seats', err);
      setSeats([]);
    }
  };

  useEffect(() => {
    loadTheaters();
  }, [q]);

  // Save new or updated theater
  const saveTheater = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form?._id) {
      await api.put(`/theaters/${form._id}`, form);
    } else {
      await api.post('/theaters', form);
    }
    setShowForm(false);
    setForm(null);
    loadTheaters();
  };

  // Delete a theater
  const deleteTheater = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this theater?')) {
      await api.delete(`/theaters/${id}`);
      loadTheaters();
    }
  };

  // Create a new seat
  const createSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/seats', seatForm);
      setSeatForm({ name: '', type: '', theaterId: '' }); // Clear form
      setShowSeatForm(false); // Close seat form
      loadSeats(selectedTheaterId!); // Reload seats for selected theater
    } catch (err) {
      console.error('Failed to create seat', err);
    }
  };

  // Delete a seat
  const deleteSeat = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this seat?')) {
      await api.delete(`/seats/${id}`);
      loadSeats(selectedTheaterId!); // Reload seats after deletion
    }
  };

  return (
    <div className="p-4">
      {/* Search */}
      <div className="mb-4 flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <input
          placeholder="Search theaters…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full sm:w-auto rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          onClick={loadTheaters}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
        >
          Find
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="ml-auto sm:ml-0 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400"
        >
          + Create new Theater
        </button>
      </div>

      {/* Theaters Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[720px] w-full">
          <thead className="text-sm bg-white/5">
            <tr>
              <th className="p-3 text-left w-12">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left w-48">Action</th>
            </tr>
          </thead>
          <tbody>
            {theaters.map((theater, i) => (
              <tr key={theater._id} className="border-t border-white/10">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      if (selectedTheaterId === theater._id) {
                        setSelectedTheaterId(null);
                      } else {
                        loadSeats(theater._id);
                      }
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    {theater.name}
                  </button>
                </td>
                <td className="p-3 capitalize">{theater.status}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setForm(theater)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTheater(theater._id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:brightness-110"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setShowSeatForm(true);
                        setSeatForm({ ...seatForm, theaterId: theater._id });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-400"
                    >
                      + Add Seat
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seats Table for selected theater */}
      {selectedTheaterId && seats.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Seats for Theater</h3>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-[720px] w-full">
              <thead className="text-sm bg-white/5">
                <tr>
                  <th className="p-3 text-left w-12">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left w-48">Action</th>
                </tr>
              </thead>
              <tbody>
                {seats.map((seat, i) => (
                  <tr key={seat._id} className="border-t border-white/10">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{seat.name}</td>
                    <td className="p-3">{seat.type}</td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteSeat(seat._id)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:brightness-110"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!seats.length && (
                  <tr>
                    <td className="p-6 text-center opacity-70" colSpan={4}>
                      No seats available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Seat Form */}
      {showSeatForm && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center">
          <form
            onSubmit={createSeat}
            className="w-full max-w-lg bg-[#0E141B] p-5 rounded-2xl border border-white/10"
          >
            <h2 className="text-lg font-semibold mb-3">Create New Seat</h2>

            {/* Seat Name */}
            <label className="block text-sm mb-1">Seat Name</label>
            <input
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
              value={seatForm.name}
              onChange={(e) => setSeatForm({ ...seatForm, name: e.target.value })}
              required
            />

            {/* Seat Type */}
            <label className="block text-sm mb-1">Seat Type</label>
            <input
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
              value={seatForm.type}
              onChange={(e) => setSeatForm({ ...seatForm, type: e.target.value })}
              required
            />

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowSeatForm(false)}
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
