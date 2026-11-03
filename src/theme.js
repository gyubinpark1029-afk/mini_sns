import { createTheme } from '@mui/material/styles';

// 베이지(메인) + 브라운(보조)의 밝고 따뜻한 팔레트. 색상은 이 파일에서만 정의한다.
const theme = createTheme({
  palette: {
    primary: { main: '#D9C3A0', light: '#F3E9D7', dark: '#B89B72', contrastText: '#4A3426' },
    secondary: { main: '#7A5C43', light: '#A38468', dark: '#573F2D', contrastText: '#FFFBF2' },
    background: { default: '#EFE6D6', paper: '#FFFBF2' },
    text: { primary: '#4A3426', secondary: '#8C7B6B' },
    divider: '#E6D8C0',
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.125rem', fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { minHeight: 48, textTransform: 'none' } },
    },
    MuiIconButton: { styleOverrides: { root: { padding: 12 } } },
    MuiListItemButton: { styleOverrides: { root: { minHeight: 48 } } },
  },
});

export default theme;
