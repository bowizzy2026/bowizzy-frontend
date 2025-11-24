import React, { useState } from 'react';
import type { EducationDetails, HigherEducation } from 'src/types/resume';
import { FormInput, FormSelect, FormSection, AddButton } from '@/pages/(ResumeBuilder)/components/ui';
import { Calendar } from 'lucide-react';

interface EducationDetailsFormProps {
  data: EducationDetails;
  onChange: (data: EducationDetails) => void;
}

const boardTypes = [
  { value: 'CBSE', label: 'CBSE' },
  { value: 'ICSE', label: 'ICSE' },
  { value: 'State Board', label: 'State Board' },
  { value: 'IB', label: 'International Baccalaureate' },
];

const subjectStreams = [
  { value: 'Science', label: 'Science' },
  { value: 'Commerce', label: 'Commerce' },
  { value: 'Arts', label: 'Arts' },
  { value: 'Vocational', label: 'Vocational' },
];

const resultFormats = [
  { value: 'Percentage', label: 'Percentage' },
  { value: 'CGPA', label: 'CGPA' },
  { value: 'GPA', label: 'GPA' },
  { value: 'Grade', label: 'Grade' },
];

const degrees = [
  { value: 'B.Tech', label: 'B.Tech' },
  { value: 'B.E', label: 'B.E' },
  { value: 'B.Sc', label: 'B.Sc' },
  { value: 'B.A', label: 'B.A' },
  { value: 'B.Com', label: 'B.Com' },
  { value: 'M.Tech', label: 'M.Tech' },
  { value: 'M.Sc', label: 'M.Sc' },
  { value: 'MBA', label: 'MBA' },
  { value: 'PhD', label: 'PhD' },
];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= 1980; i--) {
    years.push({ value: i.toString(), label: i.toString() });
  }
  return years;
};

export const EducationDetailsForm: React.FC<EducationDetailsFormProps> = ({ data, onChange }) => {
  const years = generateYears();
  
  // Collapse state for each section
  const [sslcCollapsed, setSslcCollapsed] = React.useState(false);
  const [preUniversityCollapsed, setPreUniversityCollapsed] = React.useState(false);
  const [higherEducationCollapsed, setHigherEducationCollapsed] = React.useState(false);
  
  // Error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation function
  const validateField = (name: string, value: string, resultFormat?: string) => {
    let error = '';

    // Institution name and field of study - only letters, spaces, and common punctuation
    if (name.includes('instituteName') || name.includes('fieldOfStudy') || name.includes('universityBoard')) {
      if (value && !/^[a-zA-Z0-9\s.,&()\-']+$/.test(value)) {
        error = 'Only letters, numbers, and basic punctuation allowed';
      }
    }

    // Result validation based on format
    if (name.includes('result') && value) {
      if (resultFormat === 'Percentage') {
        const num = parseFloat(value);
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          error = 'Enter valid percentage (e.g., 85 or 85.5)';
        } else if (num < 0 || num > 100) {
          error = 'Percentage must be between 0 and 100';
        }
      } else if (resultFormat === 'CGPA') {
        const num = parseFloat(value);
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          error = 'Enter valid CGPA (e.g., 8.5)';
        } else if (num < 0 || num > 10) {
          error = 'CGPA must be between 0 and 10';
        }
      } else if (resultFormat === 'GPA') {
        const num = parseFloat(value);
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          error = 'Enter valid GPA (e.g., 3.5)';
        } else if (num < 0 || num > 4) {
          error = 'GPA must be between 0 and 4';
        }
      } else if (resultFormat === 'Grade') {
        if (!/^[A-F][+-]?$|^Pass$|^Fail$/i.test(value)) {
          error = 'Enter valid grade (A, B+, C-, etc.)';
        }
      }
    }

    return error;
  };

  // Validate date range (start year must be less than end year)
  const validateDateRange = (startYear: string, endYear: string) => {
    if (startYear && endYear) {
      if (endYear < startYear) {
        return 'End year cannot be before start year';
      }
    }
    return '';
  };

  const updateSSLC = (field: string, value: string) => {
    const newData = {
      ...data,
      sslc: { ...data.sslc, [field]: value },
    };
    onChange(newData);

    // Validate
    const error = validateField(`sslc.${field}`, value, newData.sslc.resultFormat);
    setErrors((prev) => ({ ...prev, [`sslc.${field}`]: error }));
  };

  const updatePreUniversity = (field: string, value: string) => {
    const newData = {
      ...data,
      preUniversity: { ...data.preUniversity, [field]: value },
    };
    onChange(newData);

    // Validate
    const error = validateField(`preUniversity.${field}`, value, newData.preUniversity.resultFormat);
    setErrors((prev) => ({ ...prev, [`preUniversity.${field}`]: error }));
  };

  const updateHigherEducation = (id: string, field: string, value: string) => {
    const updatedEducation = data.higherEducation.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    
    onChange({
      ...data,
      higherEducation: updatedEducation,
    });

    // Validate
    const edu = updatedEducation.find(e => e.id === id);
    
    // Field-specific validation
    const fieldError = validateField(`higherEducation.${id}.${field}`, value, edu?.resultFormat);
    setErrors((prev) => ({ ...prev, [`higherEducation.${id}.${field}`]: fieldError }));
    
    // Date range validation
    if (edu && (field === 'startYear' || field === 'endYear')) {
      const dateError = validateDateRange(edu.startYear, edu.endYear);
      setErrors((prev) => ({ ...prev, [`higherEducation.${id}.endYear`]: dateError }));
    }
  };

  const addHigherEducation = () => {
    const newEdu: HigherEducation = {
      id: Date.now().toString(),
      degree: '',
      fieldOfStudy: '',
      instituteName: '',
      universityBoard: '',
      startYear: '',
      endYear: '',
      resultFormat: '',
      result: '',
    };
    onChange({
      ...data,
      higherEducation: [...data.higherEducation, newEdu],
    });
  };

  const removeHigherEducation = (id: string) => {
    onChange({
      ...data,
      higherEducation: data.higherEducation.filter((edu) => edu.id !== id),
    });
    
    // Remove errors for this education entry
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.includes(id)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* SSLC Section */}
      <FormSection
        title="SSLC (10th Standard)"
        required
        enabled={data.sslcEnabled}
        onToggle={(enabled) => onChange({ ...data, sslcEnabled: enabled })}
        showActions={true}
        isCollapsed={sslcCollapsed}
        onCollapseToggle={() => setSslcCollapsed(!sslcCollapsed)}
      >
        <FormInput
          label="Institution Name"
          placeholder="Enter Institute Name"
          value={data.sslc.instituteName}
          onChange={(v) => updateSSLC('instituteName', v)}
          error={errors['sslc.instituteName']}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormSelect
            label="Board Type"
            placeholder="Select Board Type"
            value={data.sslc.boardType}
            onChange={(v) => updateSSLC('boardType', v)}
            options={boardTypes}
          />
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Year of Passing
            </label>
            <input
              type="month"
              value={data.sslc.yearOfPassing}
              onChange={(e) => updateSSLC('yearOfPassing', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormSelect
            label="Result Format"
            placeholder="Select Result Format"
            value={data.sslc.resultFormat}
            onChange={(v) => updateSSLC('resultFormat', v)}
            options={resultFormats}
          />
          <FormInput
            label="Result"
            placeholder="Enter Result"
            value={data.sslc.result}
            onChange={(v) => updateSSLC('result', v)}
            error={errors['sslc.result']}
          />
        </div>
      </FormSection>

      {/* Pre University Section */}
      <FormSection
        title="Pre University (12th Standard)"
        required
        enabled={data.preUniversityEnabled}
        onToggle={(enabled) => onChange({ ...data, preUniversityEnabled: enabled })}
        showActions={true}
        isCollapsed={preUniversityCollapsed}
        onCollapseToggle={() => setPreUniversityCollapsed(!preUniversityCollapsed)}
      >
        <FormInput
          label="Institution Name"
          placeholder="Enter Institute Name"
          value={data.preUniversity.instituteName}
          onChange={(v) => updatePreUniversity('instituteName', v)}
          error={errors['preUniversity.instituteName']}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormSelect
            label="Board Type"
            placeholder="Select Board Type"
            value={data.preUniversity.boardType}
            onChange={(v) => updatePreUniversity('boardType', v)}
            options={boardTypes}
          />
          <FormSelect
            label="Subject Stream"
            placeholder="Select Subject Stream"
            value={data.preUniversity.subjectStream}
            onChange={(v) => updatePreUniversity('subjectStream', v)}
            options={subjectStreams}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Year of Passing
            </label>
            <input
              type="month"
              value={data.preUniversity.yearOfPassing}
              onChange={(e) => updatePreUniversity('yearOfPassing', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
            />
          </div>
          <FormSelect
            label="Result Format"
            placeholder="Result Format"
            value={data.preUniversity.resultFormat}
            onChange={(v) => updatePreUniversity('resultFormat', v)}
            options={resultFormats}
          />
          <FormInput
            label="Result"
            placeholder="Enter Result"
            value={data.preUniversity.result}
            onChange={(v) => updatePreUniversity('result', v)}
            error={errors['preUniversity.result']}
          />
        </div>
      </FormSection>

      {/* Higher Education Section */}
      <FormSection
        title="Higher Education"
        required
        enabled={data.higherEducationEnabled}
        onToggle={(enabled) => onChange({ ...data, higherEducationEnabled: enabled })}
        showActions={true}
        isCollapsed={higherEducationCollapsed}
        onCollapseToggle={() => setHigherEducationCollapsed(!higherEducationCollapsed)}
      >
        {data.higherEducation.map((edu, index) => (
          <div key={edu.id} className={`${index > 0 ? 'mt-6 pt-6 border-t border-gray-200' : ''}`}>
            {data.higherEducation.length > 1 && (
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-700">Education {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeHigherEducation(edu.id)}
                  className="text-red-500 text-sm hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Degree"
                placeholder="Select Degree"
                value={edu.degree}
                onChange={(v) => updateHigherEducation(edu.id, 'degree', v)}
                options={degrees}
              />
              <FormInput
                label="Field of Study"
                placeholder="Enter Field of Study"
                value={edu.fieldOfStudy}
                onChange={(v) => updateHigherEducation(edu.id, 'fieldOfStudy', v)}
                error={errors[`higherEducation.${edu.id}.fieldOfStudy`]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormInput
                label="Institute Name"
                placeholder="Enter Institute Name"
                value={edu.instituteName}
                onChange={(v) => updateHigherEducation(edu.id, 'instituteName', v)}
                error={errors[`higherEducation.${edu.id}.instituteName`]}
              />
              <FormInput
                label="University / Board"
                placeholder="Enter University / Board"
                value={edu.universityBoard}
                onChange={(v) => updateHigherEducation(edu.id, 'universityBoard', v)}
                error={errors[`higherEducation.${edu.id}.universityBoard`]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Year
                </label>
                <input
                  type="month"
                  value={edu.startYear}
                  onChange={(e) => updateHigherEducation(edu.id, 'startYear', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Year
                </label>
                <input
                  type="month"
                  value={edu.endYear}
                  onChange={(e) => updateHigherEducation(edu.id, 'endYear', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                    errors[`higherEducation.${edu.id}.endYear`]
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-orange-400 focus:border-transparent'
                  }`}
                />
                {errors[`higherEducation.${edu.id}.endYear`] && (
                  <p className="mt-1 text-xs text-red-500">{errors[`higherEducation.${edu.id}.endYear`]}</p>
                )}
              </div>
              <FormSelect
                label="Result Format"
                placeholder="Format"
                value={edu.resultFormat}
                onChange={(v) => updateHigherEducation(edu.id, 'resultFormat', v)}
                options={resultFormats}
              />
              <FormInput
                label="Result"
                placeholder="Result"
                value={edu.result}
                onChange={(v) => updateHigherEducation(edu.id, 'result', v)}
                error={errors[`higherEducation.${edu.id}.result`]}
              />
            </div>
          </div>
        ))}
      </FormSection>

      <div className="bg-white border border-gray-200 rounded-xl">
        <AddButton onClick={addHigherEducation} label="Add Education" />
      </div>
    </div>
  );
};

export default EducationDetailsForm;