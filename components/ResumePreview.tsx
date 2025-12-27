import React from 'react';
import { ResumeData, Experience, Education, Project, Certification, CustomSection, CustomSectionItem } from '../types';
import { MapPin, Mail, Phone, Globe, Linkedin, ExternalLink } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement>;
  onUpdate?: (data: ResumeData) => void;
}

// Editable Component Helper
const EditableText: React.FC<{
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  tagName?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  style?: React.CSSProperties;
}> = ({ value, onChange, className = '', placeholder, tagName = 'div', style }) => {
  const Tag = tagName as any;
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      className={`outline-none hover:bg-yellow-50/50 transition-colors focus:bg-yellow-50 focus:ring-1 focus:ring-indigo-200 rounded px-0.5 -mx-0.5 empty:before:content-[attr(placeholder)] empty:before:text-gray-400 cursor-text ${className}`}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.innerText;
        if (text !== value) {
          onChange(text);
        }
      }}
      placeholder={placeholder}
      style={style}
    >
      {value}
    </Tag>
  );
};

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, previewRef, onUpdate }) => {
  const { personalInfo, experience, education, skills, projects, certifications, customSections, themeColor } = data;

  const handleInfoChange = (field: keyof typeof personalInfo, value: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        personalInfo: { ...personalInfo, [field]: value }
      });
    }
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        experience: experience.map(e => e.id === id ? { ...e, [field]: value } : e)
      });
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        education: education.map(e => e.id === id ? { ...e, [field]: value } : e)
      });
    }
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        projects: projects.map(p => p.id === id ? { ...p, [field]: value } : p)
      });
    }
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        certifications: certifications.map(c => c.id === id ? { ...c, [field]: value } : c)
      });
    }
  };

  const updateSkill = (index: number, value: string) => {
    if (onUpdate) {
      const newSkills = [...skills];
      newSkills[index] = value;
      onUpdate({ ...data, skills: newSkills });
    }
  };

  const updateCustomSectionTitle = (id: string, title: string) => {
    if (onUpdate) {
       onUpdate({
           ...data,
           customSections: customSections.map(s => s.id === id ? {...s, title} : s)
       });
    }
  };

  const updateCustomItem = (sectionId: string, itemId: string, field: keyof CustomSectionItem, value: string) => {
      if (onUpdate) {
          onUpdate({
              ...data,
              customSections: customSections.map(s => 
                s.id === sectionId ? {
                    ...s,
                    items: s.items.map(i => i.id === itemId ? {...i, [field]: value} : i)
                } : s
              )
          });
      }
  };

  return (
    <div className="w-full flex justify-center p-4 bg-gray-100 print:p-0 print:bg-white overflow-hidden">
      {/* A4 Paper Container */}
      <div 
        ref={previewRef}
        id="resume-preview"
        className="bg-white shadow-2xl print:shadow-none w-[210mm] min-h-[297mm] p-[10mm] text-sm text-gray-800 leading-normal"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <header className="border-b-2 pb-6 mb-6" style={{ borderColor: themeColor }}>
          <EditableText 
            tagName="h1"
            value={personalInfo.fullName} 
            onChange={(v) => handleInfoChange('fullName', v)}
            className="text-4xl font-bold uppercase tracking-tight mb-2" 
            placeholder="YOUR NAME"
            style={{ color: themeColor }}
          />
          <EditableText 
            tagName="p"
            value={personalInfo.jobTitle}
            onChange={(v) => handleInfoChange('jobTitle', v)}
            className="text-xl font-medium text-gray-600 mb-4"
            placeholder="Job Title"
          />
          
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
             <div className="flex items-center gap-1">
                <Mail size={14} /> 
                <EditableText value={personalInfo.email} onChange={(v) => handleInfoChange('email', v)} placeholder="email@example.com" />
              </div>
            
              <div className="flex items-center gap-1">
                <Phone size={14} />
                <EditableText value={personalInfo.phone} onChange={(v) => handleInfoChange('phone', v)} placeholder="Phone" />
              </div>
            
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <EditableText value={personalInfo.location} onChange={(v) => handleInfoChange('location', v)} placeholder="Location" />
              </div>
            
            {(personalInfo.website || onUpdate) && (
              <div className="flex items-center gap-1">
                <Globe size={14} />
                <EditableText value={personalInfo.website} onChange={(v) => handleInfoChange('website', v)} placeholder="Website" />
              </div>
            )}
            {(personalInfo.linkedin || onUpdate) && (
              <div className="flex items-center gap-1">
                <Linkedin size={14} />
                <EditableText value={personalInfo.linkedin} onChange={(v) => handleInfoChange('linkedin', v)} placeholder="LinkedIn" />
              </div>
            )}
          </div>
        </header>

        {/* Summary */}
        <section className="mb-6 break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1" style={{ color: themeColor, borderColor: '#e5e7eb' }}>
            Professional Summary
          </h2>
          <EditableText 
            tagName="p"
            value={personalInfo.summary} 
            onChange={(v) => handleInfoChange('summary', v)}
            className="text-gray-700 whitespace-pre-wrap leading-relaxed"
            placeholder="Write a professional summary..."
          />
        </section>

        {/* Education (Moved top for Freshers) */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color: themeColor, borderColor: '#e5e7eb' }}>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <EditableText 
                      tagName="h3" 
                      value={edu.school} 
                      onChange={(v) => updateEducation(edu.id, 'school', v)}
                      className="font-bold text-gray-900" 
                    />
                    <EditableText 
                      tagName="span"
                      value={edu.graduationDate} 
                      onChange={(v) => updateEducation(edu.id, 'graduationDate', v)}
                      className="text-xs text-gray-500" 
                    />
                  </div>
                  <EditableText 
                    value={edu.degree} 
                    onChange={(v) => updateEducation(edu.id, 'degree', v)}
                    className="text-gray-700 text-xs font-medium" 
                  />
                  <EditableText 
                     tagName="p"
                     value={edu.description}
                     onChange={(v) => updateEducation(edu.id, 'description', v)}
                     className="text-gray-500 text-xs mt-1 whitespace-pre-wrap"
                     placeholder="Description..."
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills (Moved up for Freshers) */}
        {skills.length > 0 && (
            <section className="mb-6 break-inside-avoid">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color: themeColor, borderColor: '#e5e7eb' }}>
                Skills
            </h2>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                <span 
                    key={idx} 
                    className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                    <EditableText 
                        tagName="span"
                        value={skill}
                        onChange={(v) => updateSkill(idx, v)}
                    />
                </span>
                ))}
            </div>
            </section>
        )}

        {/* Projects (Important for Freshers) */}
        {projects.length > 0 && (
            <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color: themeColor, borderColor: '#e5e7eb' }}>
                Projects
            </h2>
            <div className="space-y-3">
                {projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                    <div className="flex items-center gap-2 mb-1">
                    <EditableText 
                        tagName="h3"
                        value={proj.name}
                        onChange={(v) => updateProject(proj.id, 'name', v)}
                        className="font-bold text-gray-900" 
                    />
                    {proj.link && (
                        <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-600 print:hidden">
                        <ExternalLink size={10} />
                        </a>
                    )}
                    </div>
                     <div className="mb-1">
                         <EditableText 
                             value={proj.link} 
                             onChange={(v) => updateProject(proj.id, 'link', v)}
                             className="text-xs text-indigo-600/80" 
                             placeholder="Project Link"
                        />
                     </div>
                    <EditableText 
                        tagName="p"
                        value={proj.description}
                        onChange={(v) => updateProject(proj.id, 'description', v)}
                        className="text-gray-600 text-xs whitespace-pre-wrap"
                    />
                </div>
                ))}
            </div>
            </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color: themeColor, borderColor: '#e5e7eb' }}>
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <EditableText 
                        tagName="h3"
                        value={exp.title}
                        onChange={(v) => updateExperience(exp.id, 'title', v)}
                        className="font-bold text-gray-900" 
                    />
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium whitespace-nowrap">
                        <EditableText value={exp.startDate} onChange={(v) => updateExperience(exp.id, 'startDate', v)} placeholder="Start" />
                        <span>–</span>
                        {exp.current ? <span>Present</span> : <EditableText value={exp.endDate} onChange={(v) => updateExperience(exp.id, 'endDate', v)} placeholder="End" />}
                    </div>
                  </div>
                  <EditableText 
                    value={exp.company}
                    onChange={(v) => updateExperience(exp.id, 'company', v)}
                    className="text-gray-700 font-medium text-xs mb-1 block" 
                  />
                  <EditableText 
                    tagName="p"
                    value={exp.description}
                    onChange={(v) => updateExperience(exp.id, 'description', v)}
                    className="text-gray-600 text-xs whitespace-pre-wrap leading-relaxed" 
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
             <section className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color: themeColor, borderColor: '#e5e7eb' }}>
                    Certifications
                </h2>
                <div className="space-y-2">
                    {certifications.map(cert => (
                        <div key={cert.id} className="break-inside-avoid">
                            <div className="flex justify-between items-baseline">
                                <div className="flex items-center gap-2">
                                    <EditableText 
                                        tagName="h3"
                                        value={cert.name}
                                        onChange={(v) => updateCertification(cert.id, 'name', v)}
                                        className="font-bold text-gray-900"
                                    />
                                    {cert.link && (
                                        <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-600 print:hidden">
                                        <ExternalLink size={10} />
                                        </a>
                                    )}
                                </div>
                                <EditableText 
                                    tagName="span"
                                    value={cert.date}
                                    onChange={(v) => updateCertification(cert.id, 'date', v)}
                                    className="text-xs text-gray-500"
                                />
                            </div>
                            <EditableText 
                                tagName="div"
                                value={cert.issuer}
                                onChange={(v) => updateCertification(cert.id, 'issuer', v)}
                                className="text-xs text-gray-600 font-medium"
                            />
                        </div>
                    ))}
                </div>
             </section>
        )}

        {/* Custom Sections */}
        {customSections.map(section => (
            <section key={section.id} className="mb-6 break-inside-avoid">
                 <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1 flex items-center gap-2" style={{ color: themeColor, borderColor: '#e5e7eb' }}>
                    <EditableText 
                        tagName="span"
                        value={section.title}
                        onChange={(v) => updateCustomSectionTitle(section.id, v)}
                    />
                </h2>
                <div className="space-y-3">
                    {section.items.map(item => (
                        <div key={item.id} className="break-inside-avoid">
                            <div className="flex justify-between items-baseline mb-1">
                                <EditableText 
                                    tagName="h3"
                                    value={item.title}
                                    onChange={(v) => updateCustomItem(section.id, item.id, 'title', v)}
                                    className="font-bold text-gray-900"
                                />
                                <EditableText 
                                    tagName="span"
                                    value={item.date}
                                    onChange={(v) => updateCustomItem(section.id, item.id, 'date', v)}
                                    className="text-xs text-gray-500"
                                />
                            </div>
                            <EditableText 
                                tagName="div"
                                value={item.subtitle}
                                onChange={(v) => updateCustomItem(section.id, item.id, 'subtitle', v)}
                                className="text-xs text-gray-600 font-medium mb-1"
                            />
                            <EditableText 
                                tagName="p"
                                value={item.description}
                                onChange={(v) => updateCustomItem(section.id, item.id, 'description', v)}
                                className="text-gray-600 text-xs whitespace-pre-wrap"
                            />
                        </div>
                    ))}
                </div>
            </section>
        ))}

      </div>
    </div>
  );
};

export default ResumePreview;
