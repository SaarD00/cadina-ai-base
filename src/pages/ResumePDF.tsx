import React, { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useResumeData } from '@/hooks/use-resume-data';
import { Project, SegmentStyles, Experience, Education } from '@/types/resume';

const ResumePDF = () => {
  const { resumeId } = useParams();
  const { resumeData, isLoading, resumeSettings } = useResumeData(resumeId);

  // Add print-specific CSS when component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body { margin: 0; }
        @page { 
          margin: 0.5in;
          size: A4;
        }
        .print-break { page-break-before: always; }
        .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-lg text-gray-600">Loading resume...</div>
      </div>
    );
  }

  const formatBulletPoints = (text: string, limit?: number) => {
    if (!text) return [];
    
    // Handle text that already has bullet points
    const points = text
      .split('\n')
      .filter(point => point.trim() !== '')
      .map(point => {
        // Clean up the point by removing any existing bullet symbols
        let cleanPoint = point.trim().replace(/^[-•*]\s*/, '');
        
        // Ensure point starts with an action verb if possible
        if (!/^[A-Z][a-z]+ed|^[A-Z][a-z]+ing|^[A-Z][a-z]+s\b/.test(cleanPoint)) {
          cleanPoint = cleanPoint.charAt(0).toUpperCase() + cleanPoint.slice(1);
        }
        
        return cleanPoint;
      });
    
    // Apply limit if specified
    return limit ? points.slice(0, limit) : points;
  };

  // Get styles for sections
  const getHeaderStyles = () => {
    const customStyles = resumeSettings?.customStyles?.header;
    return {
      color: customStyles?.color || '#5d4dcd',
      textAlign: customStyles?.textAlign || 'center',
      fontWeight: customStyles?.fontWeight || 'bold',
      fontSize: customStyles?.fontSize ? `calc(${customStyles.fontSize} * 1.2)` : 'inherit',
      fontStyle: customStyles?.fontStyle || 'normal',
      textDecoration: customStyles?.textDecoration || 'none'
    };
  };

  const getSectionTitleStyles = (section: string) => {
    const customStyles = resumeSettings?.customStyles?.[section];
    return {
      color: customStyles?.color || '#5d4dcd',
      textAlign: customStyles?.textAlign || 'left',
      borderColor: customStyles?.color || '#5d4dcd',
      fontWeight: 'semibold',
      fontStyle: customStyles?.fontStyle || 'normal',
      textDecoration: customStyles?.textDecoration || 'none'
    };
  };

  // Calculate dynamic content height for responsive sizing
  const calculateContentHeight = useMemo(() => {
    let estimatedHeight = 200; // Header base height
    
    if (resumeData.summary) estimatedHeight += 100;
    estimatedHeight += (resumeData.experience?.length || 0) * 150;
    estimatedHeight += (resumeData.education?.length || 0) * 120;
    estimatedHeight += (resumeData.projects?.length || 0) * 140;
    estimatedHeight += 150; // Skills section
    
    // Determine if we need multiple pages
    const singlePageHeight = 1000; // ~A4 page height in pixels
    const pages = Math.ceil(estimatedHeight / singlePageHeight);
    
    return {
      height: Math.max(estimatedHeight, singlePageHeight),
      pages,
      isMultiPage: pages > 1
    };
  }, [resumeData]);

  // Render template based on selected template
  const renderTemplateContent = () => {
    const templateToUse = resumeSettings?.template || 'modern';
    
    switch (templateToUse) {
      case 'professional':
        return renderProfessionalTemplate();
      case 'customizable':
        return renderCustomizableTemplate();
      case 'modern':
      default:
        return renderModernTemplate();
    }
  };

  const renderModernTemplate = () => (
    <>
      {/* Header */}
      <div className="pb-2 border-b-2 border-[#5d4dcd] mb-3" style={{ borderColor: getHeaderStyles().color }}>
        <h1 
          className="text-2xl font-bold text-gray-900 leading-tight tracking-tight pb-0 mb-1"
          style={{
            ...getHeaderStyles(),
            textAlign: getHeaderStyles().textAlign as 'left' | 'center' | 'right'
          }}
        >
          {resumeData.personal.name}
        </h1>
        <p 
          className="text-lg font-medium mt-0.5"
          style={{
            color: getHeaderStyles().color,
            textAlign: getHeaderStyles().textAlign as 'left' | 'center' | 'right'
          }}
        >
          {resumeData.personal.title}
        </p>
        <div className="flex flex-wrap text-sm text-gray-700 mt-1.5 gap-x-2 gap-y-1 items-center justify-center">
          {resumeData.personal.email && (
            <span className="inline-flex items-center">
              <span>{resumeData.personal.email}</span>
            </span>
          )}
          {resumeData.personal.phone && (
            <>
              <span className="text-gray-400">•</span>
              <span className="inline-flex items-center">
                <span>{resumeData.personal.phone}</span>
              </span>
            </>
          )}
          {resumeData.personal.location && (
            <>
              <span className="text-gray-400">•</span>
              <span className="inline-flex items-center">
                <span>{resumeData.personal.location}</span>
              </span>
            </>
          )}
          {resumeData.personal.linkedin && (
            <>
              <span className="text-gray-400">•</span>
              <span className="inline-flex items-center">
                <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" 
                   className="text-[#5d4dcd] hover:text-[#4a3da3]" style={{ color: getHeaderStyles().color }}>
                  LinkedIn
                </a>
              </span>
            </>
          )}
          {resumeData.personal.website && (
            <>
              <span className="text-gray-400">•</span>
              <span className="inline-flex items-center">
                <a href={resumeData.personal.website} target="_blank" rel="noopener noreferrer"
                   className="text-[#5d4dcd] hover:text-[#4a3da3]" style={{ color: getHeaderStyles().color }}>
                  Portfolio
                </a>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-1 border-b border-gray-200 pb-0.5 uppercase tracking-wide"
              style={getSectionTitleStyles('summary')}>
            Summary
          </h2>
          <ul className="list-disc pl-4 text-sm text-gray-700 font-normal leading-relaxed">
            {formatBulletPoints(resumeData.summary, 3).map((point, index) => (
              <li key={index} className="mb-1">{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-1 border-b border-gray-200 pb-0.5 uppercase tracking-wide"
              style={getSectionTitleStyles('experience')}>
            Experience
          </h2>
          {resumeData.experience.map((exp: Experience, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 text-sm">{exp.title}</h3>
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="text-sm text-[#5d4dcd] font-medium my-0.5" style={{ color: getHeaderStyles().color }}>
                {exp.company}, {exp.location}
              </p>
              <ul className="list-disc pl-4 text-sm text-gray-700 mt-1 font-normal leading-relaxed">
                {formatBulletPoints(exp.description).map((point, i) => (
                  <li key={i} className="mb-1">{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-1 border-b border-gray-200 pb-0.5 uppercase tracking-wide"
              style={getSectionTitleStyles('projects')}>
            Projects
          </h2>
          {resumeData.projects.map((project: Project, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 text-sm">{project.title}</h3>
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {project.startDate} - {project.endDate}
                </span>
              </div>
              <ul className="list-disc pl-4 text-sm text-gray-700 mt-1 font-normal leading-relaxed">
                {formatBulletPoints(project.description).map((point, i) => (
                  <li key={i} className="mb-1">{point}</li>
                ))}
              </ul>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-[#efeafc] rounded-sm text-xs border-[0.5px] border-[#dad3f8] shadow-xs text-violet-400 font-normal">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#5d4dcd] hover:text-[#4a3da3] mt-1 inline-block"
                  style={{ color: getHeaderStyles().color }}
                >
                  View Project →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-1 border-b border-gray-200 pb-0.5 uppercase tracking-wide"
              style={getSectionTitleStyles('education')}>
            Education
          </h2>
          {resumeData.education.map((edu: Education, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 text-sm">{edu.degree}</h3>
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <p className="text-sm text-[#5d4dcd] font-medium my-0.5" style={{ color: getHeaderStyles().color }}>
                {edu.institution}, {edu.location}
              </p>
              {edu.description && (
                <ul className="list-disc pl-4 text-sm text-gray-700 mt-1 font-normal leading-relaxed">
                  {formatBulletPoints(edu.description).map((point, i) => (
                    <li key={i} className="mb-1">{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-1 border-b border-gray-200 pb-0.5 uppercase tracking-wide"
              style={getSectionTitleStyles('skills')}>
            Skills
          </h2>
          {resumeData.skills.technical.length > 0 && (
            <div className="mb-2">
              <div className="font-medium text-gray-700 text-sm mb-1">Technical Skills</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {resumeData.skills.technical.map((skill, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-[#efeafc] rounded-sm text-xs border-[0.5px] border-[#dad3f8] shadow-xs text-violet-400 font-normal">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {resumeData.skills.soft.length > 0 && (
            <div>
              <div className="font-medium text-gray-700 text-sm mb-1">Soft Skills</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {resumeData.skills.soft.map((skill, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-[#f3f3f3] text-gray-600 font-medium rounded-sm text-xs border-[0.5px] border-[#e5e5e5]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderProfessionalTemplate = () => (
    <div className="space-y-6">
      {/* Professional template layout with different styling */}
      <div className="text-center border-b-2 pb-4" style={{ borderColor: getHeaderStyles().color }}>
        <h1 className="text-3xl font-bold" style={{ color: getHeaderStyles().color }}>
          {resumeData.personal.name}
        </h1>
        <p className="text-xl text-gray-600 mt-2">{resumeData.personal.title}</p>
        <div className="text-sm text-gray-600 mt-2">
          {[resumeData.personal.email, resumeData.personal.phone, resumeData.personal.location].filter(Boolean).join(' • ')}
        </div>
      </div>
      
      {resumeData.summary && (
        <div>
          <h2 className="text-lg font-bold mb-2 text-gray-800">Professional Summary</h2>
          <p className="text-gray-700">{resumeData.summary}</p>
        </div>
      )}
      
      {/* Experience Section */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Professional Experience</h2>
          {resumeData.experience.map((exp: Experience, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                  <p className="text-gray-600">{exp.company}, {exp.location}</p>
                </div>
                <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</span>
              </div>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                {formatBulletPoints(exp.description).map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      
      {/* Rest of sections follow similar pattern */}
    </div>
  );

  const renderCustomizableTemplate = () => (
    <div className="p-4">
      {/* Customizable template with user-defined styling */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center" style={{ color: getHeaderStyles().color }}>
          {resumeData.personal.name}
        </h1>
        <p className="text-center text-lg mt-2">{resumeData.personal.title}</p>
      </div>
      {/* Rest of sections... */}
    </div>
  );

  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div 
        className="w-full mx-auto bg-white print:shadow-none"
        style={{
          fontFamily: resumeSettings?.fontFamily || 'Inter',
          fontSize: `${resumeSettings?.fontSize || 10}pt`,
          lineHeight: "1.4",
          printColorAdjust: "exact",
          minHeight: calculateContentHeight.isMultiPage ? `${calculateContentHeight.height}px` : "100vh",
          maxWidth: "210mm", // A4 width
          padding: "20mm", // A4 margins
          margin: "0 auto"
        }}
      >
        {renderTemplateContent()}
      </div>
    </div>
  );
};

export default ResumePDF;