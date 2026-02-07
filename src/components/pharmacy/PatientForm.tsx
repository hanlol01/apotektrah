import { Patient } from '@/types/pharmacy';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, MapPin, Calendar } from 'lucide-react';

interface PatientFormProps {
  patient: Partial<Patient>;
  onChange: (patient: Partial<Patient>) => void;
}

export function PatientForm({ patient, onChange }: PatientFormProps) {
  return (
    <div className="card-pharmacy">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        Data Pasien
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientName" className="text-sm font-medium text-foreground">
            Nama Pasien
          </Label>
          <Input
            id="patientName"
            placeholder="Masukkan nama pasien"
            value={patient.name || ''}
            onChange={(e) => onChange({ ...patient, name: e.target.value })}
            className="input-pharmacy"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="patientPhone" className="text-sm font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              No. Telepon
            </span>
          </Label>
          <Input
            id="patientPhone"
            placeholder="08xx-xxxx-xxxx"
            value={patient.phone || ''}
            onChange={(e) => onChange({ ...patient, phone: e.target.value })}
            className="input-pharmacy"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="patientBirth" className="text-sm font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Tanggal Lahir
            </span>
          </Label>
          <Input
            id="patientBirth"
            type="date"
            value={patient.birthDate || ''}
            onChange={(e) => onChange({ ...patient, birthDate: e.target.value })}
            className="input-pharmacy"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="patientAddress" className="text-sm font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Alamat
            </span>
          </Label>
          <Input
            id="patientAddress"
            placeholder="Alamat pasien"
            value={patient.address || ''}
            onChange={(e) => onChange({ ...patient, address: e.target.value })}
            className="input-pharmacy"
          />
        </div>
      </div>
    </div>
  );
}
