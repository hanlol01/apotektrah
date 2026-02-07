import { Doctor } from '@/types/pharmacy';
import { mockDoctors } from '@/data/mockData';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Stethoscope, Building, FileText } from 'lucide-react';

interface DoctorSelectProps {
  doctor: Partial<Doctor> | null;
  onChange: (doctor: Doctor | null) => void;
}

export function DoctorSelect({ doctor, onChange }: DoctorSelectProps) {
  const handleDoctorSelect = (doctorId: string) => {
    const selectedDoctor = mockDoctors.find((d) => d.id === doctorId);
    onChange(selectedDoctor || null);
  };

  return (
    <div className="card-pharmacy">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-primary" />
        Data Dokter Penulis Resep
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label className="text-sm font-medium text-foreground">Pilih Dokter</Label>
          <Select onValueChange={handleDoctorSelect} value={doctor?.id || ''}>
            <SelectTrigger className="input-pharmacy">
              <SelectValue placeholder="Pilih dokter penulis resep" />
            </SelectTrigger>
            <SelectContent>
              {mockDoctors.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>
                  {doc.name} - {doc.specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {doctor && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  No. SIP
                </span>
              </Label>
              <Input
                value={doctor.sipNumber || ''}
                readOnly
                className="input-pharmacy bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                <span className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5" />
                  Instansi
                </span>
              </Label>
              <Input
                value={doctor.hospital || ''}
                readOnly
                className="input-pharmacy bg-muted"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
