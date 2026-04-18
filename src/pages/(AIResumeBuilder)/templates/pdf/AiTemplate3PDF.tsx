import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

const htmlToPlain = (html?: string) => {
  if (!html) return '';
  let t = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>|<\/li>/gi, '\n').replace(/<li>/gi, '• ').replace(/<[^>]+>/g, '');
  return t.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
};

const renderBullets = (html?: string) => {
  if (!html) return null;
  const lines = htmlToPlain(html).split('\n').filter(l => l.trim());
  return (
    <View style={{ marginTop: 2 }}>
      {lines.map((line, i) => (
        <View key={i} style={{ flexDirection: 'row', marginTop: i > 0 ? 1 : 0 }}>
          <Text style={{ width: 10, flexShrink: 0, fontSize: 9, color: '#333' }}>{line.startsWith('•') ? '•' : ''}</Text>
          <Text style={{ flex: 1, fontSize: 9, color: '#333', lineHeight: 1.5 }}>{line.startsWith('•') ? line.substring(1).trim() : line}</Text>
        </View>
      ))}
    </View>
  );
};

const fmtDate = (s?: string) => {
  if (!s) return '';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = String(s).match(/^(\d{4})-(\d{2})/);
  if (m) { const mm = parseInt(m[2], 10); return mm >= 1 && mm <= 12 ? `${months[mm-1]} ${m[1]}` : m[1]; }
  return String(s);
};

const fmtYear = (s?: string) => { if (!s) return ''; const m = String(s).match(/(\d{4})/); return m ? m[1] : String(s); };

const SIDEBAR_WIDTH = 170;

interface Props { data: ResumeData; primaryColor?: string; }

const AiTemplate3PDF: React.FC<Props> = ({ data, primaryColor = '#2d3748' }) => {
  const { personal, experience, education, projects, skillsLinks, certifications } = data;
  const linkedin = skillsLinks?.links?.linkedinProfile || '';
  const github = skillsLinks?.links?.githubProfile || '';

  return (
    <Document>
      <Page size="A4" style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, fontSize: 9 }}>
        <View style={{ flexDirection: 'row', minHeight: '100%' }}>
          {/* Left sidebar */}
          <View style={{ width: SIDEBAR_WIDTH, backgroundColor: primaryColor, paddingVertical: 28, paddingHorizontal: 18, color: '#fff' }}>
            <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#fff', marginBottom: 4 }}>{personal.firstName}</Text>
            <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#fff', marginBottom: 12 }}>{personal.lastName}</Text>

            {/* Contact */}
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#e2e8f0', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 14, marginBottom: 4 }}>Contact</Text>
            <View style={{ height: 1, backgroundColor: '#e2e8f0', marginBottom: 6 }} />
            {personal.email && <Text style={{ fontSize: 8, color: '#e2e8f0', marginBottom: 3 }}>{personal.email}</Text>}
            {personal.mobileNumber && <Text style={{ fontSize: 8, color: '#e2e8f0', marginBottom: 3 }}>{personal.mobileNumber}</Text>}
            {personal.address && <Text style={{ fontSize: 8, color: '#e2e8f0', marginBottom: 3 }}>{personal.address}</Text>}
            {linkedin && <Text style={{ fontSize: 7, color: '#90cdf4', marginBottom: 3 }}>{linkedin}</Text>}
            {github && <Text style={{ fontSize: 7, color: '#90cdf4', marginBottom: 3 }}>{github}</Text>}

            {/* Education in sidebar */}
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#e2e8f0', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 18, marginBottom: 4 }}>Education</Text>
            <View style={{ height: 1, backgroundColor: '#e2e8f0', marginBottom: 6 }} />
            {education.higherEducation.filter(e => e.enabled).map((edu: any, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#fff' }}>{edu.degree}</Text>
                <Text style={{ fontSize: 8, color: '#e2e8f0' }}>{edu.fieldOfStudy}</Text>
                <Text style={{ fontSize: 8, color: '#e2e8f0' }}>{edu.instituteName}</Text>
                <Text style={{ fontSize: 7, color: '#a0aec0' }}>{fmtYear(edu.startYear)} – {edu.currentlyPursuing ? 'Present' : fmtYear(edu.endYear)}</Text>
                {edu.resultFormat && edu.result && <Text style={{ fontSize: 7, color: '#a0aec0' }}>{edu.resultFormat}: {edu.result}</Text>}
              </View>
            ))}
            {education.preUniversityEnabled && education.preUniversity?.instituteName && (
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#fff' }}>Pre University</Text>
                <Text style={{ fontSize: 8, color: '#e2e8f0' }}>{education.preUniversity.instituteName}</Text>
                <Text style={{ fontSize: 7, color: '#a0aec0' }}>{fmtYear(education.preUniversity.yearOfPassing)}</Text>
              </View>
            )}
            {education.sslcEnabled && education.sslc?.instituteName && (
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#fff' }}>SSLC</Text>
                <Text style={{ fontSize: 8, color: '#e2e8f0' }}>{education.sslc.instituteName}</Text>
                <Text style={{ fontSize: 7, color: '#a0aec0' }}>{fmtYear(education.sslc.yearOfPassing)}</Text>
              </View>
            )}

            {/* Skills in sidebar */}
            {skillsLinks.skills.some(s => s.enabled && s.skillName) && (
              <>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#e2e8f0', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 18, marginBottom: 4 }}>Skills</Text>
                <View style={{ height: 1, backgroundColor: '#e2e8f0', marginBottom: 6 }} />
                {skillsLinks.skills.filter(s => s.enabled && s.skillName).map((s, i) => (
                  <Text key={i} style={{ fontSize: 8, color: '#e2e8f0', marginBottom: 2 }}>• {s.skillName}</Text>
                ))}
              </>
            )}

            {/* Certifications in sidebar */}
            {certifications.some(c => c.enabled && c.certificateTitle) && (
              <>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#e2e8f0', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 18, marginBottom: 4 }}>Certifications</Text>
                <View style={{ height: 1, backgroundColor: '#e2e8f0', marginBottom: 6 }} />
                {certifications.filter(c => c.enabled && c.certificateTitle).map((c, i) => (
                  <Text key={i} style={{ fontSize: 8, color: '#e2e8f0', marginBottom: 2 }}>• {c.certificateTitle}</Text>
                ))}
              </>
            )}
          </View>

          {/* Main content */}
          <View style={{ flex: 1, paddingVertical: 28, paddingHorizontal: 24 }}>
            {/* Summary */}
            {personal.aboutCareerObjective && (
              <>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5, textTransform: 'uppercase', color: primaryColor, marginBottom: 2 }}>Summary</Text>
                <View style={{ height: 1, backgroundColor: primaryColor, marginBottom: 6 }} />
                <Text style={{ fontSize: 9, color: '#333', lineHeight: 1.5 }}>{htmlToPlain(personal.aboutCareerObjective)}</Text>
              </>
            )}

            {/* Experience */}
            {experience.workExperiences.some(w => w.enabled) && (
              <>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5, textTransform: 'uppercase', color: primaryColor, marginTop: 14, marginBottom: 2 }}>Experience</Text>
                <View style={{ height: 1, backgroundColor: primaryColor, marginBottom: 6 }} />
                {experience.workExperiences.filter(w => w.enabled).map((w: any, i) => (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{w.jobTitle}</Text>
                      <Text style={{ fontSize: 8, color: '#555' }}>{fmtDate(w.startDate)} – {w.currentlyWorking ? 'Present' : fmtDate(w.endDate)}</Text>
                    </View>
                    <Text style={{ fontSize: 9, color: '#555' }}>{w.companyName}{w.location ? ` | ${w.location}` : ''}</Text>
                    {w.description && renderBullets(w.description)}
                  </View>
                ))}
              </>
            )}

            {/* Projects */}
            {projects.some(p => p.enabled) && (
              <>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5, textTransform: 'uppercase', color: primaryColor, marginTop: 14, marginBottom: 2 }}>Projects</Text>
                <View style={{ height: 1, backgroundColor: primaryColor, marginBottom: 6 }} />
                {projects.filter(p => p.enabled).map((p: any, i) => (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{p.projectTitle}</Text>
                    {p.description && renderBullets(p.description)}
                  </View>
                ))}
              </>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default AiTemplate3PDF;
