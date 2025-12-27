export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  jobTitle: string;
  summary: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  graduationDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string; // e.g. Issuer, Role, etc.
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  customSections: CustomSection[];
  themeColor: string;
}

export type SectionType = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | string;
