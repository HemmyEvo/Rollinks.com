export interface simplifiedProduct {
    _id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: number;
    categoryName: string;
}
export interface fullProduct {
    _id: string;
    name: string;
    slug: string;
    images: any;
    price: number;
    categoryName: string;
    description:string
}
