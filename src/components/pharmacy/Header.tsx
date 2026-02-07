import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari obat, pasien..."
            className="pl-10 w-64 bg-card border-border"
          />
        </div>
        
        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-card border border-border hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            3
          </span>
        </button>
        
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Apoteker</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}
