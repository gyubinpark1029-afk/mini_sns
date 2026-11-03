import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Stack, TextField, Typography } from '@mui/material';
import GenreChips from '../components/GenreChips.jsx';
import PostListState from '../components/PostListState.jsx';
import useAsync from '../lib/useAsync.js';
import { countByUser, fetchPosts, updateProfile } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function Stat({ label, value }) {
  return (
    <Box sx={{ flex: 1, textAlign: 'center' }}>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  );
}

function MyPage() {
  const navigate = useNavigate();
  const { profile, setProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ display_name: '', bio: '' });
  const userId = profile?.id;
  const counts = useAsync(() => (userId ? countByUser(userId) : Promise.resolve(null)), [userId]);
  const myPosts = useAsync(() => (userId ? fetchPosts({ userId }) : Promise.resolve([])), [userId]);

  if (isLoading) return null;
  if (!profile) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ mb: 2 }}>로그인하면 내 정보를 볼 수 있어요.</Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>로그인하러 가기</Button>
      </Box>
    );
  }

  const save = async (fields) => setProfile(await updateProfile(profile.id, fields));
  const handleToggleGenre = (genre) => {
    const list = profile.favorite_genres;
    save({ favorite_genres: list.includes(genre) ? list.filter((g) => g !== genre) : [...list, genre] });
  };
  const handleEdit = async () => {
    if (isEditing) await save(draft);
    else setDraft({ display_name: profile.display_name, bio: profile.bio ?? '' });
    setIsEditing(!isEditing);
  };

  return (
    <Box>
      <Stack alignItems="center" spacing={1} sx={{ p: 3, bgcolor: 'primary.light' }}>
        <Avatar src={profile.avatar_url ?? undefined} sx={{ width: 88, height: 88, bgcolor: 'secondary.main' }}>
          {profile.display_name.slice(0, 1)}
        </Avatar>
        {isEditing ? (
          <Stack spacing={1} sx={{ width: '100%' }}>
            <TextField size="small" label="표시 이름" value={draft.display_name} onChange={(e) => setDraft({ ...draft, display_name: e.target.value })} />
            <TextField size="small" label="소개글" multiline value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
          </Stack>
        ) : (
          <>
            <Typography variant="h6">{profile.display_name}</Typography>
            <Typography variant="body2" color="text.secondary">@{profile.username}</Typography>
            <Typography variant="body2">{profile.bio || '소개글을 적어보세요.'}</Typography>
          </>
        )}
        <Button size="small" color="secondary" onClick={handleEdit}>{isEditing ? '저장' : '프로필 수정'}</Button>
      </Stack>

      <Stack direction="row" sx={{ py: 2 }}>
        <Stat label="작성한 글" value={counts.data?.posts ?? 0} />
        <Stat label="작성한 댓글" value={counts.data?.comments ?? 0} />
      </Stack>

      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>내가 좋아하는 장르</Typography>
        <GenreChips selected={profile.favorite_genres} onToggle={handleToggleGenre} />
      </Box>

      <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>내가 쓴 리뷰</Typography>
      <PostListState state={myPosts} emptyText="아직 쓴 리뷰가 없어요." />
    </Box>
  );
}

export default MyPage;
