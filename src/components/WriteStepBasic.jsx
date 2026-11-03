import { Box, Rating, Stack, TextField, Typography } from '@mui/material';

// 1단계: 제목, 책 정보, 내용(캡션), 별점, 날짜
function WriteStepBasic({ form, onChange }) {
  const bind = (name) => ({
    value: form[name],
    onChange: (event) => onChange({ [name]: event.target.value }),
    fullWidth: true,
  });

  return (
    <Stack spacing={2}>
      <TextField label="리뷰 제목" {...bind('title')} />
      <TextField label="책 제목" {...bind('bookTitle')} />
      <TextField label="저자" {...bind('bookAuthor')} />
      <TextField label="출판사" {...bind('publisher')} />
      <TextField label="내용" multiline minRows={6} {...bind('caption')} />
      <Box>
        <Typography variant="body2" color="text.secondary">별점</Typography>
        <Rating
          size="large"
          value={form.rating}
          onChange={(_event, value) => onChange({ rating: value ?? 0 })}
          sx={{ color: 'secondary.main' }}
        />
      </Box>
      <TextField label="읽은 날짜" type="date" {...bind('readDate')} slotProps={{ inputLabel: { shrink: true } }} />
    </Stack>
  );
}

export default WriteStepBasic;
