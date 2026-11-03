import { useState } from 'react';
import { Alert, Box, Button, Grid, Stack } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCameraOutlined';
import { UNSPLASH_IMAGES } from '../lib/constants.js';
import { uploadImage } from '../lib/api.js';

// 2단계: Unsplash 이미지 선택(랜덤 뽑기 포함) 또는 내 사진 업로드
function WriteStepImage({ imageUrl, authId, onChange }) {
  const [error, setError] = useState('');

  const handleRandom = () => {
    const pool = UNSPLASH_IMAGES.filter((url) => url !== imageUrl);
    onChange({ imageUrl: pool[Math.floor(Math.random() * pool.length)] });
  };

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setError('');
    try {
      onChange({ imageUrl: await uploadImage(authId, file) });
    } catch (e) {
      setError(`업로드에 실패했어요: ${e.message}`);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" color="secondary" startIcon={<ShuffleIcon />} onClick={handleRandom} fullWidth>
          랜덤 이미지
        </Button>
        <Button variant="outlined" color="secondary" component="label" startIcon={<PhotoCameraIcon />} fullWidth>
          내 사진 올리기
          <input hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
        </Button>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={1}>
        {UNSPLASH_IMAGES.map((url) => (
          <Grid key={url} size={3}>
            <Box
              component="img"
              src={url}
              alt="선택 가능한 이미지"
              onClick={() => onChange({ imageUrl: url })}
              sx={{
                width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', borderRadius: 1, cursor: 'pointer',
                outline: imageUrl === url ? 3 : 0, outlineStyle: 'solid', outlineColor: 'secondary.main',
              }}
            />
          </Grid>
        ))}
      </Grid>
      {imageUrl && (
        <Box component="img" src={imageUrl} alt="미리보기" sx={{ width: 160, height: 220, objectFit: 'cover', borderRadius: 2, alignSelf: 'center' }} />
      )}
    </Stack>
  );
}

export default WriteStepImage;
