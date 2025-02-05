'use client'

import React, { useEffect, useState } from 'react';
import ProductCard from '../_components/ProductCard';
import { client } from '@/lib/sanity';
import { fullProduct, simplifiedProduct } from '@/app/interface';
import Loading from '@/components/ui/Loading';



async function getData() {
  const query = `*[_type == "product"]{
    _id,
    name,
    description,
    "slug": slug.current,
    "images": image[0].asset->url,
    price,
    "categoryName": category->name
  }`;
  const data = await client.fetch(query);
  return data;
}

async function getCategory() {
  const query = `*[_type == "category"]{
    _id,
    name,
    "imageUrl": image.asset->url,
  }`;
  const data = await client.fetch(query);
  return data;
}


const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [data, setData] = useState<fullProduct[]>([]);
    const [categories, setCategories] = useState<simplifiedProduct[]>([]);
  
    useEffect(() => {
      async function fetchData() {
        const result = await getData();
        const category = await getCategory()
        setData(result);
        setCategories(category)
      }
      fetchData();
    }, []);

  if(data.length === 0) 
    return <Loading />
  const filteredProducts = data.filter(product => {
    return (
      (!selectedCategory || product.categoryName === selectedCategory) &&
      (!maxPrice || product.price <= maxPrice)
    );
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <label className="mr-4">
          Category:
          <select
            className="ml-2 p-2 border rounded"
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory || ''}
          >
            <option value="">All</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="mr-4">
          Max Price:
          <input
            className="ml-2 p-2 border rounded"
            type="number"
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            value={maxPrice || ''}
          />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(item => (
         <ProductCard 
         key={item._id}
         id={item._id}
         title={item.name}
         image={item.images}
         price={item.price}
         description={item.description}
         slug={item.slug}
         discount={item.price + 1000}
           
         />
        ))}
      </div>
    </div>
  );
};

export default Page;
