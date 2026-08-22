'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import api, { Product, Category } from '../lib/api';
import ProductDetailModal from './ProductDetailModal';
import { Plus, Sparkles, Search, Star, Check } from 'lucide-react';

const ProductsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected product for modal
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getProducts()])
      .then(([catRes, prodRes]) => {
        if (catRes.data) setCategories(catRes.data);
        if (prodRes.data) setProducts(prodRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (typeof prod.category === 'object' && prod.category !== null
        ? prod.category._id === selectedCategory
        : prod.category === selectedCategory);

    const matchesSearch =
      !searchQuery.trim() ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.nameAr && prod.nameAr.includes(searchQuery)) ||
      (prod.description && prod.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart({
      productId: product._id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      quantity: 1,
      image: product.thumbnail || product.images?.[0] || '/assets/1.jpg',
      itemType: 'product',
    });

    setQuickAddedId(product._id);
    setTimeout(() => {
      setQuickAddedId(null);
    }, 1000);
  };

  const currency = t('common.currency', 'TL');

  return (
    <section id="products" className="py-24 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> {t('menu.tag', 'Artisanal Menu')}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('menu.title', 'Our Handcrafted Chocolates')}
            </span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            {t('menu.desc', 'Made with single-origin Swiss and Belgian cacao, fresh roasted nuts, and pure fruit essences.')}
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25'
                  : 'bg-pink-50/80 text-gray-700 hover:bg-pink-100 border border-pink-100'
              }`}
            >
              {t('menu.allItems', 'All Items')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat._id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25'
                    : 'bg-pink-50/80 text-gray-700 hover:bg-pink-100 border border-pink-100'
                }`}
              >
                {i18n.language === 'ar' && cat.nameAr ? cat.nameAr : i18n.language === 'tr' && cat.nameTr ? cat.nameTr : cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('menu.searchPlaceholder', 'Search chocolates & flavors...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-full border border-pink-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30 text-gray-800"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-24 text-center text-gray-400">{t('common.loading', 'Loading...')}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-base font-semibold">{t('menu.empty', 'No chocolates found in this category.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => setActiveModalProduct(product)}
                className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-pink-100 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="h-56 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4 mb-5 relative overflow-hidden border border-pink-100/50">
                    <img
                      src={product.thumbnail || product.images?.[0] || '/assets/1.jpg'}
                      alt={i18n.language === 'ar' && product.nameAr ? product.nameAr : i18n.language === 'tr' && product.nameTr ? product.nameTr : product.name}
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/1.jpg';
                      }}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1">
                      {product.isFeatured && (
                        <span className="px-2.5 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-bold shadow-xs">
                          {t('menu.featured', 'Featured')}
                        </span>
                      )}
                      {product.isBestSeller && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-white" /> {t('menu.bestSeller', 'Best Seller')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-pink-600 transition-colors truncate">
                        {i18n.language === 'ar' && product.nameAr ? product.nameAr : i18n.language === 'tr' && product.nameTr ? product.nameTr : product.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {i18n.language === 'ar' && product.descriptionAr ? product.descriptionAr : i18n.language === 'tr' && product.descriptionTr ? product.descriptionTr : product.description}
                    </p>
                  </div>
                </div>

                {/* Price & Quick Add */}
                <div className="pt-4 border-t border-pink-100/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium">{t('common.piecePrice', 'Piece Price')}</span>
                    <div className="text-xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {product.price} <span className="text-xs font-semibold text-gray-500">{currency}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md shadow-pink-500/25 hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  >
                    {quickAddedId === product._id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{t('common.added', 'Added!')}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>{t('common.add', 'Add')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal View */}
      {activeModalProduct && (
        <ProductDetailModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
        />
      )}
    </section>
  );
};

export default ProductsSection;