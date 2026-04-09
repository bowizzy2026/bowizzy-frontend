import DashNav from "@/components/dashnav/dashnav";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InterviewPrepSelection = () => {
  const navigate = useNavigate();

  const prepOptions = [
    {
      title: "Mock Interview",
      description:
        "Book a live session with a real interviewer and receive personalized real-time feedback.",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop",
      route: "/interview-prep/mock-interview",
    },
    {
      title: "Video Practice",
      description:
        "Simulate a real video interview with timed questions. Record answers and get instant feedback.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
      route: "/interview-prep/video-practice",
    },
    {
      title: "Transcript",
      description:
        "Practice common questions by speaking aloud in Mic. Improve clarity, tone, and confidence.",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
      route: "/interview-prep/transcript",
    },
    
    {
      title: "Job Role",
      description:
        "Get role-specific interview questions. Understand and exact focus your career path demands.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
      route: "/interview-prep/job-role",
    },
  ];

  return (
    <div className="flex flex-col h-screen font-['Baloo_2']">
      <DashNav heading="Interview Preparation" />

      <div className="flex-1 overflow-y-auto bg-[#F0F0F0] p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <h2 className="text-[#3A3A3A] text-lg sm:text-xl font-medium mb-4">
            How would you like to prepare for interview?
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-3 mb-6">
            {prepOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                style={{ minWidth: 0 }}
              >
                <div className="h-50 overflow-hidden">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-[#3A3A3A] font-semibold text-base sm:text-lg mb-2">
                    {option.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#3A3A3A] text-xs sm:text-sm leading-relaxed mb-3 flex-1">
                    {option.description}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => navigate(option.route)}
                    className="w-full py-1.5 rounded-md text-white text-xs sm:text-sm font-semibold transition-transform hover:scale-102 cursor-pointer mt-auto"
                    style={{
                      background:
                        "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
                    }}
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Career Path and Offline Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Career Path */}
            <div className="bg-white rounded-md p-8">
              <h3 className="text-sm sm:text-base font-semibold text-[#3A3A3A] uppercase tracking-wide mb-2">
                PREPARING FOR A NEW CAREER PATH?
              </h3>
              <h4 className="text-[#FF8351] text-base sm:text-lg font-medium mb-2">
                Create a New Role that ensures your resume, skills, and
                interview practice match the domain.
              </h4>
              <p className="text-[#3A3A3A] text-xs sm:text-sm mb-3">
                You have the option to select role at the time of opting for any
                interview.
              </p>
              <button
                className="flex items-center gap-2 px-4 py-1.5 rounded-md text-white text-xs sm:text-sm font-semibold transition-transform hover:scale-102 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
                }}
              >
                Create new role
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Offline Courses */}
            <div
              className="rounded-md p-3"
              style={{
                background: "linear-gradient(135deg, #FF9D48 0%, #FF8251 100%)",
              }}
            >
              <h3 className="text-white text-xs sm:text-sm font-semibold uppercase tracking-wide mb-1">
                OFFLINE COURSES
              </h3>
              <h4 className="text-white text-base sm:text-lg font-medium mb-4">
                Sharpen Your Professional Skill from Offline Courses at NammaQA
              </h4>
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white text-[#FF8251] text-xs sm:text-sm font-semibold transition-transform hover:scale-102 cursor-pointer mt-auto">
                Check it Out
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Community Banner */}
          <div
            className="rounded-md p-4 flex items-center justify-between flex-wrap gap-2"
            style={{
              background: "linear-gradient(90deg, #FFE8C8 0%, #FFEFD8 100%)",
            }}
          >
            <p className="text-[#3A3A3A] text-sm sm:text-base font-medium">
              One IT Community, Endless Opportunities - NammaQA Community
            </p>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white text-[#FF8251] text-xs sm:text-sm font-semibold transition-transform hover:scale-102 cursor-pointer mt-auto">
              Join Now
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrepSelection;
