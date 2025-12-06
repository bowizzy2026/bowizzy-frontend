import React from 'react';
import type { ResumeData } from '@/types/resume';

interface Template1DisplayProps {
  data: ResumeData;
  showPageBreaks?: boolean;
}

export const Template1Display: React.FC<Template1DisplayProps> = ({ 
  data,
  showPageBreaks = false 
}) => {
  const { personal, education, experience, projects, skillsLinks, certifications } = data;

  return (
    <div className="w-[210mm] bg-white" style={{ minHeight: '297mm', paddingTop: '2px', paddingBottom: '2px' }}>
      {/* Header with name and contact */}
      <div className="border-b-2 border-gray-300 pb-4 mb-4" style={{ padding: '20mm 20mm 0 20mm', marginTop: '2px' }}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800" style={{ fontSize: '32px' }}>
              {personal.firstName.toUpperCase()} <span className="font-extrabold">{personal.lastName.toUpperCase()}</span>
            </h1>
            <p className="text-gray-600 mt-1" style={{ fontSize: '14px' }}>
              {experience.jobRole || 'Executive Secretary'}
            </p>
          </div>
          <div className="text-right text-sm text-gray-600" style={{ fontSize: '11px' }}>
            <div className="flex items-center justify-end gap-2 mb-1">
              <span>{personal.mobileNumber || '+123-456-7890'}</span>
              <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">📞</div>
            </div>
            <div className="flex items-center justify-end gap-2 mb-1">
              <span>{personal.email || 'hello@reallygreatsite.com'}</span>
              <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">✉️</div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span>{personal.address || '123 Anywhere St., Any City'}</span>
              <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">📍</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {personal.aboutCareerObjective && (
        <div className="resume-section mb-6" style={{ padding: '0 20mm' }}>
          <h2 className="text-center text-xl font-semibold text-gray-700 mb-3" style={{ fontSize: '16px', letterSpacing: '2px' }}>
            SUMMARY
          </h2>
          <p className="text-gray-600 text-justify leading-relaxed" style={{ fontSize: '11px' }}>
            {personal.aboutCareerObjective}
          </p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="flex gap-8" style={{ padding: '0 20mm' }}>
        {/* Left Column */}
        <div className="w-1/2">
          {/* Education */}
          {education.higherEducationEnabled && education.higherEducation.length > 0 && (
            <div className="resume-section mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-300" style={{ fontSize: '14px', letterSpacing: '1px' }}>
                EDUCATION
              </h2>
              {education.higherEducation.map((edu, idx) => (
                <div key={idx} className="education-item mb-4">
                  <h3 className="font-bold text-gray-800" style={{ fontSize: '12px' }}>
                    {edu.instituteName || 'Ginyard International Co. University'}
                  </h3>
                  <p className="text-gray-600" style={{ fontSize: '11px' }}>
                    {edu.degree || 'Bachelor Degree in Business Administration'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {edu.startYear} - {edu.endYear || '2020'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skillsLinks.skills.length > 0 && (
            <div className="resume-section mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-300" style={{ fontSize: '14px', letterSpacing: '1px' }}>
                SKILLS
              </h2>
              <ul className="space-y-2">
                {skillsLinks.skills.filter(s => s.enabled && s.skillName).map((skill, idx) => (
                  <li key={idx} className="skill-item flex items-start gap-2 text-gray-600" style={{ fontSize: '11px' }}>
                    <span className="text-gray-800">•</span>
                    <span>{skill.skillName}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && certifications.some(c => c.enabled && c.certificateTitle) && (
            <div className="resume-section mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-300" style={{ fontSize: '14px', letterSpacing: '1px' }}>
                CERTIFICATIONS
              </h2>
              {certifications.filter(c => c.enabled && c.certificateTitle).map((cert, idx) => (
                <div key={idx} className="certification-item mb-3">
                  <p className="font-semibold text-gray-800" style={{ fontSize: '11px' }}>
                    • {cert.certificateTitle}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-1/2">
          {/* Professional Experience */}
          {experience.workExperiences.length > 0 && (
            <div className="resume-section mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-300" style={{ fontSize: '14px', letterSpacing: '1px' }}>
                PROFESSIONAL EXPERIENCE
              </h2>
              {experience.workExperiences.filter(exp => exp.enabled).map((exp, idx) => (
                <div key={idx} className="work-item mb-4">
                  <h3 className="font-bold text-gray-800" style={{ fontSize: '12px' }}>
                    {exp.jobTitle}
                  </h3>
                  <p className="text-gray-600 italic" style={{ fontSize: '11px' }}>
                    {exp.companyName} | {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </p>
                  {exp.description && (
                    <ul className="mt-2 space-y-1">
                      {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                        <li key={i} className="text-gray-600 flex items-start gap-2" style={{ fontSize: '10px' }}>
                          <span className="text-gray-800">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template1Display;