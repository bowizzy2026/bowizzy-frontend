
interface InterviewCardProps {
  interview: {
    id: string;
    title: string;
    experience: string;
    date: string;
    time: string;
    credits?: number;
    priority?: string;
  };
  isScheduled: boolean;
  onViewDetails: () => void;
}

const InterviewCard = ({ interview, isScheduled, onViewDetails }: InterviewCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-10 h-10" viewBox="0 0 80 80" fill="none">
            <path
              d="M30 50c-2.667-2.667-6.667-4-12-4s-9.333 1.333-12 4M50 30c2.667 2.667 6.667 4 12 4s9.333-1.333 12-4"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="18" cy="40" r="3" fill="white" />
            <circle cx="62" cy="40" r="3" fill="white" />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">
                INTERVIEW ID: {interview.id}
              </span>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded ${
                  interview.priority === "HIGH"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {interview.priority}
              </span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2">
            {interview.title} - {interview.experience}
          </h3>

          <p className="text-sm text-gray-600 mb-3">
            {interview.date} - {interview.time}
          </p>

          <div className="flex items-center justify-between">
            {isScheduled ? (
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition-colors">
                  Join Now
                </button>
                <button 
                  onClick={onViewDetails}
                  className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                  View Details
                </button>
                <button className="px-4 py-1.5 text-sm font-medium text-red-500 bg-white border border-gray-200 rounded hover:bg-red-50 transition-colors">
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={onViewDetails}
                className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default InterviewCard;