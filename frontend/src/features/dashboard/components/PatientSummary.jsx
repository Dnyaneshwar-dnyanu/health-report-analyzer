import { Card } from '../../../components/common/Card/Card';
import { FiUser, FiCalendar, FiDroplet } from 'react-icons/fi';

export const PatientSummary = ({ patient, date }) => {
  return (
    <Card className="h-full">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <FiUser className="text-[var(--color-primary)]" />
        Patient Profile
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-[var(--color-muted)] mb-1">Name</p>
          <p className="font-medium">{patient.name}</p>
        </div>
        <div>
          <p className="text-sm text-[var(--color-muted)] mb-1">Age / Gender</p>
          <p className="font-medium">{patient.age} / {patient.gender}</p>
        </div>
        <div>
          <p className="text-sm text-[var(--color-muted)] mb-1 flex items-center gap-1">
            <FiDroplet className="text-red-400" /> Blood Group
          </p>
          <p className="font-medium">{patient.bloodGroup}</p>
        </div>
        <div>
          <p className="text-sm text-[var(--color-muted)] mb-1 flex items-center gap-1">
            <FiCalendar /> Report Date
          </p>
          <p className="font-medium">{date}</p>
        </div>
      </div>
    </Card>
  );
};
