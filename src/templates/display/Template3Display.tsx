import React from 'react';
import type { ResumeData } from '@/types/resume';

interface Template3DisplayProps {
  data: ResumeData;
  showPageBreaks?: boolean;
}

export const Template3Display: React.FC<Template3DisplayProps> = ({ 
  data,
  showPageBreaks = false 
}) => {
  const { personal, education, experience, projects, skillsLinks, certifications } = data;

  return (
    <div className="w-[210mm] bg-white flex" style={{ minHeight: '297mm', paddingTop: '2px', paddingBottom: '2px' }}>
      {/* Left Sidebar - Blue/Gray */}
      <div className="w-[35%] bg-gradient-to-b from-blue-400 to-blue-500 text-white" style={{ padding: '20mm 15mm', paddingTop: 'calc(20mm + 2px)' }}>
        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full bg-white overflow-hidden border-4 border-white shadow-lg">
            {personal.profilePhotoUrl ? (
              <img 
                src={personal.profilePhotoUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">👤</span>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ fontSize: '28px' }}>
            {personal.firstName}
          </h1>
          <h1 className="text-3xl font-bold" style={{ fontSize: '28px' }}>
            {personal.lastName}
          </h1>
          <p className="text-sm mt-2 opacity-90" style={{ fontSize: '12px' }}>
            {experience.jobRole || 'Marketing Manager'}
          </p>
        </div>

        {/* Contact */}
        <div className="resume-section mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📞</span>
            <h2 className="text-sm font-bold" style={{ fontSize: '12px', letterSpacing: '1px' }}>
              Contact
            </h2>
          </div>
          <div className="space-y-2 text-white" style={{ fontSize: '9px', paddingLeft: '28px' }}>
            <div className="flex items-start gap-2">
              <span>📞</span>
              <span>{personal.mobileNumber || '+123-456-7890'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✉️</span>
              <span className="break-all">{personal.email || 'hello@reallygreatsite.com'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span>📍</span>
              <span>{personal.address || '123 Anywhere St., Any City, ST 12345'}</span>
            </div>
          </div>
        </div>

        {/* About Me */}
        {personal.aboutCareerObjective && (
          <div className="resume-section mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">👤</span>
              <h2 className="text-sm font-bold" style={{ fontSize: '12px', letterSpacing: '1px' }}>
                About Me
              </h2>
            </div>
            <p className="text-justify leading-relaxed" style={{ fontSize: '9px', paddingLeft: '28px', opacity: 0.95 }}>
              {personal.aboutCareerObjective}
            </p>
          </div>
        )}

        {/* Skills */}
        {skillsLinks.skills.length > 0 && (
          <div className="resume-section mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎯</span>
              <h2 className="text-sm font-bold" style={{ fontSize: '12px', letterSpacing: '1px' }}>
                Skills
              </h2>
            </div>
            <ul className="space-y-1" style={{ paddingLeft: '28px' }}>
              {skillsLinks.skills.filter(s => s.enabled && s.skillName).map((skill, idx) => (
                <li key={idx} className="skill-item flex items-center gap-2" style={{ fontSize: '9px' }}>
                  <span>•</span>
                  <span>{skill.skillName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Content - White */}
      <div className="w-[65%] bg-white text-gray-800" style={{ padding: '20mm 20mm 20mm 15mm' }}>
        {/* Education */}
        {education.higherEducationEnabled && education.higherEducation.length > 0 && (
          <div className="resume-section mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-300">
              <span className="text-2xl">🎓</span>
              <h2 className="text-base font-bold text-gray-800" style={{ fontSize: '14px', letterSpacing: '1px' }}>
                Education
              </h2>
            </div>
            {education.higherEducation.map((edu, idx) => (
              <div key={idx} className="education-item mb-4 ml-8">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-gray-800" style={{ fontSize: '11px' }}>
                      {edu.degree || 'Bachelor of Business Management'}
                    </h3>
                    <p className="text-blue-600 italic" style={{ fontSize: '10px' }}>
                      {edu.instituteName || 'Borcelle University'}
                    </p>
                    <p className="text-gray-500" style={{ fontSize: '9px' }}>
                      {edu.startYear} - {edu.endYear || '2020'}
                    </p>
                    {edu.resultFormat && edu.result && (
                      <p className="text-gray-600 mt-1" style={{ fontSize: '9px' }}>
                        {edu.resultFormat}: {edu.result}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {experience.workExperiences.length > 0 && (
          <div className="resume-section mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-300">
              <span className="text-2xl">💼</span>
              <h2 className="text-base font-bold text-gray-800" style={{ fontSize: '14px', letterSpacing: '1px' }}>
                Experience
              </h2>
            </div>
            {experience.workExperiences.filter(exp => exp.enabled).map((exp, idx) => (
              <div key={idx} className="work-item mb-4 ml-8">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-gray-800" style={{ fontSize: '11px' }}>
                      {exp.jobTitle}
                    </h3>
                    <p className="text-blue-600 italic" style={{ fontSize: '10px' }}>
                      {exp.companyName}
                    </p>
                    <p className="text-gray-500" style={{ fontSize: '9px' }}>
                      {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </p>
                    {exp.description && (
                      <p className="text-gray-600 mt-2 leading-relaxed text-justify" style={{ fontSize: '9px' }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && projects.some(p => p.enabled && p.projectTitle) && (
          <div className="resume-section mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-300">
              <span className="text-2xl">📁</span>
              <h2 className="text-base font-bold text-gray-800" style={{ fontSize: '14px', letterSpacing: '1px' }}>
                Projects
              </h2>
            </div>
            {projects.filter(p => p.enabled && p.projectTitle).map((project, idx) => (
              <div key={idx} className="project-item mb-4 ml-8">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-gray-800" style={{ fontSize: '11px' }}>
                      {project.projectTitle}
                    </h3>
                    <p className="text-gray-500" style={{ fontSize: '9px' }}>
                      {project.startDate} - {project.currentlyWorking ? 'Present' : project.endDate}
                    </p>
                    {project.description && (
                      <p className="text-gray-600 mt-2 leading-relaxed text-justify" style={{ fontSize: '9px' }}>
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* References */}
        <div className="resume-section">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-300">
            <span className="text-2xl">📋</span>
            <h2 className="text-base font-bold text-gray-800" style={{ fontSize: '14px', letterSpacing: '1px' }}>
              References
            </h2>
          </div>
          <div className="ml-8 grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-gray-800" style={{ fontSize: '10px' }}>
                Harumi Kobayashi
              </h3>
              <p className="text-gray-600" style={{ fontSize: '9px' }}>
                Wardiere Inc. / CEO
              </p>
              <p className="text-gray-500" style={{ fontSize: '8px' }}>
                Phone: 123-456-7890
              </p>
              <p className="text-gray-500 break-all" style={{ fontSize: '8px' }}>
                Email: hello@reallygreatsite.com
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800" style={{ fontSize: '10px' }}>
                Bailey Dupont
              </h3>
              <p className="text-gray-600" style={{ fontSize: '9px' }}>
                Wardiere Inc. / CEO
              </p>
              <p className="text-gray-500" style={{ fontSize: '8px' }}>
                Phone: 123-456-7890
              </p>
              <p className="text-gray-500 break-all" style={{ fontSize: '8px' }}>
                Email: hello@reallygreatsite.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template3Display;