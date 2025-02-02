"use client"
import { useEffect, useState } from 'react'
import { client } from '../../../lib/sanity'
import Loading from '@/components/ui/Loading'

export default function Transactions() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Query all orders, sorted by creation date descending
        const query = `*[_type == "order"] | order(createdAt desc) {
          _id,
          reference,
          amount,
          createdAt,
          paymentDetails
        }`
        const ordersData = await client.fetch(query)
        setOrders(ordersData)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setError('Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading)
    return <Loading />
    
  if (error)
    return (
      <p className="text-center mt-8 text-red-600">
        {error}
      </p>
    )

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
                {/* <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">List of Product</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => {
                // Convert amount from kobo to naira
                const amountNaira = (order.amount / 100).toFixed(2)
                const paidAt = new Date(order.createdAt).toLocaleString()
                const paymentDetails = order.paymentDetails || {}
                const status = paymentDetails.status || 'N/A'
                const method = paymentDetails.method || 'N/A'
                const items = order.cart || {}
                const item = items.items || []
                console.log(order.cart)
                const product = item.map((i: any) => i.product).join(', ')
               
                
                const fees = paymentDetails.fees
                  ? (paymentDetails.fees).toFixed(2)
                  : '0.00'

                return (
                  <tr key={order._id}>
                    <td className="px-4 py-2 text-sm text-gray-800">{order.reference}</td>
                    <td className="px-4 capitalize py-2 text-sm text-gray-800">{method}</td>
                    <td className="px-4 py-2 capitalize text-sm text-gray-800">{status}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">₦{amountNaira}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{paidAt}</td>
                    {/* <td className="px-4 py-2 text-sm text-gray-800">{product}</td> */}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
