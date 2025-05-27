
import { useState } from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import Cart from '../components/Cart';
import Footer from '../components/Footer';
import ProductFilters from '../components/ProductFilters';
import { Product, CartItem } from './Index';

const Products = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('name');

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header 
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      {/* Enhanced Hero Section for Products */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-pink-400 rounded-full opacity-20 animate-bounce"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Shop from our curated collection of premium items
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                ✨ Free Shipping Over $50
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                🔄 30-Day Returns
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                ⚡ Fast Delivery
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with Filters */}
          <div className="lg:w-1/4">
            <ProductFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
          
          {/* Products Grid */}
          <div className="lg:w-3/4">
            <ProductGrid 
              onAddToCart={addToCart}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              priceRange={priceRange}
              sortBy={sortBy}
            />
          </div>
        </div>
      </main>
      
      <Footer />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
};

export default Products;
