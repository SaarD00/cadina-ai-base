
import React from 'react';
import { cn } from "@/lib/utils";
import EditableField from './EditableField';
import AddSectionItem from './AddSectionItem';
import ContactInfo from './ContactInfo';
import { v4 as uuidv4 } from 'uuid';
import { Experience, Education, Project, ResumeSettings } from '@/types/resume';

interface ModernTemplateProps {
  data: any;
  settings?: ResumeSettings;
  onUpdateData?: (section: string, value: any) => void;
  onGenerateWithAI?: (section: string) => Promise<string>;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({
  data,
  settings = {},
  onUpdateData,
  onGenerateWithAI
}) => {
  // Ensure data has all required properties with defaults
  const safeData = React.useMemo(() => {
    return {
      ...data,
      experience: Array.isArray(data.experience) ? data.experience : [],
      education: Array.isArray(data.education) ? data.education : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      skills: data.skills || { technical: [], soft: [] },
      personal: data.personal || {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        website: ""
      },
      summary: data.summary || ""
    };
  }, [data]);

  const handleFieldUpdate = (section: string, field: string, value: string, itemId?: string) => {
    if (onUpdateData) {
      if (itemId && ['experience', 'education', 'projects'].includes(section)) {
        // Handling array items (experience, education, projects)
        const items = [...safeData[section]];
        const itemIndex = items.findIndex((item: any) => item.id === itemId);
        
        if (itemIndex >= 0) {
          const updatedItem = { ...items[itemIndex], [field]: value };
          items[itemIndex] = updatedItem;
          onUpdateData(section, items);
        }
      } else {
        // Handling other sections (personal, summary, skills)
        onUpdateData(section, {
          ...safeData[section],
          [field]: value
        });
      }
    }
  };

  const handleAddExperience = () => {
    if (onUpdateData) {
      onUpdateData("experience", [
        ...safeData.experience,
        {
          id: uuidv4(),
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]);
    }
  };

  const handleAddEducation = () => {
    if (onUpdateData) {
      onUpdateData("education", [
        ...safeData.education,
        {
          id: uuidv4(),
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]);
    }
  };

  // Color helper functions
  const getPrimaryColor = () => {
    return settings?.primaryColor || '#5d4dcd';
  };

  const getSecondaryColor = () => {
    return settings?.secondaryColor || '#333333';
  };

  const getAccentColor = () => {
    return settings?.accentColor || '#d6bcfa';
  };

  const nameClass = "text-xl font-bold text-gray-900 leading-tight tracking-tight pb-0 mb-1";
  const experienceTitleClass = "font-medium text-gray-800 text-sm";
  const experienceDateClass = "text-sm text-gray-600 ml-3 whitespace-nowrap min-w-[100px] max-w-[160px]";
  const experienceDescriptionClass = "text-sm text-gray-700 mt-1 font-normal leading-relaxed";

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 max-w-full", settings.fontFamily && `font-[${settings.fontFamily}]`)}
      style={{
        padding: "20px",
        background: "#fff",
        fontSize: `${settings.fontSize || 11}pt`,
        lineHeight: "1.5"
      }}>
      <div className="pb-4 border-b-2 mb-4" style={{ borderColor: getPrimaryColor() }}>
        <EditableField
          value={safeData.personal.name}
          placeholder="John Smith"
          className={nameClass}
          onSave={val => onUpdateData?.("personal", { ...safeData.personal, name: val })}
          onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI("personal-name") : undefined}
          minRows={1}
          maxRows={1}
        />
        <EditableField
          value={safeData.personal.title}
          placeholder="Software Engineer"
          className="text-lg font-medium mt-1 transition-all"
          onSave={val => onUpdateData?.("personal", { ...safeData.personal, title: val })}
          onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI("personal-title") : undefined}
          minRows={1}
          maxRows={1}
          inputStyle={{ color: getPrimaryColor(), fontWeight: 500 }}
          outputStyle={{ color: getPrimaryColor(), fontWeight: 500 }}
        />
        <ContactInfo
          personal={safeData.personal}
          onUpdateData={onUpdateData}
          onGenerateWithAI={onGenerateWithAI}
        />
      </div>

      <div className="mb-6 resume-section">
        <h2 className="text-sm font-semibold mb-2 border-b border-gray-200 pb-1 uppercase tracking-wide" 
          style={{ color: getSecondaryColor() }}>
          Summary
        </h2>
        <EditableField 
          value={safeData.summary} 
          placeholder="Experienced software engineer with 5+ years of experience in full-stack development. ..." 
          onSave={val => onUpdateData?.("summary", val)} 
          className="text-sm text-gray-700 font-normal leading-relaxed" 
          onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI("summary") : undefined} 
          minRows={2} 
          maxRows={4} 
        />
      </div>

      <div className="mb-6 resume-section">
        <h2 className="text-sm font-semibold mb-2 border-b border-gray-200 pb-1 uppercase tracking-wide"
          style={{ color: getSecondaryColor() }}>
          Experience
        </h2>
        {safeData.experience.map((exp: Experience) => (
          <div key={exp.id} className="mb-5 last:mb-0 resume-item">
            <div className="flex items-baseline justify-between flex-wrap gap-x-2">
              <div className="flex-1 min-w-0">
                <EditableField
                  value={exp.title}
                  placeholder="Senior Software Engineer"
                  className={experienceTitleClass}
                  onSave={val => handleFieldUpdate("experience", "title", val, exp.id)}
                  onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`experience-title`) : undefined}
                  minRows={1}
                  maxRows={1}
                />
              </div>
              <EditableField
                value={`${exp.startDate} - ${exp.endDate}`}
                placeholder="Jan 2022 - Present"
                className={experienceDateClass}
                onSave={val => {
                  const [startDate, endDate] = val.split(" - ");
                  
                  // Update start date
                  handleFieldUpdate("experience", "startDate", startDate || "", exp.id);
                  
                  // Update end date
                  handleFieldUpdate("experience", "endDate", endDate || "", exp.id);
                }}
                onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`experience-dates`) : undefined}
                minRows={1}
                maxRows={1}
              />
            </div>
            <EditableField
              value={exp.company && exp.location ? `${exp.company}, ${exp.location}` : exp.company || exp.location || ""}
              placeholder="Tech Solutions Inc., San Francisco, CA"
              className="text-sm font-medium my-0.5"
              onSave={val => {
                let [company, ...locParts] = val.split(",");
                const location = locParts.join(",").trim();
                
                // Update company
                handleFieldUpdate("experience", "company", company?.trim() || "", exp.id);
                
                // Update location
                handleFieldUpdate("experience", "location", location, exp.id);
              }}
              onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`experience-company`) : undefined}
              minRows={1}
              maxRows={1}
              inputStyle={{ color: getPrimaryColor() }}
              outputStyle={{ color: getPrimaryColor() }}
            />
            <EditableField
              value={exp.description}
              placeholder="Lead developer for the company's flagship product..."
              className={experienceDescriptionClass}
              onSave={val => handleFieldUpdate("experience", "description", val, exp.id)}
              onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`experience-desc:${exp.id}`) : undefined}
              minRows={1}
              maxRows={3}
            />
          </div>
        ))}
        <AddSectionItem onAdd={handleAddExperience} />
      </div>

      <div className="mb-6 resume-section">
        <h2 className="text-sm font-semibold mb-2 border-b border-gray-200 pb-1 uppercase tracking-wide"
          style={{ color: getSecondaryColor() }}>
          Education
        </h2>
        {safeData.education.map((edu: Education) => (
          <div key={edu.id} className="mb-5 last:mb-0 resume-item">
            <div className="flex items-baseline justify-between flex-wrap gap-x-2">
              <div className="flex-1 min-w-0">
                <EditableField
                  value={edu.degree}
                  placeholder="Master of Science in Computer Science"
                  className={experienceTitleClass}
                  onSave={val => handleFieldUpdate("education", "degree", val, edu.id)}
                  onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`education-degree`) : undefined}
                  minRows={1}
                  maxRows={1}
                />
                <EditableField
                  value={edu.institution && edu.location ? `${edu.institution}, ${edu.location}` : edu.institution || edu.location || ""}
                  placeholder="Stanford University, Stanford, CA"
                  className="text-sm font-medium my-0.5"
                  onSave={val => {
                    let [inst, ...locParts] = val.split(",");
                    const location = locParts.join(",").trim();
                    
                    // Update institution
                    handleFieldUpdate("education", "institution", inst?.trim() || "", edu.id);
                    
                    // Update location
                    handleFieldUpdate("education", "location", location, edu.id);
                  }}
                  onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`education-institution`) : undefined}
                  minRows={1}
                  maxRows={1}
                  inputStyle={{ color: getPrimaryColor() }}
                  outputStyle={{ color: getPrimaryColor() }}
                />
              </div>
              <EditableField
                value={`${edu.startDate} - ${edu.endDate}`}
                placeholder="Sep 2017 - May 2019"
                className={experienceDateClass}
                onSave={val => {
                  const [startDate, endDate] = val.split(" - ");
                  
                  // Update start date
                  handleFieldUpdate("education", "startDate", startDate || "", edu.id);
                  
                  // Update end date
                  handleFieldUpdate("education", "endDate", endDate || "", edu.id);
                }}
                onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`education-dates`) : undefined}
                minRows={1}
                maxRows={1}
              />
            </div>
            <EditableField
              value={edu.description || ""}
              placeholder="Specialization in Artificial Intelligence. GPA: 3.8/4.0"
              className={experienceDescriptionClass}
              onSave={val => handleFieldUpdate("education", "description", val, edu.id)}
              onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`education-desc`) : undefined}
              minRows={1}
              maxRows={2}
            />
          </div>
        ))}
        <AddSectionItem onAdd={handleAddEducation} />
      </div>

      <div className="mb-2 pb-2 border-b border-gray-200 resume-section">
        <h2 className="text-sm font-semibold mb-2 border-b border-gray-200 pb-1 uppercase tracking-wide"
          style={{ color: getSecondaryColor() }}>
          Skills
        </h2>
        <div className="mb-3">
          <div className="font-medium text-gray-700 text-sm mb-1.5">Technical Skills</div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {safeData.skills.technical.map((skill: string, i: number) => (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded-sm text-sm border-[0.5px] shadow-xs transition whitespace-nowrap font-normal"
                style={{ 
                  backgroundColor: `${getPrimaryColor()}20`, 
                  borderColor: `${getPrimaryColor()}40`,
                  color: getPrimaryColor()
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="font-medium text-gray-700 text-sm mb-1.5">Soft Skills</div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {safeData.skills.soft.map((skill: string, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-[#f3f3f3] text-gray-600 font-medium rounded-sm text-sm border-[0.5px] border-[#e5e5e5] transition whitespace-nowrap">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {safeData.projects && safeData.projects.length > 0 && (
        <div className="mb-6 resume-section">
          <h2 className="text-sm font-semibold mb-2 border-b border-gray-200 pb-1 uppercase tracking-wide"
            style={{ color: getSecondaryColor() }}>
            Projects
          </h2>
          {safeData.projects.map((project: Project) => (
            <div key={project.id} className="mb-5 last:mb-0 resume-item">
              <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                <div className="flex-1 min-w-0">
                  <EditableField
                    value={project.title}
                    placeholder="Project Name"
                    className={experienceTitleClass}
                    onSave={val => handleFieldUpdate("projects", "title", val, project.id)}
                    minRows={1}
                    maxRows={1}
                  />
                </div>
                <EditableField
                  value={`${project.startDate} - ${project.endDate}`}
                  placeholder="Jan 2023 - Present"
                  className={experienceDateClass}
                  onSave={val => {
                    const [startDate, endDate] = val.split(" - ");
                    handleFieldUpdate("projects", "startDate", startDate || "", project.id);
                    handleFieldUpdate("projects", "endDate", endDate || "", project.id);
                  }}
                  minRows={1}
                  maxRows={1}
                />
              </div>
              <EditableField
                value={project.description}
                placeholder="Describe the project and your role..."
                className={experienceDescriptionClass}
                onSave={val => handleFieldUpdate("projects", "description", val, project.id)}
                minRows={1}
                maxRows={3}
              />
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.technologies.map((tech: string, i: number) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded-sm text-sm border-[0.5px] shadow-xs transition whitespace-nowrap font-normal"
                      style={{ 
                        backgroundColor: `${getPrimaryColor()}20`, 
                        borderColor: `${getPrimaryColor()}40`,
                        color: getPrimaryColor()
                      }}
                    >
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
                  className="text-sm hover:underline mt-1 inline-block"
                  style={{ color: getPrimaryColor() }}
                >
                  View Project →
                </a>
              )}
            </div>
          ))}
          <AddSectionItem onAdd={() => {
            const newProject = {
              id: uuidv4(),
              title: "",
              description: "",
              technologies: [],
              startDate: "",
              endDate: "",
              link: ""
            };
            onUpdateData?.("projects", [...(safeData.projects || []), newProject]);
          }} />
        </div>
      )}

      {/* Certifications Section */}
      {safeData.certifications && safeData.certifications.length > 0 && (
        <div className="mb-6 resume-section">
          <h2 className="text-sm font-semibold mb-2 border-b border-gray-200 pb-1 uppercase tracking-wide"
            style={{ color: getSecondaryColor() }}>
            Certifications
          </h2>
          <div className="space-y-2">
            {safeData.certifications.map((cert: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getPrimaryColor() }}>
                </div>
                <span className="text-sm text-gray-700 font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
