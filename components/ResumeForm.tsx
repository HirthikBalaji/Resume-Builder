import React, { useState } from 'react';
import { ResumeData, Experience, Education, Project, Certification, CustomSection, CustomSectionItem } from '../types';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Wand2, LayoutTemplate } from 'lucide-react';
import * as geminiService from '../services/gemini';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // --- AI Handlers ---

  const handleAiEnhance = async (fieldId: string, text: string, context: string, updateCb: (newText: string) => void) => {
    setLoadingField(fieldId);
    const enhanced = await geminiService.enhanceText(text, context);
    updateCb(enhanced);
    setLoadingField(null);
  };

  const handleGenerateSummary = async () => {
    setLoadingField('summary');
    const summary = await geminiService.generateSummary(data);
    updatePersonalInfo('summary', summary);
    setLoadingField(null);
  };

  const handleSuggestSkills = async () => {
    setLoadingField('skills');
    const skills = await geminiService.suggestSkills(data.personalInfo.jobTitle);
    onChange({ ...data, skills: [...new Set([...data.skills, ...skills])] });
    setLoadingField(null);
  };

  // --- Experience Handlers ---

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      title: '', company: '', startDate: '', endDate: '', current: false, description: ''
    };
    onChange({ ...data, experience: [newExp, ...data.experience] });
    setActiveSection(`exp-${newExp.id}`);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  };

  // --- Education Handlers ---
  
  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: '', degree: '', graduationDate: '', description: ''
    };
    onChange({ ...data, education: [newEdu, ...data.education] });
    setActiveSection(`edu-${newEdu.id}`);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onChange({
      ...data,
      education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(e => e.id !== id) });
  };

  // --- Skills Handler ---

  const handleSkillChange = (value: string) => {
    const skillsArray = value.split(',').map(s => s.trim()).filter(s => s !== '');
    onChange({ ...data, skills: skillsArray });
  };

  // --- Projects Handlers ---

  const addProject = () => {
      const newProj: Project = { id: crypto.randomUUID(), name: '', link: '', description: '' };
      onChange({ ...data, projects: [newProj, ...data.projects] });
      setActiveSection(`proj-${newProj.id}`);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
      onChange({ ...data, projects: data.projects.map(p => p.id === id ? {...p, [field]: value} : p)});
  };

  const removeProject = (id: string) => {
      onChange({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  // --- Certifications Handlers ---

  const addCertification = () => {
    const newCert: Certification = { id: crypto.randomUUID(), name: '', issuer: '', date: '', link: '' };
    onChange({ ...data, certifications: [newCert, ...data.certifications] });
    setActiveSection(`cert-${newCert.id}`);
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    onChange({ ...data, certifications: data.certifications.map(c => c.id === id ? { ...c, [field]: value } : c) });
  };

  const removeCertification = (id: string) => {
    onChange({ ...data, certifications: data.certifications.filter(c => c.id !== id) });
  };

  // --- Custom Section Handlers ---

  const addCustomSection = () => {
    const newSection: CustomSection = { id: crypto.randomUUID(), title: 'Custom Section', items: [] };
    onChange({ ...data, customSections: [...data.customSections, newSection] });
    setActiveSection(`cust-${newSection.id}`);
  };

  const updateCustomSectionTitle = (id: string, title: string) => {
    onChange({ ...data, customSections: data.customSections.map(s => s.id === id ? { ...s, title } : s) });
  };

  const removeCustomSection = (id: string) => {
    onChange({ ...data, customSections: data.customSections.filter(s => s.id !== id) });
  };

  const addCustomItem = (sectionId: string) => {
    const newItem: CustomSectionItem = { id: crypto.randomUUID(), title: '', subtitle: '', date: '', description: '' };
    onChange({
      ...data,
      customSections: data.customSections.map(s => 
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      )
    });
  };

  const updateCustomItem = (sectionId: string, itemId: string, field: keyof CustomSectionItem, value: string) => {
    onChange({
      ...data,
      customSections: data.customSections.map(s => 
        s.id === sectionId ? { 
          ...s, 
          items: s.items.map(i => i.id === itemId ? { ...i, [field]: value } : i) 
        } : s
      )
    });
  };

  const removeCustomItem = (sectionId: string, itemId: string) => {
     onChange({
      ...data,
      customSections: data.customSections.map(s => 
        s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
      )
    });
  };


  // --- Helper Components ---

  const AIButton = ({ onClick, loading, label }: { onClick: () => void, loading: boolean, label?: string }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all
        ${loading ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-sm'}
      `}
      title="Use Gemini AI to enhance"
    >
      {loading ? (
        <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <Sparkles size={12} />
      )}
      {label || 'Enhance'}
    </button>
  );

  const SectionTitle = ({ title, isOpen, onClick }: { title: string, isOpen: boolean, onClick: () => void }) => (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <h3 className="font-semibold text-gray-800">{title}</h3>
      {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 pb-20">
      
      {/* Personal Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <SectionTitle title="Personal Information" isOpen={activeSection === 'personal'} onClick={() => toggleSection('personal')} />
        
        {activeSection === 'personal' && (
          <div className="p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
                <input type="text" value={data.personalInfo.jobTitle} onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="Software Engineer" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="+1 234 567 890" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={data.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="San Francisco, CA" />
              </div>
              <div>
                 <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn (Optional)</label>
                 <input type="text" value={data.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="linkedin.com/in/john" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-700">Professional Summary</label>
                <AIButton 
                  label="Generate with AI" 
                  loading={loadingField === 'summary'} 
                  onClick={handleGenerateSummary} 
                />
              </div>
              <textarea 
                value={data.personalInfo.summary} 
                onChange={(e) => updatePersonalInfo('summary', e.target.value)} 
                rows={4} 
                className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none" 
                placeholder="Briefly describe your professional background..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Experience</h3>
          <button onClick={addExperience} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 transition-colors">
            <Plus size={16} /> Add
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="group">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(`exp-${exp.id}`)}
              >
                <div>
                   <h4 className="font-medium text-gray-800 text-sm">{exp.title || '(No Title)'}</h4>
                   <p className="text-xs text-gray-500">{exp.company}</p>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                     onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                     className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={16} />
                   </button>
                   {activeSection === `exp-${exp.id}` ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                </div>
              </div>

              {activeSection === `exp-${exp.id}` && (
                 <div className="p-5 bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
                       <input type="text" value={exp.title} onChange={(e) => updateExperience(exp.id, 'title', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Senior Manager" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
                       <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Acme Corp" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                       <input type="text" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Jan 2020" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                       <div className="flex gap-2 items-center">
                          <input 
                            type="text" 
                            disabled={exp.current}
                            value={exp.endDate} 
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} 
                            className={`w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${exp.current ? 'bg-gray-100 text-gray-400' : ''}`} 
                            placeholder="Dec 2022" 
                          />
                          <div className="flex items-center gap-1.5 min-w-fit">
                            <input 
                              type="checkbox" 
                              checked={exp.current} 
                              onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-xs text-gray-600">Current</span>
                          </div>
                       </div>
                     </div>
                   </div>
                   
                   <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-gray-700">Description</label>
                        <AIButton 
                          loading={loadingField === `exp-desc-${exp.id}`} 
                          onClick={() => handleAiEnhance(`exp-desc-${exp.id}`, exp.description, exp.title, (txt) => updateExperience(exp.id, 'description', txt))}
                        />
                      </div>
                      <textarea 
                        value={exp.description} 
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} 
                        rows={4} 
                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="• Achieved X by doing Y..."
                      />
                   </div>
                 </div>
              )}
            </div>
          ))}
          {data.experience.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">No experience added yet.</div>}
        </div>
      </div>

       {/* Projects */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Projects</h3>
          <button onClick={addProject} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 transition-colors">
            <Plus size={16} /> Add
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {data.projects.map((proj) => (
            <div key={proj.id} className="group">
               <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(`proj-${proj.id}`)}
              >
                <div>
                   <h4 className="font-medium text-gray-800 text-sm">{proj.name || '(No Name)'}</h4>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                     onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}
                     className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={16} />
                   </button>
                   {activeSection === `proj-${proj.id}` ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                </div>
              </div>

               {activeSection === `proj-${proj.id}` && (
                 <div className="p-5 bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Project Name</label>
                       <input type="text" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Link (Optional)</label>
                       <input type="text" value={proj.link} onChange={(e) => updateProject(proj.id, 'link', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
                     </div>
                   </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-gray-700">Description</label>
                        <AIButton 
                          loading={loadingField === `proj-desc-${proj.id}`} 
                          onClick={() => handleAiEnhance(`proj-desc-${proj.id}`, proj.description, "Tech Project", (txt) => updateProject(proj.id, 'description', txt))}
                        />
                      </div>
                      <textarea 
                        value={proj.description} 
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)} 
                        rows={3} 
                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                   </div>
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Education</h3>
          <button onClick={addEducation} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 transition-colors">
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {data.education.map((edu) => (
             <div key={edu.id} className="group">
               <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(`edu-${edu.id}`)}
              >
                <div>
                   <h4 className="font-medium text-gray-800 text-sm">{edu.school || '(No School)'}</h4>
                   <p className="text-xs text-gray-500">{edu.degree}</p>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                     onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                     className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={16} />
                   </button>
                   {activeSection === `edu-${edu.id}` ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                </div>
              </div>
               {activeSection === `edu-${edu.id}` && (
                 <div className="p-5 bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">School / University</label>
                       <input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Degree</label>
                       <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="BSc Computer Science" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Graduation Date</label>
                       <input type="text" value={edu.graduationDate} onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="May 2019" />
                     </div>
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <textarea 
                        value={edu.description} 
                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)} 
                        rows={2} 
                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                   </div>
                 </div>
               )}
             </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Certifications</h3>
          <button onClick={addCertification} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 transition-colors">
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {data.certifications.map((cert) => (
             <div key={cert.id} className="group">
               <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(`cert-${cert.id}`)}
              >
                <div>
                   <h4 className="font-medium text-gray-800 text-sm">{cert.name || '(No Name)'}</h4>
                   <p className="text-xs text-gray-500">{cert.issuer}</p>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                     onClick={(e) => { e.stopPropagation(); removeCertification(cert.id); }}
                     className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={16} />
                   </button>
                   {activeSection === `cert-${cert.id}` ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                </div>
              </div>
               {activeSection === `cert-${cert.id}` && (
                 <div className="p-5 bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Certification Name</label>
                       <input type="text" value={cert.name} onChange={(e) => updateCertification(cert.id, 'name', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="AWS Certified..." />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Issuer</label>
                       <input type="text" value={cert.issuer} onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Amazon Web Services" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                       <input type="text" value={cert.date} onChange={(e) => updateCertification(cert.id, 'date', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Aug 2023" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-gray-700 mb-1">Link (Optional)</label>
                       <input type="text" value={cert.link} onChange={(e) => updateCertification(cert.id, 'link', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
                     </div>
                   </div>
                 </div>
               )}
             </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <SectionTitle title="Skills" isOpen={activeSection === 'skills'} onClick={() => toggleSection('skills')} />
        
        {activeSection === 'skills' && (
          <div className="p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
             <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-700">Skills List (Comma Separated)</label>
                <AIButton 
                  label="Suggest Skills" 
                  loading={loadingField === 'skills'} 
                  onClick={handleSuggestSkills} 
                />
              </div>
             <textarea 
               value={data.skills.join(', ')} 
               onChange={(e) => handleSkillChange(e.target.value)}
               rows={3}
               className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
               placeholder="React, TypeScript, Project Management..."
             />
             <div className="flex flex-wrap gap-2 mt-2">
               {data.skills.map((skill, idx) => (
                 <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">{skill}</span>
               ))}
             </div>
          </div>
        )}
      </div>

      {/* Custom Sections */}
      {data.customSections.map((section) => (
         <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={section.title} 
                      onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
                      className="font-semibold text-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-1"
                      placeholder="Section Title"
                    />
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => addCustomItem(section.id)} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 transition-colors">
                        <Plus size={16} /> Item
                   </button>
                   <button onClick={() => removeCustomSection(section.id)} className="text-gray-400 hover:text-red-500 ml-2">
                       <Trash2 size={16} />
                   </button>
                </div>
             </div>
             
             <div className="divide-y divide-gray-100">
                {section.items.map((item) => (
                    <div key={item.id} className="group">
                        <div 
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleSection(`cust-${section.id}-${item.id}`)}
                        >
                             <div>
                                <h4 className="font-medium text-gray-800 text-sm">{item.title || '(No Title)'}</h4>
                                <p className="text-xs text-gray-500">{item.subtitle}</p>
                             </div>
                             <div className="flex items-center gap-3">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeCustomItem(section.id, item.id); }}
                                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                                {activeSection === `cust-${section.id}-${item.id}` ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                             </div>
                        </div>

                        {activeSection === `cust-${section.id}-${item.id}` && (
                            <div className="p-5 bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                                        <input type="text" value={item.title} onChange={(e) => updateCustomItem(section.id, item.id, 'title', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                     </div>
                                     <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle</label>
                                        <input type="text" value={item.subtitle} onChange={(e) => updateCustomItem(section.id, item.id, 'subtitle', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Role / Issuer / Location" />
                                     </div>
                                     <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                                        <input type="text" value={item.date} onChange={(e) => updateCustomItem(section.id, item.id, 'date', e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="2023" />
                                     </div>
                                 </div>
                                 <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-xs font-medium text-gray-700">Description (Optional)</label>
                                        <AIButton 
                                          loading={loadingField === `cust-desc-${item.id}`} 
                                          onClick={() => handleAiEnhance(`cust-desc-${item.id}`, item.description, section.title, (txt) => updateCustomItem(section.id, item.id, 'description', txt))}
                                        />
                                    </div>
                                    <textarea 
                                        value={item.description} 
                                        onChange={(e) => updateCustomItem(section.id, item.id, 'description', e.target.value)} 
                                        rows={2} 
                                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {section.items.length === 0 && <div className="p-4 text-center text-gray-400 text-xs">No items in this section.</div>}
             </div>
         </div>
      ))}

      {/* Add Custom Section Button */}
      <button 
        onClick={addCustomSection}
        className="w-full py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
      >
        <LayoutTemplate size={18} />
        Add Custom Section
      </button>

    </div>
  );
};

export default ResumeForm;
