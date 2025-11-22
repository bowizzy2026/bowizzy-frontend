import React from 'react';
import type { SkillsLinksDetails, Skill } from 'src/types/resume';
import { FormInput, FormSelect, FormTextarea, FormSection, AddButton, ToggleSwitch } from '@/pages/(ResumeBuilder)/components/ui';
import { X } from 'lucide-react';

interface SkillsLinksFormProps {
  data: SkillsLinksDetails;
  onChange: (data: SkillsLinksDetails) => void;
}

const skillLevels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' },
];

export const SkillsLinksForm: React.FC<SkillsLinksFormProps> = ({ data, onChange }) => {
  // Collapse state for each section
  const [skillsCollapsed, setSkillsCollapsed] = React.useState(false);
  const [linksCollapsed, setLinksCollapsed] = React.useState(false);
  const [technicalSummaryCollapsed, setTechnicalSummaryCollapsed] = React.useState(false);

  // Validation errors state
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  // Validation functions
  const validateSkillName = (value: string) => {
    if (value && !/^[a-zA-Z0-9\s.+#-]+$/.test(value)) {
      return "Invalid characters in skill name";
    }
    return "";
  };

  const validateUrl = (value: string, type: string) => {
    if (!value) return "";
    
    // Basic URL format validation
    const urlPattern = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([\w\-\.,@?^=%&:/~\+#]*[\w\-@?^=%&/~\+#])?$/;
    
    if (!urlPattern.test(value)) {
      return `Invalid ${type} URL format`;
    }

    // Specific validation for LinkedIn
    if (type === "LinkedIn" && value && !value.includes("linkedin.com")) {
      return "Please enter a valid LinkedIn URL";
    }

    // Specific validation for GitHub
    if (type === "GitHub" && value && !value.includes("github.com")) {
      return "Please enter a valid GitHub URL";
    }

    return "";
  };

  const updateSkill = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      skills: data.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });

    // Validate skill name
    if (field === "skillName") {
      const error = validateSkillName(value);
      setErrors((prev) => ({ ...prev, [`skill-${id}-skillName`]: error }));
    }
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      skillName: '',
      skillLevel: '',
    };
    onChange({
      ...data,
      skills: [...data.skills, newSkill],
    });
  };

  const removeSkill = (id: string) => {
    if (data.skills.length > 1) {
      onChange({
        ...data,
        skills: data.skills.filter((skill) => skill.id !== id),
      });
      // Clear errors for removed skill
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`skill-${id}-skillName`];
        return newErrors;
      });
    }
  };

  const updateLink = (field: string, value: string) => {
    onChange({
      ...data,
      links: { ...data.links, [field]: value },
    });

    // Validate URLs
    if (field === "linkedinProfile") {
      const error = validateUrl(value, "LinkedIn");
      setErrors((prev) => ({ ...prev, [`link-linkedinProfile`]: error }));
    } else if (field === "githubProfile") {
      const error = validateUrl(value, "GitHub");
      setErrors((prev) => ({ ...prev, [`link-githubProfile`]: error }));
    } else if (field === "portfolioUrl") {
      const error = validateUrl(value, "Portfolio");
      setErrors((prev) => ({ ...prev, [`link-portfolioUrl`]: error }));
    } else if (field === "publicationUrl") {
      const error = validateUrl(value, "Publication");
      setErrors((prev) => ({ ...prev, [`link-publicationUrl`]: error }));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Skills Section */}
      <FormSection
        title="Skills"
        required
        showToggle={false}
        showActions={true}
        isCollapsed={skillsCollapsed}
        onCollapseToggle={() => setSkillsCollapsed(!skillsCollapsed)}
      >
        {data.skills.map((skill, index) => (
          <div key={skill.id} className={`${index > 0 ? 'mt-4' : ''}`}>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <FormInput
                  label="Skill"
                  placeholder="Enter Skill Name..."
                  value={skill.skillName}
                  onChange={(v) => updateSkill(skill.id, 'skillName', v)}
                  error={errors[`skill-${skill.id}-skillName`]}
                />
              </div>
              <div className="flex-1">
                <FormSelect
                  label="Skill Level"
                  placeholder="Select Skill level"
                  value={skill.skillLevel}
                  onChange={(v) => updateSkill(skill.id, 'skillLevel', v)}
                  options={skillLevels}
                />
              </div>
              {data.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors mb-1"
                >
                  <X size={18} />
                </button>
              )}
              <div className="mb-1">
                <ToggleSwitch enabled={true} onChange={() => {}} />
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-4">
          <button
            type="button"
            onClick={addSkill}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium text-sm"
          >
            <span className="text-lg">+</span> Add Skill
          </button>
        </div>
      </FormSection>

      {/* Links Section */}
      <FormSection
        title="Links"
        showToggle={true}
        enabled={data.linksEnabled}
        onToggle={(enabled) => onChange({ ...data, linksEnabled: enabled })}
        showActions={true}
        isCollapsed={linksCollapsed}
        onCollapseToggle={() => setLinksCollapsed(!linksCollapsed)}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <FormInput
                label="LinkedIn Profile"
                placeholder="Enter LinkedIn profile link..."
                value={data.links.linkedinProfile}
                onChange={(v) => updateLink('linkedinProfile', v)}
                error={errors[`link-linkedinProfile`]}
              />
            </div>
            <div className="mt-5">
              <ToggleSwitch enabled={true} onChange={() => {}} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <FormInput
                label="GitHub Profile"
                placeholder="Enter Github profile link..."
                value={data.links.githubProfile}
                onChange={(v) => updateLink('githubProfile', v)}
                error={errors[`link-githubProfile`]}
              />
            </div>
            <div className="mt-5">
              <ToggleSwitch enabled={true} onChange={() => {}} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <FormInput
                label="Portfolio URL"
                placeholder="Enter Portfolio URL..."
                value={data.links.portfolioUrl}
                onChange={(v) => updateLink('portfolioUrl', v)}
                error={errors[`link-portfolioUrl`]}
              />
            </div>
            <div className="mt-5">
              <ToggleSwitch enabled={true} onChange={() => {}} />
            </div>
          </div>

          <FormTextarea
            label="Portfolio Description"
            placeholder="Provide Portfolio Description..."
            value={data.links.portfolioDescription}
            onChange={(v) => updateLink('portfolioDescription', v)}
            rows={3}
          />

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <FormInput
                label="Publication URL"
                placeholder="Enter Publication URL..."
                value={data.links.publicationUrl}
                onChange={(v) => updateLink('publicationUrl', v)}
                error={errors[`link-publicationUrl`]}
              />
            </div>
            <div className="mt-5">
              <ToggleSwitch enabled={true} onChange={() => {}} />
            </div>
          </div>

          <FormTextarea
            label="Publication Description"
            placeholder="Provide Portfolio Description..."
            value={data.links.publicationDescription}
            onChange={(v) => updateLink('publicationDescription', v)}
            rows={3}
          />

          <button
            type="button"
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium text-sm"
          >
            <span className="text-lg">+</span> Add Link
          </button>
        </div>
      </FormSection>

      {/* Technical Summary Section */}
      <FormSection
        title="Technical Summary"
        showToggle={true}
        enabled={data.technicalSummaryEnabled}
        onToggle={(enabled) => onChange({ ...data, technicalSummaryEnabled: enabled })}
        showActions={true}
        isCollapsed={technicalSummaryCollapsed}
        onCollapseToggle={() => setTechnicalSummaryCollapsed(!technicalSummaryCollapsed)}
      >
        <FormTextarea
          placeholder="Provide Career Objective"
          value={data.technicalSummary}
          onChange={(v) => onChange({ ...data, technicalSummary: v })}
          rows={5}
          showAiButton={true}
        />
      </FormSection>
    </div>
  );
};

export default SkillsLinksForm;