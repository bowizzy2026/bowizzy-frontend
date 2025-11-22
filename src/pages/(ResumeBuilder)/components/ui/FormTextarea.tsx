interface FormTextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  rows?: number;
  showAiButton?: boolean;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  rows = 4,
  showAiButton = false,
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs text-gray-600 font-medium">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 resize-none"
        />
        {showAiButton && (
          <button
            type="button"
            className="absolute bottom-3 right-3 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg flex items-center justify-center transition-shadow"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {/* Large star */}
              <path
                d="M12 2L13.5 7.5L19 9L13.5 10.5L12 16L10.5 10.5L5 9L10.5 7.5L12 2Z"
                fill="#1e1b4b"
              />
              {/* Small star top right */}
              <path
                d="M18 3L18.75 5.25L21 6L18.75 6.75L18 9L17.25 6.75L15 6L17.25 5.25L18 3Z"
                fill="#1e1b4b"
              />
              {/* Small star bottom right */}
              <path
                d="M19 14L19.5 15.5L21 16L19.5 16.5L19 18L18.5 16.5L17 16L18.5 15.5L19 14Z"
                fill="#1e1b4b"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};