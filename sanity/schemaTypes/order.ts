// schemas/order.js
export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      description: 'Unique order identifier',
    },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Processing', value: 'processing' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Refunded', value: 'refunded' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'processing',
    },
    {
      name: 'customer',
      title: 'Customer Information',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Full Name',
          type: 'string',
     
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
       
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          
        },
        {
          name: 'userId',
          title: 'User ID',
          type: 'string',
          description: 'Reference to user account if logged in'
        }
      ]
    },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        {
          name: 'street',
          title: 'Street Address',
          type: 'string',
      
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
          
        },
        {
          name: 'state',
          title: 'State',
          type: 'string',
         
        },
        {
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
        
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
          
        },
        {
          name: 'specialInstructions',
          title: 'Delivery Instructions',
          type: 'text',
          rows: 2
        }
      ]
    },
    {
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
             
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              initialValue: 1,
             
            },
            {
              name: 'price',
              title: 'Unit Price (₦)',
              type: 'number',
              
            },
            {
              name: 'variant',
              title: 'Variant',
              type: 'string',
              description: 'Size, color, or other variant'
            }
          ]
        }
      ],
      
    },
    {
      name: 'payment',
      title: 'Payment Information',
      type: 'object',
      fields: [
        {
          name: 'method',
          title: 'Payment Method',
          type: 'string',
          options: {
            list: [
              { title: 'Credit Card', value: 'credit_card' },
              { title: 'Paystack', value: 'paystack' },
              { title: 'Flutterwave', value: 'flutterwave' },
              { title: 'Bank Transfer', value: 'bank_transfer' },
              { title: 'Cash on Delivery', value: 'cod' }
            ],
            layout: 'dropdown'
          },
          
        },
        {
          name: 'status',
          title: 'Payment Status',
          type: 'string',
          options: {
            list: [
              { title: 'Pending', value: 'pending' },
              { title: 'Completed', value: 'completed' },
              { title: 'Failed', value: 'failed' },
              { title: 'Refunded', value: 'refunded' }
            ],
            layout: 'dropdown'
          },
          initialValue: 'pending',
          
        },
        {
          name: 'transactionId',
          title: 'Transaction ID',
          type: 'string'
        },
        {
          name: 'amount',
          title: 'Amount Paid (₦)',
          type: 'number',
          
        },
        {
          name: 'currency',
          title: 'Currency',
          type: 'string',
          initialValue: 'NGN',
         
        }
      ]
    },
    {
      name: 'shipping',
      title: 'Shipping Information',
      type: 'object',
      fields: [
        {
          name: 'method',
          title: 'Shipping Method',
          type: 'string',
          options: {
            list: [
              { title: 'Standard', value: 'standard' },
              { title: 'Express', value: 'express' },
              { title: 'Pickup', value: 'pickup' }
            ],
            layout: 'dropdown'
          },
          
        },
        {
          name: 'cost',
          title: 'Shipping Cost (₦)',
          type: 'number',
          initialValue: 0,
       
        },
        {
          name: 'trackingNumber',
          title: 'Tracking Number',
          type: 'string'
        },
        {
          name: 'carrier',
          title: 'Carrier',
          type: 'string'
        }
      ]
    },
    {
      name: 'subtotal',
      title: 'Subtotal (₦)',
      type: 'number',
      
    },
    {
      name: 'total',
      title: 'Total Amount (₦)',
      type: 'number',
     
    },
    {
      name: 'discount',
      title: 'Discount Amount (₦)',
      type: 'number',
      initialValue: 0,
     
    },
    {
      name: 'coupon',
      title: 'Coupon Code',
      type: 'string'
    },
    {
      name: 'notes',
      title: 'Order Notes',
      type: 'text',
      rows: 3
    },
    {
      name: 'createdAt',
      title: 'Order Date',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
  
    },
    {
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      orderId: 'orderId',
      customer: 'customer.name',
      status: 'status',
      total: 'total',
      date: 'createdAt',
      items: 'items.length'
    },
    prepare(selection) {
      const { orderId, customer, status, total, date, items } = selection
      return {
        title: `Order #${orderId}`,
        subtitle: `${customer} • ${status} • ${items} item${items !== 1 ? 's' : ''} • ₦${total}`,
        date: date
      }
    }
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }]
    },
    {
      title: 'Oldest First',
      name: 'createdAtAsc',
      by: [{ field: 'createdAt', direction: 'asc' }]
    },
    {
      title: 'Highest Amount',
      name: 'totalDesc',
      by: [{ field: 'total', direction: 'desc' }]
    }
  ]
}
