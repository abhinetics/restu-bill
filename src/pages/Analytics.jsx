import React from 'react';
import { Link } from 'react-router-dom';

function Analytics() {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0);
  }, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-lg transition-all"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg">
            <h3 className="text-lg text-gray-300 mb-2">Total Orders</h3>
            <p className="text-4xl font-bold">{totalOrders}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg">
            <h3 className="text-lg text-gray-300 mb-2">Total Revenue</h3>
            <p className="text-4xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg">
            <h3 className="text-lg text-gray-300 mb-2">Average Order Value</h3>
            <p className="text-4xl font-bold">${averageOrderValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Items</th>
                  <th className="pb-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-white/5">
                    <td className="py-4">#{order.id}</td>
                    <td className="py-4">{order.items.length} items</td>
                    <td className="py-4">
                      ${order.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;