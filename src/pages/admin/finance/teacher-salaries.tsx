import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { adminApi } from '@/lib/adminApi';
import type { TeacherProfile } from '@/types/admin';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

function TeacherSalaryContent() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [formTeacher, setFormTeacher] = useState<TeacherProfile | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formState, setFormState] = useState({ monthlySalary: 0, status: 'active' as TeacherProfile['status'] });
  const { toast } = useToast();

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    const data = await adminApi.listTeachers();
    setTeachers(data);
  };

  const totals = teachers.reduce(
    (acc, teacher) => {
      if (teacher.status === 'active') {
        acc.active += teacher.monthlySalary;
      } else {
         acc.inactive += teacher.monthlySalary;
      }
      return acc;
    },
    { active: 0, inactive: 0 }
  );

  const handleOpen = (teacher: TeacherProfile) => {
    setFormTeacher(teacher);
    setFormState({ monthlySalary: teacher.monthlySalary, status: teacher.status });
    setFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formTeacher) return;
    await adminApi.updateTeacher(formTeacher.id, formState);
    toast({ title: 'Yangilandi', description: 'Oylik maosh qayd etildi' });
    setFormOpen(false);
    loadTeachers();
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Moliya</p>
        <h1 className="text-3xl font-bold">Teacher Salary Ledger</h1>
        <p className="text-muted-foreground">Ustozlar uchun maosh nazorati va holat</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Faol ustozlar maoshi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totals.active.toLocaleString()} so'm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Nofaol ustozlar maoshi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totals.inactive.toLocaleString()} so'm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Jami majburiyat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{(totals.active + totals.inactive).toLocaleString()} so'm</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>O'qituvchilar jadvali</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>O'qituvchi</TableHead>
                <TableHead>Yo'nalish</TableHead>
                <TableHead>Tajriba</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead className="text-right">Oylik</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tahrir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={teacher.photoUrl} />
                      <AvatarFallback>{teacher.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{teacher.fullName}</p>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.experience} yil</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell className="text-right font-semibold">{teacher.monthlySalary.toLocaleString()} so'm</TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'} className={teacher.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpen(teacher)}>
                      Tahrirlash
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Maoshni yangilash</DialogTitle>
            <DialogDescription>A+ Academy payroll uchun moslashtiring</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Oylik</Label>
              <Input type="number" value={formState.monthlySalary} onChange={(e) => setFormState({ ...formState, monthlySalary: Number(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formState.status} onValueChange={(value) => setFormState({ ...formState, status: value as TeacherProfile['status'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="submit">Saqlash</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function TeacherSalaryPage() {
  return (
    <ProtectedRoute>
      <TeacherSalaryContent />
    </ProtectedRoute>
  );
}


