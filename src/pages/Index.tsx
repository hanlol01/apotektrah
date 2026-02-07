import { Layout } from '@/components/pharmacy/Layout';
import { Header } from '@/components/pharmacy/Header';
import { StatCard } from '@/components/pharmacy/StatCard';
import { RecentTransactions } from '@/components/pharmacy/RecentTransactions';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  FileText,
  Beaker,
  ArrowRight,
} from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <Header
        title="Dashboard"
        subtitle="Selamat datang di Apotek Sehat Farma"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Transaksi Hari Ini"
          value={24}
          icon={ShoppingCart}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Pendapatan Hari Ini"
          value="Rp 3.250.000"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Pasien Dilayani"
          value={18}
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          variant="secondary"
        />
        <StatCard
          title="Stok Menipis"
          value={7}
          icon={Package}
          variant="accent"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="card-pharmacy">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-lg text-foreground">
                Resep Biasa
              </h3>
              <p className="text-sm text-muted-foreground">
                Input transaksi resep dokter untuk obat biasa
              </p>
            </div>
            <Link to="/resep-biasa">
              <Button className="btn-primary-gradient">
                Buat Transaksi
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="card-pharmacy">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
              <Beaker className="h-7 w-7 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-lg text-foreground">
                Resep Racikan
              </h3>
              <p className="text-sm text-muted-foreground">
                Input transaksi resep dokter untuk obat racikan
              </p>
            </div>
            <Link to="/resep-racikan">
              <Button className="btn-secondary-gradient">
                Buat Transaksi
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </Layout>
  );
};

export default Index;
