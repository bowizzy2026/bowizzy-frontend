import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

// Register fonts if needed
// Font.register({ family: 'Roboto', src: 'path/to/font' });

const styles = StyleSheet.create({
  page: {
    paddingTop: 42, // 40 + 2px extra top margin
    paddingBottom: 42, // 40 + 2px extra bottom margin
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#cccccc',
    paddingBottom: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameSection: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
  },
  jobTitle: {
    fontSize: 11,
    color: '#666666',
    marginTop: 4,
  },
  contactSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    fontSize: 9,
    color: '#666666',
  },
  contactItem: {
    marginBottom: 3,
  },
  summary: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#555555',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 30,
  },
  leftColumn: {
    width: '48%',
  },
  rightColumn: {
    width: '48%',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#555555',
    letterSpacing: 0.8,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  section: {
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 8,
    color: '#999999',
  },
  bulletList: {
    marginTop: 5,
  },
  bulletItem: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 3,
    paddingLeft: 10,
    flexDirection: 'row',
  },
  bullet: {
    marginRight: 5,
  },
  skillItem: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 5,
    flexDirection: 'row',
  },
});

interface Template1PDFProps {
  data: ResumeData;
}

export const Template1PDF: React.FC<Template1PDFProps> = ({ data }) => {
  const { personal, education, experience, projects, skillsLinks, certifications } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.nameSection}>
            <Text style={styles.name}>
              {personal.firstName.toUpperCase()} {personal.lastName.toUpperCase()}
            </Text>
            <Text style={styles.jobTitle}>{experience.jobRole || 'Executive Secretary'}</Text>
          </View>
          <View style={styles.contactSection}>
            <Text style={styles.contactItem}>{personal.mobileNumber || '+123-456-7890'}</Text>
            <Text style={styles.contactItem}>{personal.email || 'hello@reallygreatsite.com'}</Text>
            <Text style={styles.contactItem}>{personal.address || '123 Anywhere St., Any City'}</Text>
          </View>
        </View>

        {/* Summary */}
        {personal.aboutCareerObjective && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>SUMMARY</Text>
            <Text style={styles.summaryText}>{personal.aboutCareerObjective}</Text>
          </View>
        )}

        {/* Two Column Layout */}
        <View style={styles.twoColumn}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Education */}
            {education.higherEducationEnabled && education.higherEducation.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>EDUCATION</Text>
                {education.higherEducation.map((edu, idx) => (
                  <View key={idx} style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>{edu.instituteName}</Text>
                    <Text style={styles.itemSubtitle}>{edu.degree}</Text>
                    <Text style={styles.itemDate}>
                      {edu.startYear} - {edu.endYear}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Skills */}
            {skillsLinks.skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SKILLS</Text>
                {skillsLinks.skills.filter(s => s.enabled && s.skillName).map((skill, idx) => (
                  <View key={idx} style={styles.skillItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>{skill.skillName}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {certifications.length > 0 && certifications.some(c => c.enabled && c.certificateTitle) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                {certifications.filter(c => c.enabled && c.certificateTitle).map((cert, idx) => (
                  <View key={idx} style={styles.itemContainer}>
                    <Text style={styles.itemSubtitle}>• {cert.certificateTitle}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Professional Experience */}
            {experience.workExperiences.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
                {experience.workExperiences.filter(exp => exp.enabled).map((exp, idx) => (
                  <View key={idx} style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
                    <Text style={styles.itemSubtitle}>
                      {exp.companyName} | {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </Text>
                    {exp.description && (
                      <View style={styles.bulletList}>
                        {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                          <View key={i} style={styles.bulletItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text>{line}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Template1PDF;