import React from 'react';
import { Document, Page, View, Text, StyleSheet, Svg, Path } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
  page: { paddingTop: 32, paddingBottom: 28, paddingLeft: 40, paddingRight: 40, fontSize: 10, fontFamily: 'Helvetica' },
  name: { fontSize: 26, letterSpacing: 1 },
  contact: { fontSize: 9, color: '#555' },
  sectionHeading: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginTop: 14 },
  divider: { height: 1, width: '100%', marginTop: 2, marginBottom: 6 },
  itemTitle: { fontSize: 11 },
  itemSub: { fontSize: 10, color: '#333' },
  body: { fontSize: 10, color: '#333', lineHeight: 1.5 },
  bullet: { width: 10, flexShrink: 0, fontSize: 10, color: '#333' },
});

const htmlToPlain = (html?: string) => {
  if (!html) return '';
  let t = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>|<\/li>/gi, '\n').replace(/<li>/gi, '• ').replace(/<[^>]+>/g, '');
  t = t.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  return t.trim();
};

const renderBullets = (html?: string) => {
  if (!html) return null;
  const text = htmlToPlain(html);
  const lines = text.split('\n').filter(l => l.trim());
  return (
    <View style={{ marginTop: 2 }}>
      {lines.map((line, i) => (
        <View key={i} style={{ flexDirection: 'row', marginTop: i > 0 ? 1 : 0 }}>
          <Text style={styles.bullet}>{line.startsWith('•') ? '•' : ''}</Text>
          <Text style={{ flex: 1, ...styles.body }}>{line.startsWith('•') ? line.substring(1).trim() : line}</Text>
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

interface Props { data: ResumeData; primaryColor?: string; }

const AiTemplate1PDF: React.FC<Props> = ({ data, primaryColor = '#1a1a1a' }) => {
  const { personal, experience, education, projects, skillsLinks, certifications } = data;
  const contactParts = [personal.email, personal.mobileNumber, personal.address].filter(Boolean);
  const linkedin = skillsLinks?.links?.linkedinProfile || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={{ textAlign: 'center', marginBottom: 4 }}>
          <Text style={{ ...styles.name, fontFamily: 'Helvetica-Bold', color: primaryColor }}>
            {personal.firstName} {personal.middleName || ''} {personal.lastName}
          </Text>
          <Text style={{ ...styles.contact, marginTop: 4 }}>{contactParts.join('  |  ')}</Text>
          {linkedin && <Text style={{ ...styles.contact, marginTop: 2 }}>{linkedin}</Text>}
        </View>
        <View style={{ ...styles.divider, backgroundColor: primaryColor }} />

        {/* Summary */}
        {personal.aboutCareerObjective && (
          <>
            <Text style={{ ...styles.sectionHeading, fontFamily: 'Helvetica-Bold', color: primaryColor }}>Professional Summary</Text>
            <View style={{ ...styles.divider, backgroundColor: primaryColor }} />
            <Text style={styles.body}>{htmlToPlain(personal.aboutCareerObjective)}</Text>
          </>
        )}

        {/* Experience */}
        {experience.workExperiences.some(w => w.enabled) && (
          <>
            <Text style={{ ...styles.sectionHeading, fontFamily: 'Helvetica-Bold', color: primaryColor }}>Experience</Text>
            <View style={{ ...styles.divider, backgroundColor: primaryColor }} />
            {experience.workExperiences.filter(w => w.enabled).map((w: any, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ ...styles.itemTitle, fontFamily: 'Helvetica-Bold' }}>{w.jobTitle} — {w.companyName}</Text>
                  <Text style={styles.itemSub}>{fmtDate(w.startDate)} – {w.currentlyWorking ? 'Present' : fmtDate(w.endDate)}</Text>
                </View>
                {w.description && renderBullets(w.description)}
              </View>
            ))}
          </>
        )}

        {/* Projects */}
        {projects.some(p => p.enabled) && (
          <>
            <Text style={{ ...styles.sectionHeading, fontFamily: 'Helvetica-Bold', color: primaryColor }}>Projects</Text>
            <View style={{ ...styles.divider, backgroundColor: primaryColor }} />
            {projects.filter(p => p.enabled).map((p: any, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={{ ...styles.itemTitle, fontFamily: 'Helvetica-Bold' }}>{p.projectTitle}</Text>
                {p.description && renderBullets(p.description)}
              </View>
            ))}
          </>
        )}

        {/* Education */}
        <Text style={{ ...styles.sectionHeading, fontFamily: 'Helvetica-Bold', color: primaryColor }}>Education</Text>
        <View style={{ ...styles.divider, backgroundColor: primaryColor }} />
        {education.higherEducation.filter(e => e.enabled).map((edu: any, i) => (
          <View key={i} style={{ marginBottom: 6 }}>
            <Text style={{ ...styles.itemTitle, fontFamily: 'Helvetica-Bold' }}>{edu.degree} — {edu.fieldOfStudy}</Text>
            <Text style={styles.itemSub}>{edu.instituteName} | {fmtYear(edu.startYear)} – {edu.currentlyPursuing ? 'Present' : fmtYear(edu.endYear)}</Text>
            {edu.resultFormat && edu.result && <Text style={styles.body}>{edu.resultFormat}: {edu.result}</Text>}
          </View>
        ))}
        {education.preUniversityEnabled && education.preUniversity?.instituteName && (
          <View style={{ marginBottom: 6 }}>
            <Text style={{ ...styles.itemTitle, fontFamily: 'Helvetica-Bold' }}>Pre University (12th)</Text>
            <Text style={styles.itemSub}>{education.preUniversity.instituteName} | {fmtYear(education.preUniversity.yearOfPassing)}</Text>
            {education.preUniversity.resultFormat && education.preUniversity.result && <Text style={styles.body}>{education.preUniversity.resultFormat}: {education.preUniversity.result}</Text>}
          </View>
        )}
        {education.sslcEnabled && education.sslc?.instituteName && (
          <View style={{ marginBottom: 6 }}>
            <Text style={{ ...styles.itemTitle, fontFamily: 'Helvetica-Bold' }}>SSLC (10th)</Text>
            <Text style={styles.itemSub}>{education.sslc.instituteName} | {fmtYear(education.sslc.yearOfPassing)}</Text>
            {education.sslc.resultFormat && education.sslc.result && <Text style={styles.body}>{education.sslc.resultFormat}: {education.sslc.result}</Text>}
          </View>
        )}

        {/* Skills */}
        {skillsLinks.skills.some(s => s.enabled && s.skillName) && (
          <>
            <Text style={{ ...styles.sectionHeading, fontFamily: 'Helvetica-Bold', color: primaryColor }}>Skills</Text>
            <View style={{ ...styles.divider, backgroundColor: primaryColor }} />
            <Text style={styles.body}>{skillsLinks.skills.filter(s => s.enabled && s.skillName).map(s => s.skillName).join(', ')}</Text>
          </>
        )}

        {/* Certifications */}
        {certifications.some(c => c.enabled && c.certificateTitle) && (
          <>
            <Text style={{ ...styles.sectionHeading, fontFamily: 'Helvetica-Bold', color: primaryColor }}>Certifications</Text>
            <View style={{ ...styles.divider, backgroundColor: primaryColor }} />
            <Text style={styles.body}>{certifications.filter(c => c.enabled && c.certificateTitle).map(c => c.certificateTitle).join(', ')}</Text>
          </>
        )}
      </Page>
    </Document>
  );
};

export default AiTemplate1PDF;
