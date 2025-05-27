
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Star, TrendingUp, DollarSign } from 'lucide-react';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const categories = [
  { name: 'All', icon: '🛍️', count: 24 },
  { name: 'Electronics', icon: '📱', count: 8 },
  { name: 'Accessories', icon: '👜', count: 6 },
  { name: 'Food', icon: '🍫', count: 4 },
  { name: 'Lifestyle', icon: '🌱', count: 6 }
];

const sortOptions = [
  { value: 'name', label: 'Name', icon: '🔤' },
  { value: 'price-low', label: 'Price: Low to High', icon: '💰' },
  { value: 'price-high', label: 'Price: High to Low', icon: '💎' },
  { value: 'rating', label: 'Best Rated', icon: '⭐' },
  { value: 'newest', label: 'Newest First', icon: '🆕' }
];

const ProductFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange
}: ProductFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('All');
    onPriceRangeChange([0, 500]);
    onSortChange('name');
  };

  return (
    <div className="sticky top-24">
      <Card className="backdrop-blur-md bg-white/80 border border-purple-100 shadow-md">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearFilters} title="Clear all filters">
              <X className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse filters" : "Expand filters"}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-3">
            <div className="space-y-6">
              {/* Search Input */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Categories */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.name}
                      variant={selectedCategory === category.name ? "default" : "outline"}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedCategory === category.name 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => onCategoryChange(category.name)}
                    >
                      {category.icon} {category.name} ({category.count})
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price Range
                </h3>
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={500}
                  step={10}
                  value={priceRange}
                  onValueChange={onPriceRangeChange}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              {/* Sort By */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Sort By
                </h3>
                <div className="space-y-1">
                  {sortOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`px-3 py-2 rounded-md cursor-pointer transition-all flex items-center gap-2 text-sm ${
                        sortBy === option.value 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => onSortChange(option.value)}
                    >
                      {option.icon} {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ProductFilters;
