import React, { useState, useRef, useEffect } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { ResumeData } from './types';
import { Download, Sparkles, Layout, Palette, FileJson, Upload } from 'lucide-react';

const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: 'Jordan Smith',
    email: 'jordan.smith@example.com',
    phone: '+1 (555) 987-6543',
    location: 'Seattle, WA',
    website: 'jordansmith.dev',
    linkedin: 'linkedin.com/in/jordansmith',
    jobTitle: 'Junior Software Engineer',
    summary: 'Motivated Computer Science graduate with a strong foundation in full-stack development. Passionate about building scalable web applications and learning new technologies. Proven ability to work in agile environments through internships and academic projects. Seeking a challenging role to contribute to innovative software solutions.',
  },
  experience: [
    {
      id: '1',
      title: 'Software Engineering Intern',
      company: 'Innovate Tech Solutions',
      startDate: 'Jun 2023',
      endDate: 'Aug 2023',
      current: false,
      description: '• Collaborated with a team of 5 to develop a feature for the internal dashboard using React and Node.js.\n• Assisted in writing unit tests, increasing code coverage by 15%.\n• Participated in daily stand-ups and code reviews to ensure code quality.',
    },
    {
      id: '2',
      title: 'Frontend Developer (Volunteer)',
      company: 'Local Non-Profit',
      startDate: 'Jan 2023',
      endDate: 'May 2023',
      current: false,
      description: '• Revamped the organization’s website, improving mobile responsiveness and accessibility.\n• Implemented a donation form integrated with Stripe API.\n• Maintained website content and fixed bugs reported by users.',
    }
  ],
  education: [
    {
      id: '1',
      school: 'University of Washington',
      degree: 'B.S. in Computer Science',
      graduationDate: 'May 2024',
      description: 'GPA: 3.8/4.0. Relevant Coursework: Data Structures, Algorithms, Web Development, Database Systems, Artificial Intelligence.',
    }
  ],
  skills: ['JavaScript (ES6+)', 'TypeScript', 'React.js', 'Node.js', 'Python', 'Git/GitHub', 'SQL', 'Tailwind CSS'],
  projects: [
      {
          id: '1',
          name: 'TaskMaster App',
          description: 'A productivity application allowing users to manage tasks with drag-and-drop functionality. Built with React, Redux, and Firebase.',
          link: 'github.com/jordan/taskmaster'
      },
      {
          id: '2',
          name: 'Weather Forecaster',
          description: 'A weather dashboard consuming OpenWeatherMap API to display real-time weather data. Features include location search and 5-day forecast.',
          link: 'weather-forecaster-demo.com'
      }
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: 'Aug 2023',
      link: 'aws.amazon.com/verify'
    }
  ],
  customSections: [
    {
      id: '1',
      title: 'Awards & Honors',
      items: [
        {
          id: '1',
          title: 'Dean’s List',
          subtitle: 'University of Washington',
          date: '2021 - 2024',
          description: 'Awarded for maintaining a GPA above 3.5 for 6 consecutive semesters.'
        }
      ]
    }
  ],
  themeColor: '#4f46e5', // Indigo-600
};

const THEME_COLORS = [
    '#4f46e5', // Indigo
    '#0891b2', // Cyan
    '#059669', // Emerald
    '#db2777', // Pink
    '#dc2626', // Red
    '#2563eb', // Blue
    '#111827', // Gray-900
];

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resumeData');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsedData = JSON.parse(result);
        // Simple validation to check if it looks like our data
        if (parsedData.personalInfo && Array.isArray(parsedData.experience)) {
            setResumeData(parsedData);
        } else {
            alert("Invalid resume JSON format.");
        }
      } catch (error) {
        console.error("Failed to parse JSON", error);
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm print:hidden">
        <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Nova<span className="text-indigo-600">Resume</span></span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 mr-4">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1"><Palette size={14}/> Theme</span>
                <div className="flex gap-1.5">
                    {THEME_COLORS.map(c => (
                        <button 
                            key={c} 
                            onClick={() => setResumeData({...resumeData, themeColor: c})}
                            className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${resumeData.themeColor === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
             </div>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-md active:transform active:scale-95"
            >
              <Download size={16} />
              Export PDF
            </button>

            <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>

            <div className="flex gap-2">
                <button 
                onClick={handleExport}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm active:transform active:scale-95"
                title="Save as JSON"
                >
                <FileJson size={16} />
                <span className="hidden sm:inline">Save</span>
                </button>
                <button 
                onClick={handleImportClick}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm active:transform active:scale-95"
                title="Load JSON"
                >
                <Upload size={16} />
                <span className="hidden sm:inline">Load</span>
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".json" 
                    className="hidden" 
                />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 print:block print:p-0">
        
        {/* Left Panel: Editor */}
        <div className="lg:col-span-5 xl:col-span-4 print:hidden">
            <div className="mb-4 flex items-center gap-2 text-indigo-900/50 uppercase tracking-widest text-xs font-bold">
                <Layout size={14}/> Editor
            </div>
            <ResumeForm data={resumeData} onChange={setResumeData} />
        </div>

        {/* Right Panel: Preview */}
        <div className="lg:col-span-7 xl:col-span-8 print:w-full print:h-full">
            <div className="mb-4 flex items-center gap-2 text-indigo-900/50 uppercase tracking-widest text-xs font-bold print:hidden">
                <Layout size={14}/> Live Preview (Editable)
            </div>
            
            {/* Scrollable Container for Preview */}
            <div className="relative w-full overflow-x-auto lg:overflow-visible pb-12 lg:pb-0 perspective-1000 print:overflow-visible print:pb-0">
               <div className="min-w-[210mm] lg:min-w-0 flex justify-center lg:sticky lg:top-24 transition-all duration-300 origin-top">
                  <ResumePreview 
                    data={resumeData} 
                    previewRef={previewRef} 
                    onUpdate={setResumeData}
                  />
               </div>
            </div>
        </div>

      </main>

      {/* Print Styles for PDF Export */}
      <style>{`
        @media print {
          @page {
            /* Create space for header and footer on every page */
            margin: 15mm; 
            size: A4;
          }
          body {
            background: white;
          }
          /* Hide everything except the resume preview */
          body > * {
            display: none;
          }
          /* Re-display the root and main */
          #root, #root > div, main {
             display: block !important;
             margin: 0 !important;
             padding: 0 !important;
             background: white !important;
             height: auto !important;
             width: auto !important;
             overflow: visible !important;
          }
          /* Specific targeting to ensure preview is visible */
          #resume-preview {
             display: block !important;
             box-shadow: none !important;
             margin: 0 auto !important;
             width: 100% !important; 
             height: auto !important;
             min-height: auto !important;
             overflow: visible !important;
             print-color-adjust: exact;
             -webkit-print-color-adjust: exact;
          }
          
          /* Prevent breaking inside items and sections */
          .break-inside-avoid {
             break-inside: avoid;
             page-break-inside: avoid;
          }

          /* Ensure headings stick to their content */
          h1, h2, h3, h4 {
            break-after: avoid;
            page-break-after: avoid;
          }
        }
      `}</style>
    </div>
  );
}

export default App;