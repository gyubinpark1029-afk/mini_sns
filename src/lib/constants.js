export const GENRES = ['소설', '에세이', '시', '자기계발', '인문/철학', '과학', '역사', '기타'];

// 게시물 작성 시 고를 수 있는 Unsplash 이미지
export const UNSPLASH_IMAGES = [
  '1544947950-fa07a98d237f',
  '1512820790803-83ca734da794',
  '1481627834876-b7833e8f5570',
  '1495446815901-a7297e633e8d',
  '1524995997946-a1c2e315a42f',
  '1589998059171-988d887df646',
  '1507842217343-583bb7270b66',
  '1532012197267-da84d127e765',
].map((id) => `https://images.unsplash.com/photo-${id}?w=600`);

export const DRAFT_KEY = 'mini_sns_draft';
export const NO_IMAGE = UNSPLASH_IMAGES[0];
