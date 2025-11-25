import  { useState } from "react";
import DashNav from "@/components/dashnav/dashnav";

const CandidateInformationConnect = () => {
  // Mock data structure - ready for API integration
  const [interviewData, setInterviewData] = useState({
    interviewId: "#12345",
    role: "Python Developer",
    yearsExp: 1,
    monthsExp: 2,
    selectedDate: "31 AUG 2025",
    selectedTime: "03:00 PM - 04:00 PM",
    primarySkills: [
      "Skill 1",
      "Skill 2",
      "Skill 3",
      "Skill 4",
      "Skill 5",
      "Skill 5",
      "Skill 6",
      "Skill 7",
    ],
    secondarySkills: [
      "Skill 1",
      "Skill 2",
      "Skill 3",
      "Skill 4",
      "Skill 5",
      "Skill 5",
      "Skill 6",
      "Skill 7",
    ],
    credits: 15,
    isVerified: true,
  });

  const [savedInterviews] = useState([
    {
      id: "#12345",
      role: "Python Developer",
      experience: "12 Years Experience",
      date: "31 AUG 2025",
      time: "03:00 PM",
      status: "active",
    },
    {
      id: "#12345",
      role: "Python Developer",
      experience: "12 Years Experience",
      date: "31 AUG 2025",
      time: "03:00 PM",
      status: "completed",
    },
    {
      id: "#12345",
      role: "Python Developer",
      experience: "12 Years Experience",
      date: "31 AUG 2025",
      time: "03:00 PM",
      status: "completed",
    },
    {
      id: "#12345",
      role: "Python Developer",
      experience: "12 Years Experience",
      date: "31 AUG 2025",
      time: "03:00 PM",
      status: "completed",
    },
  ]);

  const [credits] = useState(100);

  const handleCancelInterview = () => {
    console.log("Cancel interview");
  };

  const handleViewDetails = (interviewId) => {
    console.log("View details:", interviewId);
  };

  const handleRemoveInterview = (interviewId) => {
    console.log("Remove interview:", interviewId);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F5] font-['Baloo_2']">
      <DashNav heading="Give Mock Interview" />

      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex gap-6">
            {/* Left Section - Interview Details */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm ">
                {/* Header with Connect Button */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E5E5]">
                  <h2 className="text-[#FF8351] text-sm font-semibold uppercase tracking-wider">
                    INTERVIEW ID: {interviewData.interviewId}
                  </h2>
                  <button
                    className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
                    }}
                  >
                    Connect Now
                  </button>
                </div>

                {/* Role */}
                <div className="mb-2">
                  <h3 className="text-[#1A1A1A] text-2xl font-semibold">
                    {interviewData.role}
                  </h3>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <p className="text-[#1A1A1A] text-base">
                    Experience: {interviewData.yearsExp} Year(s),{" "}
                    {interviewData.monthsExp} Month(s)
                  </p>
                </div>

                {/* Date and Time */}
                <div className="flex items-center gap-12 mb-8 pb-8 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-3 text-[#1A1A1A]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span className="font-normal text-base">
                      {interviewData.selectedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[#1A1A1A]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span className="font-normal text-base">
                      {interviewData.selectedTime}
                    </span>
                  </div>
                </div>

                {/* Primary Skills */}
                <div className="mb-8 pb-8 border-b border-[#E5E5E5]">
                  <h3 className="text-[#666666] text-xs font-semibold uppercase tracking-wider mb-4">
                    PRIMARY SKILLS TO EVALUATE
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {interviewData.primarySkills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg px-6 py-2.5 text-[#1A1A1A] text-sm"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secondary Skills */}
                <div className="mb-8 pb-8 border-b border-[#E5E5E5]">
                  <h3 className="text-[#666666] text-xs font-semibold uppercase tracking-wider mb-4">
                    SECONDARY SKILLS TO EVALUATE
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {interviewData.secondarySkills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg px-6 py-2.5 text-[#1A1A1A] text-sm"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credits Display */}
                <div className="flex items-center justify-end mb-8">
                  <span className="text-[#1A1A1A] text-lg font-medium">
                    {interviewData.credits} Credits
                  </span>
                </div>

                {/* Cancel Interview Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleCancelInterview}
                    className="px-12 py-3 bg-white border-2 border-[#FF8351] text-[#FF8351] rounded-lg text-base font-semibold hover:bg-[#FFF9F5] transition-colors"
                  >
                    Cancel Interview
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section - Saved Interviews & Status */}
            <div className="space-y-3">
              {/* Verification Status Card */}
              <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#4CAF50] ring-4 ring-[#C8E6C9] flex-shrink-0"></div>
                  <span className="text-[#1A1A1A] text-sm font-medium">
                    You are verified as Interviewer
                  </span>
                </div>
              </div>

              {/* Credits Card */}
              <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm">
                {/* Credits Display */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">W</span>
                  </div>
                  <span className="text-[#1A1A1A] text-sm font-medium">
                    {credits} Credit(s) available   
                  </span>
                </div>

                {/* Redeem Link */}
                
                <div className="flex justify-end">
                  <button className="text-[#007BFF] text-sm font-medium hover:underline">
                    Redeem in store →
                  </button>
                </div>

              </div>

              {/* Saved Interviews List */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-[#FF8351] text-base font-semibold mb-5">
                  Saved Interview(s)
                </h3>

                <div className="space-y-4">
                  {savedInterviews.map((interview, idx) => (
                    <div
                      key={idx}
                      className="border border-[#E5E5E5] rounded-xl p-4"
                    >
                      {/* Status Indicator */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[#999999] text-[11px] font-medium uppercase tracking-wide">
                          INTERVIEW ID: {interview.id}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            interview.status === "active"
                              ? "bg-[#FF6B6B]"
                              : "bg-[#4CAF50]"
                          }`}
                        ></div>
                      </div>

                      {/* Role */}
                      <h4 className="text-[#1A1A1A] text-base font-semibold mb-1">
                        {interview.role}
                      </h4>

                      {/* Experience */}
                      <p className="text-[#666666] text-sm mb-3">
                        {interview.experience}
                      </p>

                      {/* Date and Time */}
                      <div className="flex items-center justify-between text-[11px] text-[#999999] mb-4">
                        <span>{interview.date}</span>
                        <span>{interview.time}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(interview.id)}
                          className="flex-1 py-2 bg-[#F5F5F5] text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#EBEBEB] transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleRemoveInterview(interview.id)}
                          className="flex-1 py-2 bg-[#F5F5F5] text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#EBEBEB] transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateInformationConnect;
