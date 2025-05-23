import { useState } from 'react';
import { Paper, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Box } from '@mui/material';
import { ReportFilter } from '../types/Report';
import { useReports } from '../context/ReportContext';

const FilterPanel = () => {
  const { fetchReports, setSelectedCategory } = useReports();
  const [filters, setFilters] = useState<ReportFilter>({
    category: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleApplyFilters = () => {
    setSelectedCategory(filters.category || null);
    fetchReports(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      startDate: '',
      endDate: '',
    });
    setSelectedCategory(null);
    fetchReports();
  };

  return (
    <Paper sx={{ p: 2, width: '100%' }}>
      <Typography variant="h6" gutterBottom>Filtros</Typography>
      
      <FormControl fullWidth margin="normal" size="small">
        <InputLabel id="category-label">Categoría</InputLabel>
        <Select
          labelId="category-label"
          name="category"
          value={filters.category}
          label="Categoría"
          onChange={handleChange}
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="narcobloqueo">Narcobloqueo</MenuItem>
          <MenuItem value="robo">Robo</MenuItem>
          <MenuItem value="accidente">Accidente</MenuItem>
          <MenuItem value="otro">Otro</MenuItem>
        </Select>
      </FormControl>
      
      <TextField
        fullWidth
        margin="normal"
        size="small"
        label="Desde"
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      
      <TextField
        fullWidth
        margin="normal"
        size="small"
        label="Hasta"
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleApplyFilters}
          fullWidth
        >
          Aplicar
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleClearFilters}
        >
          Limpiar
        </Button>
      </Box>
    </Paper>
  );
};

export default FilterPanel;