import { useEffect, useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { adminApi } from '@/lib/adminApi';
import type { RevenueRecord } from '@/types/admin';
import { Loader2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

function RevenueContent() {
  const [revenue, setRevenue] = useState<RevenueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ source: '', amount: 1000000, month: new Date().toISOString().slice(0, 7), note: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRevenue();
  }, []);

  const loadRevenue = async () => {
    setLoading(true);
    const data = await adminApi.listRevenue();
    setRevenue(data);
    setLoading(false);
  };

  const metrics = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTotal = revenue.filter((entry) => entry.month === currentMonth).reduce((sum, entry) => sum + entry.amount, 0);
    const yearlyTotal = revenue.reduce((sum, entry) => sum + entry.amount, 0);
    const averageTicket = revenue.length ? Math.round(yearlyTotal / revenue.length) : 0;
    return { monthlyTotal, yearlyTotal, averageTicket };
  }, [revenue]);

  const chartData = useMemo(() => {
    const grouped = revenue.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.month] = (acc[entry.month] || 0) + entry.amount;
      return acc;
    }, {});
    return Object.entries(grouped)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, value]) => ({
        month,
        value,
        label: format(new Date(`${month}-01`), 'MMM yy'),
      }));
  }, [revenue]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await adminApi.addRevenue({ ...formData, amount: Number(formData.amount) });
    setSubmitting(false);
    setDialogOpen(false);
    setFormData({ source: '', amount: 1000000, month: new Date().toISOString().slice(0, 7), note: '' });
    loadRevenue();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Moliya</p>
          <h1 className="text-3xl font-bold">Revenue Hub</h1>
          <p className="text-muted-foreground">Oylik tushumlarni kuzatish va baholash</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yangi tushum
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revenue qo'shish</DialogTitle>
              <DialogDescription>Qo'shimcha tushum manbasini kiritish</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Manba</Label>
                <Input required value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Summasi (so'm)</Label>
                  <Input type="number" min={0} value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Oy</Label>
                  <Input type="month" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Izoh</Label>
                <Input value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
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
        <MetricCard title="Joriy oy tushumi" value={`${metrics.monthlyTotal.toLocaleString()} so'm`} />
        <MetricCard title="Yillik tushum" value={`${metrics.yearlyTotal.toLocaleString()} so'm`} />
        <MetricCard title="O'rtacha chek" value={`${metrics.averageTicket.toLocaleString()} so'm`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Oylik revenue trendi</CardTitle>
          </CardHeader>
          <CardContent className="h-[360px]">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">Grafik uchun ma'lumot yo'q</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-muted">
          <CardHeader>
            <CardTitle>So'nggi tushumlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
            ) : (
              revenue.slice(0, 6).map((entry) => (
                <div key={entry.id} className="rounded-xl border p-3">
                  <p className="font-semibold">{entry.source}</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(`${entry.month}-01`), 'MMMM yyyy')}</p>
                  <p className="text-lg font-bold">{entry.amount.toLocaleString()} so'm</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Revenue jadvali</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Ma'lumotlar yuklanmoqda...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manba</TableHead>
                  <TableHead>Oy</TableHead>
                  <TableHead>Izoh</TableHead>
                  <TableHead className="text-right">Summasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenue.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.source}</TableCell>
                    <TableCell>{format(new Date(`${entry.month}-01`), 'MMMM yyyy')}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.note || '—'}</TableCell>
                    <TableCell className="text-right font-semibold">{entry.amount.toLocaleString()} so'm</TableCell>
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

export default function RevenuePage() {
  return (
    <ProtectedRoute>
      <RevenueContent />
    </ProtectedRoute>
  );
}


