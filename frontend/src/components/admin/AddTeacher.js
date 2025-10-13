import { TextField, Button, Stack } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

export default function AddTeacher() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/teachers', formData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      alert('Teacher added!');
    } catch (err) {
      alert('Error adding teacher');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField label="Name" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <TextField label="Email" type="email" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <TextField label="Password" type="password" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <Button type="submit" variant="contained" color="primary">Add Teacher</Button>
      </Stack>
    </form>
  );
}