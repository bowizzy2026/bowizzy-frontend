import React, { useState } from 'react';
import ProfileStepper from './components/ProfileStepper';
import PersonalDetailsForm from './components/forms/PersonalDetailsForm';
import EducationDetailsForm from './components/forms/EducationDetailsForm';
import ExperienceDetailsForm from './components/forms/ExperienceDetailsForm';
import ProjectsForm from './components/forms/ProjectsForm';
import SkillsLinksForm from './components/forms/SkillsLinksForm';
import CertificationsForm from './components/forms/CertificationsForm';
import ResumePreview from './components/resume/ResumePreview';
import { initialResumeData } from "../../types/resume";
import type { ResumeData } from '../../types/resume';
import DashNav from "@/components/dashnav/dashnav";

interface ResumeEditorProps {
  templateId?: string;
  existingData?: ResumeData;
  onSave?: (data: ResumeData) => void;
}

const steps = [
  'Personal',
  'Education',
  'Experience',
  'Projects',
  'Skills & Links',
  'Certification',
];

const stepTitles = [
  'Step 1: Personal Details',
  'Step 2: Education Details',
  'Step 3: Experience',
  'Step 4: Projects',
  'Step 5: Skill(s) & Link(s)',
  'Step 6: Certification',
];

const nextButtonLabels = [
  'Proceed to Education',
  'Proceed to Experience',
  'Proceed to Projects',
  'Proceed to Skill(s) & Link(s)',
  'Proceed to Certification',
  'Preview Resume',
];

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  templateId,
  existingData,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>(existingData || initialResumeData);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - Preview Resume
      onSave?.(resumeData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersonalData = (data: typeof resumeData.personal) => {
    setResumeData({ ...resumeData, personal: data });
  };

  const updateEducationData = (data: typeof resumeData.education) => {
    setResumeData({ ...resumeData, education: data });
  };

  const updateExperienceData = (data: typeof resumeData.experience) => {
    setResumeData({ ...resumeData, experience: data });
  };

  const updateProjectsData = (data: typeof resumeData.projects) => {
    setResumeData({ ...resumeData, projects: data });
  };

  const updateSkillsLinksData = (data: typeof resumeData.skillsLinks) => {
    setResumeData({ ...resumeData, skillsLinks: data });
  };

  const updateCertificationsData = (data: typeof resumeData.certifications) => {
    setResumeData({ ...resumeData, certifications: data });
  };

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalDetailsForm
            data={resumeData.personal}
            onChange={updatePersonalData}
          />
        );
      case 1:
        return (
          <EducationDetailsForm
            data={resumeData.education}
            onChange={updateEducationData}
          />
        );
      case 2:
        return (
          <ExperienceDetailsForm
            data={resumeData.experience}
            onChange={updateExperienceData}
          />
        );
      case 3:
        return (
          <ProjectsForm
            data={resumeData.projects}
            onChange={updateProjectsData}
          />
        );
      case 4:
        return (
          <SkillsLinksForm
            data={resumeData.skillsLinks}
            onChange={updateSkillsLinksData}
          />
        );
      case 5:
        return (
          <CertificationsForm
            data={resumeData.certifications}
            onChange={updateCertificationsData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Baloo_2'] overflow-hidden">
      <DashNav heading="Resume Builder" />
      
      {/* Main Content with 4px gap and white rounded background */}
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="flex-1 flex flex-col bg-white rounded-lg overflow-hidden">
          {/* Stepper */}
          <div className="bg-white">
            <ProfileStepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              validationErrors={validationErrors}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Form Panel - Complete scroll with hidden scrollbar */}
            <div className="flex-1 lg:w-[50%] overflow-auto scrollbar-hide">
              <div className="p-4 md:p-6">
                {/* Step Title */}
                <h2 className="text-lg font-semibold text-[#1A1A43] mb-5">
                  {stepTitles[currentStep]}
                </h2>

                {/* Form Content */}
                <div className="mb-6">
                  {renderCurrentForm()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-center gap-4 py-4">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-6 py-2.5 text-sm font-medium text-orange-500 bg-white border border-orange-400 rounded-full hover:bg-orange-50 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-orange-400 rounded-full hover:bg-orange-500 transition-colors"
                  >
                    {nextButtonLabels[currentStep]}
                  </button>
                </div>
              </div>
            </div>

            {/* Resume Preview Panel with border on all sides */}
            <div className="hidden lg:flex lg:w-[50%] bg-white overflow-auto scrollbar-hide">
              <div className="flex-1 p-4 overflow-auto scrollbar-hide border border-gray-300 m-4 rounded-lg">
                <ResumePreview
                  data={resumeData}
                  currentPage={currentPage}
                  totalPages={2}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add custom CSS to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ResumeEditor;