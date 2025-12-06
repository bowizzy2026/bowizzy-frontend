import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    paddingTop: 2,
    paddingBottom: 2,
  },
  // Left Sidebar (Blue)
  leftSidebar: {
    width: '35%',
    backgroundColor: '#5B9BD5',
    color: '#ffffff',
    padding: '40px 25px',
  },
  profilePhotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
    overflow: 'hidden',
    border: '4px solid #ffffff',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  nameSection: {
    textAlign: 'center',
    marginBottom: 25,
  },
  firstName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  lastName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  jobTitle: {
    fontSize: 10,
    color: '#ffffff',
    marginTop: 5,
    opacity: 0.9,
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sidebarIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  sidebarTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.8,
  },
  sidebarContent: {
    paddingLeft: 22,
    fontSize: 8,
    lineHeight: 1.4,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  contactIcon: {
    marginRight: 5,
    fontSize: 8,
  },
  skillItem: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  skillBullet: {
    marginRight: 5,
  },
  aboutText: {
    textAlign: 'justify',
    opacity: 0.95,
  },
  // Right Content (White)
  rightContent: {
    width: '65%',
    backgroundColor: '#ffffff',
    color: '#333333',
    padding: '40px 30px 40px 25px',
  },
  contentSection: {
    marginBottom: 20,
  },
  contentSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#cccccc',
  },
  contentIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  contentTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.8,
    color: '#333333',
  },
  itemContainer: {
    marginBottom: 12,
    marginLeft: 24,
  },
  itemWithBullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  blueBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5B9BD5',
    marginTop: 4,
    marginRight: 8,
    flexShrink: 0,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 8.5,
    color: '#5B9BD5',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 7.5,
    color: '#999999',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 8,
    color: '#666666',
    lineHeight: 1.5,
    marginTop: 5,
    textAlign: 'justify',
  },
  itemResult: {
    fontSize: 7.5,
    color: '#666666',
    marginTop: 3,
  },
  // References Section
  referencesGrid: {
    flexDirection: 'row',
    gap: 15,
    marginLeft: 24,
  },
  referenceItem: {
    flex: 1,
  },
  referenceName: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 2,
  },
  referenceTitle: {
    fontSize: 7.5,
    color: '#666666',
    marginBottom: 2,
  },
  referenceContact: {
    fontSize: 7,
    color: '#999999',
    marginBottom: 1,
  },
});

interface Template3PDFProps {
  data: ResumeData;
}

export const Template3PDF: React.FC<Template3PDFProps> = ({ data }) => {
  const { personal, education, experience, projects, skillsLinks, certifications } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Sidebar - Blue */}
        <View style={styles.leftSidebar}>
          {/* Profile Photo */}
          <View style={styles.profilePhotoContainer}>
            {personal.profilePhotoUrl ? (
              <Image src={personal.profilePhotoUrl} style={styles.profilePhoto} />
            ) : (
              <View style={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0' }} />
            )}
          </View>

          {/* Name */}
          <View style={styles.nameSection}>
            <Text style={styles.firstName}>{personal.firstName}</Text>
            <Text style={styles.lastName}>{personal.lastName}</Text>
            <Text style={styles.jobTitle}>{experience.jobRole || 'Marketing Manager'}</Text>
          </View>

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <View style={styles.sidebarSectionHeader}>
              <Text style={styles.sidebarIcon}>📞</Text>
              <Text style={styles.sidebarTitle}>Contact</Text>
            </View>
            <View style={styles.sidebarContent}>
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>📞</Text>
                <Text>{personal.mobileNumber || '+123-456-7890'}</Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>✉️</Text>
                <Text>{personal.email || 'hello@reallygreatsite.com'}</Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>📍</Text>
                <Text>{personal.address || '123 Anywhere St., Any City, ST 12345'}</Text>
              </View>
            </View>
          </View>

          {/* About Me */}
          {personal.aboutCareerObjective && (
            <View style={styles.sidebarSection}>
              <View style={styles.sidebarSectionHeader}>
                <Text style={styles.sidebarIcon}>👤</Text>
                <Text style={styles.sidebarTitle}>About Me</Text>
              </View>
              <View style={styles.sidebarContent}>
                <Text style={styles.aboutText}>{personal.aboutCareerObjective}</Text>
              </View>
            </View>
          )}

          {/* Skills */}
          {skillsLinks.skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <View style={styles.sidebarSectionHeader}>
                <Text style={styles.sidebarIcon}>🎯</Text>
                <Text style={styles.sidebarTitle}>Skills</Text>
              </View>
              <View style={styles.sidebarContent}>
                {skillsLinks.skills.filter(s => s.enabled && s.skillName).map((skill, idx) => (
                  <View key={idx} style={styles.skillItem}>
                    <Text style={styles.skillBullet}>•</Text>
                    <Text>{skill.skillName}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Right Content - White */}
        <View style={styles.rightContent}>
          {/* Education */}
          {education.higherEducationEnabled && education.higherEducation.length > 0 && (
            <View style={styles.contentSection}>
              <View style={styles.contentSectionHeader}>
                <Text style={styles.contentIcon}>🎓</Text>
                <Text style={styles.contentTitle}>Education</Text>
              </View>
              {education.higherEducation.map((edu, idx) => (
                <View key={idx} style={styles.itemContainer}>
                  <View style={styles.itemWithBullet}>
                    <View style={styles.blueBullet} />
                    <View style={styles.itemContent}>
                      <Text style={styles.itemTitle}>
                        {edu.degree || 'Bachelor of Business Management'}
                      </Text>
                      <Text style={styles.itemSubtitle}>
                        {edu.instituteName || 'Borcelle University'}
                      </Text>
                      <Text style={styles.itemDate}>
                        {edu.startYear} - {edu.endYear || '2020'}
                      </Text>
                      {edu.resultFormat && edu.result && (
                        <Text style={styles.itemResult}>
                          {edu.resultFormat}: {edu.result}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Experience */}
          {experience.workExperiences.length > 0 && (
            <View style={styles.contentSection}>
              <View style={styles.contentSectionHeader}>
                <Text style={styles.contentIcon}>💼</Text>
                <Text style={styles.contentTitle}>Experience</Text>
              </View>
              {experience.workExperiences.filter(exp => exp.enabled).map((exp, idx) => (
                <View key={idx} style={styles.itemContainer}>
                  <View style={styles.itemWithBullet}>
                    <View style={styles.blueBullet} />
                    <View style={styles.itemContent}>
                      <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
                      <Text style={styles.itemSubtitle}>{exp.companyName}</Text>
                      <Text style={styles.itemDate}>
                        {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                      </Text>
                      {exp.description && (
                        <Text style={styles.itemDescription}>{exp.description}</Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && projects.some(p => p.enabled && p.projectTitle) && (
            <View style={styles.contentSection}>
              <View style={styles.contentSectionHeader}>
                <Text style={styles.contentIcon}>📁</Text>
                <Text style={styles.contentTitle}>Projects</Text>
              </View>
              {projects.filter(p => p.enabled && p.projectTitle).map((project, idx) => (
                <View key={idx} style={styles.itemContainer}>
                  <View style={styles.itemWithBullet}>
                    <View style={styles.blueBullet} />
                    <View style={styles.itemContent}>
                      <Text style={styles.itemTitle}>{project.projectTitle}</Text>
                      <Text style={styles.itemDate}>
                        {project.startDate} - {project.currentlyWorking ? 'Present' : project.endDate}
                      </Text>
                      {project.description && (
                        <Text style={styles.itemDescription}>{project.description}</Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* References */}
          <View style={styles.contentSection}>
            <View style={styles.contentSectionHeader}>
              <Text style={styles.contentIcon}>📋</Text>
              <Text style={styles.contentTitle}>References</Text>
            </View>
            <View style={styles.referencesGrid}>
              <View style={styles.referenceItem}>
                <Text style={styles.referenceName}>Harumi Kobayashi</Text>
                <Text style={styles.referenceTitle}>Wardiere Inc. / CEO</Text>
                <Text style={styles.referenceContact}>Phone: 123-456-7890</Text>
                <Text style={styles.referenceContact}>Email: hello@reallygreatsite.com</Text>
              </View>
              <View style={styles.referenceItem}>
                <Text style={styles.referenceName}>Bailey Dupont</Text>
                <Text style={styles.referenceTitle}>Wardiere Inc. / CEO</Text>
                <Text style={styles.referenceContact}>Phone: 123-456-7890</Text>
                <Text style={styles.referenceContact}>Email: hello@reallygreatsite.com</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Template3PDF;