import { useState } from "react";
import { ArrowRight } from "lucide-react";
import DashNav from "@/components/dashnav/dashnav";
import { useNavigate } from "react-router-dom";

const InterviewPrep = () => {
  const navigate = useNavigate();

  // State to hold interview data - set to [] for empty state, or add data to show dashboard
  const [upcomingInterviews] = useState([
    {
      id: 1,
      type: "Mock Interview",
      date: "August 23rd 2025",
      time: "11:00 AM - 11:00 AM",
      status: "scheduled",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      type: "Job Role Interview",
      date: "August 28rd 2025",
      time: "11:00 AM - 12:00 PM",
      status: "scheduled",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      type: "Video Practice",
      date: "September 02nd 2025",
      time: "01:03 PM - 02:00 PM",
      status: "waiting",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
    {
      id: 4,
      type: "Mock Interview",
      date: "August 23rd 2025",
      time: "11:00 AM - 11:00 AM",
      status: "scheduled",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
    {
      id: 5,
      type: "Job Role Interview",
      date: "August 28rd 2025",
      time: "11:00 AM - 12:00 PM",
      status: "scheduled",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
    {
      id: 6,
      type: "Video Practice",
      date: "September 02nd 2025",
      time: "01:03 PM - 02:00 PM",
      status: "waiting",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
  ]);

  const [pastInterviews] = useState([
    {
      id: 1,
      type: "Mock Interview",
      completedDate: "August 18th, 2025",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      type: "Video Practice",
      completedDate: "August 7th, 2025",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      type: "Video Practice",
      completedDate: "August 18th, 2025",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
    {
      id: 4,
      type: "Mock Interview",
      date: "August 23rd 2025",
      time: "11:00 AM - 11:00 AM",
      status: "scheduled",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
    {
      id: 5,
      type: "Job Role Interview",
      date: "August 28rd 2025",
      time: "11:00 AM - 12:00 PM",
      status: "scheduled",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
    {
      id: 6,
      type: "Video Practice",
      date: "September 02nd 2025",
      time: "01:03 PM - 02:00 PM",
      status: "waiting",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
    },
  ]);

  // State to control "see all" expansion
  const [showAllUpcoming, setShowAllUpcoming] = useState(true);
  const [showAllPast, setShowAllPast] = useState(false);

  // Limit items shown initially
  const displayedUpcoming = showAllUpcoming
    ? upcomingInterviews
    : upcomingInterviews.slice(0, 3);
  const displayedPast = showAllPast
    ? pastInterviews
    : pastInterviews.slice(0, 3);

  // Empty State Component
  const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center bg-[#F0F0F0] px-4 sm:px-6 md:px-8">
      <div className="flex flex-col items-center w-full max-w-5xl">
        <h1 className="text-center mb-4 sm:mb-6 md:mb-10 px-2">
          <span className="text-[#3A3A3A] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal inline">
            Turn Interviews Into{" "}
          </span>
          <span className="text-[#FF8351] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal underline decoration-[#FF8351] decoration-2 underline-offset-4 inline">
            Opportunities
          </span>
        </h1>

        <p className="text-[#3A3A3A] text-sm sm:text-base md:text-lg lg:text-xl text-center mb-6 sm:mb-8 md:mb-10 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl px-2 leading-relaxed">
          Practice with AI-driven mock interviews, personalized to your resume
          and career goals.
        </p>

        <button
          onClick={() => navigate("/interview-prep/select")}
          className="flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-semibold text-sm sm:text-base transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
          }}
        >
          Get Started
          <ArrowRight size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );

  // Dashboard with Interviews
  const DashboardWithData = () => (
    <div className="flex-1 overflow-auto bg-[#F0F0F0] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Interviews */}
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#3A3A3A] text-lg font-semibold">
                  Upcoming Interview(s)
                </h2>
                <button
                  onClick={() => navigate("/interview-prep/select")}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-white text-sm font-semibold cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
                  }}
                >
                  + New Interview
                </button>
              </div>

              <div className="space-y-3">
                {displayedUpcoming.map((interview: any) => (
                  <div
                    key={interview.id}
                    className="flex gap-3 p-3 bg-white border border-[#E5E5E5] rounded-xl"
                  >
                    <img
                      src={interview.image}
                      alt={interview.type}
                      className="w-36 h-32 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[#3A3A3A] font-semibold text-base mb-1">
                          {interview.type}
                        </h3>
                        <p className="text-[#7F7F7F] text-sm mb-3">
                          Booked for {interview.date}, {interview.time}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {interview.status === "waiting" ? (
                            <div className="px-4 py-2 bg-[#FFF4E6] text-[#FF9D48] rounded-md text-sm font-medium whitespace-nowrap">
                              Waiting for confirmation
                            </div>
                          ) : (
                            <>
                              <button className="px-4 py-2 bg-[#4ADE80] text-white rounded-md text-sm font-medium hover:bg-green-500 cursor-pointer whitespace-nowrap">
                                Join Now
                              </button>
                              <button
                                onClick={() =>
                                  navigate(
                                    "/interview-prep/interview-details"
                                  )
                                }
                                className="px-4 py-2 bg-white border border-[#E5E5E5] text-[#3A3A3A] rounded-md text-sm font-medium hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                              >
                                View Details
                              </button>
                            </>
                          )}
                        </div>

                        <button className="px-4 py-2 bg-white border border-[#FFD4D4] text-[#FF6B6B] rounded-md text-sm font-medium hover:bg-red-50 cursor-pointer whitespace-nowrap">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {upcomingInterviews.length > 3 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                    className="text-[#FF8351] text-sm hover:underline"
                  >
                    {showAllUpcoming ? "show less" : "see all"}
                  </button>
                </div>
              )}
            </div>

            {/* Interview Stats */}
            <div className="bg-white rounded-2xl p-5">
              <h2 className="text-[#3A3A3A] text-lg font-semibold mb-4">
                Interview(s) given till now
              </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 justify-items-stretch">
                {[
                  {
                  icon: "👥",
                  count: "Mock Sessions",
                  label: "5 sessions",
                  bg: "bg-[#EDE7F6]",
                  iconBg: "bg-[#D1C4E9]",
                  },
                  {
                  icon: "🎥",
                  count: "Video Practice",
                  label: "7 sessions",
                  bg: "bg-[#E3F2FD]",
                  iconBg: "bg-[#BBDEFB]",
                  },
                  {
                  icon: "📄",
                  count: "Transcript",
                  label: "3 sessions",
                  bg: "bg-[#FFEBEE]",
                  iconBg: "bg-[#FFCDD2]",
                  },
                  // {
                  //   icon: "📋",
                  //   count: "2 sessions",
                  //   label: "Resume",
                  //   bg: "bg-[#E8F5E9]",
                  //   iconBg: "bg-[#C8E6C9]",
                  // },
                  {
                  icon: "💼",
                  count: "Job Role",
                  label: "4 sessions",
                  bg: "bg-[#FFF9C4]",
                  iconBg: "bg-[#FFF59D]",
                  },
                ].map((stat, idx) => (
                  <div
                  key={idx}
                  className={`${stat.bg} rounded-xl p-3 flex flex-col items-center justify-center min-h-[100px] w-full`}
                  >
                  <div
                    className={`w-10 h-10 ${stat.iconBg} rounded-full flex items-center justify-center text-xl mb-2`}
                  >
                    {stat.icon}
                  </div>
                  <p className="text-sm font-bold text-[#3A3A3A] mb-0.5">
                    {stat.count}
                  </p>
                  <p className="text-[10px] text-[#7F7F7F] text-center">
                    {stat.label}
                  </p>
                  </div>
                ))}
                </div>
            </div>

            {/* Offline Courses Banner */}
            <div className="bg-gradient-to-r from-[#FF9D48] to-[#FF8251] rounded-2xl p-6 text-white">
              <h3 className="text-xs font-semibold mb-2 uppercase tracking-wide">
                OFFLINE COURSES
              </h3>
              <p className="text-base mb-4 font-medium">
                Sharpen Your Professional Skill from Offline Courses at NammaQA
              </p>
              <button className="px-5 py-2 bg-white text-[#3A3A3A] rounded-lg text-sm font-semibold hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                Check it Out
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Sidebar - 1/3 width */}
          <div className="lg:col-span-1 space-y-6">
            {/* Past Performance */}
            <div className="bg-white rounded-2xl p-5">
              <h2 className="text-[#3A3A3A] text-lg font-semibold mb-4">
                Past Performance
              </h2>

              <div className="space-y-3">
                {displayedPast.map((interview: any) => (
                  <div
                    key={interview.id}
                    className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden"
                  >
                    <img
                      src={interview.image}
                      alt={interview.type}
                      className="w-full h-28 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-[#3A3A3A] font-semibold text-sm mb-1">
                        {interview.type}
                      </h3>
                      <p className="text-[#7F7F7F] text-xs mb-3">
                        Completed on {interview.completedDate}
                      </p>
                      <button className="w-full py-2 bg-white border border-[#FF9D48] text-[#FF9D48] rounded-lg text-xs font-semibold hover:bg-orange-50 cursor-pointer">
                        Review Feedback
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {pastInterviews.length > 3 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowAllPast(!showAllPast)}
                    className="text-[#FF8351] text-sm hover:underline"
                  >
                    {showAllPast ? "show less" : "see all"}
                  </button>
                </div>
              )}
            </div>

            {/* Create New Role */}
            <div className="bg-[#FFF9F5] rounded-2xl p-5">
              <h3 className="text-[#3A3A3A] text-xs font-semibold mb-2 uppercase tracking-wide">
                PREPARING FOR A NEW CAREER PATH?
              </h3>
              <p className="text-[#FF8351] text-lg font-bold mb-4 leading-tight">
                Create a New Role that ensures your resume, skills, and
                interview practice match the domain.
              </p>
              <button className="px-5 py-2 bg-white border-2 border-[#FF9D48] text-[#FF9D48] rounded-lg text-sm font-semibold hover:bg-orange-50 flex items-center gap-2 cursor-pointer">
                Create new role
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen font-['Baloo_2']">
      <DashNav heading="Interview Preparation" />

      {/* Conditional rendering based on whether there are interviews */}
      {upcomingInterviews.length === 0 ? <EmptyState /> : <DashboardWithData />}
    </div>
  );
};

export default InterviewPrep;
