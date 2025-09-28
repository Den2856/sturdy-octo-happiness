import { useState, useEffect } from 'react';
import { api } from '../../api';

type User = {
  _id: string;
  name: string;
  email: string;
};

type Movie = {
  _id: string;
  title: string;
};

type Theater = {
  _id: string;
  name: string;
};

type Order = {
  _id: string;
  userId: User;
  movieId: Movie;
  theaterId: Theater;
  title: string;
  seats: string[];
  price: number;
  selectedDate: string;
  bookingInfo: string;
  createdAt: string;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Загрузка заказов
  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Error loading orders:', err);
      setMessage('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Удаление заказа
  const deleteOrder = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.delete(`/orders/${id}`);
        setMessage('Order deleted successfully');
        loadOrders();
      } catch (err) {
        console.error('Error deleting order:', err);
        setMessage('Error deleting order');
      }
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Orders</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Orders Management</h2>

      {/* Сообщение об ошибке или успешном действии */}
      {message && (
        <div className={`p-3 mb-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
        }`}>
          {message}
        </div>
      )}

      {/* Таблица заказов */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[1000px] w-full">
          <thead className="text-sm bg-white/5">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Movie</th>
              <th className="p-3 text-left">Theater</th>
              <th className="p-3 text-left">Seats</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order, i) => (
                <tr key={order._id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">
                        {order.userId?.name || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {order.userId?.email || 'No email'}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{order.title}</div>
                      <div className="text-sm text-gray-400">
                        {order.movieId?.title || 'Unknown Movie'}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {order.theaterId?.name || 'Unknown Theater'}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {order.seats.map((seat, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-white/10 rounded text-xs"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">${order.price}</td>
                  <td className="p-3">
                    {formatDate(order.selectedDate)}
                  </td>
                  <td className="p-3 text-sm text-gray-400">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:brightness-110 text-sm"
                      title="Delete order"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Статистика */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold">{orders.length}</div>
          <div className="text-sm text-gray-400">Total Orders</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold">
            ${orders.reduce((sum, order) => sum + order.price, 0)}
          </div>
          <div className="text-sm text-gray-400">Total Revenue</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold">
            {orders.reduce((sum, order) => sum + order.seats.length, 0)}
          </div>
          <div className="text-sm text-gray-400">Total Tickets</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold">
            {orders.length > 0 ? formatDate(orders[orders.length - 1].createdAt) : 'N/A'}
          </div>
          <div className="text-sm text-gray-400">Last Order</div>
        </div>
      </div>
    </div>
  );
}