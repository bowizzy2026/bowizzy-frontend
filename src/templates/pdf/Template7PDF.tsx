import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
  },
  leftColumn: {
    width: '60%',
    paddingRight: 20,
  },
  rightColumn: {
    width: '40%',
    paddingLeft: 20,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004b87',
    marginBottom: 2,
    letterSpacing: 1,
  },
  jobTitle: {
    fontSize: 12,
    color: '#444',
    fontWeight: 500,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#004b87',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#004b87',
  },
  section: {
    marginBottom: 16,
  },
  educationItem: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 9,
    color: '#888',
  },
  itemCoursework: {
    fontSize: 9,
    color: '#888',
    marginTop: 4,
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  experienceDate: {
    fontSize: 9,
    color: '#888',
    marginBottom: 4,
  },
  description: {
    fontSize: 9,
    color: '#555',
    lineHeight: 1.5,
  },
  listItem: {
    fontSize: 9,
    color: '#555',
    marginBottom: 4,
    paddingLeft: 8,
    marginLeft: -8,
  },
  contactInfo: {
    fontSize: 9,
    color: '#555',
    lineHeight: 1.8,
  },
});

interface Template7PDFProps {
  data: ResumeData;
}

const Template7PDF: React.FC<Template7PDFProps> = ({ data }) => {
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
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.name}>
              {personal.firstName.toUpperCase()} {personal.lastName.toUpperCase()}
            </Text>
            <Text style={styles.jobTitle}>{experience.jobRole}</Text>
          </View>

          {/* Profile */}
          {personal.aboutCareerObjective && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <Text style={styles.description}>{htmlToText(personal.aboutCareerObjective)}</Text>
            </View>
          )}

          {/* Education */}
          {education.higherEducationEnabled && education.higherEducation.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.higherEducation.map((edu, i) => (
                <View key={i} style={styles.educationItem}>
                  <Text style={styles.itemTitle}>{edu.instituteName}</Text>
                  <Text style={styles.itemSubtitle}>{edu.degree}</Text>
                  <Text style={styles.itemDate}>
                    {edu.startYear} - {edu.currentlyPursuing ? 'Present' : edu.endYear}
                  </Text>
                  {edu.fieldOfStudy && (
                    <Text style={styles.itemCoursework}>Relevant Coursework: {edu.fieldOfStudy}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Experience */}
          {experience.workExperiences.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {experience.workExperiences.filter(w => w.enabled).map((w, i) => (
                <View key={i} style={styles.experienceItem}>
                  <Text style={styles.experienceTitle}>{w.jobTitle} | {w.companyName}</Text>
                  <Text style={styles.experienceDate}>
                    {w.startDate} - {w.currentlyWorking ? 'Present' : w.endDate}
                  </Text>
                  {w.description && (
                    <Text style={styles.description}>{htmlToText(w.description)}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {/* Languages */}
          {personal.languagesKnown && personal.languagesKnown.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              {personal.languagesKnown.map((lang, i) => (
                <Text key={i} style={styles.listItem}>• {lang}</Text>
              ))}
            </View>
          )}

          {/* Skills */}
          {skillsLinks.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              {skillsLinks.skills.filter(s => s.enabled && s.skillName).map((s, i) => (
                <Text key={i} style={styles.listItem}>• {s.skillName}</Text>
              ))}
            </View>
          )}

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.contactInfo}>
              {personal.mobileNumber && <Text>{personal.mobileNumber}{'\n'}</Text>}
              {personal.email && <Text>{personal.email}{'\n'}</Text>}
              {personal.address && <Text>{personal.address}</Text>}
            </Text>
          </View>

          {/* Licenses */}
          {certifications.length > 0 && certifications.some(c => c.enabled) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Licenses</Text>
              {certifications.filter(c => c.enabled && c.certificateTitle).map((c, i) => (
                <Text key={i} style={styles.listItem}>• {c.certificateTitle}</Text>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default Template7PDF;
