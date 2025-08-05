
import React from 'react';
import { useResumeAI } from '@/hooks/use-resume-ai';
import { Experience, Education, ResumeSettings, SegmentStyles } from '@/types/resume';
import ContactInfo from './ContactInfo';

interface ProfessionalTemplateProps {
  data: any;
  settings?: ResumeSettings & { customStyles?: Record<string, SegmentStyles> };
  onUpdateData?: (key: string, value: any) => void;
  onGenerateWithAI?: (section: string) => Promise<string>;
  isEditMode?: boolean;
}

const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ 
  data, 
  settings = {},
  onUpdateData = () => {},
  onGenerateWithAI,
  isEditMode = true
}) => {
  const { improveDescription, isGenerating } = useResumeAI();

  const handleUpdateData = (key: string, value: any) => {
    onUpdateData(key, value);
  };

  const handlePrimaryColor = () => {
    return settings?.primaryColor || "#5d4dcd";
  };

  const handleSecondaryColor = () => {
    return settings?.secondaryColor || "#333333";
  };

  const handleAccentColor = () => {
    return settings?.accentColor || "#d6bcfa";
  };

  const handleDescriptionBlur = async (exp: Experience, newDescription: string) => {
    if (exp.description === newDescription || !newDescription) {
      return;
    }

    try {
      // Update the local state immediately
      const updatedExp = { ...exp, description: newDescription };
      const updatedExperiences = data.experience.map((e: Experience) => 
        e.id === exp.id ? updatedExp : e
      );
      handleUpdateData("experience", updatedExperiences);
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const formatDate = (startDate?: string, endDate?: string) => {
    if (!startDate) return '';
    return `${startDate}${endDate ? ` - ${endDate}` : ''}`;
  };

  const handleGenerateDescription = async (description: string): Promise<string> => {
    return improveDescription(description);
  };

  // Fix the type error when handling technologies
  const formatTechnologies = (technologies: string[] | undefined): string => {
    if (!technologies || technologies.length === 0) {
      return '';
    }
    return technologies.join(', ');
  };

  // Apply custom styles if available
  const applyHeaderStyles = () => {
    if (settings?.customStyles?.header) {
      const headerStyle = settings.customStyles.header;
      return {
        color: headerStyle.color || handlePrimaryColor(),
        textAlign: headerStyle.textAlign || 'center',
        fontWeight: headerStyle.fontWeight || 'bold',
        fontSize: headerStyle.fontSize || '1.25rem',
        fontStyle: headerStyle.fontStyle || 'normal',
        textDecoration: headerStyle.textDecoration || 'none'
      };
    }
    return {
      color: handlePrimaryColor(),
      textAlign: 'center' as const
    };
  };

  // Apply section title styles
  const applySectionTitleStyles = (section: string) => {
    if (settings?.customStyles?.[section]) {
      const sectionStyle = settings.customStyles[section];
      return {
        color: sectionStyle.color || handlePrimaryColor(),
        textAlign: sectionStyle.textAlign || 'left',
        borderColor: sectionStyle.color || handlePrimaryColor()
      };
    }
    return {
      color: handlePrimaryColor(),
      textAlign: 'left' as const,
      borderColor: handlePrimaryColor()
    };
  };

  return (
    <div className="print:p-0" style={{ fontSize: `${settings.fontSize || 11}pt` }}>
      {/* Header Section */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold" style={applyHeaderStyles()}>
          {data.personal.name || "Your Name"}
        </h1>
        <p className="text-base font-semibold" style={{ 
          color: handleSecondaryColor(),
          textAlign: (settings?.customStyles?.header?.textAlign || 'center') as 'left' | 'center' | 'right'
        }}>
          {data.personal.title || "Professional Title"}
        </p>
        <ContactInfo 
          personal={data.personal} 
          onUpdateData={onUpdateData} 
          onGenerateWithAI={onGenerateWithAI}
          compact={true}
        />
      </div>

      {/* Summary Section */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold border-b-2 mb-2" 
            style={applySectionTitleStyles('summary')}>
            Summary
          </h2>
          <p className="text-sm">
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold border-b-2 mb-2" 
            style={applySectionTitleStyles('experience')}>
            Experience
          </h2>
          {data.experience.map((exp: Experience) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-semibold" style={{ color: handleSecondaryColor() }}>
                  {exp.title || "Position Title"}
                </h3>
                <span className="text-sm italic">
                  {formatDate(exp.startDate, exp.endDate)}
                </span>
              </div>
              <p className="text-sm font-medium">
                {exp.company}{exp.location ? `, ${exp.location}` : ''}
              </p>
              <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                {exp.description.split('\n').map((bullet, idx) => (
                  <li key={idx} className="text-sm">
                    {bullet.replace(/^[•-]\s*/, '')}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold border-b-2 mb-2" 
            style={applySectionTitleStyles('education')}>
            Education
          </h2>
          {data.education.map((edu: Education) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-semibold" style={{ color: handleSecondaryColor() }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </h3>
                <span className="text-sm italic">
                  {formatDate(edu.startDate, edu.endDate)}
                </span>
              </div>
              <p className="text-sm font-medium">
                {edu.institution}{edu.location ? `, ${edu.location}` : ''}
              </p>
              {edu.description && (
                <p className="text-sm mt-1">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {data.skills && (data.skills.technical?.length > 0 || data.skills.soft?.length > 0) && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold border-b-2 mb-2" 
            style={applySectionTitleStyles('skills')}>
            Skills
          </h2>
          {data.skills.technical?.length > 0 && (
            <div className="mb-2">
              <h3 className="text-sm font-semibold">Technical</h3>
              <p className="text-sm">
                {data.skills.technical.join(', ')}
              </p>
            </div>
          )}
          {data.skills.soft?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold">Soft Skills</h3>
              <p className="text-sm">
                {data.skills.soft.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold border-b-2 mb-2" 
            style={applySectionTitleStyles('projects')}>
            Projects
          </h2>
          {data.projects.map((project: any) => (
            <div key={project.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-semibold" style={{ color: handleSecondaryColor() }}>
                  {project.title || "Project Name"}
                </h3>
                <span className="text-sm italic">
                  {formatDate(project.startDate, project.endDate)}
                </span>
              </div>
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-sm font-medium">
                  Technologies: {formatTechnologies(project.technologies)}
                </p>
              )}
              <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                {project.description.split('\n').map((bullet: string, idx: number) => (
                  <li key={idx} className="text-sm">
                    {bullet.replace(/^[•-]\s*/, '')}
                  </li>
                ))}
              </ul>
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm hover:underline" 
                  style={{ color: handlePrimaryColor() }}
                >
                  View Project →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications Section */}
      {data.certifications && data.certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold border-b-2 mb-2" 
            style={applySectionTitleStyles('certifications')}>
            Certifications
          </h2>
          <div className="space-y-1">
            {data.certifications.map((cert: string, index: number) => (
              <div key={index} className="text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></span>
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages Section */}
      {data.languages && data.languages.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold border-b-2 mb-2" 
            style={applySectionTitleStyles('languages')}>
            Languages
          </h2>
          <p className="text-sm">
            {data.languages.map((lang: any) => `${lang.language} (${lang.proficiency})`).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
