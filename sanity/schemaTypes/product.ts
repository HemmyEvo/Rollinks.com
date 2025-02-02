export default {
    name:'product',
    type:'document',
    title:'Product',
    fields: [
        {
            name:'name',
            type: 'string',
            title:'Name of product'
        },
        {
            name: 'image',
            type:'array',
            title: 'Product Images',
            of:[{type: 'image'}]
        },
        {
            name:'description',
            type:'text',
            title:'Description of product'
        },
        {
            name: 'slug',
            type:'slug',
            title:'Product slug',
            options:{
                source:'name',
            }
        },
        {
            name: 'price',
            type:'number',
            title:'Price'
        },
        {
            name: 'category',
            type:'reference',
            title:'Category',
            to:[{type:'category'}]
        }
    ]
}