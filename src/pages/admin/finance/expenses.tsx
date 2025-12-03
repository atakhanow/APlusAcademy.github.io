import { useEffect, useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { adminApi } from '@/lib/adminApi';
import type { ExpenseRecord } from '@/types/admin';
import { Loader2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function ExpensesContent() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ category: '', amount: 500000, month: new Date().toISOString().slice(0, 7), description: '', type: 'fixed' as ExpenseRecord['type'] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    const data = await adminApi.listExpenses();
    setExpenses(data);
    setLoading(false);
  };

  const totals = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthly = expenses.filter((expense) => expense.month === currentMonth).reduce((sum, entry) => sum + entry.amount, 0);
    const yearly = expenses.reduce((sum, entry) => sum + entry.amount, 0);
    const fixed = expenses.filter((expense) => expense.type === 'fixed').reduce((sum, entry) => sum + entry.amount, 0);
    return { monthly, yearly, fixed };
  }, [expenses]);

  const chartData = useMemo(() => {
    const grouped = expenses.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.month] = (acc[entry.month] || 0) + entry.amount;
      return acc;
    }, {});
    return Object.entries(grouped)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, amount]) => ({ month: format(new Date(`${month}-01`), 'MMM yy'), amount }));
  }, [expenses]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await adminApi.addExpense({ ...formData, amount: Number(formData.amount) });
    setSubmitting(false);
    setDialogOpen(false);
    setFormData({ category: '', amount: 500000, month: new Date().toISOString().slice(0, 7), description: '', type: 'fixed' });
    loadExpenses();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Moliya</p>
          <h1 className="text-3xl font-bold">Expenses Board</h1>
          <p className="text-muted-foreground">Ijara, kommunal va qo'shimcha xarajatlar nazorati</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yangi xarajat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xarajat qo'shish</DialogTitle>
              <DialogDescription>Sentyabiyni barchaga ko'rsatish uchun to'ldiring</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Kategoriya</Label>
                <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Summasi</Label>
                  <Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label>Oy</Label>
                  <Input type="month" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Turi</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ExpenseRecord['type'] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="variable">Variable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Izoh</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Saqlash
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard title="Joriy oy xarajatlari" value={`${totals.monthly.toLocaleString()} so'm`} />
        <MetricCard title="Fixed xarajatlar" value={`${totals.fixed.toLocaleString()} so'm`} />
        <MetricCard title="Yillik xarajatlar" value={`${totals.yearly.toLocaleString()} so'm`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Oylik xarajatlar</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">Grafik uchun ma'lumot yo'q</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>So'nggi xarajatlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[320px] overflow-y-auto">
            {loading ? (
              <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
            ) : (
              expenses.slice(0, 6).map((expense) => (
                <div key={expense.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{expense.category}</p>
                    <span className="text-xs text-muted-foreground">{expense.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{format(new Date(`${expense.month}-01`), 'MMMM yyyy')}</p>
                  <p className="text-lg font-bold">{expense.amount.toLocaleString()} so'm</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Xarajatlar jadvali</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Ma'lumotlar yuklanmoqda...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead>Tur</TableHead>
                  <TableHead>Oy</TableHead>
                  <TableHead>Izoh</TableHead>
                  <TableHead className="text-right">Summasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.category}</TableCell>
                    <TableCell className="capitalize">{expense.type}</TableCell>
                    <TableCell>{format(new Date(`${expense.month}-01`), 'MMMM yyyy')}</TableCell>
                    <TableCell className="text-muted-foreground">{expense.description || '—'}</TableCell>
                    <TableCell className="text-right font-semibold">{expense.amount.toLocaleString()} so'm</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

const MetricCard = ({ title, value }: { title: string; value: string }) => (
  <Card className="shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default function ExpensesPage() {
  return (
    <ProtectedRoute>
      <ExpensesContent />
    </ProtectedRoute>
  );
}


