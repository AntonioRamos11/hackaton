import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  CircularProgress, 
  Alert,
  IconButton,
  Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '../components/Header';
import { submitReport } from '../services/api';

const categories = [
  { value: 'narcobloqueo', label: 'Narcobloqueo' },
  { value: 'robo', label: 'Robo' },
  { value: 'accidente', label: 'Accidente' },
  { value: 'otro', label: 'Otro' }
];

const ReportFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    image_url: ''
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get user location on component mount
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocalización no es soportada por tu navegador');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('No se pudo obtener tu ubicación');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      setError('Se requiere tu ubicación para enviar un reporte');
      return;
    }

    if (!formData.category || !formData.description) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitReport({
        ...formData,
        ...location
      });
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        category: '',
        description: '',
        image_url: ''
      });
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
      setError('Error al enviar el reporte. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Container maxWidth="sm" sx={{ flexGrow: 1, py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton edge="start" onClick={() => navigate('/')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5">Crear Reporte</Typography>
          </Box>

          {/* Location status */}
          {locationLoading ? (
            <Alert icon={<CircularProgress size={20} />} severity="info">
              Obteniendo tu ubicación...
            </Alert>
          ) : location ? (
            <Alert severity="success">
              Ubicación obtenida: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Alert>
          ) : (
            <Alert 
              severity="error" 
              action={
                <Button color="inherit" size="small" onClick={getLocation}>
                  Reintentar
                </Button>
              }
            >
              {locationError || 'No se pudo obtener tu ubicación'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              select
              fullWidth
              label="Categoría"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              margin="normal"
              required
            >
              {categories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              required
            />

            <TextField
              fullWidth
              label="URL de Imagen (opcional)"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              margin="normal"
              placeholder="https://ejemplo.com/imagen.jpg"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={submitting || !location}
            >
              {submitting ? <CircularProgress size={24} /> : 'Enviar Reporte'}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          ¡Reporte enviado con éxito!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportFormPage;