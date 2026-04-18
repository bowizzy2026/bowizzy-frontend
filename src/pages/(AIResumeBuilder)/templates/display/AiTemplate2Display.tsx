import React from 'react';
import type { ResumeData } from '@/types/resume';

const htmlToLines = (s?: string) => {
  if (!s) return [] as string[];
  const text = String(s).replace(/<\/p>|<\/li>/gi, '\n').replace(/<br\s*\/?>(?:\s*)/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  return text.split(/\n|\r\n/).map(l => l.trim()).filter(Boolean);
};

const fmtDate = (s?: string) => {
  if (!s) return '';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = String(s).match(/^(\d{4})-(\d{2})/);
  if (m) { const mm = parseInt(m[2], 10); return mm >= 1 && mm <= 12 ? `${months[mm-1]} ${m[1]}` : m[1]; }
  return String(s);
};
const fmtYear = (s?: string) => { if (!s) return ''; const m = String(s).match(/(\d{4})/); return m ? m[1] : String(s); };

interface Props { data: ResumeData; primaryColor?: string; }

const AiTemplate2Display: React.FC<Props> = ({ data, primaryColor = '#1e3a5f' }) => {
  const { personal, experience, education, projects, skillsLinks, certifications } = data;
  const contactParts = [personal.email, personal.mobileNumber, personal.address].filter(Boolean);
  const linkedin = skillsLinks?.links?.linkedinProfile || '';

  const sectionStyle: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: primaryColor, marginTop: 14, marginBottom: 0 };
  const dividerStyle: React.CSSProperties = { height: 1.5, backgroundColor: primaryColor, width: '100%', marginBottom: 6 };

  return (
    <div style={{ width: '210mm', minHeight: '297mm', fontFamily: "Inter, sans-serif", background: '#fff' }}>
      {/* Header band */}
      <div style={{ backgroundColor: primaryColor, padding: '24px 40px', color: '#fff' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: 1 }}>
          {personal.firstName} {personal.middleName || ''} {personal.lastName}
        </h1>
        <p style={{ fontSize: 10, color: '#c4d9f2', margin: '4px 0 0' }}>{contactParts.join('  •  ')}{linkedin ? `  •  ${linkedin}` : ''}</p>
      </div>

      <div style={{ padding: '16px 40px 24px' }}>
        {personal.aboutCareerObjective && (
          <>
            <p style={sectionStyle}>Professional Summary</p>
            <div style={dividerStyle} />
            <p style={{ fontSize: 9, color: '#333', lineHeight: 1.5, margin: 0 }}>{htmlToLines(personal.aboutCareerObjective).join(' ')}</p>
          </>
        )}

        {experience.workExperiences.some(w => w.enabled) && (
          <>
            <p style={sectionStyle}>Work Experience</p>
            <div style={dividerStyle} />
            {experience.workExperiences.filter(w => w.enabled).map((w: any, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: 10 }}>{w.jobTitle}</strong>
                  <span style={{ fontSize: 9, color: '#555' }}>{fmtDate(w.startDate)} – {w.currentlyWorking ? 'Present' : fmtDate(w.endDate)}</span>
                </div>
                <p style={{ fontSize: 9, color: '#555', margin: 0 }}>{w.companyName}{w.location ? `, ${w.location}` : ''}</p>
                <ul style={{ margin: '2px 0 0 16px', padding: 0, fontSize: 9, color: '#333' }}>
                  {htmlToLines(w.description).map((line, j) => <li key={j} style={{ marginBottom: 1 }}>{line.replace(/^[•\-]\s*/, '')}</li>)}
                </ul>
              </div>
            ))}
          </>
        )}

        {projects.some(p => p.enabled) && (
          <>
            <p style={sectionStyle}>Projects</p>
            <div style={dividerStyle} />
            {projects.filter(p => p.enabled).map((p: any, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: 10 }}>{p.projectTitle}</strong>
                <ul style={{ margin: '2px 0 0 16px', padding: 0, fontSize: 9, color: '#333' }}>
                  {htmlToLines(p.description).map((line, j) => <li key={j} style={{ marginBottom: 1 }}>{line.replace(/^[•\-]\s*/, '')}</li>)}
                </ul>
              </div>
            ))}
          </>
        )}

        <p style={sectionStyle}>Education</p>
        <div style={dividerStyle} />
        {education.higherEducation.filter(e => e.enabled).map((edu: any, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: 10 }}>{edu.degree} — {edu.fieldOfStudy}</strong>
              <span style={{ fontSize: 9, color: '#555' }}>{fmtYear(edu.startYear)} – {edu.currentlyPursuing ? 'Present' : fmtYear(edu.endYear)}</span>
            </div>
            <p style={{ fontSize: 9, color: '#555', margin: 0 }}>{edu.instituteName}</p>
          </div>
        ))}
        {education.preUniversityEnabled && education.preUniversity?.instituteName && (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ fontSize: 10 }}>Pre University (12th)</strong>
            <p style={{ fontSize: 9, color: '#555', margin: 0 }}>{education.preUniversity.instituteName} | {fmtYear(education.preUniversity.yearOfPassing)}</p>
          </div>
        )}
        {education.sslcEnabled && education.sslc?.instituteName && (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ fontSize: 10 }}>SSLC (10th)</strong>
            <p style={{ fontSize: 9, color: '#555', margin: 0 }}>{education.sslc.instituteName} | {fmtYear(education.sslc.yearOfPassing)}</p>
          </div>
        )}

        {skillsLinks.skills.some(s => s.enabled && s.skillName) && (
          <>
            <p style={sectionStyle}>Skills</p>
            <div style={dividerStyle} />
            <p style={{ fontSize: 9, color: '#333', margin: 0 }}>{skillsLinks.skills.filter(s => s.enabled && s.skillName).map(s => s.skillName).join(', ')}</p>
          </>
        )}

        {certifications.some(c => c.enabled && c.certificateTitle) && (
          <>
            <p style={sectionStyle}>Certifications</p>
            <div style={dividerStyle} />
            <p style={{ fontSize: 9, color: '#333', margin: 0 }}>{certifications.filter(c => c.enabled && c.certificateTitle).map(c => c.certificateTitle).join(', ')}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AiTemplate2Display;
