/**
 * Filters resume data based on enabled flags
 * - Includes skills only if linksEnabled is true
 * - Includes work experiences only if experienceEnabled is true
 * - Includes education sections based on their enabled flags
 * - Includes certifications based on enabled flag
 */
export const filterResumeData = (fullResumeData: any) => {
  if (!fullResumeData) return null;

  const filtered = {
    personal: fullResumeData.personal || {},
    education: {
      sslc: fullResumeData.education?.sslcEnabled
        ? fullResumeData.education?.sslc || {}
        : {},
      preUniversity: fullResumeData.education?.preUniversityEnabled
        ? fullResumeData.education?.preUniversity || {}
        : {},
      higherEducation: fullResumeData.education?.higherEducationEnabled
        ? fullResumeData.education?.higherEducation || []
        : [],
    },
    experience: {
      jobRole: fullResumeData.experience?.jobRole || "",
      workExperiences: fullResumeData.experience?.experienceEnabled
        ? fullResumeData.experience?.workExperiences || []
        : [],
    },
    projects: fullResumeData.projects || [],
    skillsLinks: {
      skills: fullResumeData.skillsLinks?.linksEnabled
        ? fullResumeData.skillsLinks?.skills || []
        : [],
      links: fullResumeData.skillsLinks?.links || {},
      technicalSummary: fullResumeData.skillsLinks?.technicalSummaryEnabled
        ? fullResumeData.skillsLinks?.technicalSummary || ""
        : "",
    },
    certifications: fullResumeData.certifications || [],
  };

  return filtered;
};

/**
 * Get only enabled skill names
 */
export const getEnabledSkills = (fullResumeData: any) => {
  if (
    !fullResumeData?.skillsLinks?.linksEnabled ||
    !fullResumeData?.skillsLinks?.skills
  ) {
    return [];
  }

  return fullResumeData.skillsLinks.skills
    .filter((skill: any) => skill.enabled !== false)
    .map((skill: any) => skill.skillName);
};

/**
 * Get only enabled work experiences
 */
export const getEnabledWorkExperiences = (fullResumeData: any) => {
  if (
    !fullResumeData?.experience?.experienceEnabled ||
    !fullResumeData?.experience?.workExperiences
  ) {
    return [];
  }

  return fullResumeData.experience.workExperiences.filter(
    (exp: any) => exp.enabled !== false
  );
};

/**
 * Get only enabled projects
 */
export const getEnabledProjects = (fullResumeData: any) => {
  if (!fullResumeData?.projects) {
    return [];
  }

  return fullResumeData.projects.filter(
    (project: any) => project.enabled !== false
  );
};

/**
 * Get only enabled certifications
 */
export const getEnabledCertifications = (fullResumeData: any) => {
  if (!fullResumeData?.certifications) {
    return [];
  }

  return fullResumeData.certifications.filter(
    (cert: any) => cert.enabled !== false
  );
};
