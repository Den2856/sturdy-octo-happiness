import { useState, useEffect } from 'react';
import { api } from '../../api';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Partial<User> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  // Загрузка пользователей
  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Сохранение или обновление пользователя
  const saveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form?._id) {
        await api.put(`/users/${form._id}`, form);
        setMessage('User updated successfully');
      } else {
        await api.post('/users', form);
        setMessage('User created successfully');
      }
      setShowForm(false);
      setForm(null);
      loadUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      setMessage('Error saving user');
    }
  };

  // Удаление пользователя
  const deleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        loadUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  // Открытие формы редактирования или создания
  const openForm = (user?: User) => {
    if (user) {
      setForm(user);
    } else {
      setForm({ role: 'user' }); // Для создания нового пользователя
    }
    setShowForm(true);
  };

  // Закрытие формы
  const closeForm = () => {
    setShowForm(false);
    setForm(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Users</h2>

      {/* Добавление нового пользователя */}
      <button
        onClick={() => openForm()}
        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 mb-4"
      >
        + Add New User
      </button>

      {/* Сообщение об ошибке или успешном добавлении/обновлении */}
      {message && <p>{message}</p>}

      {/* Таблица пользователей */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[720px] w-full">
          <thead className="text-sm bg-white/5">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user._id} className="border-t border-white/10">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openForm(user)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:brightness-110"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Форма для добавления/редактирования пользователя */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center">
          <form
            onSubmit={saveUser}
            className="w-full max-w-lg bg-[#0E141B] p-5 rounded-2xl border border-white/10"
          >
            <h2 className="text-lg font-semibold mb-3">{form?._id ? 'Edit User' : 'Create New User'}</h2>

            {/* Имя пользователя */}
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
              value={form?.name || ''}
              onChange={(e) => setForm((f) => ({ ...f!, name: e.target.value }))}
              required
            />

            {/* Электронная почта пользователя */}
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
              value={form?.email || ''}
              onChange={(e) => setForm((f) => ({ ...f!, email: e.target.value }))}
              required
            />

            {/* Роль пользователя */}
            <label className="block text-sm mb-1">Role</label>
            <select
              className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              value={form?.role || 'user'}
              onChange={(e) => setForm((f) => ({ ...f!, role: e.target.value }))}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeForm}
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
