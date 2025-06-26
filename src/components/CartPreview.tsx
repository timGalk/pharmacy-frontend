import React from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, Divider, Button, Paper
} from '@mui/material';
import { Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import type { CartItem } from '../types/CartDTO';

interface CartPreviewProps {
  items: CartItem[];
  onRemoveItem?: (itemId: number) => void;
  onViewCart?: () => void;
  onClearCart?: () => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ 
  items, 
  onRemoveItem, 
  onViewCart, 
  onClearCart 
}) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <ShoppingCartIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Your cart is empty
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Cart ({totalItems} items)
        </Typography>
        {onClearCart && (
          <Button size="small" color="error" onClick={onClearCart}>
            Clear All
          </Button>
        )}
      </Box>
      
      <List dense>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem>
              <ListItemText
                primary={item.medicine.name}
                secondary={`${item.quantity} × $${item.medicine.price.toFixed(2)}`}
              />
              <ListItemSecondaryAction>
                <Typography variant="body2" color="primary" sx={{ mr: 1 }}>
                  ${(item.medicine.price * item.quantity).toFixed(2)}
                </Typography>
                {onRemoveItem && (
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
            {index < items.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6" color="primary">
          ${totalPrice.toFixed(2)}
        </Typography>
      </Box>
      
      {onViewCart && (
        <Button
          variant="contained"
          fullWidth
          onClick={onViewCart}
          sx={{ borderRadius: 2 }}
        >
          View Cart
        </Button>
      )}
    </Paper>
  );
};

export default CartPreview; 