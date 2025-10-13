import { Box, Skeleton, Grid } from '@mui/material';

const SkeletonLoader = ({ type = "grid", count = 6 }) => {
  if (type === "grid") {
    return (
      <Grid container spacing={3}>
        {Array.from(new Array(count)).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box sx={{ 
              p: 2, 
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              border: '1px solid #333',
              borderRadius: 2
            }}>
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={140} 
                sx={{ 
                  bgcolor: '#333',
                  borderRadius: 1,
                  mb: 2
                }} 
              />
              <Skeleton 
                variant="text" 
                width="80%" 
                height={24} 
                sx={{ bgcolor: '#333', mb: 1 }} 
              />
              <Skeleton 
                variant="text" 
                width="60%" 
                height={20} 
                sx={{ bgcolor: '#333', mb: 1 }} 
              />
              <Skeleton 
                variant="text" 
                width="40%" 
                height={20} 
                sx={{ bgcolor: '#333' }} 
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Skeleton 
                  variant="rectangular" 
                  width={80} 
                  height={32} 
                  sx={{ bgcolor: '#333', borderRadius: 1 }} 
                />
                <Skeleton 
                  variant="rectangular" 
                  width={80} 
                  height={32} 
                  sx={{ bgcolor: '#333', borderRadius: 1 }} 
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === "list") {
    return (
      <Box>
        {Array.from(new Array(count)).map((_, index) => (
          <Box 
            key={index} 
            sx={{ 
              p: 2, 
              mb: 2, 
              background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
              border: '1px solid #333',
              borderRadius: 2
            }}
          >
            <Skeleton 
              variant="text" 
              width="70%" 
              height={28} 
              sx={{ bgcolor: '#333', mb: 1 }} 
            />
            <Skeleton 
              variant="text" 
              width="50%" 
              height={20} 
              sx={{ bgcolor: '#333', mb: 2 }} 
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton 
                variant="rectangular" 
                width={100} 
                height={24} 
                sx={{ bgcolor: '#333', borderRadius: 1 }} 
              />
              <Skeleton 
                variant="rectangular" 
                width={100} 
                height={24} 
                sx={{ bgcolor: '#333', borderRadius: 1 }} 
              />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return null;
};

export default SkeletonLoader;