// schemas/order.js
export default {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
      {
        name: 'reference',
        title: 'Reference',
        type: 'string',
      },
      {
        name: 'email',
        title:"Email",
        type:'string'
      },
      {
        name: 'amount',
        title: 'Amount',
        type: 'number',
      },
      {
        name: 'paymentDetails',
        title: 'Payment Details',
        type: 'object',
        fields: [
          {
            name: 'method',
            title: 'Method',
            type: 'string',
          },
          {
            name: 'status',
            title: 'Status',
            type: 'string',
          },
        ],
      },
      {
        name:'customerDetails',
        title:'Customer Details',
        type:'object',
        fields:[
          {name: 'fullName', title:'Full Name', type:'string'},
          {name: 'email', title:'Email', type:'string'},
          {name: 'phone', title:'Phone', type:'string'},
      ,
        ]
      },
      {
        name: 'cart',
        title: 'Cart',
        type: 'object',
        fields: [
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [{ 
              type: 'object',
              fields: [
                { name: 'productId', title: 'Product ID', type: 'string' },
                { name: 'quantity', title: 'Quantity', type: 'number' },
                { name: 'price', title: 'Price', type: 'number' }
              ]
            }],
          },
          {
            name: 'total',
            title: 'Total',
            type: 'number',
          },
        ],
      },
      {
        name: 'createdAt',
        title: 'Created At',
        type: 'datetime',
      },
    ],
  };
  