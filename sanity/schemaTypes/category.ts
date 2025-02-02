import { title } from "process";

export default {
    name:'category',
    type:'document',
    title:'Category',
    fields: [{
        name:'name',
        type:'string',
        title:'Name of category'
    },
    {
        name:'image',
        type:'image',
        title:'Category Image'
    }
    ]
}