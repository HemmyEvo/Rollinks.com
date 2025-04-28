"use client";

import { useEffect, useState } from 'react';
import { client } from '../../../lib/sanity';
import Loading from '@/components/ui/Loading';
import { useAuth } from '@clerk/nextjs';
import { formatDate } from '@/lib/utils';
import { FiPackage, FiCheckCircle, FiTruck, FiClock, FiXCircle, FiDollarSign } from 'react-icons/fi';
import Link from 'next/link';

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    async function fetchOrders() {
      if (!userId) return;

      try {
        setLoading(true);
        const query = `*[_type == "order" && customer.userId == userId] | order(createdAt asc) {
  _id,
  orderId,
  status,
  customer {
    name,
    email,
    phone
  },
  shippingAddress,
  items[]{
    _key,
    name,
    price,
    quantity,
    currency,
    image,
    product->{_id, name, slug}
  },
  payment {
    method,
    status,
    transactionId,
    amount,
    currency
  },
  shipping {
    method,
    cost,
    trackingNumber,
    carrier
  },
  subtotal,
  total,
  discount,
  createdAt,
  updatedAt
}`;

        const ordersData = await client.fetch(query, { userId: userId });
        setOrders(ordersData);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load order history');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <FiClock className="text-yellow-500" />;
      case 'confirmed':
        return <FiCheckCircle className="text-blue-500" />;
      case 'shipped':
        return <FiTruck className="text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl min-h-[80vh] mx-auto px-4 my-6 sm:px-6 lg:px-8">
      <div className="my-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="mt-2 text-sm text-gray-600">
          View all your past orders and their current status
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't placed any orders yet. Start shopping to see orders here.
          </p>
          <div className="mt-6">
            <Link
              href="/product"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0">
                  <Link
                    href={`/order-tracking/${order._id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Payment</h4>
                  <div className="flex items-center">
                    <FiDollarSign className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <div className="ml-2">
                      <p className="text-sm text-gray-500 capitalize">
                        {order.payment?.method || 'N/A'}
                      </p>
                      <p className={`text-sm ${
                        order.payment?.status === 'completed'
                          ? 'text-green-600'
                          : order.payment?.status === 'failed'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      } capitalize`}>
                        {order.payment?.status || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping</h4>
                  <div className="flex items-center">
                    <FiTruck className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <div className="ml-2">
                      <p className="text-sm text-gray-500 capitalize">
                        {order.shipping?.method || 'Standard'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.shipping?.carrier || 'Local Delivery'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Total</h4>
                  <p className="text-lg font-semibold text-gray-900">
                    ₦{(order.total || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
                <div className="space-y-4">
                  {order.items?.slice(0, 2).map((item: any) => {
                    if (!item) return null;
                    return (
                      <div key={item._id || Math.random()} className="flex items-center">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name || 'Product image'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <h5 className="text-sm font-medium text-gray-900">
                            {item.name || 'Unknown Product'}
                          </h5>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity ?? 0} × ₦{item.price?.toLocaleString() ?? '0'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {order.items?.length > 2 && (
                    <p className="text-sm text-gray-500">
                      + {order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}