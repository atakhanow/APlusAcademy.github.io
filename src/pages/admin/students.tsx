import { useEffect, useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { adminApi } from '@/lib/adminApi';
import type { GroupProfile, StudentPayload, StudentProfile } from '@/types/admin';
import { Loader2, MoreHorizontal, Plus, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

function StudentsContent() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [groups, setGroups] = useState<GroupProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [historyStudent, setHistoryStudent] = useState<StudentProfile | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [formData, setFormData] = useState<StudentPayload>({
    fullName: '',
    groupId: null,
    parentName: '',
    parentContact: '',
    monthlyPayment: 1500000,
    paymentStatus: 'paid',
    photoUrl: '',
    notes: '',
  });
  const [groupFilter, setGroupFilter] = useState<'all' | string>('all');
  const [unpaidGroupFilter, setUnpaidGroupFilter] = useState<'all' | string>('all');
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
    loadGroups();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await adminApi.listStudents();
      setStudents(data);
    } catch (error) {
      console.error(error);
      toast({ title: 'Xatolik', description: 'Talabalar ro\'yxatini yuklab bo\'lmadi', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadGroups = async () => {
    const data = await adminApi.listGroups();
    setGroups(data);
  };

  const resetForm = () => {
    setEditingStudent(null);
    setFormData({
      fullName: '',
      groupId: groups[0]?.id ?? null,
      parentName: '',
      parentContact: '',
      monthlyPayment: 1500000,
      paymentStatus: 'paid',
      photoUrl: '',
      notes: '',
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingStudent) {
        await adminApi.updateStudent(editingStudent.id, formData);
        toast({ title: 'Yangilandi', description: 'Talaba ma\'lumotlari muvaffaqiyatli yangilandi' });
      } else {
        await adminApi.createStudent({ ...formData, history: [] });
        toast({ title: 'Qo\'shildi', description: 'Talaba muvaffaqiyatli qo\'shildi' });
      }
      setFormOpen(false);
      resetForm();
      loadStudents();
      loadGroups();
    } catch (error) {
      console.error(error);
      toast({ title: 'Xatolik', description: 'Saqlashda muammo yuz berdi', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (student: StudentProfile) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName,
      groupId: student.groupId,
      parentName: student.parentName,
      parentContact: student.parentContact,
      monthlyPayment: student.monthlyPayment,
      paymentStatus: student.paymentStatus,
      photoUrl: student.photoUrl,
      notes: student.notes,
      history: student.history,
    });
    setFormOpen(true);
  };

  const handleDelete = async (student: StudentProfile) => {
    if (!confirm(`${student.fullName} ma'lumotlarini o'chirishni tasdiqlaysizmi?`)) return;
    try {
      await adminApi.deleteStudent(student.id);
      toast({ title: 'O\'chirildi', description: 'Talaba o\'chirildi' });
      loadStudents();
      loadGroups();
    } catch (error) {
      console.error(error);
      toast({ title: 'Xatolik', description: 'Talabani o\'chirishda muammo', variant: 'destructive' });
    }
  };

  const handleRecordPayment = async (student: StudentProfile) => {
    try {
      await adminApi.recordPayment(student.id, {
        amount: student.monthlyPayment,
        date: new Date().toISOString(),
        method: 'card',
        status: 'paid',
      });
      toast({ title: 'To\'lov qabul qilindi', description: `${student.fullName} uchun to'lov qo'shildi` });
      loadStudents();
    } catch (error) {
      console.error(error);
      toast({ title: 'Xatolik', description: 'To\'lovni yozib bo\'lmadi', variant: 'destructive' });
    }
  };

  const stats = useMemo(() => {
    const total = students.length;
    const paid = students.filter((student) => student.paymentStatus === 'paid');
    const unpaid = total - paid.length;
    const monthlyRevenue = paid.reduce((sum, student) => sum + student.monthlyPayment, 0);
    const perGroup = groups.map((group) => ({
      ...group,
      remaining: Math.max(group.maxStudents - group.currentStudents, 0),
    }));
    return { total, paid: paid.length, unpaid, monthlyRevenue, perGroup };
  }, [students, groups]);

  const filteredStudents = useMemo(() => {
    let data = students.filter((student) => student.fullName.toLowerCase().includes(searchValue.toLowerCase()));
    if (groupFilter !== 'all') {
      data = data.filter((student) => student.groupId === groupFilter);
    }
    if (unpaidGroupFilter !== 'all') {
      data = data.filter(
        (student) => student.paymentStatus === 'unpaid' && student.groupId === unpaidGroupFilter
      );
    } else if (showUnpaidOnly) {
      data = data.filter((student) => student.paymentStatus === 'unpaid');
    }
    return data;
  }, [students, groupFilter, unpaidGroupFilter, showUnpaidOnly, searchValue]);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6 animate-fade-in-down">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Talabalar
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Guruhlar, ota-onalar va to'lovlarni boshqaring</p>
        </div>
        <Dialog open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setFormOpen(true); }} className="w-full sm:w-auto text-sm">
              <Plus className="h-4 w-4 mr-2" />
              Yangi talaba
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-base sm:text-lg">{editingStudent ? 'Talaba ma\'lumotlarini tahrirlash' : 'Yangi talaba qo\'shish'}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">Ma\'lumotlarni to\'ldiring va saqlang.</DialogDescription>
            </DialogHeader>
            <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label>F.I.Sh</Label>
                  <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Guruh</Label>
                  <Select
                    value={formData.groupId || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, groupId: value === 'none' ? null : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Guruhni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Guruhsiz</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ota-ona ismi</Label>
                  <Input value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Ota-ona kontakti</Label>
                  <Input value={formData.parentContact} onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Oylik to'lov (so'm)</Label>
                  <Input
                    type="number"
                    value={formData.monthlyPayment}
                    onChange={(e) => setFormData({ ...formData, monthlyPayment: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Holat</Label>
                  <Select value={formData.paymentStatus} onValueChange={(value) => setFormData({ ...formData, paymentStatus: value as StudentPayload['paymentStatus'] })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Holat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Profil surati (URL)</Label>
                  <Input value={formData.photoUrl || ''} onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Qo'shimcha eslatma</Label>
                  <Input value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingStudent ? 'Yangilash' : 'Qo\'shish'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="stagger-item">
          <StatCard title="Jami talabalar" value={stats.total} description="Faol ro'yxat" />
        </div>
        <div className="stagger-item">
          <StatCard title="Paid students" value={stats.paid} description="To'lovni amalga oshirgan" accent="bg-emerald-500/10 text-emerald-600" />
        </div>
        <div className="stagger-item">
          <StatCard title="Unpaid students" value={stats.unpaid} description="To'lov kutilmoqda" accent="bg-amber-500/10 text-amber-600" />
        </div>
        <div className="stagger-item">
          <StatCard title="Oylik daromad" value={`${stats.monthlyRevenue.toLocaleString()} so'm`} description="Talabalardan tushum" />
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Guruh sig'imi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 pt-0">
          {stats.perGroup.length === 0 ? (
            <p className="text-sm text-muted-foreground">Guruh ma'lumotlari yo'q</p>
          ) : (
            stats.perGroup.map((group, index) => (
              <div 
                key={group.id} 
                className="stagger-item rounded-lg border p-4 hover:bg-muted/50"
                style={{ animationDelay: `${index * 0.02}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{group.name}</p>
                    <p className="text-xs text-muted-foreground">{group.schedule}</p>
                  </div>
                  <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>{group.status}</Badge>
                </div>
                <p className="text-2xl font-bold mt-3">
                  {group.currentStudents}/{group.maxStudents}
                </p>
                <p className="text-xs text-muted-foreground">Qolgan o'rinlar: {group.remaining}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3">
            <CardTitle className="text-base sm:text-lg">Talabalar jadvallari</CardTitle>
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="Ism bo'yicha qidirish..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full sm:w-44 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Select value={groupFilter} onValueChange={(value) => setGroupFilter(value)}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue placeholder="Guruh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barchasi</SelectItem>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={unpaidGroupFilter} onValueChange={(value) => setUnpaidGroupFilter(value)}>
                  <SelectTrigger className="w-full sm:w-48 text-sm">
                    <SelectValue placeholder="Unpaid group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Unpaid filtri yo'q</SelectItem>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Switch id="unpaid-only" checked={showUnpaidOnly} onCheckedChange={(checked) => setShowUnpaidOnly(checked)} />
                  <Label htmlFor="unpaid-only" className="text-xs sm:text-sm">Faqat unpaid</Label>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-4 sm:p-6 pt-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Ma'lumotlar yuklanmoqda...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Talabalar topilmadi</div>
          ) : (
            <div className="min-w-[700px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Talaba</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Guruh</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Ota-ona</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Oylik to'lov</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={student.id} className="table-row-hover stagger-item" style={{ animationDelay: `${index * 0.02}s` }}>
                      <TableCell className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                          <AvatarImage src={student.photoUrl} alt={student.fullName} />
                          <AvatarFallback className="text-xs">{student.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-xs sm:text-sm truncate">{student.fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">{student.notes || '—'}</p>
                          <div className="md:hidden mt-1">
                            {student.groupName && (
                              <p className="text-xs font-medium">{student.groupName}</p>
                            )}
                            <p className="text-xs text-muted-foreground">{student.parentName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {student.groupName ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs sm:text-sm">{student.groupName}</span>
                            <span className="text-xs text-muted-foreground">{student.groupSchedule}</span>
                          </div>
                        ) : (
                          <span className="text-xs sm:text-sm text-muted-foreground">Guruh biriktirilmagan</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs sm:text-sm font-medium">{student.parentName}</span>
                          <span className="text-xs text-muted-foreground">{student.parentContact}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-xs sm:text-sm">
                        {student.monthlyPayment.toLocaleString()} so'm
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.paymentStatus === 'paid' ? 'default' : 'secondary'} className={`text-[10px] sm:text-xs ${student.paymentStatus === 'paid' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500/20 text-amber-600'}`}>
                          {student.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs">Amallar</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setHistoryStudent(student)} className="text-xs">To'lov tarixi</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(student)} className="text-xs">Tahrirlash</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRecordPayment(student)} className="text-xs">To'lovni qayd etish</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive text-xs" onClick={() => handleDelete(student)}>
                              O'chirish
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!historyStudent} onOpenChange={(open) => !open && setHistoryStudent(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>To'lov tarixi — {historyStudent?.fullName}</DialogTitle>
            <DialogDescription>So'nggi tranzaksiyalar</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {historyStudent?.history.map((entry) => (
              <div key={entry.id} className="rounded-2xl border p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{entry.amount.toLocaleString()} so'm</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(entry.date), 'dd MMM yyyy')}</p>
                </div>
                <Badge variant={entry.status === 'paid' ? 'default' : 'secondary'}>{entry.status}</Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

type StatCardProps = {
  title: string;
  value: number | string;
  description: string;
  accent?: string;
};

function StatCard({ title, value, description, accent }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2 p-4 sm:p-6">
        <CardTitle className="text-xs sm:text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <p className={`text-xl sm:text-2xl font-bold break-words ${accent ?? ''}`}>{value}</p>
        <p className="text-xs text-muted-foreground mt-1 sm:mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminStudentsPage() {
  return (
    <ProtectedRoute>
      <StudentsContent />
    </ProtectedRoute>
  );
}


