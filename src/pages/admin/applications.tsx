import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/AdminLayout';
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
import type { Application, Course } from '@shared/schema';
import { Download } from 'lucide-react';

function ApplicationsContent() {
  const [applications, setApplications] = useState<(Application & { course?: Course })[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, courses(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
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

  const exportToCSV = () => {
    const headers = ['Ism', 'Yosh', 'Telefon', 'Kurs', 'Qiziqishlar', 'Sana'];
    const rows = applications.map((app) => [
      app.full_name,
      app.age.toString(),
      app.phone,
      (app.course as any)?.name_uz || 'Noma\'lum',
      app.interests,
      new Date(app.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold">Ro'yxatdan o'tganlar</h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Online forma orqali tushgan barcha arizalarni kuzating
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline" className="w-full sm:w-auto text-sm">
            <Download className="h-4 w-4 mr-2" />
            CSV yuklab olish
          </Button>
        </div>
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">O'quvchilar ro'yxati ({applications.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 overflow-x-auto">
            {loading ? (
              <div className="text-center py-8 text-sm">Yuklanmoqda...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Hozircha ro'yxatdan o'tganlar yo'q
              </div>
            ) : (
              <div className="min-w-[700px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Ism</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Yosh</TableHead>
                      <TableHead className="text-xs sm:text-sm">Telefon</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Kurs</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Qiziqishlar</TableHead>
                      <TableHead className="text-xs sm:text-sm">Sana</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <div>
                            <div>{app.full_name}</div>
                            <div className="md:hidden mt-1 text-xs text-muted-foreground">Yosh: {app.age}</div>
                            <div className="lg:hidden mt-1 text-xs text-muted-foreground">{(app.course as any)?.name_uz || 'Noma\'lum'}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs sm:text-sm">{app.age}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{app.phone}</TableCell>
                        <TableCell className="hidden lg:table-cell text-xs sm:text-sm">{(app.course as any)?.name_uz || 'Noma\'lum'}</TableCell>
                        <TableCell className="hidden xl:table-cell max-w-xs truncate text-xs sm:text-sm">{app.interests}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default function AdminApplications() {
  return (
    <ProtectedRoute>
      <ApplicationsContent />
    </ProtectedRoute>
  );
}

