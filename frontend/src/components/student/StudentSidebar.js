import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  Divider,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'All Events', icon: <DashboardIcon />, status: 'all' },
  { text: 'Upcoming Events', icon: <EventIcon />, status: 'upcoming' },
  { text: 'Ongoing Events', icon: <CalendarIcon />, status: 'ongoing' },
  { text: 'Completed Events', icon: <EventIcon />, status: 'completed' }
];

const StudentSidebar = ({ activeTab, setActiveTab, mobileOpen, onMobileClose }) => {
  const { user } = useAuth();

  const handleMenuItemClick = (status) => {
    setActiveTab(status);
    if (mobileOpen) {
      onMobileClose();
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          borderRight: '1px solid #333'
        },
      }}
    >
      <SidebarContent user={user} activeTab={activeTab} onMenuItemClick={handleMenuItemClick} />
    </Drawer>
  );
};

const SidebarContent = ({ user, activeTab, onMenuItemClick }) => (
  <Box>
    <Box sx={{ p: 3, textAlign: 'center', marginTop: 6 }}>
      <Avatar 
        sx={{ 
          width: 64, 
          height: 64, 
          mx: 'auto', 
          mb: 2,
          background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
          fontSize: '24px',
          fontWeight: 'bold'
        }}
      >
        {user?.name?.charAt(0) || 'S'}
      </Avatar>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
        }}
      >
        STUDENT DASHBOARD
      </Typography>
      <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 1 }}>
        {user?.name || 'Student'}
      </Typography>
    </Box>

    <Divider sx={{ borderColor: '#333' }} />

    <List sx={{ px: 2, mt: 2 }}>
      {menuItems.map((item) => {
        const isActive = activeTab === item.status;
        return (
          <ListItem key={item.status} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={isActive}
              onClick={() => onMenuItemClick(item.status)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #E55A2B, #E57A43)'
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  border: '1px solid rgba(255, 107, 53, 0.3)'
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive ? 'white' : '#FF6B35',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? 'white' : '#b0b0b0'
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  </Box>
);

export default StudentSidebar;