
export interface PersonalDetails {
  profilePhotoUrl: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  gender: string;
  languagesKnown: string[];
  address: string;
  country: string;
  city: string;
  nationality: string;
  state: string;
  pincode: string;
  passportNumber: string;
  aboutCareerObjective: string;
}

export interface SSLCEducation {
  instituteName: string;
  boardType: string;
  yearOfPassing: string;
  resultFormat: string;
  result: string;
}

export interface PreUniversityEducation {
  instituteName: string;
  boardType: string;
  subjectStream: string;
  yearOfPassing: string;
  resultFormat: string;
  result: string;
}

export interface HigherEducation {
  id: string;
  degree: string;
  fieldOfStudy: string;
  instituteName: string;
  universityBoard: string;
  startYear: string;
  endYear: string;
  resultFormat: string;
  result: string;
}

export interface EducationDetails {
  sslc: SSLCEducation;
  sslcEnabled: boolean;
  preUniversity: PreUniversityEducation;
  preUniversityEnabled: boolean;
  higherEducation: HigherEducation[];
  higherEducationEnabled: boolean;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  jobTitle: string;
  employmentType: string;
  location: string;
  workMode: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

export interface ExperienceDetails {
  jobRole: string;
  workExperiences: WorkExperience[];
}

export interface Project {
  id: string;
  projectTitle: string;
  projectType: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  rolesResponsibilities: string;
  enabled: boolean;
}

export interface Skill {
  id: string;
  skillName: string;
  skillLevel: string;
}

export interface Links {
  linkedinProfile: string;
  githubProfile: string;
  portfolioUrl: string;
  portfolioDescription: string;
  publicationUrl: string;
  publicationDescription: string;
}

export interface SkillsLinksDetails {
  skills: Skill[];
  links: Links;
  linksEnabled: boolean;
  technicalSummary: string;
  technicalSummaryEnabled: boolean;
}

export interface Certificate {
  id: string;
  certificateType: string;
  certificateTitle: string;
  domain: string;
  providedBy: string;
  date: string;
  description: string;
  certificateUrl: string;
  enabled: boolean;
}

export interface ResumeData {
  personal: PersonalDetails;
  education: EducationDetails;
  experience: ExperienceDetails;
  projects: Project[];
  skillsLinks: SkillsLinksDetails;
  certifications: Certificate[];
}

export const initialResumeData: ResumeData = {
  personal: {
    profilePhotoUrl: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: '',
    languagesKnown: [],
    address: '',
    country: 'India',
    city: '',
    nationality: '',
    state: '',
    pincode: '',
    passportNumber: '',
    aboutCareerObjective: '',
  },
  education: {
    sslc: {
      instituteName: '',
      boardType: '',
      yearOfPassing: '',
      resultFormat: '',
      result: '',
    },
    sslcEnabled: true,
    preUniversity: {
      instituteName: '',
      boardType: '',
      subjectStream: '',
      yearOfPassing: '',
      resultFormat: '',
      result: '',
    },
    preUniversityEnabled: true,
    higherEducation: [],
    higherEducationEnabled: true,
  },
  experience: {
    jobRole: '',
    workExperiences: [
      {
        id: '1',
        companyName: '',
        jobTitle: '',
        employmentType: '',
        location: '',
        workMode: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: '',
      },
    ],
  },
  projects: [
    {
      id: '1',
      projectTitle: '',
      projectType: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      rolesResponsibilities: '',
      enabled: true,
    },
  ],
  skillsLinks: {
    skills: [
      { id: '1', skillName: '', skillLevel: '' },
      { id: '2', skillName: '', skillLevel: '' },
    ],
    links: {
      linkedinProfile: '',
      githubProfile: '',
      portfolioUrl: '',
      portfolioDescription: '',
      publicationUrl: '',
      publicationDescription: '',
    },
    linksEnabled: true,
    technicalSummary: '',
    technicalSummaryEnabled: true,
  },
  certifications: [
    {
      id: '1',
      certificateType: '',
      certificateTitle: '',
      domain: '',
      providedBy: '',
      date: '',
      description: '',
      certificateUrl: '',
      enabled: true,
    },
  ],
};