import { Chip, Stack } from '@mui/material';
import { GENRES } from '../lib/constants.js';

// 해시태그 칩 모음. selected는 문자열(단일) 또는 배열(다중) 모두 받는다.
function GenreChips({ selected, onToggle, isWrap = true }) {
  const selectedList = Array.isArray(selected) ? selected : [selected];
  return (
    <Stack direction="row" gap={1} flexWrap={isWrap ? 'wrap' : 'nowrap'} sx={{ overflowX: isWrap ? 'visible' : 'auto' }}>
      {GENRES.map((genre) => {
        const isOn = selectedList.includes(genre);
        return (
          <Chip
            key={genre}
            label={`#${genre}`}
            color={isOn ? 'secondary' : 'primary'}
            variant={isOn ? 'filled' : 'outlined'}
            onClick={() => onToggle(genre)}
            sx={{ height: 40, flexShrink: 0 }}
          />
        );
      })}
    </Stack>
  );
}

export default GenreChips;
