import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { supabase } from '../lib/supabase.js';

const REDIRECT_URL = `${window.location.origin}${window.location.pathname}`;

function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', displayName: '', username: '' });
  const [message, setMessage] = useState({ severity: 'info', text: '' });
  const [isBusy, setIsBusy] = useState(false);

  const bind = (name, type = 'text') => ({
    type, fullWidth: true, value: form[name],
    onChange: (event) => setForm({ ...form, [name]: event.target.value }),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsBusy(true);
    setMessage({ severity: 'info', text: '' });
    const { email, password, displayName, username } = form;
    const result = isSignUp
      ? await supabase.auth.signUp({
          email, password,
          options: { data: { display_name: displayName, username }, emailRedirectTo: REDIRECT_URL },
        })
      : await supabase.auth.signInWithPassword({ email, password });
    setIsBusy(false);

    if (result.error) return setMessage({ severity: 'error', text: result.error.message });
    if (isSignUp && !result.data.session) {
      return setMessage({ severity: 'success', text: '가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.' });
    }
    navigate('/');
  };

  const handleOAuth = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: REDIRECT_URL } });
    if (error) setMessage({ severity: 'error', text: `${provider} 로그인은 아직 준비 중이에요. (${error.message})` });
  };

  return (
    <Box sx={{ bgcolor: 'primary.light', minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', p: 3 }}>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>📖 책결</Typography>
        <Typography align="center" color="text.secondary">책으로 이어지는 우리의 결</Typography>

        <Stack component="form" spacing={2} onSubmit={handleSubmit} sx={{ pt: 2 }}>
          {isSignUp && <TextField label="표시 이름" required {...bind('displayName')} />}
          {isSignUp && <TextField label="아이디 (@)" required {...bind('username')} />}
          <TextField label="이메일" required {...bind('email', 'email')} />
          <TextField label="비밀번호 (6자 이상)" required {...bind('password', 'password')} />
          <Button type="submit" variant="contained" color="secondary" size="large" disabled={isBusy}>
            {isSignUp ? '이메일로 회원가입' : '이메일로 로그인'}
          </Button>
          <Button color="secondary" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? '이미 계정이 있어요' : '처음이신가요? 회원가입'}
          </Button>
        </Stack>

        {message.text && <Alert severity={message.severity}>{message.text}</Alert>}

        <Divider sx={{ color: 'text.secondary', typography: 'body2' }}>다른 방법으로 로그인</Divider>
        <Button variant="outlined" color="secondary" size="large" onClick={() => handleOAuth('kakao')}>카카오로 계속하기</Button>
        <Button variant="outlined" color="secondary" size="large" onClick={() => handleOAuth('google')}>Google로 계속하기</Button>
      </Stack>
    </Box>
  );
}

export default LoginPage;
