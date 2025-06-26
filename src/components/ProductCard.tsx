import React, { useState } from 'react';
import {
  Card, CardMedia, CardContent, Typography, Button, Box, Chip,
  IconButton, TextField
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import type { Medicine } from '../types/CartDTO';

interface ProductCardProps {
  medicine: Medicine;
  onAddToCart: (medicine: Medicine, quantity: number) => void;
  loading?: boolean;
  currentCartQuantity?: number;
  canAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  medicine, 
  onAddToCart, 
  loading = false, 
  currentCartQuantity = 0,
  canAddToCart = true
}) => {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = medicine.stockQuantity === 0;
  const hasReachedMax = currentCartQuantity >= medicine.stockQuantity;
  const isDisabled = loading || isOutOfStock || hasReachedMax || !canAddToCart;
  const maxAddable = Math.max(0, medicine.stockQuantity - currentCartQuantity);

  const getButtonText = () => {
    if (!canAddToCart) return 'Not Available';
    if (isOutOfStock) return 'Out of Stock';
    if (hasReachedMax) return 'Max Quantity';
    return 'Add to Cart';
  };

  const getStockStatus = () => {
    if (isOutOfStock) return { text: 'Out of Stock', color: 'error' as const };
    if (medicine.stockQuantity <= 5) return { text: 'Low Stock', color: 'warning' as const };
    return { text: 'In Stock', color: 'success' as const };
  };

  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(1, Math.min(newQuantity, maxAddable));
    setQuantity(clampedQuantity);
  };

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= maxAddable) {
      onAddToCart(medicine, quantity);
      setQuantity(1); // Reset quantity after adding
    }
  };

  const stockStatus = getStockStatus();

  return (
    <Card sx={{ borderRadius: 2, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia 
        component="img" 
        height="140" 
        image={medicine.image || 'https://images.unsplash.com/photo-1603398938378-4b2b20f3c69a?w=300'} 
        alt={medicine.name} 
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
          {medicine.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flexGrow: 1 }}>
          {medicine.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary">
            ${medicine.price.toFixed(2)}
          </Typography>
        </Box>

        {canAddToCart && !isOutOfStock && !hasReachedMax && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Qty:
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  handleQuantityChange(value);
                }
              }}
              size="small"
              sx={{ width: 60 }}
              inputProps={{ 
                min: 1, 
                max: maxAddable,
                style: { textAlign: 'center' } 
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxAddable}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          {canAddToCart && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddToCart}
              disabled={isDisabled}
              sx={{ borderRadius: 2 }}
            >
              {getButtonText()}
            </Button>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Stock: {medicine.stockQuantity} units
          </Typography>
          <Chip 
            label={stockStatus.text} 
            color={stockStatus.color} 
            size="small" 
            variant="outlined"
          />
        </Box>
        
        {currentCartQuantity > 0 && canAddToCart && (
          <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
            In cart: {currentCartQuantity} units
          </Typography>
        )}
        
        {canAddToCart && maxAddable > 0 && maxAddable < medicine.stockQuantity && (
          <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
            Can add: {maxAddable} more units
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard; 