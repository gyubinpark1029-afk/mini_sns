import { useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import PostListState from '../components/PostListState.jsx';
import useAsync from '../lib/useAsync.js';
import { fetchPosts } from '../lib/api.js';
import { GENRES } from '../lib/constants.js';

function BestPage() {
  const [genre, setGenre] = useState(GENRES[0]);
  const state = useAsync(() => fetchPosts({ genre, sort: 'likes_count', limit: 10 }), [genre]);

  return (
    <Box>
      <Typography variant="h5" sx={{ p: 2, pb: 1 }}>베스트</Typography>
      <Grid container spacing={1} sx={{ px: 2, pb: 2 }}>
        {GENRES.map((item) => {
          const isOn = item === genre;
          return (
            <Grid key={item} size={3}>
              <Paper
                component="button"
                type="button"
                onClick={() => setGenre(item)}
                elevation={0}
                sx={{
                  width: '100%', minHeight: 56, cursor: 'pointer', border: 1, borderColor: isOn ? 'secondary.main' : 'divider',
                  bgcolor: isOn ? 'secondary.main' : 'primary.light', color: isOn ? 'secondary.contrastText' : 'text.primary',
                  font: 'inherit', fontWeight: 700, fontSize: '0.875rem',
                }}
              >
                {item}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <Typography variant="subtitle1" sx={{ px: 2, pb: 1 }}>#{genre} 베스트 순위</Typography>
      <PostListState state={state} showRank emptyText="이 장르의 순위가 아직 없어요." />
    </Box>
  );
}

export default BestPage;
