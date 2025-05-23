import { useEffect } from 'react';
import { Box, Container, Grid, Typography, Fab, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Map from '../components/Map';
import FilterPanel from '../components/FilterPanel';
import { useReports } from '../context/ReportContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { reports, loading, error, fetchReports, selectedCategory } = useReports();

  useEffect(() => {
    fetchReports();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchReports();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchReports]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main content */}
        <Box sx={{ flexGrow: 1, height: '100%', position: 'relative' }}>
          {error && (
            <Alert severity="error" sx={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
              {error}
            </Alert>
          )}
          
          <Map 
            reports={reports} 
            loading={loading} 
            selectedCategory={selectedCategory} 
          />
          
          {/* Floating action button for new report */}
          <Fab 
            color="primary" 
            aria-label="add" 
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            onClick={() => navigate('/report')}
          >
            <AddIcon />
          </Fab>
        </Box>
        
        {/* Side panel for filters */}
        <Box 
          sx={{ 
            width: 300, 
            flexShrink: 0, 
            height: '100%', 
            overflow: 'auto',
            p: 2,
            borderLeft: '1px solid #eee',
            display: { xs: 'none', md: 'block' }
          }}
        >
          <FilterPanel />
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Estadísticas</Typography>
            <Typography variant="body2">Total de reportes: {reports.length}</Typography>
            {selectedCategory && (
              <Typography variant="body2">
                Reportes de {selectedCategory}: {reports.filter(r => r.category === selectedCategory).length}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;