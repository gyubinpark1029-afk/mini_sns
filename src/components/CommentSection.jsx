import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import useAsync from '../lib/useAsync.js';
import { addComment, fetchComments } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function CommentSection({ postId }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const [content, setContent] = useState('');
  const { data: comments } = useAsync(() => fetchComments(postId), [postId, version]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!profile) return navigate('/login');
    if (!content.trim()) return;
    await addComment({ postId, userId: profile.id, content: content.trim() });
    setContent('');
    setVersion((v) => v + 1);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>댓글 {comments?.length ?? 0}</Typography>
      <Stack spacing={2} sx={{ my: 2 }}>
        {comments?.map((c) => (
          <Box key={c.id}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{c.author?.display_name}</Typography>
            <Typography variant="body2">{c.content}</Typography>
          </Box>
        ))}
      </Stack>
      <Stack component="form" direction="row" spacing={1} onSubmit={handleSubmit}>
        <TextField
          fullWidth size="small" value={content} onChange={(e) => setContent(e.target.value)}
          placeholder={profile ? '댓글을 남겨보세요' : '로그인하고 댓글을 남겨보세요'}
          slotProps={{ htmlInput: { maxLength: 500 } }}
        />
        <Button type="submit" variant="contained" sx={{ flexShrink: 0 }}>등록</Button>
      </Stack>
    </Box>
  );
}

export default CommentSection;
