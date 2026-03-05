import React, { useState, useEffect } from 'react';
import { supabase, Article } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, LogOut, Loader2, ShieldAlert, Mail, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const OWNER_EMAIL = 'abzta123@gmail.com';

export default function StaffAdmin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [inviting, setInviting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen for auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load allowed emails from DB
  useEffect(() => {
    if (user?.email === OWNER_EMAIL) {
      supabase.from('staff_emails').select('email').then(({ data }) => {
        setAllowedEmails(data?.map(r => r.email) || []);
      });
    }
  }, [user]);

  const isAllowed = user && (user.email === OWNER_EMAIL || allowedEmails.includes(user.email));
  const isOwner = user?.email === OWNER_EMAIL;

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      const { error } = await supabase.from('staff_emails').insert({ email: inviteEmail });
      if (error) throw error;
      setAllowedEmails(prev => [...prev, inviteEmail]);
      setInviteEmail('');
      setShowInvite(false);
      toast.success(`${inviteEmail} añadido al staff`);
    } catch (err) {
      toast.error('Error al añadir email');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveStaff = async (email) => {
    if (!confirm(`¿Remover a ${email} del staff?`)) return;
    await supabase.from('staff_emails').delete().eq('email', email);
    setAllowedEmails(prev => prev.filter(e => e !== email));
    toast.success('Email removido del staff');
  };

  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => Article.list('-created_at'),
    enabled: !!isAllowed
  });

  const createMutation = useMutation({
    mutationFn: (data) => Article.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Artículo creado');
      setShowForm(false);
      setEditingArticle(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => Article.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Artículo actualizado');
      setShowForm(false);
      setEditingArticle(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => Article.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Artículo eliminado');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
      excerpt: formData.get('excerpt'),
      author: formData.get('author'),
      cover_image: formData.get('cover_image'),
      published: formData.get('published') === 'true',
      published_date: formData.get('published') === 'true' ? new Date().toISOString() : null
    };
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const togglePublished = (article) => {
    updateMutation.mutate({
      id: article.id,
      data: { ...article, published: !article.published, published_date: !article.published ? new Date().toISOString() : article.published_date }
    });
  };

  // Loading
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );

  // Not logged in
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCFA]">
      <Card className="p-10 max-w-sm w-full text-center shadow-sm">
        <img src="/logo.png" alt="Valmai" className="h-16 w-auto mx-auto mb-6" />
        <h2 className="text-xl font-medium text-gray-800 mb-2">Acceso Staff</h2>
        <p className="text-gray-500 text-sm mb-6">Inicia sesión con tu cuenta de Google autorizada</p>
        <Button onClick={handleGoogleLogin} className="w-full gap-3 bg-[#EF2828] hover:bg-[#d42222]">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Iniciar sesión con Google
        </Button>
      </Card>
    </div>
  );

  // Logged in but not allowed
  if (!isAllowed) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFCFA] gap-4">
      <ShieldAlert className="w-16 h-16 text-gray-300" />
      <h2 className="text-xl font-medium text-gray-700">Sin acceso</h2>
      <p className="text-gray-500 text-sm">Tu cuenta ({user.email}) no está autorizada.</p>
      <Button variant="outline" onClick={handleLogout}>Cerrar sesión</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-gray-900">Panel de Administración</h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex gap-3">
            {isOwner && (
              <Button onClick={() => setShowInvite(!showInvite)} variant="outline" className="gap-2">
                <UserPlus className="w-4 h-4" /> Gestionar Staff
              </Button>
            )}
            <Button onClick={() => { setEditingArticle(null); setShowForm(true); }} className="bg-[#EF2828] hover:bg-[#d42222] gap-2">
              <Plus className="w-4 h-4" /> Nuevo Artículo
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" /> Salir
            </Button>
          </div>
        </div>

        {/* Staff Management Panel (owner only) */}
        {showInvite && isOwner && (
          <Card className="p-6 mb-8 border-blue-100 bg-blue-50/30">
            <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> Gestionar Staff
            </h2>
            <form onSubmit={handleInvite} className="flex gap-3 mb-6">
              <Input
                type="email"
                placeholder="email@ejemplo.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={inviting} className="bg-[#EF2828] hover:bg-[#d42222] gap-2">
                {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Añadir
              </Button>
            </form>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Emails autorizados</p>
              <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-gray-100">
                <span className="text-sm text-gray-700">{OWNER_EMAIL}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Dueño</span>
              </div>
              {allowedEmails.map(email => (
                <div key={email} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-gray-100">
                  <span className="text-sm text-gray-700">{email}</span>
                  <button onClick={() => handleRemoveStaff(email)} className="text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {allowedEmails.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">No hay staff añadido aún</p>
              )}
            </div>
          </Card>
        )}

        {/* Article Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-900">{editingArticle ? 'Editar Artículo' : 'Nuevo Artículo'}</h2>
                <Button type="button" variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditingArticle(null); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <Input name="title" required defaultValue={editingArticle?.title} placeholder="Título del artículo" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Autora *</label>
                <Input name="author" required defaultValue={editingArticle?.author} placeholder="Nombre de la autora" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Extracto</label>
                <Textarea name="excerpt" defaultValue={editingArticle?.excerpt} placeholder="Breve resumen" rows={2} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Contenido * (Markdown)</label>
                <Textarea name="content" required defaultValue={editingArticle?.content} placeholder="Contenido en Markdown" rows={12} className="font-mono text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen de Portada</label>
                <Input name="cover_image" type="url" defaultValue={editingArticle?.cover_image} placeholder="https://..." /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select name="published" defaultValue={editingArticle?.published ? 'true' : 'false'} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option value="false">Borrador</option>
                  <option value="true">Publicado</option>
                </select></div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-[#EF2828] hover:bg-[#d42222]"><Save className="w-4 h-4 mr-2" />{editingArticle ? 'Actualizar' : 'Crear'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingArticle(null); }}>Cancelar</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Articles List */}
        <div className="grid gap-4">
          {articlesLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
          ) : articles.length === 0 ? (
            <Card className="p-8 text-center"><p className="text-gray-500">No hay artículos aún.</p></Card>
          ) : articles.map((article) => (
            <Card key={article.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${article.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {article.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Por {article.author}</p>
                  {article.excerpt && <p className="text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="icon" variant="ghost" onClick={() => togglePublished(article)} title={article.published ? 'Despublicar' : 'Publicar'}>
                    {article.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => { setEditingArticle(article); setShowForm(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => { if (confirm('¿Eliminar?')) deleteMutation.mutate(article.id); }}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
