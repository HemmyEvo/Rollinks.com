'use client'

import React, { useEffect, useState } from 'react';
import ProductCard from '../_components/ProductCard';
import { client } from '@/lib/sanity';
import { fullProduct, simplifiedProduct } from '@/app/interface';
import { useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown, ChevronUp, Star, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

async function getData() {
  const query = `*[_type == "product"]{
    _id,
    name,
    "description": description,
    "slug": slug.current,
    "images": images[].asset->url,
    price,
    "categoryName": category->name,
    rating,
    isNew
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
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(urlCategory);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [data, setData] = useState<fullProduct[]>([]);
  const [categories, setCategories] = useState<simplifiedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productData, categoryData] = await Promise.all([
          getData(),
          getCategory()
        ]);
        setData(productData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = data.filter(product => {
    return (
      (!selectedCategory || product.categoryName === selectedCategory) &&
      (!maxPrice || product.price <= maxPrice) &&
      (!minRating || (product.rating || 0) >= minRating)
    );
  }).sort((a, b) => {
    switch (sortOption) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default: return 0; // featured - no sorting
    }
  });

  const resetFilters = () => {
    setSelectedCategory(null);
    setMaxPrice(null);
    setMinRating(null);
    setSortOption('featured');
  };

  const activeFiltersCount = [
    selectedCategory,
    maxPrice,
    minRating,
    sortOption !== 'featured'
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      {/* Header with back button */}
      <div className="max-w-7xl mx-auto mb-6">
        {selectedCategory ? (
          <div className="flex flex-col space-y-4">
            <Link href="/categories" className="flex items-center text-blue-600 hover:text-blue-800 w-fit">
              <ArrowLeft className="mr-2" size={18} />
              Back to categories
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              {selectedCategory} Products
            </h1>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">All Skincare Products</h1>
            <p className="text-gray-600">Discover your perfect skincare routine</p>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Filter Bar */}
        <motion.div 
          className="sticky top-0 z-10 mb-6 backdrop-blur-lg bg-white/70 border-b border-white/20 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-wrap items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onChange={(e) => setSortOption(e.target.value)}
                  value={sortOption}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="text-sm text-gray-500 mt-2 sm:mt-0">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </motion.div>

        {/* Mobile Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="overflow-hidden bg-white/80 backdrop-blur-md rounded-xl shadow-lg mb-6 border border-white/20"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Category</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-sm ${!selectedCategory ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        All Categories
                      </button>
                      {categories.map(category => (
                        <button
                          key={category._id}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap overflow-hidden text-ellipsis ${selectedCategory === category.name ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Max price (₦)"
                        className="flex-1 p-2 border rounded-lg"
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        value={maxPrice || ''}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Minimum Rating</h4>
                    <div className="flex gap-2">
                      {[4, 3, 2, 1].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setMinRating(rating === minRating ? null : rating)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${minRating === rating ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          <Star size={14} fill={rating <= (minRating || 0) ? 'currentColor' : 'none'} />
                          {rating}+
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={resetFilters}
                      className="flex-1 py-2 text-blue-600 hover:text-blue-800 font-medium border border-blue-600 rounded-lg"
                    >
                      Reset all
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            <AnimatePresence>
              {filteredProducts.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-white/20"
                >
                <ProductCard
  id={item._id}
  title={item.name}
  image={item.images?.[0]} // use the first image
  price={item.price}
  description={item.description}
  slug={item.slug.current}
  discount={item.price + 1000}
  rating={item.rating ?? 0}
  isNew={item.isNew}
/>


                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="bg-blue-100/50 p-6 rounded-full mb-4">
              <X size={40} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to find what you're looking for</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Reset filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Page;