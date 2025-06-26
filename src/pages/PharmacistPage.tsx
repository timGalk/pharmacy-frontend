import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
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
import { addMedicine, getAllMedicines, deleteMedicine, updateMedicine } from '../services/api'; // adjust path as needed
import { authService } from '../services/authService';
import Grid from '@mui/material/Grid';

interface Medicine {
  id: string | number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  expirationDate: string;
  image: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null);

  // Load medicines from API
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // Fetch medicines from API on component mount
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        setError(null);
        const medicinesData = await getAllMedicines();
        setMedicines(medicinesData);
      } catch (err) {
        setError('Failed to load medicines');
        console.error('Error fetching medicines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

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
    description: '',
    price: 0,
    stockQuantity: 0,
    expirationDate: '',
    image: '',
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

  const handleMedicineSubmit = async () => {
    // Validation
    if (!newMedicine.name || newMedicine.name.length < 3 || newMedicine.name.length > 50) {
      setSnackbar({ open: true, message: 'Name must be between 3 and 50 characters', severity: 'error' });
      return;
    }
    if (!newMedicine.description || newMedicine.description.length < 3 || newMedicine.description.length > 200) {
      setSnackbar({ open: true, message: 'Description must be between 3 and 200 characters', severity: 'error' });
      return;
    }
    if (newMedicine.price === undefined || newMedicine.price < 0) {
      setSnackbar({ open: true, message: 'Price must be greater than or equal to 0', severity: 'error' });
      return;
    }
    if (newMedicine.stockQuantity === undefined || newMedicine.stockQuantity < 0) {
      setSnackbar({ open: true, message: 'Stock quantity must be greater than or equal to 0', severity: 'error' });
      return;
    }
    if (newMedicine.image && newMedicine.image.length > 255) {
      setSnackbar({ open: true, message: 'Image URL must not exceed 255 characters', severity: 'error' });
      return;
    }
    if (!newMedicine.expirationDate) {
      setSnackbar({ open: true, message: 'Expiration date is required', severity: 'error' });
      return;
    }
    try {
      if (editingMedicine) {
        await updateMedicine(editingMedicine.id.toString(), {
          name: newMedicine.name!,
          description: newMedicine.description!,
          price: newMedicine.price!,
          quantity: newMedicine.stockQuantity!,
          expirationDate: newMedicine.expirationDate!,
          image: newMedicine.image || '',
        });
      } else {
        await addMedicine({
          name: newMedicine.name!,
          description: newMedicine.description!,
          price: newMedicine.price!,
          stockQuantity: newMedicine.stockQuantity!,
          expirationDate: newMedicine.expirationDate!,
          image: newMedicine.image || '',
        });
      }
      // Refresh medicines from API
      const medicinesData = await getAllMedicines();
      setMedicines(medicinesData);
      setMedicineDialogOpen(false);
      setEditingMedicine(null);
      setNewMedicine({ name: '', description: '', price: 0, stockQuantity: 0, expirationDate: '', image: '' });
      setSnackbar({ open: true, message: 'Medicine saved successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save medicine', severity: 'error' });
    }
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

  const handleDeleteMedicine = async (id: string | number) => {
    try {
      await deleteMedicine(id.toString());
      // Refresh medicines from API
      const medicinesData = await getAllMedicines();
      setMedicines(medicinesData);
      setSnackbar({ open: true, message: 'Medicine deleted successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete medicine', severity: 'error' });
    }
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
                {medicines.filter(m => m.stockQuantity < 50).length}
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
            <Tab label="Me" icon={<PeopleIcon />} iconPosition="start" />
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

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Loading medicines...
                </Typography>
              </Box>
            )}

            {error && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
                  {error}
                </Alert>
              </Box>
            )}

            {!loading && !error && (
              <Grid container spacing={3}>
                {medicines.length === 0 ? (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        No medicines found. Add your first medicine to get started.
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  medicines.map((medicine) => (
                    <Grid item xs={12} sm={6} md={4} key={medicine.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ position: 'relative' }}>
                          <img
                            src={medicine.image}
                            alt={medicine.name}
                            style={{ width: '100%', height: 200, objectFit: 'cover' }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {medicine.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {medicine.description}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            ${medicine.price}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {medicine.stockQuantity} units
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Expiry: {medicine.expirationDate}
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
                            onClick={() => {
                              setMedicineToDelete(medicine);
                              setDeleteConfirmOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            )}
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
                    {Array.from(new Set(medicines.map(m => m.name))).map((name) => (
                      <ListItem key={name}>
                        <ListItemText
                          primary={name}
                          secondary={`${medicines.filter(m => m.name === name).length} medicines`}
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

        {/* Me Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              My Profile
            </Typography>
            <Grid container spacing={3}>
              {/* Profile Information */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
                      <PeopleIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {authService.getFullName() || 'Pharmacist User'}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {authService.getUser()?.email || 'user@example.com'}
                      </Typography>
                      <Chip 
                        label={authService.getPrimaryRole()?.toUpperCase() || 'PHARMACIST'} 
                        color="primary" 
                        size="small" 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        First Name
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {authService.getUser()?.firstName || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Last Name
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {authService.getUser()?.lastName || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Age
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {authService.getUser()?.age || 'N/A'} years
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Phone Number
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {authService.getUser()?.phoneNumber || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {authService.getUser()?.address || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Account Status
                      </Typography>
                      <Chip 
                        label={authService.getUser()?.active ? 'Active' : 'Inactive'} 
                        color={authService.getUser()?.active ? 'success' : 'error'} 
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography variant="body1">
                        {authService.getUser()?.createdAt ? 
                          new Date(authService.getUser()!.createdAt).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      fullWidth
                      onClick={() => {
                        // TODO: Implement edit profile functionality
                        setSnackbar({ open: true, message: 'Edit profile functionality coming soon!', severity: 'info' });
                      }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ScheduleIcon />}
                      fullWidth
                      onClick={() => {
                        // TODO: Implement change password functionality
                        setSnackbar({ open: true, message: 'Change password functionality coming soon!', severity: 'info' });
                      }}
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<AnalyticsIcon />}
                      fullWidth
                      onClick={() => {
                        setActiveTab(2); // Switch to Analytics tab
                      }}
                    >
                      View Analytics
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CancelIcon />}
                      fullWidth
                      onClick={() => {
                        authService.logout();
                        window.location.href = '/login';
                      }}
                    >
                      Logout
                    </Button>
                  </Stack>
                </Paper>

                {/* Account Statistics */}
                <Paper sx={{ p: 3, mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Account Statistics
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Medicines
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {medicines.length}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Blog Articles
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {articles.length}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Low Stock Items
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'warning.main' }}>
                        {medicines.filter(m => m.stockQuantity < 50).length}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Views
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {articles.reduce((sum, art) => sum + art.views, 0)}
                      </Typography>
                    </Box>
                  </Stack>
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
                inputProps={{ maxLength: 50 }}
                helperText="3-50 characters"
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
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={newMedicine.stockQuantity}
                onChange={(e) => setNewMedicine({ ...newMedicine, stockQuantity: parseInt(e.target.value) || 0 })}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={newMedicine.expirationDate}
                onChange={(e) => setNewMedicine({ ...newMedicine, expirationDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={newMedicine.image}
                onChange={(e) => setNewMedicine({ ...newMedicine, image: e.target.value })}
                inputProps={{ maxLength: 255 }}
                helperText="Paste a valid image URL (max 255 characters)"
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
                inputProps={{ maxLength: 200 }}
                helperText="3-200 characters"
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setMedicineToDelete(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this medicine?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDeleteConfirmOpen(false);
            setMedicineToDelete(null);
          }}>Cancel</Button>
          <Button onClick={() => {
            if (medicineToDelete) {
              handleDeleteMedicine(medicineToDelete.id.toString());
            }
            setDeleteConfirmOpen(false);
            setMedicineToDelete(null);
          }} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PharmacistPage;
