import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import PostListItem from './PostListItem.jsx';

// 로딩 / 오류 / 빈 목록 / 목록 표시를 한 곳에서 처리한다.
function PostListState({ state, showRank = false, emptyText = '아직 게시물이 없어요.' }) {
  const { data, error, isLoading } = state;
  if (isLoading) {
    return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress color="secondary" /></Box>;
  }
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error.message}</Alert>;
  if (!data.length) {
    return <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>{emptyText}</Typography>;
  }
  return data.map((post, index) => (
    <PostListItem key={post.id} post={post} rank={showRank ? index + 1 : undefined} />
  ));
}

export default PostListState;
