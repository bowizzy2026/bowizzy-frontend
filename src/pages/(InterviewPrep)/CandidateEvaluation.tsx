import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import DashNav from "@/components/dashnav/dashnav";
import api from "@/api";

const SkillBadge = ({ skill }: { skill: string }) => (
  <div className="flex flex-col items-center bg-white w-[140px] pb-[1px] rounded-lg">
    <span className="text-[#3A3A3A] text-base">{skill}</span>
  </div>
);

const RatingSection = React.memo(
  ({
    title,
    description,
    category,
    ratings,
    comments,
    handleRatingChange,
    handleCommentChange,
  }: {
    title: string;
    description: string;
    category: string;
    ratings: Record<string, number>;
    comments: Record<string, string>;
    handleRatingChange: (category: string, value: number) => void;
    handleCommentChange: (category: string, value: string) => void;
  }) => (
    <div className="flex flex-col items-start self-stretch bg-white py-5 mb-6 rounded-lg border border-solid border-[#CACACA]">
      <div className="flex flex-col items-start mb-3 ml-5">
        <span className="text-[#3A3A3A] text-lg font-medium">{title}</span>
      </div>
      <div className="flex flex-col items-start mb-4 ml-5">
        <span className="text-[#7F7F7F] text-sm leading-relaxed">{description}</span>
      </div>
      <div className="flex items-center self-stretch mb-4 mx-5">
        <div className="flex flex-col items-center mr-4">
          <span className="text-[#3A3A3A] text-sm font-medium">
            RATE: <span className="text-red-500">*</span>
          </span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRatingChange(category, value)}
              className={`flex items-center justify-center w-8 h-8 rounded border border-solid transition-all ${
                ratings[category] === value
                  ? "bg-[#FFF0E3] border-[#F26D3A] text-[#F26D3A]"
                  : "bg-white border-[#CACACA] text-[#3A3A3A]"
              }`}
            >
              <span className="text-sm font-medium">{value}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start self-stretch mx-5">
        <span className="text-[#3A3A3A] text-sm font-medium mb-2">
          Comments <span className="text-red-500">*</span>
        </span>
        <textarea
          value={comments[category] || ""}
          onChange={(e) => handleCommentChange(category, e.target.value)}
          placeholder="Type your comments here!!"
          className="w-full h-20 pt-2 px-3 rounded border border-solid border-[#CACACA] text-[#3A3A3A] text-sm resize-none focus:outline-none focus:border-[#F26D3A]"
        />
      </div>
    </div>
  )
);

const CandidateEvaluation = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const passedInterview = (location.state as any)?.interview;

  const [interviewData, setInterviewData] = useState({
    id: passedInterview?.id || "#12345",
    name: passedInterview?.title || "Interview Name",
    candidateProfile: passedInterview?.job_role || "Python Developer",
    candidateName: "Loading...",
    experience: { years: 1, months: 2 },
    date: passedInterview?.date || "31 AUG 2025",
    time: passedInterview?.time || "03:00 PM - 04:00 PM",
    primarySkills: passedInterview?.skills || ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    secondarySkills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7"],
  });
  const [isLoadingInterview, setIsLoadingInterview] = useState(true);
  const [interviewError, setInterviewError] = useState<string | null>(null);

  // Fetch interview data based on scheduleId
  useEffect(() => {
    const fetchInterviewData = async () => {
      setIsLoadingInterview(true);
      setInterviewError(null);
      try {
        const parsed = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = parsed?.user_id || parsed?.userId || parsed?.id;
        const token = parsed?.token || localStorage.getItem("token") || "";

        if (!userId || !scheduleId) {
          setInterviewError("Missing user ID or schedule ID");
          setIsLoadingInterview(false);
          return;
        }

        const res = await api.get(
          `/users/${userId}/mock-interview/interview-schedule/${scheduleId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        const data = res?.data ?? res;
        const interview_slot = data?.interview_slot || {};
        const candidate = data?.candidate || {};
        const personal_details = candidate?.personal_details || {};

        // Extract candidate name
        const candidateName = `${personal_details?.first_name || ""} ${personal_details?.last_name || ""}`.trim();

        // Extract experience from interview_slot
        const experienceStr = interview_slot?.experience || "0 years 0 months";
        const experienceParts = experienceStr.split(" ");
        const years = parseInt(experienceParts[0]) || 0;
        const months = parseInt(experienceParts[2]) || 0;

        setInterviewData({
          id: String(data?.interview_schedule_id || passedInterview?.id || "#12345"),
          name: interview_slot?.job_role || passedInterview?.title || "Interview Name",
          candidateProfile: interview_slot?.job_role || passedInterview?.job_role || "Python Developer",
          candidateName,
          experience: { years, months },
          date:
            passedInterview?.date ||
            new Date(interview_slot?.start_time_utc || "").toLocaleDateString(
              undefined,
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            ),
          time:
            passedInterview?.time ||
            `${new Date(
              interview_slot?.start_time_utc || ""
            ).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })} - ${new Date(
              interview_slot?.end_time_utc || ""
            ).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}`,
          primarySkills: (interview_slot?.skills || []) as string[],
          secondarySkills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7"],
        });
      } catch (err) {
        console.error("Failed to fetch interview data:", err);
        setInterviewError(
          (err as Error)?.message || "Failed to load interview data"
        );
      } finally {
        setIsLoadingInterview(false);
      }
    };

    if (scheduleId) {
      fetchInterviewData();
    }
  }, [scheduleId, passedInterview?.id, passedInterview?.title, passedInterview?.job_role, passedInterview?.date, passedInterview?.time]);

  const [ratings, setRatings] = useState({
    communication: 0,
    technicalKnowledge: 0,
    problemSolving: 0,
    relevantExperience: 0,
    adaptability: 0,
    culturalFit: 0,
    overall: 0,
  });

  const [comments, setComments] = useState({
    communication: "",
    technicalKnowledge: "",
    problemSolving: "",
    relevantExperience: "",
    adaptability: "",
    culturalFit: "",
    overall: "",
    final: "",
  });

  const [recommendation, setRecommendation] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleCommentChange = (category: string, value: string) => {
    setComments((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    setValidationError(null);

    // Validate all ratings are filled (must be > 0)
    const allRatingsFilled = Object.values(ratings).every((rating) => rating > 0);
    if (!allRatingsFilled) {
      setValidationError("All rating fields are mandatory. Please rate all categories.");
      return;
    }

    // Validate all comments are filled
    const allCommentsFilled =
      comments.communication.trim() !== "" &&
      comments.technicalKnowledge.trim() !== "" &&
      comments.problemSolving.trim() !== "" &&
      comments.relevantExperience.trim() !== "" &&
      comments.adaptability.trim() !== "" &&
      comments.culturalFit.trim() !== "" &&
      comments.overall.trim() !== "" &&
      comments.final.trim() !== "";

    if (!allCommentsFilled) {
      setValidationError("All comment fields are mandatory. Please provide feedback for all categories.");
      return;
    }

    // Validate recommendation is selected
    if (!recommendation) {
      setValidationError("Final recommendation is mandatory. Please select one.");
      return;
    }

    // Create payload according to API structure
    const evaluationPayload = {
      interview_schedule_id: parseInt(scheduleId || "0"),
      communication_skills: comments.communication,
      technical_knowledge: comments.technicalKnowledge,
      problem_solving_analytical_skills: comments.problemSolving,
      relevant_experience_skills: comments.relevantExperience,
      adaptability_learning_ability: comments.adaptability,
      cultural_team_fit: comments.culturalFit,
      overall_impression: comments.overall,
      final_comments: comments.final,
      final_recommendation: recommendation,
      communication_skills_rating: ratings.communication,
      technical_knowledge_rating: ratings.technicalKnowledge,
      problem_solving_analytical_skills_rating: ratings.problemSolving,
      relevant_experience_skills_rating: ratings.relevantExperience,
      adaptability_learning_ability_rating: ratings.adaptability,
      cultural_team_fit_rating: ratings.culturalFit,
      overall_impression_rating: ratings.overall,
    };

    setIsSubmitting(true);
    try {
      const parsed = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = parsed?.user_id || parsed?.userId || parsed?.id;
      const token = parsed?.token || localStorage.getItem("token") || "";

      if (!userId) {
        setValidationError("User ID not found. Please login again.");
        setIsSubmitting(false);
        return;
      }

      const response = await api.post(
        `/users/${userId}/mock-interview/candidate-review`,
        evaluationPayload,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      console.log("Candidate Evaluation submitted successfully:", response.data);
      alert("Candidate Evaluation submitted successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Failed to submit candidate evaluation:", err);
      setValidationError(
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "Failed to submit evaluation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col h-screen font-['Baloo_2'] overflow-hidden">
      <DashNav heading="Candidate Evaluation" />
      <div className="flex-1 overflow-auto bg-[#F5F5F5] p-4 lg:p-8">
        <div className="max-w-7xl mx-auto w-full">
          {isLoadingInterview ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-600 text-lg">Loading interview details...</p>
            </div>
          ) : interviewError ? (
            <div className="flex items-center justify-center h-64">
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <p className="text-red-700 font-medium">{interviewError}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-[20px] mb-6 shadow-sm">
                <div className="pt-5 pb-8">
                  <div className="flex flex-col items-start mb-5 ml-5">
                    <span className="text-[#F26D3A] text-xl font-semibold">
                      Interview ID: {interviewData.id}
                    </span>
                  </div>
                  <div className="border-t border-[#DEDEDE] mx-5 mb-5"></div>
                  <div className="flex flex-wrap items-center mb-5 gap-3 ml-7">
                    <span className="text-black text-xl">Candidate Name:</span>
                    <span className="text-black text-xl font-semibold">
                      {interviewData.candidateName}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between mb-5 mx-7">
                    <div className="flex items-center gap-2">
                      <span className="text-black text-lg">Job Role:</span>
                      <span className="text-black text-lg font-semibold">
                        {interviewData.candidateProfile}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-black text-lg">Experience:</span>
                      <span className="text-black text-lg font-semibold">
                        {interviewData.experience.years} Year(s), {interviewData.experience.months} Month(s)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between items-center mb-5 mx-7 gap-4">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                          stroke="#3A3A3A"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-black text-base">{interviewData.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="#3A3A3A"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 6V12L16 14"
                          stroke="#3A3A3A"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-black text-base">{interviewData.time}</span>
                    </div>
                  </div>
                  <div className="border-t border-[#DEDEDE] mx-5 mb-5"></div>
                  <div className="px-5">
                    <div className="mb-5">
                      <span className="block text-black text-base mb-3">Skills</span>
                      <div className="flex flex-wrap gap-3">
                        {(interviewData.primarySkills && interviewData.primarySkills.length > 0
                          ? interviewData.primarySkills
                          : ["Skill 1", "Skill 2", "Skill 3"]
                        ).map((skill, i) => (
                          <SkillBadge key={i} skill={skill} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[20px] shadow-sm p-5">
            <span className="text-[#3A3A3A] text-lg font-medium mb-5 block">
              CANDIDATE EVALUATION
            </span>
            {validationError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{validationError}</p>
              </div>
            )}
            <RatingSection
              title="1. Communication Skills"
              description="Ability to clearly articulate thoughts, listening skills and response relevance, confidence in communication"
              category="communication"
              ratings={ratings}
              comments={comments}
              handleRatingChange={handleRatingChange}
              handleCommentChange={handleCommentChange}
            />
            <RatingSection
              title="2. Technical Knowledge"
              description="Understanding of key technical concepts related to the role, depth of knowledge in relevant technologies, ability to discuss technical topics"
              category="technicalKnowledge"
              ratings={ratings}
              comments={comments}
              handleRatingChange={handleRatingChange}
              handleCommentChange={handleCommentChange}
            />
            <RatingSection
              title="3. Problem-Solving and Analytical Skills"
              description="Ability to break down problems and apply logical thinking, quality of solutions or suggestions provided, approach to handling challenging questions"
              category="problemSolving"
              ratings={ratings}
              comments={comments}
              handleRatingChange={handleRatingChange}
              handleCommentChange={handleCommentChange}
            />
            <RatingSection
              title="4. Relevant Experience and Skills"
              description="Fit based on previous experience in similar roles, technical skills match the role requirements, breadth of knowledge in relevant areas"
              category="relevantExperience"
              ratings={ratings}
              comments={comments}
              handleRatingChange={handleRatingChange}
              handleCommentChange={handleCommentChange}
            />
            <RatingSection
              title="5. Adaptability and Learning Ability"
              description="Willingness to learn and improve, ability to quickly grasp new ideas or concepts, adaptability to changes or new challenges"
              category="adaptability"
              ratings={ratings}
              comments={comments}
              handleRatingChange={handleRatingChange}
              handleCommentChange={handleCommentChange}
            />
            <RatingSection
              title="6. Cultural and Team Fit"
              description="Alignment with company values and culture, collaboration and teamwork potential, attitude, enthusiasm, and professionalism"
              category="culturalFit"
              ratings={ratings}
              comments={comments}
              handleRatingChange={handleRatingChange}
              handleCommentChange={handleCommentChange}
            />
            <RatingSection
              title="7. Overall Impression"
              description="General ability to succeed in this role, confidence in the candidate's fit for the company, overall performance during the interview"
              category="overall"
              ratings={ratings}
              comments={comments}
              handleRatingChange={handleRatingChange}
              handleCommentChange={handleCommentChange}
            />
            <div className="flex flex-col bg-white py-5 mb-6 rounded-lg border border-solid border-[#CACACA]">
              <div className="ml-5 mb-3">
                <span className="text-[#3A3A3A] text-lg font-medium">
                  FINAL COMMENTS <span className="text-red-500">*</span>
                </span>
              </div>
              <div className="mx-5">
                <span className="text-[#7F7F7F] text-sm block mb-2">
                  Please provide any additional comments or suggestions if you have about the candidate.
                </span>
                <textarea
                  value={comments.final || ""}
                  onChange={(e) => handleCommentChange("final", e.target.value)}
                  placeholder="Type your comments here!!"
                  className="w-full h-20 pt-2 px-3 rounded border border-solid border-[#CACACA] text-[#3A3A3A] text-sm resize-none focus:outline-none focus:border-[#F26D3A]"
                />
              </div>
            </div>
            <div className="flex flex-col bg-white py-5 mb-6 rounded-lg border border-solid border-[#CACACA]">
              <div className="ml-5 mb-3">
                <span className="text-[#3A3A3A] text-lg font-medium">
                  FINAL RECOMMENDATION FOR JOB ROLE
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </div>
              <div className="text-[#7F7F7F] text-sm block mb-4 ml-5">
                (This will not be shown to the candidate.)
              </div>
              <div className="mx-5 flex flex-wrap gap-3">
                {[
                  { value: "highly_recommend", label: "Highly Recommend" },
                  { value: "recommend", label: "Recommend" },
                  { value: "neutral", label: "Neutral" },
                  { value: "not_recommend", label: "Not Recommend" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRecommendation(option.value)}
                    className={`px-6 py-2 rounded border-2 font-medium transition-all ${
                      recommendation === option.value
                        ? "bg-[#FFF0E3] border-[#F26D3A] text-[#F26D3A]"
                        : "bg-white border-[#CACACA] text-[#3A3A3A] hover:border-[#F26D3A]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-2 bg-[#F26D3A] text-white rounded text-base font-medium hover:bg-[#E05C29] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateEvaluation;
