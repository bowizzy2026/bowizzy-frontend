import { Plus } from 'lucide-react';

interface AddButtonProps {
  onClick: () => void;
  label: string;
}

export const AddButton: React.FC<AddButtonProps> = ({ onClick, label }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors"
    >
      <Plus size={18} />
      {label}
    </button>
  );
};