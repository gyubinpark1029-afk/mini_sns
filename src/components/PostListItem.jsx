import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { NO_IMAGE } from '../lib/constants.js';

// 책 표지 | 제목(굵게) / 지은이·출판사 / 회색 줄거리 2줄(넘으면 ...)
function PostListItem({ post, rank }) {
  return (
    <Stack
      component={RouterLink}
      to={`/posts/${post.id}`}
      direction="row"
      spacing={2}
      sx={{ p: 2, color: 'inherit', textDecoration: 'none', borderBottom: 1, borderColor: 'divider', minHeight: 48 }}
    >
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Box
          component="img"
          src={post.image_url || NO_IMAGE}
          alt={`${post.book_title} 표지`}
          sx={{ width: 80, height: 112, objectFit: 'cover', borderRadius: 1, display: 'block' }}
        />
        {rank && (
          <Typography
            variant="caption"
            sx={{ position: 'absolute', top: 0, left: 0, px: 1, bgcolor: 'secondary.main', color: 'secondary.contrastText', borderRadius: '8px 0 8px 0', fontWeight: 700 }}
          >
            {rank}
          </Typography>
        )}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
          {post.book_title}
        </Typography>
        <Typography variant="body2" noWrap>
          {post.book_author}{post.publisher ? ` · ${post.publisher}` : ''}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {post.summary || post.caption}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ♥ {post.likes_count}
        </Typography>
      </Box>
    </Stack>
  );
}

export default PostListItem;
