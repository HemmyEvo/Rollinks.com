import { simplifiedProduct } from '@/app/interface';
import { client } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

async function getData() {
  const query = `*[_type == "category"]{
    _id,
    name,
    "imageUrl": image.asset->url,
    "slug": slug.current
  }`;
  const data = await client.fetch(query);
  return data;
}

export default function Category() {
  const [data, setData] = useState<simplifiedProduct[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      setData(result);
    }
    fetchData();
  }, []);

  return (
    <div className="pb-[30px] pt-[56px] px-4 sm:px-12 bg-[#f8f8f8]">
      <header className="w-full md:max-w-4xl mx-auto space-y-5 text-center">
        <div className="label flex items-center justify-center space-x-4">
          <Image src="/Rectangle 18.png" width={12} height={12} alt="" />
          <p className="text-sm text-[#DB4444]">Categories</p>
        </div>
        <div className="title text-xl md:text-2xl text-center font-semibold">
          <p>Browse By Category</p>
        </div>
      </header>
      
      <main className="mt-10 max-w-4xl mx-auto">
        <div className="flex overflow-x-auto pb-4 gap-4 px-2">
          {data.map((item) => (
            <Link 
              key={item._id}
              href={`/products?category=${encodeURIComponent(item.name)}`}
              passHref
            >
              <div className="flex-shrink-0 w-28 h-28 flex flex-col items-center justify-center cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-16 h-16 flex items-center justify-center mb-2">
                  {item.imageUrl && (
                    <Image 
                      src={item.imageUrl} 
                      width={60} 
                      height={60} 
                      className='object-contain'
                      alt={item.name}
                    />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700 px-2 text-center">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}