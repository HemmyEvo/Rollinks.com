"use client"

import { useEffect, useState } from 'react';
import { client } from '../../../lib/sanity';
import Loading from '@/components/ui/Loading';
import { useAuth } from '@clerk/nextjs';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function Transactions() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isSignedIn } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.user.getMe, isAuthenticated ? undefined : "skip");

  useEffect(() => {
    async function fetchOrders() {
      if (!me) return;
      
      try {
        setLoading(true);
        const query = `*[_type == "order"] | order(createdAt desc) {
          _id,
          reference,
          amount,
          customerDetails,
          createdAt,
          paymentDetails
        }`;
        const ordersData = await client.fetch(query);
        
        const filteredOrders = ordersData.filter((order: any) => order.customerDetails?.email !== me.email);
        setOrders(filteredOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrders();
  }, [me]);

  if (loading) return <Loading />;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl min-h-[80vh] mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Transaction History</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Reference</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Message</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount (₦)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Paid At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => {
                const amountNaira = (order.amount / 100).toFixed(2);
                const paidAt = new Date(order.createdAt).toLocaleString();
                const paymentDetails = order.paymentDetails || {};
                const status = paymentDetails.status || 'N/A';
                const method = paymentDetails.method || 'N/A';
                
                return (
                  <tr key={order._id}>
                    <td className="px-4 py-2 text-sm text-gray-800">{order.reference}</td>
                    <td className="px-4 capitalize py-2 text-sm text-gray-800">{method}</td>
                    <td className="px-4 py-2 capitalize text-sm text-gray-800">{status}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">₦{amountNaira}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{paidAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}