import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

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
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 15,
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    letterSpacing: 2,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 25,
  },
  leftColumn: {
    width: '33%',
  },
  rightColumn: {
    width: '63%',
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 5,
  },
  section: {
    marginBottom: 18,
  },
  // Contact Section
  contactItem: {
    fontSize: 8.5,
    color: '#666666',
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contactIcon: {
    marginRight: 5,
    fontSize: 9,
  },
  // Education Section
  educationItem: {
    marginBottom: 12,
  },
  educationTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 2,
  },
  educationSubtitle: {
    fontSize: 8.5,
    color: '#666666',
    marginBottom: 2,
  },
  educationDate: {
    fontSize: 7.5,
    color: '#999999',
  },
  // Skills Section
  skillItem: {
    fontSize: 8.5,
    color: '#666666',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  skillArrow: {
    marginRight: 5,
    fontSize: 8,
  },
  // Certification Section
  certTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 2,
  },
  certDate: {
    fontSize: 7.5,
    color: '#666666',
  },
  // About Me Section
  aboutText: {
    fontSize: 8.5,
    color: '#666666',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  // Work Experience Section
  workItem: {
    marginBottom: 12,
  },
  workTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 2,
  },
  workCompany: {
    fontSize: 8.5,
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  workDescription: {
    fontSize: 8,
    color: '#666666',
    lineHeight: 1.5,
    marginTop: 5,
    textAlign: 'justify',
  },
  // Projects Section
  projectItem: {
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 2,
  },
  projectDate: {
    fontSize: 7.5,
    color: '#666666',
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 8,
    color: '#666666',
    lineHeight: 1.5,
    marginTop: 3,
    textAlign: 'justify',
  },
});

interface Template2PDFProps {
  data: ResumeData;
}

export const Template2PDF: React.FC<Template2PDFProps> = ({ data }) => {
  const { personal, education, experience, projects, skillsLinks, certifications } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personal.firstName.toUpperCase()} {personal.lastName.toUpperCase()}
          </Text>
        </View>

        {/* Two Column Layout */}
        <View style={styles.twoColumn}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Contact */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CONTACT</Text>
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>📞</Text>
                <Text>{personal.mobileNumber || '+123-456-7890'}</Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>📍</Text>
                <Text>{personal.address || '123 Anywhere St., Any City'}</Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>✉️</Text>
                <Text>{personal.email || 'hello@reallygreatsite.com'}</Text>
              </View>
              {skillsLinks.links.portfolioEnabled && skillsLinks.links.portfolioUrl && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactIcon}>🌐</Text>
                  <Text>{skillsLinks.links.portfolioUrl}</Text>
                </View>
              )}
            </View>

            {/* Education */}
            {education.higherEducationEnabled && education.higherEducation.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>EDUCATION</Text>
                {education.higherEducation.map((edu, idx) => (
                  <View key={idx} style={styles.educationItem}>
                    <Text style={styles.educationTitle}>
                      {edu.instituteName?.toUpperCase() || 'BORCELLE UNIVERSITY'}
                    </Text>
                    <Text style={styles.educationSubtitle}>
                      {edu.degree || 'Bachelor of Science in Psychology'}
                    </Text>
                    <Text style={styles.educationDate}>
                      {edu.startYear} - {edu.endYear || '2018'}
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
                    <Text style={styles.skillArrow}>➔</Text>
                    <Text>{skill.skillName}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Certification */}
            {certifications.length > 0 && certifications.some(c => c.enabled && c.certificateTitle) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>CERTIFICATION</Text>
                {certifications.filter(c => c.enabled && c.certificateTitle).map((cert, idx) => (
                  <View key={idx} style={styles.educationItem}>
                    <Text style={styles.certTitle}>
                      {cert.certificateTitle.toUpperCase()}
                    </Text>
                    <Text style={styles.certDate}>
                      {cert.date} - {cert.providedBy}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* About Me */}
            {personal.aboutCareerObjective && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ABOUT ME</Text>
                <Text style={styles.aboutText}>{personal.aboutCareerObjective}</Text>
              </View>
            )}

            {/* Work Experience */}
            {experience.workExperiences.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
                {experience.workExperiences.filter(exp => exp.enabled).map((exp, idx) => (
                  <View key={idx} style={styles.workItem}>
                    <Text style={styles.workTitle}>{exp.jobTitle.toUpperCase()}</Text>
                    <Text style={styles.workCompany}>
                      {exp.companyName} ({exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate})
                    </Text>
                    {exp.description && (
                      <Text style={styles.workDescription}>{exp.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {projects.length > 0 && projects.some(p => p.enabled && p.projectTitle) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>PROJECTS</Text>
                {projects.filter(p => p.enabled && p.projectTitle).map((project, idx) => (
                  <View key={idx} style={styles.projectItem}>
                    <Text style={styles.projectTitle}>{project.projectTitle}</Text>
                    <Text style={styles.projectDate}>
                      {project.startDate} - {project.currentlyWorking ? 'Present' : project.endDate}
                    </Text>
                    {project.description && (
                      <Text style={styles.projectDescription}>{project.description}</Text>
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

export default Template2PDF;