
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, ShoppingBag, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549989476-69a92fa57c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-500/20 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-yellow-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="text-white space-y-8 text-center md:text-left animate-fade-in">
              <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium mb-2">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending products for 2023
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Discover Amazing Products
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 max-w-lg">
                Shop the latest trends with unbeatable prices and lightning-fast delivery straight to your door
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to="/products">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 font-semibold px-8 py-6 rounded-full">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 font-semibold px-8 py-6 rounded-full">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Browse Categories
                  </Button>
                </Link>
              </div>
              
              {/* Trust Elements */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-white/90 text-sm">4.9/5 from 10,000+ reviews</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-white" />
                  <span className="text-white/90 text-sm">Delivery within 24 hours</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Featured Products */}
            <div className="hidden md:block relative animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: "Premium Headphones",
                    price: "$299",
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
                    className: "transform -rotate-6 translate-y-4 hover:rotate-0 hover:scale-105"
                  },
                  {
                    name: "Smart Watch",
                    price: "$199",
                    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
                    className: "transform rotate-6 -translate-y-4 hover:rotate-0 hover:scale-105"
                  },
                  {
                    name: "Designer Bag",
                    price: "$89",
                    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
                    className: "transform -rotate-3 translate-y-2 hover:rotate-0 hover:scale-105"
                  },
                  {
                    name: "Coffee Beans",
                    price: "$24",
                    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
                    className: "transform rotate-3 -translate-y-2 hover:rotate-0 hover:scale-105"
                  }
                ].map((product, index) => (
                  <div 
                    key={index}
                    className={`group rounded-2xl bg-white/10 backdrop-blur-md p-3 transition-all duration-500 hover:shadow-2xl ${product.className}`}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-3 text-white">
                      <h3 className="font-medium line-clamp-1">{product.name}</h3>
                      <p className="font-bold">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -inset-4 border-2 border-dashed border-white/20 rounded-3xl -z-10"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white hover:bg-white/20 transition-all">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl">🚚</div>
            <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
            <p className="text-white/70">On all orders over $50</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white hover:bg-white/20 transition-all">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl">🔄</div>
            <h3 className="text-xl font-bold mb-2">30-Day Returns</h3>
            <p className="text-white/70">Hassle-free return policy</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white hover:bg-white/20 transition-all">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl">💬</div>
            <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
            <p className="text-white/70">Customer service available</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
