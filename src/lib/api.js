import { supabase } from './supabase.js';

const POST_SELECT = '*, author:sns_users(id, username, display_name, avatar_url)';

function check({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

// 목록 조회: genre(해시태그), userId(작성자), sort(정렬 기준)로 걸러낸다.
export async function fetchPosts({ genre, userId, sort = 'created_at', limit } = {}) {
  let query = supabase.from('sns_posts').select(POST_SELECT).order(sort, { ascending: false });
  if (genre) query = query.contains('genres', [genre]);
  if (userId) query = query.eq('user_id', userId);
  if (limit) query = query.limit(limit);
  return check(await query);
}

export async function fetchPost(id) {
  return check(await supabase.from('sns_posts').select(POST_SELECT).eq('id', id).single());
}

export async function createPost(post) {
  return check(await supabase.from('sns_posts').insert(post).select().single());
}

export async function deletePost(id) {
  check(await supabase.from('sns_posts').delete().eq('id', id));
}

export async function fetchComments(postId) {
  return check(
    await supabase
      .from('sns_comments')
      .select('*, author:sns_users(display_name, username)')
      .eq('post_id', postId)
      .order('created_at'),
  );
}

export async function addComment({ postId, userId, content }) {
  check(await supabase.from('sns_comments').insert({ post_id: postId, user_id: userId, content }));
}

export async function likePost(postId, delta) {
  return check(await supabase.rpc('sns_like_post', { p_post_id: postId, p_delta: delta }));
}

export async function countByUser(userId) {
  const [posts, comments] = await Promise.all([
    supabase.from('sns_posts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('sns_comments').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ]);
  return { posts: posts.count ?? 0, comments: comments.count ?? 0 };
}

export async function updateProfile(id, fields) {
  return check(await supabase.from('sns_users').update(fields).eq('id', id).select().single());
}

export async function uploadImage(authId, file) {
  const ext = file.name.split('.').pop();
  const path = `${authId}/${Date.now()}.${ext}`;
  check(await supabase.storage.from('sns-images').upload(path, file));
  return supabase.storage.from('sns-images').getPublicUrl(path).data.publicUrl;
}
