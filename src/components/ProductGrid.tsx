
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Plus, CheckCircle, Eye, X } from 'lucide-react';
import { Product } from '../pages/Index';
import { useToast } from '@/hooks/use-toast';

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  searchTerm?: string;
  selectedCategory?: string;
  priceRange?: number[];
  sortBy?: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation",
    rating: 4.8
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Electronics",
    description: "Track your fitness goals with this advanced smartwatch",
    rating: 4.6
  },
  {
    id: 3,
    name: "Designer Laptop Bag",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Accessories",
    description: "Stylish and functional laptop bag for professionals",
    rating: 4.7
  },
  {
    id: 4,
    name: "Organic Coffee Beans",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    category: "Food",
    description: "Premium organic coffee beans from Colombia",
    rating: 4.9
  },
  {
    id: 5,
    name: "Wireless Charging Pad",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    category: "Electronics",
    description: "Fast wireless charging for all compatible devices",
    rating: 4.5
  },
  {
    id: 6,
    name: "Eco-Friendly Water Bottle",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    category: "Lifestyle",
    description: "Sustainable stainless steel water bottle",
    rating: 4.4
  },
  {
    id: 7,
    name: "Artisanal Handmade Soap",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1607006344380-e4945e43f380?w=400&h=400&fit=crop",
    category: "Lifestyle",
    description: "Natural artisanal soap with organic ingredients",
    rating: 4.7
  },
  {
    id: 8,
    name: "Bluetooth Portable Speaker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    category: "Electronics",
    description: "Powerful sound in a compact, portable design",
    rating: 4.5
  },
  {
    id: 9,
    name: "Premium Dark Chocolate",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop",
    category: "Food", 
    description: "Gourmet 85% dark chocolate made from single-origin cacao",
    rating: 4.8
  }
];

const ProductGrid = ({ 
  onAddToCart,
  searchTerm = '',
  selectedCategory = 'All',
  priceRange = [0, 500],
  sortBy = 'name'
}: ProductGridProps) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [quickView, setQuickView] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Filter and sort products
  let filteredProducts = [...mockProducts];
  
  // Filter by category
  if (selectedCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }
  
  // Filter by search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }
  
  // Filter by price
  filteredProducts = filteredProducts.filter(p => 
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );
  
  // Sort products
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => b.id - a.id);
      break;
    default:
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast({
          title: "Removed from wishlist",
          description: "This item has been removed from your wishlist"
        });
      } else {
        newFavorites.add(productId);
        toast({
          title: "Added to wishlist",
          description: "This item has been added to your wishlist"
        });
      }
      return newFavorites;
    });
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
      variant: "default"
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Featured Products
        </h2>
        <p className="text-gray-600 mb-4">
          Discover our curated selection of premium products
        </p>
        
        <div className="text-sm text-gray-500 mb-4">
          {filteredProducts.length} products found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card 
            key={product.id} 
            className="group overflow-hidden border border-purple-100 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600">
                {product.category}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                className={`absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm ${
                  favorites.has(product.id) ? 'text-red-500 border-red-500' : 'text-gray-600'
                }`}
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm"
                onClick={() => setQuickView(product.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center gap-1 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.rating})</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
              </div>
            </CardContent>
            
            <CardFooter className="p-6 pt-0">
              <Button 
                onClick={() => handleAddToCart(product)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all group"
              >
                <ShoppingCart className="mr-2 h-4 w-4 transition-all group-hover:scale-110" />
                Add to Cart
              </Button>
            </CardFooter>
            
            {quickView === product.id && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold">{product.name}</h3>
                      <Button variant="ghost" size="icon" onClick={() => setQuickView(null)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-auto aspect-square object-cover"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <Badge>{product.category}</Badge>
                        
                        <h4 className="text-3xl font-bold text-purple-600">
                          ${product.price}
                        </h4>
                        
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating) 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({product.rating})</span>
                        </div>
                        
                        <p className="text-gray-600">
                          {product.description}
                        </p>
                        
                        <div className="space-y-4 pt-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>In stock and ready to ship</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Free returns within 30 days</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                            onClick={() => {
                              handleAddToCart(product);
                              setQuickView(null);
                            }}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                          
                          <Button 
                            variant="outline"
                            className={`flex-1 ${
                              favorites.has(product.id) ? 'text-red-500 border-red-500' : ''
                            }`}
                            onClick={() => toggleFavorite(product.id)}
                          >
                            <Heart className={`mr-2 h-4 w-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
                            {favorites.has(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😢</div>
          <h3 className="text-2xl font-bold mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <Button onClick={() => {
            // Reset filters logic would go here
          }}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
