import { simplifiedProduct } from '@/app/interface';
import { client } from '@/lib/sanity';
import Image from 'next/image';
import React from 'react'

// Fetch data from Sanity
async function getData() {
  const query = `*[_type == "category"]{
    _id,
    name,
    "imageUrl": image.asset->url,
  }`;
  const data = await client.fetch(query);
  return data;
}

import { useState, useEffect } from 'react';

export default function Category() {
  const [data, setData] = useState<simplifiedProduct[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      setData(result);
    }
    fetchData();
  }, []);
  return(
      <div className="pb-[30px] pt-[56px] px-12 bg-[#d3d2d2]">
            <header className="w-full md:max-w-4xl mx-auto space-y-5 text-center">
              <div className="label flex items-center space-x-4">
                <Image src="/Rectangle 18.png" width={12} height={12} alt="" />
                <p className="text-sm text-[#DB4444]">Categories</p>
              </div>
              <div className="title text-xl text-left font-semibold">
                <p>Browse By Category</p>
              </div>
            </header>
            <main className="mt-10 max-w-4xl overflow-hidden mx-auto">
              <div className="h-28 flex w-fit space-x-7">
                {data.map((item, i) => (
                  <div
                    key={i}
                    className="h-full w-28 flex items-center overflow-hidden justify-center flex-col cursor-pointer bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105"
                  >
                    <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-t-lg bg-gray-100">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} width={60} height={60} className='object-cover' alt='category image' />
                      )}
                    </div>
                    <div className="w-full p-2 text-center">
                      <p className="text-sm font-medium text-gray-700">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
  )
}
