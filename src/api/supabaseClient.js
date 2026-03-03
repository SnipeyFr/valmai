import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── AUTH ────────────────────────────────────────────────────────────────────

export const auth = {
  async me() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  async redirectToLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
    });
  },

  async logout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }
};

// ─── ARTICLES ────────────────────────────────────────────────────────────────

export const Article = {
  async list(order = '-created_at') {
    const descending = order.startsWith('-');
    const column = order.replace('-', '').replace('created_date', 'created_at');
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order(column, { ascending: !descending });
    if (error) throw error;
    return (data || []).map(normalizeArticle);
  },

  async filter(filters = {}) {
    let query = supabase.from('articles').select('*');
    if (filters.published !== undefined) query = query.eq('published', filters.published);
    if (filters.id) query = query.eq('id', filters.id);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(normalizeArticle);
  },

  async create(articleData) {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        author: articleData.author,
        cover_image: articleData.cover_image,
        published: articleData.published || false,
        published_date: articleData.published_date || null,
      })
      .select()
      .single();
    if (error) throw error;
    return normalizeArticle(data);
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return normalizeArticle(data);
  },

  async delete(id) {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function normalizeArticle(a) {
  if (!a) return a;
  return {
    ...a,
    created_date: a.created_at,
  };
}
