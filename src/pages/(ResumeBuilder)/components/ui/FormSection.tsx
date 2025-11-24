import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { ToggleSwitch } from "./ToggleSwitch";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  showToggle?: boolean;
  showActions?: boolean;
  required?: boolean;
  isCollapsed?: boolean;
  onCollapseToggle?: () => void;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  enabled = true,
  onToggle,
  onRemove,
  onMoveUp,
  onMoveDown,
  showToggle = true,
  showActions = true,
  required = false,
  isCollapsed = false,
  onCollapseToggle,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">
          {title}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>

        <div className="flex items-center gap-2">
          {showToggle && onToggle && (
            <ToggleSwitch enabled={enabled} onChange={onToggle} />
          )}

          {showActions && (
            <>
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="w-7 h-7 flex items-center justify-center 
                             border border-gray-400 rounded-full 
                             text-gray-600 hover:text-red-500 
                             hover:border-red-500 transition-colors"
                >
                  <X size={14} strokeWidth={2.2} />
                </button>
              )}

              {onMoveUp && (
                <button
                  type="button"
                  onClick={onMoveUp}
                  className="w-7 h-7 flex items-center justify-center 
                             border border-gray-400 rounded-full 
                             text-gray-600 hover:text-gray-800 
                             hover:border-gray-600 transition-colors"
                >
                  <ChevronUp size={14} strokeWidth={2.2} />
                </button>
              )}

              {onMoveDown && (
                <button
                  type="button"
                  onClick={onMoveDown}
                  className="w-7 h-7 flex items-center justify-center 
                             border border-gray-400 rounded-full 
                             text-gray-600 hover:text-gray-800 
                             hover:border-gray-600 transition-colors"
                >
                  <ChevronDown size={14} strokeWidth={2.2} />
                </button>
              )}
            </>
          )}

          {onCollapseToggle && (
            <button
              type="button"
              onClick={onCollapseToggle}
              className="w-7 h-7 flex items-center justify-center 
                         border border-gray-400 rounded-full 
                         text-gray-600 hover:text-gray-800 
                         hover:border-gray-600 transition-colors"
            >
              {isCollapsed ? (
                <ChevronDown size={14} strokeWidth={2.2} />
              ) : (
                <ChevronUp size={14} strokeWidth={2.2} />
              )}
            </button>
          )}
        </div>
      </div>

      {enabled && !isCollapsed && <div className="p-4">{children}</div>}
    </div>
  );
};
