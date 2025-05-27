
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { CartItem } from './Index';
import { Award, Users, Globe, Heart } from 'lucide-react';

const About = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About E-Commerce App</h1>
            <p className="text-xl text-gray-600">Your trusted partner for premium products and exceptional shopping experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2020, E-Commerce App has been dedicated to providing customers with the best online shopping experience. We believe in quality, affordability, and exceptional customer service.
              </p>
              <p className="text-gray-600">
                Our mission is to make premium products accessible to everyone while maintaining the highest standards of quality and customer satisfaction.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700">Quality products and services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700">Customer-first approach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700">Global accessibility</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700">Passionate about excellence</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick and reliable shipping to your doorstep</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock customer service</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
                <p className="text-gray-600">Competitive pricing on all products</p>
              </div>
            </div>
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

export default About;
