import React from 'react';
import type { ResumeData } from '@/types/resume';

interface Template7DisplayProps {
  data: ResumeData;
}

const Template7Display: React.FC<Template7DisplayProps> = ({ data }) => {
  const { personal, education, experience, projects, skillsLinks, certifications } = data;

  const htmlToText = (s?: string) => {
    if (!s) return '';
    try {
      return String(s)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .trim();
    } catch (e) {
      return s || '';
    }
  };

  return (
    <div className="w-[210mm] bg-white" style={{ minHeight: '297mm', fontFamily: 'Arial, sans-serif', color: '#222' }}>
      <div style={{ display: 'flex', minHeight: '100%' }}>
        {/* Left Column */}
        <div style={{ width: '60%', padding: '40px', boxSizing: 'border-box' }}>
          {/* Header */}
          <header style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#004b87', margin: '0 0 4px 0', letterSpacing: '1px' }}>
              {personal.firstName.toUpperCase()} {personal.lastName.toUpperCase()}
            </h1>
            <p style={{ fontSize: 14, color: '#444', margin: '0', letterSpacing: '0.5px', fontWeight: 500 }}>
              {experience.jobRole}
            </p>
          </header>

          {/* Profile */}
          {personal.aboutCareerObjective && (
            <section style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#004b87', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8, paddingBottom: 6, borderBottom: '2px solid #004b87' }}>
                Profile
              </h2>
              <p style={{ fontSize: 11, lineHeight: 1.6, color: '#555', textAlign: 'justify' }}>
                {htmlToText(personal.aboutCareerObjective)}
              </p>
            </section>
          )}

          {/* Education */}
          {education.higherEducationEnabled && education.higherEducation.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#004b87', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8, paddingBottom: 6, borderBottom: '2px solid #004b87' }}>
                Education
              </h2>
              {education.higherEducation.map((edu, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#222' }}>{edu.instituteName}</div>
                  <div style={{ fontSize: 10, color: '#666' }}>{edu.degree}</div>
                  <div style={{ fontSize: 10, color: '#888' }}>{edu.startYear} - {edu.currentlyPursuing ? 'Present' : edu.endYear}</div>
                  {edu.fieldOfStudy && (
                    <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Relevant Coursework: {edu.fieldOfStudy}</div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Experience */}
          {experience.workExperiences.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#004b87', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8, paddingBottom: 6, borderBottom: '2px solid #004b87' }}>
                Experience
              </h2>
              {experience.workExperiences.filter(w => w.enabled).map((w, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#222' }}>{w.jobTitle} | {w.companyName}</div>
                  <div style={{ fontSize: 10, color: '#888', marginBottom: 6 }}>{w.startDate} - {w.currentlyWorking ? 'Present' : w.endDate}</div>
                  {w.description && (
                    <p style={{ fontSize: 10, color: '#555', margin: 0, lineHeight: 1.5 }}>
                      {htmlToText(w.description).split('\n').map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right Column */}
        <div style={{ width: '40%', padding: '40px 40px 40px 0', boxSizing: 'border-box', paddingRight: 40 }}>
          {/* Languages */}
          {personal.languagesKnown && personal.languagesKnown.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#004b87', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #004b87' }}>
                Languages
              </h2>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {personal.languagesKnown.map((lang, i) => (
                  <li key={i} style={{ fontSize: 10, color: '#555', marginBottom: 6, lineHeight: 1.4 }}>
                    {lang}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills */}
          {skillsLinks.skills.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#004b87', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #004b87' }}>
                Skills
              </h2>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {skillsLinks.skills.filter(s => s.enabled && s.skillName).map((s, i) => (
                  <li key={i} style={{ fontSize: 10, color: '#555', marginBottom: 6, lineHeight: 1.4 }}>
                    {s.skillName}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Contact */}
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: '#004b87', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #004b87' }}>
              Contact
            </h2>
            <div style={{ fontSize: 10, color: '#555', lineHeight: 1.8 }}>
              {personal.mobileNumber && <div>{personal.mobileNumber}</div>}
              {personal.email && <div>{personal.email}</div>}
              {personal.address && <div>{personal.address}</div>}
            </div>
          </section>

          {/* Certifications/Licenses */}
          {certifications.length > 0 && certifications.some(c => c.enabled) && (
            <section>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#004b87', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #004b87' }}>
                Licenses
              </h2>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {certifications.filter(c => c.enabled && c.certificateTitle).map((c, i) => (
                  <li key={i} style={{ fontSize: 10, color: '#555', marginBottom: 6, lineHeight: 1.4 }}>
                    {c.certificateTitle}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template7Display;
