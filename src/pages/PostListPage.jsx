import { useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PostListState from '../components/PostListState.jsx';
import GenreChips from '../components/GenreChips.jsx';
import useAsync from '../lib/useAsync.js';
import { fetchPosts } from '../lib/api.js';

// ?genre=소설 처럼 주소에 해시태그를 담아 "해시태그별 게시물 모음"을 보여준다.
function PostListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genre = searchParams.get('genre') ?? '';
  const state = useAsync(() => fetchPosts({ genre }), [genre]);

  const handleToggle = (next) => {
    setSearchParams(next === genre ? {} : { genre: next });
  };

  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {genre ? `#${genre} 모음` : '리뷰 목록'}
        </Typography>
        <GenreChips selected={genre} onToggle={handleToggle} isWrap={false} />
      </Box>
      <PostListState state={state} emptyText="이 태그의 게시물이 아직 없어요." />
    </Box>
  );
}

export default PostListPage;
