"use client";

import { useEffect, useState } from 'react';
import { client } from '../../../lib/sanity';
import Loading from '@/components/ui/Loading';
import { useAuth } from '@clerk/nextjs';
import { formatDate } from '@/lib/utils';
import { useConvexAuth, useQuery } from 'convex/react';
import AdminPanel from './AdminPanel'
import { 
  FiPackage, 
  FiCheckCircle, 
  FiTruck, 
  FiClock, 
  FiXCircle, 
  FiDollarSign,
  FiX,
  FiMapPin,
  FiCreditCard,
  FiUser
} from 'react-icons/fi';
import Link from 'next/link';

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { isSignedIn, userId } = useAuth();
  const { isAuthenticated } = useConvexAuth();
const me = useQuery(api.user.getMe, isAuthenticated ? undefined : "skip");
  useEffect(() => {
    async function fetchOrders() {
      if (me?.isAdmin) return
      if (!userId) return;

      try {
        setLoading(true);
        const query = `*[_type == "order" && customer.userId == $userId] | order(createdAt desc) {
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

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100  text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-center  mt-8 text-red-600">{error}</p>;
if(me?.isAdmin) return <AdminPanel />

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
                  <button
                    onClick={() => openOrderDetails(order)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </button>
                </div>
              </div>

              <div className="px-6  py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
            </div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Order #{selectedOrder.orderId}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                {/* Order status */}
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getStatusIcon(selectedOrder.status)}
                    </div>
                    <div className="ml-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping info */}
                {selectedOrder.shipping?.trackingNumber && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <FiTruck className="flex-shrink-0 h-5 w-5 text-blue-400" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">Tracking Information</h4>
                        <p className="text-sm text-blue-700">
                          {selectedOrder.shipping.carrier || 'Carrier'}: {selectedOrder.shipping.trackingNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer info */}
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <FiUser className="mr-2" /> Customer Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span> {selectedOrder.customer?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {selectedOrder.customer?.email || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {selectedOrder.customer?.phone || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Shipping address */}
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <FiMapPin className="mr-2" /> Shipping Address
                    </h4>
                    {selectedOrder.shippingAddress ? (
                      <div className="text-sm text-gray-600">
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                        <p>{selectedOrder.shippingAddress.country}, {selectedOrder.shippingAddress.postalCode}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No shipping address provided</p>
                    )}
                  </div>

                  {/* Payment info */}
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <FiCreditCard className="mr-2" /> Payment Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Method:</span> {selectedOrder.payment?.method || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-1 capitalize ${
                          selectedOrder.payment?.status === 'completed'
                            ? 'text-green-600'
                            : selectedOrder.payment?.status === 'failed'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                        }`}>
                          {selectedOrder.payment?.status || 'N/A'}
                        </span>
                      </p>
                      {selectedOrder.payment?.transactionId && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Transaction ID:</span> {selectedOrder.payment.transactionId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order totals */}
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal:</span>
                        <span>₦{selectedOrder.subtotal?.toLocaleString() || '0'}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Discount:</span>
                          <span>-₦{selectedOrder.discount?.toLocaleString() || '0'}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping:</span>
                        <span>₦{selectedOrder.shipping?.cost?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-gray-900 border-t border-gray-200 pt-2 mt-2">
                        <span>Total:</span>
                        <span>₦{selectedOrder.total?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items ({selectedOrder.items?.length || 0})</h4>
                  <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item._key} className="p-4 flex">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name || 'Product image'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
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
                          {item.product?.slug && (
                            <Link 
                              href={`/product/${item.product.slug}`}
                              className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                              onClick={closeModal}
                            >
                              View Product
                            </Link>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}