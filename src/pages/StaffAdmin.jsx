import React, { useState, useEffect } from 'react';
import { supabase, Article } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, LogOut, Loader2, ShieldAlert, UserPlus, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function StaffAdmin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [staffList, setStaffList] = useState([]);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Invite
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      supabase.from('staff_emails').select('*').order('created_at').then(({ data }) => setStaffList(data || []));
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
      if (error) throw error;
    } catch {
      setLoginError('Email o contraseña incorrectos');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ email: inviteEmail })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setStaffList(prev => [...prev, { email: inviteEmail }]);
      setInviteEmail('');
      setShowInvite(false);
      toast.success(`Invitación enviada a ${inviteEmail} — recibirá un email para crear su contraseña`);
    } catch (err) {
      toast.error(err.message || 'Error al enviar invitación');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveStaff = async (email) => {
    if (!confirm(`¿Remover a ${email} del staff?`)) return;
    await supabase.from('staff_emails').delete().eq('email', email);
    setStaffList(prev => prev.filter(u => u.email !== email));
    toast.success('Staff removido');
  };

  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => Article.list('-created_at'),
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: (data) => Article.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-articles'] }); toast.success('Artículo creado'); setShowForm(false); setEditingArticle(null); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => Article.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-articles'] }); toast.success('Artículo actualizado'); setShowForm(false); setEditingArticle(null); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => Article.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-articles'] }); toast.success('Eliminado'); }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      title: fd.get('title'),
      content: fd.get('content'),
      excerpt: fd.get('excerpt'),
      author: fd.get('author'),
      cover_image: fd.get('cover_image'),
      published: fd.get('published') === 'true',
      published_date: fd.get('published') === 'true' ? new Date().toISOString() : null
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

  // Not logged in — show login form
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCFA]">
      <Card className="p-10 max-w-sm w-full shadow-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Valmai" className="h-14 w-auto mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-800">Acceso Staff</h2>
          <p className="text-gray-500 text-sm mt-1">Inicia sesión con tus credenciales</p>
        </div>
        {loginError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {loginError}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <Input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required placeholder="tu@email.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
            <Input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <Button type="submit" disabled={loginLoading} className="w-full bg-[#EF2828] hover:bg-[#d42222]">
            {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Iniciar sesión'}
          </Button>
        </form>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-gray-900">Panel de Administración</h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowInvite(!showInvite)} variant="outline" className="gap-2">
              <UserPlus className="w-4 h-4" /> Gestionar Staff
            </Button>
            <Button onClick={() => { setEditingArticle(null); setShowForm(true); }} className="bg-[#EF2828] hover:bg-[#d42222] gap-2">
              <Plus className="w-4 h-4" /> Nuevo Artículo
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" /> Salir
            </Button>
          </div>
        </div>

        {/* Staff Management */}
        {showInvite && (
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
                Invitar
              </Button>
            </form>
            <p className="text-xs text-gray-500 mb-3">La persona recibirá un email para crear su contraseña automáticamente.</p>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Staff actual</p>
              {staffList.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-2">Solo tú tienes acceso por ahora</p>
              ) : staffList.map(s => (
                <div key={s.email} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-gray-100">
                  <span className="text-sm text-gray-700">{s.email}</span>
                  <button onClick={() => handleRemoveStaff(s.email)} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
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
                <Button type="submit" className="bg-[#EF2828] hover:bg-[#d42222]">
                  <Save className="w-4 h-4 mr-2" />{editingArticle ? 'Actualizar' : 'Crear'}
                </Button>
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
                  <Button size="icon" variant="ghost" onClick={() => togglePublished(article)}>
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
