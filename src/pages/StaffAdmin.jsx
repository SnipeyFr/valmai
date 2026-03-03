import React, { useState, useEffect } from 'react';
import { Article, auth, supabase } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

export default function StaffAdmin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notApproved, setNotApproved] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await auth.me();
        const ADMIN_EMAILS = ['abzta123@gmail.com'];
        if (!ADMIN_EMAILS.includes(currentUser.email)) {
          setNotApproved(true);
          setLoading(false);
          return;
        }
        setUser(currentUser);
      } catch (error) {
        window.location.href = "/Login";
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    auth.logout();
  };

  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => Article.list('-created_at'),
    enabled: !!user
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
      data: {
        ...article,
        published: !article.published,
        published_date: !article.published ? new Date().toISOString() : article.published_date
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (notApproved) {
    return <UserNotRegisteredError />;
  }

  if (articlesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Cargando artículos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600 mt-1">Gestiona los artículos de Mas+</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setEditingArticle(null);
                setShowForm(true);
              }}
              className="bg-[#EF2828] hover:bg-[#d42222]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Artículo
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-900">
                  {editingArticle ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowForm(false);
                    setEditingArticle(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <Input
                  name="title"
                  required
                  defaultValue={editingArticle?.title}
                  placeholder="Título del artículo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autora *
                </label>
                <Input
                  name="author"
                  required
                  defaultValue={editingArticle?.author}
                  placeholder="Nombre de la autora"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extracto
                </label>
                <Textarea
                  name="excerpt"
                  defaultValue={editingArticle?.excerpt}
                  placeholder="Breve resumen del artículo"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenido * (Markdown)
                </label>
                <Textarea
                  name="content"
                  required
                  defaultValue={editingArticle?.content}
                  placeholder="Escribe el contenido en formato Markdown"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Imagen de Portada
                </label>
                <Input
                  name="cover_image"
                  type="url"
                  defaultValue={editingArticle?.cover_image}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="published"
                  defaultValue={editingArticle?.published ? 'true' : 'false'}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="false">Borrador</option>
                  <option value="true">Publicado</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-[#EF2828] hover:bg-[#d42222]">
                  <Save className="w-4 h-4 mr-2" />
                  {editingArticle ? 'Actualizar' : 'Crear'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingArticle(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Articles List */}
        <div className="grid gap-4">
          {articles.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No hay artículos aún. Crea el primero.</p>
            </Card>
          ) : (
            articles.map((article) => (
              <Card key={article.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {article.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          article.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {article.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Por {article.author}
                    </p>
                    {article.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => togglePublished(article)}
                      title={article.published ? 'Despublicar' : 'Publicar'}
                    >
                      {article.published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingArticle(article);
                        setShowForm(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (confirm('¿Eliminar este artículo?')) {
                          deleteMutation.mutate(article.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}