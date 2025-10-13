import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { adminApi } from '../../api/adminApi';
import UrbanButton from '../common/UrbanButton';
import { UrbanOutlineButton } from '../common/UrbanOutlineButton';

const UserManagement = ({ onShowSnackbar }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showSnackbar('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'student'
    });
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '', // Don't pre-fill password
      role: user.role
    });
    setDialogOpen(true);
  };

  const handleSubmitUser = async () => {
    try {
      if (editingUser) {
        await adminApi.updateUser(editingUser._id, userForm);
        showSnackbar('User updated successfully');
      } else {
        await adminApi.createUser(userForm);
        showSnackbar('User created successfully');
      }

      setDialogOpen(false);
      fetchUsers();
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Operation failed', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(userId);
        showSnackbar('User deleted successfully');
        fetchUsers();
      } catch (error) {
        showSnackbar('Failed to delete user', 'error');
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'teacher': return 'primary';
      case 'student': return 'success';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ 
      p: 3, 
      background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
      border: '1px solid #333',
      minHeight: '100vh'
    }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ 
          color: 'white',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          User Management
        </Typography>
        <UrbanButton variant="contained" startIcon={<AddIcon />} onClick={handleCreateUser}>
          Add User
        </UrbanButton>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: '#FF6B35' }} />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ 
          background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
          border: '1px solid #333'
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Created</TableCell>
                <TableCell sx={{ color: '#FF6B35', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ color: 'white' }}>{user.name}</TableCell>
                  <TableCell sx={{ color: '#b0b0b0' }}>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={getRoleColor(user.role)}
                      size="small"
                      sx={{
                        backgroundColor: 
                          user.role === 'admin' ? 'rgba(244, 67, 54, 0.2)' :
                          user.role === 'teacher' ? 'rgba(255, 107, 53, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                        color: 
                          user.role === 'admin' ? '#f44336' :
                          user.role === 'teacher' ? '#FF6B35' : '#4CAF50'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#b0b0b0' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      sx={{ 
                        color: '#FF6B35',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 53, 0.1)'
                        }
                      }}
                      onClick={() => handleEditUser(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        color: '#f44336',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.1)'
                        }
                      }}
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit User Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', borderBottom: '1px solid #333' }}>
          {editingUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Full Name"
              value={userForm.name}
              onChange={(e) => setUserForm({...userForm, name: e.target.value})}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#FF6B35' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                },
                '& .MuiInputLabel-root': { color: '#b0b0b0' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
              }}
            />
            
            <TextField
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({...userForm, email: e.target.value})}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#FF6B35' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                },
                '& .MuiInputLabel-root': { color: '#b0b0b0' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
              }}
            />

            <TextField
              label={editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
              type="password"
              value={userForm.password}
              onChange={(e) => setUserForm({...userForm, password: e.target.value})}
              fullWidth
              required={!editingUser}
              helperText={editingUser ? "Leave blank to keep current password" : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#FF6B35' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                },
                '& .MuiInputLabel-root': { color: '#b0b0b0' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' }
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b0b0' }}>Role</InputLabel>
              <Select
                value={userForm.role}
                label="Role"
                onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF6B35' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF6B35' },
                }}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
          <UrbanOutlineButton onClick={() => setDialogOpen(false)}>
            Cancel
          </UrbanOutlineButton>
          <UrbanButton 
            onClick={handleSubmitUser} 
            variant="contained"
            disabled={!userForm.name || !userForm.email || (!editingUser && !userForm.password)}
          >
            {editingUser ? 'Update User' : 'Create User'}
          </UrbanButton>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserManagement;