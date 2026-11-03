import { useState } from 'react';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Box, Divider, Drawer, Fab, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Stack, Toolbar, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import ListIcon from '@mui/icons-material/ViewListOutlined';
import TrophyIcon from '@mui/icons-material/EmojiEventsOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useAuth } from '../context/AuthContext.jsx';

const MENUS = [
  { label: '홈', path: '/', icon: <HomeIcon /> },
  { label: '게시물 목록', path: '/posts', icon: <ListIcon /> },
  { label: '베스트', path: '/best', icon: <TrophyIcon /> },
  { label: '글쓰기', path: '/write', icon: <EditIcon /> },
  { label: '마이페이지', path: '/me', icon: <PersonIcon /> },
];

function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const { session, signOut } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleMove = (path) => {
    setIsOpen(false);
    navigate(path);
  };
  const handleSignOut = async () => {
    await signOut();
    handleMove('/');
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', minHeight: '100vh', bgcolor: 'background.paper', position: 'relative' }}>
      <AppBar position="sticky" color="primary" elevation={0} sx={{ maxWidth: 480 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="메뉴 열기" onClick={() => setIsOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ ml: 1, color: 'inherit', textDecoration: 'none' }}
          >
            책결
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={{ width: 280 }}>
          <Typography variant="h6" sx={{ p: 3 }}>📖 책결</Typography>
          <Divider />
          <List>
            {MENUS.map((menu) => (
              <ListItemButton key={menu.path} selected={pathname === menu.path} onClick={() => handleMove(menu.path)}>
                <ListItemIcon sx={{ color: 'secondary.main' }}>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            {session ? (
              <ListItemButton onClick={handleSignOut}>
                <ListItemIcon sx={{ color: 'secondary.main' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="로그아웃" />
              </ListItemButton>
            ) : (
              <ListItemButton onClick={() => handleMove('/login')}>
                <ListItemIcon sx={{ color: 'secondary.main' }}><LoginIcon /></ListItemIcon>
                <ListItemText primary="로그인 / 회원가입" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ pb: 12 }}>
        <Outlet />
      </Box>

      {/* 주요 버튼은 화면 오른쪽에 세로로 배치한다 */}
      <Stack
        spacing={2}
        sx={{ position: 'fixed', bottom: 24, right: { xs: 16, sm: 'max(16px, calc(50% - 224px))' }, zIndex: 10 }}
      >
        <Fab size="medium" color="primary" aria-label="맨 위로" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ArrowUpIcon />
        </Fab>
        <Fab color="secondary" aria-label="글쓰기" onClick={() => navigate('/write')}>
          <EditIcon />
        </Fab>
      </Stack>
    </Box>
  );
}

export default AppLayout;
