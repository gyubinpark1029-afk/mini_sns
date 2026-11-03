import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Snackbar, Step, StepLabel, Stepper, Stack, Typography } from '@mui/material';
import WriteStepBasic from '../components/WriteStepBasic.jsx';
import WriteStepImage from '../components/WriteStepImage.jsx';
import GenreChips from '../components/GenreChips.jsx';
import { createPost } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { DRAFT_KEY, UNSPLASH_IMAGES } from '../lib/constants.js';

const STEPS = ['내용 쓰기', '이미지 선택', '장르 태그'];
const today = () => new Date().toISOString().slice(0, 10);
const EMPTY_FORM = {
  title: '', bookTitle: '', bookAuthor: '', publisher: '', summary: '', caption: '',
  rating: 0, readDate: today(), imageUrl: UNSPLASH_IMAGES[0], genres: [],
};

function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY));
  } catch {
    return null;
  }
}

function PostWritePage() {
  const navigate = useNavigate();
  const { profile, session, isLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...loadDraft() }));
  const [notice, setNotice] = useState(loadDraft() ? '임시저장한 글을 불러왔어요.' : '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const handleToggleGenre = (genre) =>
    handleChange({ genres: form.genres.includes(genre) ? form.genres.filter((g) => g !== genre) : [...form.genres, genre] });

  // 임시저장: 이 기기의 브라우저에 저장해서 로그인 없이도 쓸 수 있다.
  const handleDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    setNotice('임시저장 했어요.');
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.bookTitle.trim() || !form.bookAuthor.trim() || !form.caption.trim()) {
      setStep(0);
      return setError('리뷰 제목, 책 제목, 저자, 내용은 꼭 입력해 주세요.');
    }
    setIsSaving(true);
    try {
      const post = await createPost({
        user_id: profile.id, title: form.title.trim(), caption: form.caption.trim(),
        book_title: form.bookTitle.trim(), book_author: form.bookAuthor.trim(), publisher: form.publisher.trim(),
        summary: form.summary.trim(),
        genres: form.genres, rating: form.rating || null, read_date: form.readDate || null, image_url: form.imageUrl,
      });
      localStorage.removeItem(DRAFT_KEY);
      navigate(`/posts/${post.id}`, { replace: true });
    } catch (e) {
      setError(e.message);
      setIsSaving(false);
    }
  };

  if (!isLoading && !session) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ mb: 2 }}>글을 올리려면 로그인이 필요해요.</Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>로그인하러 가기</Button>
      </Box>
    );
  }

  const isLast = step === STEPS.length - 1;
  return (
    <Box sx={{ p: 3 }}>
      <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
        {STEPS.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      {step === 0 && <WriteStepBasic form={form} onChange={handleChange} />}
      {step === 1 && <WriteStepImage imageUrl={form.imageUrl} authId={session?.user.id} onChange={handleChange} />}
      {step === 2 && (
        <Box>
          <Typography sx={{ mb: 2 }}>책에 어울리는 장르를 골라주세요 (여러 개 가능)</Typography>
          <GenreChips selected={form.genres} onToggle={handleToggleGenre} />
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
        <Button variant="outlined" color="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>이전</Button>
        <Button variant="outlined" color="secondary" onClick={handleDraft}>임시저장</Button>
        {isLast ? (
          <Button fullWidth variant="contained" color="secondary" disabled={isSaving || !profile} onClick={handleSubmit}>등록</Button>
        ) : (
          <Button fullWidth variant="contained" color="secondary" onClick={() => setStep(step + 1)}>다음</Button>
        )}
      </Stack>
      <Snackbar open={Boolean(notice)} autoHideDuration={2500} onClose={() => setNotice('')} message={notice} />
    </Box>
  );
}

export default PostWritePage;
