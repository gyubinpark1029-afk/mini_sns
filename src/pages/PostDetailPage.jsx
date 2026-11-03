import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Chip, CircularProgress, Rating, Stack, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentSection from '../components/CommentSection.jsx';
import useAsync from '../lib/useAsync.js';
import { deletePost, fetchPost, likePost } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { NO_IMAGE } from '../lib/constants.js';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: post, error, isLoading } = useAsync(() => fetchPost(id), [id]);
  const likedKey = `mini_sns_liked_${id}`;
  const [isLiked, setIsLiked] = useState(() => localStorage.getItem(likedKey) === '1');
  const [likeCount, setLikeCount] = useState(null);
  const [message, setMessage] = useState('');

  if (isLoading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress color="secondary" /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>게시물을 찾을 수 없어요.</Alert>;

  const handleLike = async () => {
    if (!profile) return navigate('/login');
    try {
      const next = await likePost(post.id, isLiked ? -1 : 1);
      setLikeCount(next);
      setIsLiked(!isLiked);
      localStorage.setItem(likedKey, isLiked ? '0' : '1');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('이 게시물을 삭제할까요?')) return;
    await deletePost(post.id);
    navigate('/posts');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Box
          component="img"
          src={post.image_url || NO_IMAGE}
          alt={`${post.book_title} 표지`}
          sx={{ width: 200, height: 280, objectFit: 'cover', borderRadius: 2, boxShadow: 3 }}
        />
      </Box>
      <Typography variant="h5" sx={{ mt: 3 }}>{post.book_title}</Typography>
      <Typography color="text.secondary">
        {post.book_author}{post.publisher ? ` · ${post.publisher}` : ''}
      </Typography>
      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 2 }}>
        {post.genres.map((g) => <Chip key={g} label={`#${g}`} color="primary" sx={{ mr: '2px' }} onClick={() => navigate(`/posts?genre=${encodeURIComponent(g)}`)} />)}
      </Stack>
      {post.summary && (
        <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'primary.light' }}>
          <Typography variant="caption" color="secondary">줄거리</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{post.summary}</Typography>
        </Box>
      )}
      <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 700 }}>{post.title}</Typography>
      <Typography sx={{ mt: 1, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{post.caption}</Typography>
      <Rating value={post.rating ?? 0} readOnly size="large" sx={{ mt: 2, color: 'secondary.main' }} />
      <Typography variant="caption" display="block" color="text.secondary">
        {post.author?.display_name} · {post.read_date ?? post.created_at.slice(0, 10)}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Button
          variant={isLiked ? 'contained' : 'outlined'}
          color="secondary"
          startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={handleLike}
        >
          좋아요 {likeCount ?? post.likes_count}
        </Button>
        {profile?.id === post.user_id && (
          <Button color="secondary" onClick={handleDelete}>삭제</Button>
        )}
      </Stack>
      {message && <Alert severity="warning" sx={{ mt: 2 }}>{message}</Alert>}

      <CommentSection postId={post.id} />
    </Box>
  );
}

export default PostDetailPage;
