import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, Lock as LockIcon } from '@mui/icons-material';
import type { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../types/UserProfileDTO';
import { userService } from '../services/userService';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateProfileRequest | null>(null);
  
  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await userService.getUserProfile();
      setProfile(userProfile);
      setEditForm({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        address: userProfile.address,
        age: userProfile.age,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditForm({
        firstName: profile!.firstName,
        lastName: profile!.lastName,
        address: profile!.address,
        age: profile!.age,
        email: profile!.email,
        phoneNumber: profile!.phoneNumber
      });
    }
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = async () => {
    if (!editForm) return;

    try {
      setError(null);
      const updatedProfile = await userService.updateProfile(editForm);
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    try {
      setError(null);
      await userService.changePassword(passwordForm);
      setShowPasswordForm(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccess('Password changed successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    }
  };

  const getStatusColor = (active: boolean) => {
    return active ? 'success' : 'error';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'PHARMACIST':
        return 'warning';
      case 'USER':
        return 'primary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load profile</Alert>
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth="800px" mx="auto">
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Personal Information</Typography>
                <Button
                  variant={isEditing ? "outlined" : "contained"}
                  startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                  onClick={handleEditToggle}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={editForm?.firstName || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={editForm?.lastName || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={editForm?.email || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, email: e.target.value } : null)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={editForm?.phoneNumber || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, phoneNumber: e.target.value } : null)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={editForm?.age || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, age: parseInt(e.target.value) || 0 } : null)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={3}
                    value={editForm?.address || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, address: e.target.value } : null)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
              </Grid>

              {isEditing && (
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleProfileUpdate}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>

              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {profile.firstName} {profile.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile.email}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={profile.active ? 'Active' : 'Inactive'}
                  color={getStatusColor(profile.active)}
                  size="small"
                />
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Roles
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {profile.roles.map((role) => (
                    <Chip
                      key={role}
                      label={role}
                      color={getRoleColor(role)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Member Since
                </Typography>
                <Typography variant="body2">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                startIcon={<LockIcon />}
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Password Change Form */}
        {showPasswordForm && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                <Box mt={2} display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePasswordChange}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProfilePage; 