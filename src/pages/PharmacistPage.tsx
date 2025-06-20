import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Snackbar,
  Badge,
  Avatar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LocalPharmacy as PharmacyIcon,
  Article as ArticleIcon,
  Inventory as InventoryIcon,
  Analytics as AnalyticsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
  ShoppingCart as CartIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import Navigation from '../components/Navigation';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  price: number;
  stock: number;
  manufacturer: string;
  description: string;
  requiresPrescription: boolean;
  image: string;
  expiryDate: string;
  status: 'active' | 'inactive' | 'out_of_stock';
}

interface BlogArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  readTime: number;
  views: number;
}

const PharmacistPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [medicineDialogOpen, setMedicineDialogOpen] = useState(false);
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Sample data
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Pain Relief',
      price: 5.99,
      stock: 150,
      manufacturer: 'Generic Pharma',
      description: 'Effective pain reliever and fever reducer',
      requiresPrescription: false,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
      expiryDate: '2025-12-31',
      status: 'active',
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotics',
      price: 12.99,
      stock: 45,
      manufacturer: 'MedCorp',
      description: 'Broad-spectrum antibiotic for bacterial infections',
      requiresPrescription: true,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
      expiryDate: '2024-06-30',
      status: 'active',
    },
  ]);

  const [articles, setArticles] = useState<BlogArticle[]>([
    {
      id: '1',
      title: 'Understanding Seasonal Allergies',
      content: 'Seasonal allergies affect millions of people worldwide...',
      category: 'Health Tips',
      author: 'Dr. Sarah Johnson',
      publishDate: '2024-01-15',
      status: 'published',
      tags: ['allergies', 'seasonal', 'health'],
      readTime: 5,
      views: 1247,
    },
    {
      id: '2',
      title: 'The Importance of Vitamin D',
      content: 'Vitamin D plays a crucial role in bone health...',
      category: 'Nutrition',
      author: 'Dr. Sarah Johnson',
      publishDate: '2024-01-10',
      status: 'published',
      tags: ['vitamin D', 'nutrition', 'bone health'],
      readTime: 7,
      views: 892,
    },
  ]);

  const [newMedicine, setNewMedicine] = useState<Partial<Medicine>>({
    name: '',
    genericName: '',
    category: '',
    price: 0,
    stock: 0,
    manufacturer: '',
    description: '',
    requiresPrescription: false,
    expiryDate: '',
  });

  const [newArticle, setNewArticle] = useState<Partial<BlogArticle>>({
    title: '',
    content: '',
    category: '',
    tags: [],
    readTime: 0,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMedicineSubmit = () => {
    if (editingMedicine) {
      setMedicines(medicines.map(med => 
        med.id === editingMedicine.id ? { ...editingMedicine, ...newMedicine } as Medicine : med
      ));
    } else {
      const medicine: Medicine = {
        id: Date.now().toString(),
        ...newMedicine,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
        status: 'active',
      } as Medicine;
      setMedicines([...medicines, medicine]);
    }
    setMedicineDialogOpen(false);
    setEditingMedicine(null);
    setNewMedicine({
      name: '',
      genericName: '',
      category: '',
      price: 0,
      stock: 0,
      manufacturer: '',
      description: '',
      requiresPrescription: false,
      expiryDate: '',
    });
    setSnackbar({ open: true, message: 'Medicine saved successfully!', severity: 'success' });
  };

  const handleArticleSubmit = () => {
    if (editingArticle) {
      setArticles(articles.map(art => 
        art.id === editingArticle.id ? { ...editingArticle, ...newArticle } as BlogArticle : art
      ));
    } else {
      const article: BlogArticle = {
        id: Date.now().toString(),
        ...newArticle,
        author: 'Dr. Sarah Johnson',
        publishDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        views: 0,
      } as BlogArticle;
      setArticles([...articles, article]);
    }
    setArticleDialogOpen(false);
    setEditingArticle(null);
    setNewArticle({
      title: '',
      content: '',
      category: '',
      tags: [],
      readTime: 0,
    });
    setSnackbar({ open: true, message: 'Article saved successfully!', severity: 'success' });
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setNewMedicine(medicine);
    setMedicineDialogOpen(true);
  };

  const handleEditArticle = (article: BlogArticle) => {
    setEditingArticle(article);
    setNewArticle(article);
    setArticleDialogOpen(true);
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter(med => med.id !== id));
    setSnackbar({ open: true, message: 'Medicine deleted successfully!', severity: 'success' });
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(art => art.id !== id));
    setSnackbar({ open: true, message: 'Article deleted successfully!', severity: 'success' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'out_of_stock': return 'error';
      default: return 'default';
    }
  };

  const getArticleStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navigation />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <PharmacyIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Pharmacist Dashboard
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage medicines and create health articles
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {medicines.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Medicines
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <ArticleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {articles.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Blog Articles
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <TrendingIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {medicines.filter(m => m.stock < 50).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Stock Items
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {articles.reduce((sum, art) => sum + art.views, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Article Views
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Medicine Management" icon={<InventoryIcon />} iconPosition="start" />
            <Tab label="Blog Articles" icon={<ArticleIcon />} iconPosition="start" />
            <Tab label="Analytics" icon={<AnalyticsIcon />} iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Medicine Management Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Medicine Inventory
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setMedicineDialogOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                Add New Medicine
              </Button>
            </Box>

            <Grid container spacing={3}>
              {medicines.map((medicine) => (
                <Grid item xs={12} sm={6} md={4} key={medicine.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={medicine.image}
                        alt={medicine.name}
                        style={{ width: '100%', height: 200, objectFit: 'cover' }}
                      />
                      <Chip
                        label={medicine.status.replace('_', ' ')}
                        color={getStatusColor(medicine.status) as any}
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {medicine.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {medicine.genericName}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip label={medicine.category} size="small" variant="outlined" />
                        {medicine.requiresPrescription && (
                          <Chip label="Prescription Required" size="small" color="warning" />
                        )}
                      </Stack>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        ${medicine.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stock: {medicine.stock} units
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditMedicine(medicine)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteMedicine(medicine.id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Blog Articles Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Blog Articles
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setArticleDialogOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                Create New Article
              </Button>
            </Box>

            <Grid container spacing={3}>
              {articles.map((article) => (
                <Grid item xs={12} md={6} key={article.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {article.title}
                        </Typography>
                        <Chip
                          label={article.status}
                          color={getArticleStatusColor(article.status) as any}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {article.content.substring(0, 150)}...
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        {article.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {article.publishDate} • {article.readTime} min read • {article.views} views
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleEditArticle(article)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteArticle(article.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Analytics Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Analytics Dashboard
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Medicine Categories
                  </Typography>
                  <List>
                    {Array.from(new Set(medicines.map(m => m.category))).map((category) => (
                      <ListItem key={category}>
                        <ListItemText
                          primary={category}
                          secondary={`${medicines.filter(m => m.category === category).length} medicines`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Article Performance
                  </Typography>
                  <List>
                    {articles.map((article) => (
                      <ListItem key={article.id}>
                        <ListItemText
                          primary={article.title}
                          secondary={`${article.views} views • ${article.readTime} min read`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>

      {/* Medicine Dialog */}
      <Dialog open={medicineDialogOpen} onClose={() => setMedicineDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Medicine Name"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Generic Name"
                value={newMedicine.genericName}
                onChange={(e) => setNewMedicine({ ...newMedicine, genericName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={newMedicine.category}
                onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manufacturer"
                value={newMedicine.manufacturer}
                onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={newMedicine.price}
                onChange={(e) => setNewMedicine({ ...newMedicine, price: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={newMedicine.stock}
                onChange={(e) => setNewMedicine({ ...newMedicine, stock: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={newMedicine.expiryDate}
                onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newMedicine.requiresPrescription}
                    onChange={(e) => setNewMedicine({ ...newMedicine, requiresPrescription: e.target.checked })}
                  />
                }
                label="Requires Prescription"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={newMedicine.description}
                onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMedicineDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleMedicineSubmit} variant="contained">
            {editingMedicine ? 'Update' : 'Add'} Medicine
          </Button>
        </DialogActions>
      </Dialog>

      {/* Article Dialog */}
      <Dialog open={articleDialogOpen} onClose={() => setArticleDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingArticle ? 'Edit Article' : 'Create New Article'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Article Title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={newArticle.category}
                onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Read Time (minutes)"
                type="number"
                value={newArticle.readTime}
                onChange={(e) => setNewArticle({ ...newArticle, readTime: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                value={newArticle.tags?.join(', ') || ''}
                onChange={(e) => setNewArticle({ 
                  ...newArticle, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                })}
                helperText="Enter tags separated by commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Article Content"
                multiline
                rows={8}
                value={newArticle.content}
                onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                helperText="Write your article content here. You can use markdown formatting."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArticleDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleArticleSubmit} variant="contained">
            {editingArticle ? 'Update' : 'Create'} Article
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PharmacistPage;
