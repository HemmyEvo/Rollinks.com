"use client";

import { useState, useEffect } from 'react';
import { client } from '../../../lib/sanity';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiCheckCircle, FiTruck, FiClock, FiXCircle, FiDollarSign, FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiEdit, FiSave,FiUser, FiTrash2, FiPrinter } from 'react-icons/fi';
import { toast } from "react-hot-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState('');
  const [tempTracking, setTempTracking] = useState('');
  const [tempCarrier, setTempCarrier] = useState('');
 

  const statusOptions = [
    'pending',
    'processing',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled'
  ];

  const carrierOptions = [
    'DHL',
    'FedEx',
    'UPS',
    'USPS',
    'Local Delivery',
    'Pickup'
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const query = `*[_type == "order"] | order(createdAt desc) {
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

      const ordersData = await client.fetch(query);
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, dateFilter, orders]);

  const filterOrders = () => {
    let result = [...orders];

    // Search filter
    if (searchTerm) {
      result = result.filter((order:any) => 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) || order.shipping?.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((order:any) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      result = result.filter((order:any) => {
        const orderDate = new Date(order.createdAt);
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
            return orderDate >= oneWeekAgo;
          case 'month':
            const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return orderDate >= oneMonthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(result);
  };

  const startEditing = (order: any) => {
    setEditingOrder(order._id);
    setTempStatus(order.status);
    setTempTracking(order.shipping?.trackingNumber || '');
    setTempCarrier(order.shipping?.carrier || '');
  };

  const cancelEditing = () => {
    setEditingOrder(null);
  };

  const saveChanges = async (orderId: string) => {
    try {
      setLoading(true);
      const orderToUpdate = orders.find((o:any) => o._id === orderId);
      if (!orderToUpdate) return;

      const updatedOrder = {
        ...orderToUpdate,
        status: tempStatus,
        shipping: {
          ...orderToUpdate.shipping,
          trackingNumber: tempTracking,
          carrier: tempCarrier
        },
        updatedAt: new Date().toISOString()
      };

      await client
        .patch(orderId)
        .set(updatedOrder)
        .commit();

      setOrders(orders.map((o:any) => o._id === orderId ? updatedOrder : o));
      setEditingOrder(null);
      toast.success('Order updated successfully');
      
    } catch (err) {
      console.error('Failed to update order:', err);
      toast.error('Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">View and manage all customer orders</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search orders..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <FiFilter className="mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <FiFilter className="mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by date" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDateFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </motion.div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No orders found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order:any) => (
                  <motion.div key={order._id} layout>
                    <TableRow
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleExpandOrder(order._id)}
                    >
                      <TableCell className="font-medium">#{order.orderId}</TableCell>
                      <TableCell>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>₦{order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="capitalize">{order.payment.method}</div>
                        <div className={`text-sm ${
                          order.payment.status === 'completed' ? 'text-green-600' : 
                          order.payment.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {order.payment.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(order);
                            }}
                          >
                            <FiEdit className="mr-1" /> Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <FiPrinter className="mr-1" /> Print
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Order Details */}
                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell colSpan={7} className="p-0">
                            <div className="bg-gray-50 p-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {/* Customer Info */}
                                <div className="bg-white p-4 rounded-lg shadow-xs">
                                  <h3 className="font-medium mb-3 flex items-center">
                                    <FiUser className="mr-2" /> Customer Information
                                  </h3>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Name:</span> {order.customer.name}</p>
                                    <p><span className="font-medium">Email:</span> {order.customer.email}</p>
                                    <p><span className="font-medium">Phone:</span> {order.customer.phone || 'N/A'}</p>
                                  </div>
                                </div>

                                {/* Shipping Info */}
                                <div className="bg-white p-4 rounded-lg shadow-xs">
                                  <h3 className="font-medium mb-3 flex items-center">
                                    <FiTruck className="mr-2" /> Shipping Information
                                  </h3>
                                  <div className="space-y-2 text-sm">
                                    {order.shippingAddress ? (
                                      <>
                                        <p><span className="font-medium">Address:</span> {order.shippingAddress.street}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                        <p>{order.shippingAddress.country}, {order.shippingAddress.postalCode}</p>
                                      </>
                                    ) : (
                                      <p>No shipping address provided</p>
                                    )}
                                    {order.shipping && (
                                      <>
                                        <p><span className="font-medium">Method:</span> {order.shipping.method}</p>
                                        <p><span className="font-medium">Cost:</span> ₦{order.shipping.cost.toLocaleString()}</p>
                                        {order.shipping.trackingNumber && (
                                          <p><span className="font-medium">Tracking:</span> {order.shipping.trackingNumber}</p>
                                        )}
                                        {order.shipping.carrier && (
                                          <p><span className="font-medium">Carrier:</span> {order.shipping.carrier}</p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Payment Info */}
                                <div className="bg-white p-4 rounded-lg shadow-xs">
                                  <h3 className="font-medium mb-3 flex items-center">
                                    <FiDollarSign className="mr-2" /> Payment Information
                                  </h3>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Method:</span> {order.payment.method}</p>
                                    <p><span className="font-medium">Status:</span> 
                                      <span className={`ml-1 capitalize ${
                                        order.payment.status === 'completed' ? 'text-green-600' : 
                                        order.payment.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                                      }`}>
                                        {order.payment.status}
                                      </span>
                                    </p>
                                    <p><span className="font-medium">Amount:</span> ₦{order.payment.amount.toLocaleString()}</p>
                                    {order.payment.transactionId && (
                                      <p><span className="font-medium">Transaction ID:</span> {order.payment.transactionId}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div className="bg-white p-4 rounded-lg shadow-xs">
                                <h3 className="font-medium mb-3">Order Items ({order.items.length})</h3>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Product</TableHead>
                                      <TableHead>Price</TableHead>
                                      <TableHead>Qty</TableHead>
                                      <TableHead>Subtotal</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {order.items.map((item) => (
                                      <TableRow key={item._key}>
                                        <TableCell>
                                          <div className="flex items-center">
                                            {item.image && (
                                              <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-md object-cover mr-3"
                                              />
                                            )}
                                            <div>
                                              <div className="font-medium">{item.name}</div>
           {item.product && (
                                                <div className="text-sm text-gray-500">
                                                  SKU: {item.product._id.slice(-6)}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </TableCell>
                                        <TableCell>₦{item.price.toLocaleString()}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>₦{(item.price * item.quantity).toLocaleString()}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>

                                {/* Order Summary */}
                                <div className="mt-6 flex justify-end">
                                  <div className="w-full md:w-1/3">
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span>₦{order.subtotal.toLocaleString()}</span>
                                      </div>
                                      {order.discount > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Discount:</span>
                                          <span>-₦{order.discount.toLocaleString()}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span>₦{order.shipping?.cost?.toLocaleString() || '0'}</span>
                                      </div>
                                      <div className="flex justify-between border-t border-gray-200 pt-2 font-medium">
                                        <span>Total:</span>
                                        <span>₦{order.total.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      )}
                    </AnimatePresence>

                    {/* Edit Modal */}
                    <AnimatePresence>
                      {editingOrder === order._id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell colSpan={7} className="p-0">
                            <div className="bg-blue-50 p-6">
                              <h3 className="font-medium mb-4">Update Order #{order.orderId}</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Status</label>
                                  <Select value={tempStatus} onValueChange={setTempStatus}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {statusOptions.map(status => (
                                        <SelectItem key={status} value={status}>
                                          {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Tracking Number</label>
                                  <Input
                                    value={tempTracking}
                                    onChange={(e) => setTempTracking(e.target.value)}
                                    placeholder="Enter tracking number"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Carrier</label>
                                  <Select value={tempCarrier} onValueChange={setTempCarrier}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select carrier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {carrierOptions.map(carrier => (
                                        <SelectItem key={carrier} value={carrier}>
                                          {carrier}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2 mt-4">
                                <Button variant="outline" onClick={cancelEditing}>
                                  Cancel
                                </Button>
                                <Button onClick={() => saveChanges(order._id)}>
                                  <FiSave className="mr-1" /> Save Changes
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}
              