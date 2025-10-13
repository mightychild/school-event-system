import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem
} from '@mui/material';
import ExportButton from './ExportButton';
import { useUserData } from '../../hooks/useUserData';

export default function HomePanel() {
  const { users, loading, roleFilter, setRoleFilter } = useUserData();

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">User Management</Typography>
        <ExportButton data={users} filename="users_export" />
      </Box>

      <TextField
        select
        label="Filter by Role"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        sx={{ mb: 2, width: 200 }}
      >
        <MenuItem value="all">All Roles</MenuItem>
        <MenuItem value="admin">Admins</MenuItem>
        <MenuItem value="teacher">Teachers</MenuItem>
        <MenuItem value="student">Students</MenuItem>
      </TextField>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter(user => roleFilter === 'all' || user.role === roleFilter)
              .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={
                        user.role === 'admin' ? 'error' : 
                        user.role === 'teacher' ? 'primary' : 'default'
                      } 
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}