import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Category {
  id: string;
  name: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  type: 'course' | 'event';
  created_at?: string;
}

function CategoriesContent() {
  const [courseCategories, setCourseCategories] = useState<Category[]>([]);
  const [eventCategories, setEventCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'course' | 'event'>('course');
  const [formData, setFormData] = useState({
    name_uz: '',
    name_ru: '',
    name_en: '',
    type: 'course' as 'course' | 'event',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const courses = (data || []).filter((cat) => cat.type === 'course');
      const events = (data || []).filter((cat) => cat.type === 'event');
      setCourseCategories(courses);
      setEventCategories(events);
    } catch (error: any) {
      toast({
        title: 'Xatolik',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryData = {
        ...formData,
        name: formData.name_uz, // Default name
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast({
          title: 'Muvaffaqiyatli',
          description: 'Kategoriya yangilandi',
        });
      } else {
        const { error } = await supabase.from('categories').insert([categoryData]);

        if (error) throw error;
        toast({
          title: 'Muvaffaqiyatli',
          description: 'Kategoriya qo\'shildi',
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadCategories();
    } catch (error: any) {
      toast({
        title: 'Xatolik',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyani o\'chirishni xohlaysizmi?')) return;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);

      if (error) throw error;
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Kategoriya o\'chirildi',
      });
      loadCategories();
    } catch (error: any) {
      toast({
        title: 'Xatolik',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_uz: category.name_uz,
      name_ru: category.name_ru,
      name_en: category.name_en,
      type: category.type,
    });
    setActiveTab(category.type);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name_uz: '',
      name_ru: '',
      name_en: '',
      type: activeTab,
    });
  };

  const currentCategories = activeTab === 'course' ? courseCategories : eventCategories;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Kategoriyalar boshqaruvi</h2>
            <p className="text-muted-foreground">
              Kurs va tadbir kategoriyalarini boshqaring
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Yangi kategoriya
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya qo\'shish'}
                </DialogTitle>
                <DialogDescription>
                  Kategoriya ma'lumotlarini to'ldiring
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Kategoriya turi</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as 'course' | 'event' })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategoriya turini tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="course">Kurs kategoriyasi</SelectItem>
                      <SelectItem value="event">Tadbir kategoriyasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nomi (UZ)</Label>
                  <Input
                    value={formData.name_uz}
                    onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nomi (RU)</Label>
                  <Input
                    value={formData.name_ru}
                    onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nomi (EN)</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button type="submit">
                    {editingCategory ? 'Yangilash' : 'Qo\'shish'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kategoriyalar ro'yxati</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'course' | 'event')}>
              <TabsList>
                <TabsTrigger value="course">Kurs kategoriyalari</TabsTrigger>
                <TabsTrigger value="event">Tadbir kategoriyalari</TabsTrigger>
              </TabsList>
              <TabsContent value="course">
                {loading ? (
                  <div className="text-center py-8">Yuklanmoqda...</div>
                ) : courseCategories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Hozircha kurs kategoriyalari yo'q
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nomi (UZ)</TableHead>
                        <TableHead>Nomi (RU)</TableHead>
                        <TableHead>Nomi (EN)</TableHead>
                        <TableHead>Amallar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.name_uz}</TableCell>
                          <TableCell>{category.name_ru}</TableCell>
                          <TableCell>{category.name_en}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(category)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(category.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
              <TabsContent value="event">
                {loading ? (
                  <div className="text-center py-8">Yuklanmoqda...</div>
                ) : eventCategories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Hozircha tadbir kategoriyalari yo'q
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nomi (UZ)</TableHead>
                        <TableHead>Nomi (RU)</TableHead>
                        <TableHead>Nomi (EN)</TableHead>
                        <TableHead>Amallar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.name_uz}</TableCell>
                          <TableCell>{category.name_ru}</TableCell>
                          <TableCell>{category.name_en}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(category)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(category.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default function AdminCategories() {
  return (
    <ProtectedRoute>
      <CategoriesContent />
    </ProtectedRoute>
  );
}

