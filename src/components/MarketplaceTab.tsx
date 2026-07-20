"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from './ProductCard';
import { Search, ShoppingCart, Star, Filter, Heart, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  category: 'furniture' | 'lighting' | 'flooring' | 'paint' | 'decor';
  price: number;
  description: string;
  image: string;
  specs: Record<string, string>;
  rating: number;
  reviewsCount: number;

}

interface MarketplaceTabProps {
  serverUrl: string;
}

const CATEGORIES = [
  { id: 'all', name: 'All Spaces' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'lighting', name: 'Lighting' },
  { id: 'paint', name: 'Wall Paint' },
  { id: 'flooring', name: 'Flooring' },
  { id: 'decor', name: 'Interior Decor' }
];

export default function MarketplaceTab({ serverUrl }: MarketplaceTabProps) {
  const { addToCart, removeFromCart, cart, loading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Searching & sorting filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Track adding items feedback
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${serverUrl}/api/marketplace/products`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to pull marketplace products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [serverUrl]);

  // Handle adding product with temporary feedback trigger
  const handleAddToCart = async (
    e: React.MouseEvent,
    item: Product
  ) => {
    e.stopPropagation();

    const isInCart = cart.some(c => c.id === item.id);

    if (isInCart) {
      await removeFromCart(item.id);
      toast.success(`${item.name} removed from cart.`);
      return;
    }

    await addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category
    });

    toast.success(`${item.name} added to cart.`);

    setAddedItemMap(prev => ({
      ...prev,
      [item.id]: true
    }));

    setTimeout(() => {
      setAddedItemMap(prev => ({
        ...prev,
        [item.id]: false
      }));
    }, 1200);
  };

  // Handle wishlist clicks
  const handleWishlistToggle = async (e: React.MouseEvent, item: Product) => {
    e.stopPropagation();
    if (isInWishlist(item.id)) {
      await removeFromWishlist(item.id);
    } else {
      await addToWishlist(item);
    }
  };

  // Filter products memo
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchCat = selectedCategory === 'all' || product.category === selectedCategory;
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const globalLoading = loading || wishlistLoading || cartLoading;

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Loading Overlay */}
      {globalLoading && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-40 pointer-events-none rounded-2xl">
          <div className="w-10 h-10 rounded-full border-2 border-t-[#C28285] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
      )}

      {/* Product Spec Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div
            className="glass-panel w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:bg-black text-gray-400 hover:text-white text-sm"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-6 relative aspect-square bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-6 p-6 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-violet-400 font-bold uppercase tracking-widest block capitalize">
                        {selectedProduct.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">{selectedProduct.name}</h3>

                      <div className="flex items-center gap-1 mt-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-semibold">{selectedProduct.rating}</span>
                        <span className="text-[10px] text-gray-500 font-medium">({selectedProduct.reviewsCount} reviews)</span>
                      </div>
                    </div>


                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Specifications checklist */}
                  <div className="space-y-1.5 border-t border-white/5 pt-4">
                    <span className="text-[9px] text-gray-900 font-bold uppercase tracking-wider block">Product Specifications</span>
                    <div className="grid grid-cols-1 gap-1 text-[10px]">
                      {Object.entries(selectedProduct.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-white/[0.02] py-1">
                          <span className="text-gray-900">{key}</span>
                          <span className="text-gray-800 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
                  <div className="text-lg font-black text-cyan-400">
                    ${selectedProduct.price}
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, selectedProduct)}
                    className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${cart.some(c => c.id === selectedProduct.id)
                      ? "bg-red-100 text-red-600 border border-red-300"
                      : "btn-gradient text-white"
                      }`}
                  >
                    <ShoppingCart className="w-4 h-4" />

                    {cart.some(c => c.id === selectedProduct.id)
                      ? "Remove from Cart"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories filter list & Search bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-black/20 p-4 border border-white/5 rounded-2xl">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedCategory === cat.id
                ? 'border-cyan-900/50 bg-cyan-350/20 text-cyan-600 shadow-sm shadow-cyan-500/5'
                : 'border-white bg-white/[0.01] text-gray-900 hover:text-white hover:bg-white/[0.02]'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-white absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, brands, textures..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-200 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Products list Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="glass-panel aspect-[3/4] rounded-2xl skeleton-pulse bg-white/[0.01]" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-panel p-20 rounded-2xl text-center flex flex-col items-center justify-center">
          <Filter className="w-10 h-10 text-gray-600 mb-4" />
          <h3 className="text-sm font-bold text-gray-400">No matching items found</h3>
          <p className="text-[10px] text-gray-500 mt-1">Refine your search term or select another category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

    </div>
  );
}
