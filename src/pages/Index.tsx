import { Layout } from '@/components/pharmacy/Layout';
import { RecentTransactions } from '@/components/pharmacy/RecentTransactions';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  ShoppingCart,
  TrendingUp,
  Package,
  FileText,
  Beaker,
  ArrowRight,
  Calendar,
  Wallet,
  AlertTriangle,
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] || 'Administrator';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Hero Card - Large Green Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 p-8 text-white shadow-xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium">Panel Kasir</p>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-2">{userName}</h1>
            <p className="text-white/90 text-lg mb-8">
              Kelola approval cart dan monitor transaksi penjualan harian
            </p>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5">
                <ShoppingCart className="h-5 w-5" />
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-white/80">Transaksi hari ini</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5">
                <Calendar className="h-5 w-5" />
                <div>
                  <p className="text-sm text-white/80">
                    {new Date().toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 flex gap-4 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Wallet className="h-7 w-7" />
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <ShoppingCart className="h-7 w-7" />
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <FileText className="h-7 w-7" />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
        </div>

        {/* Stats Grid - Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Cart Pending */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-600 font-medium">Cart Menunggu</p>
              <p className="text-xs text-orange-600 font-medium">Butuh approval</p>
            </div>
          </div>

          {/* Today's Transactions */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-600 font-medium">Transaksi Hari Ini</p>
              <p className="text-xs text-emerald-600 font-medium">+12 transaksi baru</p>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">Rp 700K</p>
              <p className="text-sm text-gray-600 font-medium">Penjualan Hari Ini</p>
              <p className="text-xs text-blue-600 font-medium">Total pendapatan</p>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                <Package className="h-6 w-6 text-pink-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">7</p>
              <p className="text-sm text-gray-600 font-medium">Stok Minimum</p>
              <p className="text-xs text-pink-600 font-medium">Perlu restock</p>
            </div>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-xs text-gray-600">Cart Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-gray-600">Transaksi</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Rp 700K</p>
                <p className="text-xs text-gray-600">Penjualan</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50">
                <AlertTriangle className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">7</p>
                <p className="text-xs text-gray-600">Stok Minimum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100">
                  <ShoppingCart className="h-7 w-7 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Cart Menunggu Approval
                  </h3>
                  <p className="text-sm text-gray-600">
                    1 cart perlu persetujuan
                  </p>
                </div>
              </div>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-6">
                Lihat Semua →
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                  <TrendingUp className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Aksi Cepat
                  </h3>
                  <p className="text-sm text-gray-600">
                    Navigasi cepat ke fitur utama
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Modern Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Link to="/resep-biasa" className="block group">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-6 text-white hover:shadow-xl transition-all duration-200 transform group-hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <FileText className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Resep Biasa</h3>
                    <p className="text-white/90 text-sm">
                      Input transaksi resep dokter untuk obat biasa
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link to="/resep-racikan" className="block group">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white hover:shadow-xl transition-all duration-200 transform group-hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <Beaker className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Resep Racikan</h3>
                    <p className="text-white/90 text-sm">
                      Input transaksi resep dokter untuk obat racikan
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Transactions */}
        <RecentTransactions />
      </div>
    </Layout>
  );
};

export default Index;
