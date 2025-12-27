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

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  themeColor: string;
}

export type SectionType = 'personal' | 'experience' | 'education' | 'skills' | 'projects';
