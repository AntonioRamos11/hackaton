import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <SecurityIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            SinaloaSegura
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={() => navigate('/report')}>
          Nuevo Reporte
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;