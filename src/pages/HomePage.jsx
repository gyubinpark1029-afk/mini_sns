import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import PostListState from '../components/PostListState.jsx';
import GenreChips from '../components/GenreChips.jsx';
import useAsync from '../lib/useAsync.js';
import { fetchPosts } from '../lib/api.js';
import { NO_IMAGE } from '../lib/constants.js';

function SectionTitle({ title, to }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, pt: 3, pb: 1 }}>
      <Typography variant="h6">{title}</Typography>
      <Button component={RouterLink} to={to} color="secondary" size="small">더보기</Button>
    </Stack>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const best = useAsync(() => fetchPosts({ sort: 'likes_count', limit: 5 }), []);
  const recent = useAsync(() => fetchPosts({ limit: 3 }), []);
  const pick = best.data?.[0];

  return (
    <Box>
      {/* 이 달의 추천도서 배너 */}
      <Box
        component={RouterLink}
        to={pick ? `/posts/${pick.id}` : '/posts'}
        sx={{ display: 'block', m: 2, p: 3, borderRadius: 3, bgcolor: 'primary.light', color: 'inherit', textDecoration: 'none' }}
      >
        <Typography variant="caption" color="secondary">이 달의 추천도서</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Box
            component="img"
            src={pick?.image_url || NO_IMAGE}
            alt=""
            sx={{ width: 96, height: 128, objectFit: 'cover', borderRadius: 1, boxShadow: 2 }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6">{pick?.book_title ?? '불러오는 중...'}</Typography>
            <Typography variant="body2">{pick?.book_author}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              지금 가장 사랑받는 책을 만나보세요 ♥ {pick?.likes_count}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>어떤 책이 궁금하세요?</Typography>
        <GenreChips selected="" isWrap={false} gap={0.5} chipMr="2px" onToggle={(genre) => navigate(`/posts?genre=${encodeURIComponent(genre)}`)} />
      </Box>

      <SectionTitle title="🏆 베스트 랭킹" to="/best" />
      <PostListState state={best} showRank />

      <SectionTitle title="새로 올라온 리뷰" to="/posts" />
      <PostListState state={recent} />
    </Box>
  );
}

export default HomePage;
