import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReportProvider } from './context/ReportContext';
import HomePage from './pages/HomePage';
import ReportFormPage from './pages/ReportFormPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReportProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportFormPage />} />
          </Routes>
        </Router>
      </ReportProvider>
    </ThemeProvider>
  );
}

export default App;
