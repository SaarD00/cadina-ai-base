
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import EditableField from './EditableField';
import AddSectionItem from './AddSectionItem';
import ContactInfo from './ContactInfo';
import { v4 as uuidv4 } from 'uuid';
import { Experience, Education, Project, SegmentStyles } from '@/types/resume';
import { ChromePicker } from 'react-color';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Palette,
  Text
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface CustomizableTemplateProps {
  data: any;
  settings?: any;
  onUpdateData?: (section: string, value: any) => void;
  onGenerateWithAI?: (section: string) => Promise<string>;
}

const defaultSegmentStyles: SegmentStyles = {
  color: '#333333',
  backgroundColor: 'transparent',
  textAlign: 'left',
  fontSize: '1rem',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  padding: '0px',
  margin: '0px'
};

const CustomizableTemplate: React.FC<CustomizableTemplateProps> = ({
  data,
  settings = {},
  onUpdateData,
  onGenerateWithAI
}) => {
  // Default segment styles
  const [segmentStyles, setSegmentStyles] = useState<Record<string, SegmentStyles>>({
    header: { ...defaultSegmentStyles, color: '#5d4dcd', fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center' },
    summary: { ...defaultSegmentStyles },
    experience: { ...defaultSegmentStyles },
    education: { ...defaultSegmentStyles },
    skills: { ...defaultSegmentStyles },
    projects: { ...defaultSegmentStyles },
  });
  
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  // Initialize with saved styles if available
  useEffect(() => {
    if (settings?.customStyles) {
      setSegmentStyles(prev => ({
        ...prev,
        ...settings.customStyles
      }));
    }
  }, [settings?.customStyles]);

  // Save styles when they change
  useEffect(() => {
    if (onUpdateData && JSON.stringify(segmentStyles) !== JSON.stringify(settings?.customStyles || {})) {
      const updatedSettings = {
        ...settings,
        customStyles: segmentStyles
      };
      onUpdateData("settings", updatedSettings);
    }
  }, [segmentStyles]);

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
      } else if (section === "personal") {
        // Handling personal info updates
        onUpdateData(section, {
          ...safeData.personal,
          [field]: value
        });
      } else if (section === "summary") {
        // Handling summary updates
        onUpdateData(section, value);
      } else {
        // Handling other sections
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

  const handleStyleChange = (segment: string, property: keyof SegmentStyles, value: any) => {
    setSegmentStyles(prev => ({
      ...prev,
      [segment]: {
        ...(prev[segment] || defaultSegmentStyles),
        [property]: value
      }
    }));
  };

  const StyleControls = ({ segment }: { segment: string }) => {
    const currentStyles = segmentStyles[segment] || { ...defaultSegmentStyles };

    return (
      <div className="absolute top-0 right-0 z-10 bg-white dark:bg-gray-850 shadow-lg rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 w-64">
        <div className="flex items-center gap-1 w-full">
          <Button 
            size="sm" 
            variant={currentStyles.textAlign === 'left' ? "default" : "outline"}
            className="p-1 h-8 w-8" 
            onClick={() => handleStyleChange(segment, 'textAlign', 'left')}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant={currentStyles.textAlign === 'center' ? "default" : "outline"}
            className="p-1 h-8 w-8" 
            onClick={() => handleStyleChange(segment, 'textAlign', 'center')}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant={currentStyles.textAlign === 'right' ? "default" : "outline"}
            className="p-1 h-8 w-8" 
            onClick={() => handleStyleChange(segment, 'textAlign', 'right')}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant={currentStyles.fontWeight === 'bold' ? "default" : "outline"}
            className="p-1 h-8 w-8" 
            onClick={() => handleStyleChange(segment, 'fontWeight', currentStyles.fontWeight === 'bold' ? 'normal' : 'bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant={currentStyles.fontStyle === 'italic' ? "default" : "outline"}
            className="p-1 h-8 w-8" 
            onClick={() => handleStyleChange(segment, 'fontStyle', currentStyles.fontStyle === 'italic' ? 'normal' : 'italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant={currentStyles.textDecoration === 'underline' ? "default" : "outline"}
            className="p-1 h-8 w-8" 
            onClick={() => handleStyleChange(segment, 'textDecoration', currentStyles.textDecoration === 'underline' ? 'none' : 'underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 w-full mt-2">
          <Text className="h-4 w-4" />
          <span className="text-xs">Font Size</span>
          <Slider 
            className="flex-1" 
            defaultValue={[parseFloat(currentStyles.fontSize) || 1]} 
            min={0.75} 
            max={2} 
            step={0.05} 
            onValueChange={(values) => handleStyleChange(segment, 'fontSize', `${values[0]}rem`)} 
          />
          <span className="text-xs">{parseFloat(currentStyles.fontSize || '1').toFixed(2)}</span>
        </div>
        
        <div className="flex items-center gap-2 w-full mt-2">
          <Palette className="h-4 w-4" />
          <span className="text-xs">Text Color</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-8 h-8 p-0 ml-auto" 
                style={{ backgroundColor: currentStyles.color || '#333333' }}
              >
                <span className="sr-only">Pick color</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <ChromePicker 
                color={currentStyles.color || '#333333'} 
                onChange={(colorResult) => handleStyleChange(segment, 'color', colorResult.hex)} 
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center gap-2 w-full mt-2">
          <Palette className="h-4 w-4" />
          <span className="text-xs">Background</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-8 h-8 p-0 ml-auto" 
                style={{ backgroundColor: currentStyles.backgroundColor || 'transparent' }}
              >
                <span className="sr-only">Pick background</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <ChromePicker 
                color={currentStyles.backgroundColor || 'transparent'} 
                onChange={(colorResult) => handleStyleChange(segment, 'backgroundColor', colorResult.hex)} 
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  };

  const applySegmentStyles = (segment: string) => {
    const style = segmentStyles[segment] || defaultSegmentStyles;
    return {
      color: style.color || defaultSegmentStyles.color,
      backgroundColor: style.backgroundColor || defaultSegmentStyles.backgroundColor,
      textAlign: style.textAlign || defaultSegmentStyles.textAlign,
      fontSize: style.fontSize || defaultSegmentStyles.fontSize,
      fontWeight: style.fontWeight || defaultSegmentStyles.fontWeight,
      fontStyle: style.fontStyle || defaultSegmentStyles.fontStyle,
      textDecoration: style.textDecoration || defaultSegmentStyles.textDecoration,
      padding: style.padding || defaultSegmentStyles.padding,
      margin: style.margin || defaultSegmentStyles.margin
    };
  };

  // For section titles only (not the content)
  const applySectionTitleStyles = (segment: string) => {
    const style = segmentStyles[segment] || defaultSegmentStyles;
    return {
      color: style.color || defaultSegmentStyles.color,
      backgroundColor: style.backgroundColor || defaultSegmentStyles.backgroundColor,
      textAlign: style.textAlign || defaultSegmentStyles.textAlign,
      fontWeight: 'semibold', // Always semibold for section titles
      fontStyle: style.fontStyle || defaultSegmentStyles.fontStyle,
      textDecoration: style.textDecoration || defaultSegmentStyles.textDecoration,
      borderColor: style.color || defaultSegmentStyles.color,
    };
  };

  const SegmentWrapper = ({ id, children }: { id: string; children: React.ReactNode }) => {
    return (
      <div 
        className={cn(
          "resume-section mb-6 relative p-3 border-2 border-transparent transition-all",
          activeSegment === id ? "border-dashed border-blue-400 rounded-md" : ""
        )}
        onClick={() => setActiveSegment(id === activeSegment ? null : id)}
      >
        {activeSegment === id && <StyleControls segment={id} />}
        <div style={applySegmentStyles(id)}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div 
      className={cn("bg-white rounded-lg border border-gray-200 max-w-full", 
        settings.fontFamily && `font-[${settings.fontFamily}]`)}
      style={{
        padding: "20px",
        background: "#fff",
        fontSize: `${settings.fontSize || 11}pt`,
        lineHeight: "1.5"
      }}
    >
      <SegmentWrapper id="header">
        <EditableField
          value={safeData.personal.name}
          placeholder="John Smith"
          className="text-xl font-bold text-gray-900 leading-tight tracking-tight pb-0 mb-1"
          onSave={val => handleFieldUpdate("personal", "name", val)}
          onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI("personal-name") : undefined}
          minRows={1}
          maxRows={1}
        />
        <EditableField
          value={safeData.personal.title}
          placeholder="Software Engineer"
          className="text-lg font-medium mt-1 transition-all"
          onSave={val => handleFieldUpdate("personal", "title", val)}
          onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI("personal-title") : undefined}
          minRows={1}
          maxRows={1}
        />
        <ContactInfo
          personal={safeData.personal}
          onUpdateData={onUpdateData}
          onGenerateWithAI={onGenerateWithAI}
          compact={true}
        />
      </SegmentWrapper>

      <SegmentWrapper id="summary">
        <h2 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1 uppercase tracking-wide"
            style={applySectionTitleStyles("summary")}>
          Summary
        </h2>
        <EditableField 
          value={safeData.summary} 
          placeholder="Experienced software engineer with 5+ years of experience in full-stack development. ..." 
          onSave={val => handleFieldUpdate("summary", "", val)} 
          className="text-sm text-gray-700 font-normal leading-relaxed" 
          onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI("summary") : undefined} 
          minRows={2} 
          maxRows={4} 
        />
      </SegmentWrapper>

      <SegmentWrapper id="experience">
        <h2 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1 uppercase tracking-wide"
            style={applySectionTitleStyles("experience")}>
          Experience
        </h2>
        {safeData.experience.map((exp: Experience) => (
          <div key={exp.id} className="mb-5 last:mb-0 resume-item">
            <div className="flex items-baseline justify-between flex-wrap gap-x-2">
              <div className="flex-1 min-w-0">
                <EditableField
                  value={exp.title}
                  placeholder="Senior Software Engineer"
                  className="font-medium text-gray-800 text-sm"
                  onSave={val => handleFieldUpdate("experience", "title", val, exp.id)}
                  onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`experience-title`) : undefined}
                  minRows={1}
                  maxRows={1}
                />
              </div>
              <EditableField
                value={`${exp.startDate} - ${exp.endDate}`}
                placeholder="Jan 2022 - Present"
                className="text-sm text-gray-600 ml-3 whitespace-nowrap min-w-[100px] max-w-[160px]"
                onSave={val => {
                  const [startDate, endDate] = val.split(" - ");
                  handleFieldUpdate("experience", "startDate", startDate || "", exp.id);
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
                handleFieldUpdate("experience", "company", company?.trim() || "", exp.id);
                handleFieldUpdate("experience", "location", location, exp.id);
              }}
              onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`experience-company`) : undefined}
              minRows={1}
              maxRows={1}
            />
            <EditableField
              value={exp.description}
              placeholder="Lead developer for the company's flagship product..."
              className="text-sm text-gray-700 mt-1 font-normal leading-relaxed"
              onSave={val => handleFieldUpdate("experience", "description", val, exp.id)}
              onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`experience-desc:${exp.id}`) : undefined}
              minRows={1}
              maxRows={3}
            />
          </div>
        ))}
        <AddSectionItem onAdd={handleAddExperience} />
      </SegmentWrapper>

      <SegmentWrapper id="education">
        <h2 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1 uppercase tracking-wide"
            style={applySectionTitleStyles("education")}>
          Education
        </h2>
        {safeData.education.map((edu: Education) => (
          <div key={edu.id} className="mb-5 last:mb-0 resume-item">
            <div className="flex items-baseline justify-between flex-wrap gap-x-2">
              <div className="flex-1 min-w-0">
                <EditableField
                  value={edu.degree}
                  placeholder="Master of Science in Computer Science"
                  className="font-medium text-gray-800 text-sm"
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
                    handleFieldUpdate("education", "institution", inst?.trim() || "", edu.id);
                    handleFieldUpdate("education", "location", location, edu.id);
                  }}
                  onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`education-institution`) : undefined}
                  minRows={1}
                  maxRows={1}
                />
              </div>
              <EditableField
                value={`${edu.startDate} - ${edu.endDate}`}
                placeholder="Sep 2017 - May 2019"
                className="text-sm text-gray-600 ml-3 whitespace-nowrap min-w-[100px] max-w-[160px]"
                onSave={val => {
                  const [startDate, endDate] = val.split(" - ");
                  handleFieldUpdate("education", "startDate", startDate || "", edu.id);
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
              className="text-sm text-gray-700 font-normal leading-relaxed"
              onSave={val => handleFieldUpdate("education", "description", val, edu.id)}
              onGenerateWithAI={onGenerateWithAI ? () => onGenerateWithAI(`education-desc`) : undefined}
              minRows={1}
              maxRows={2}
            />
          </div>
        ))}
        <AddSectionItem onAdd={handleAddEducation} />
      </SegmentWrapper>

      <SegmentWrapper id="skills">
        <h2 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1 uppercase tracking-wide"
            style={applySectionTitleStyles("skills")}>
          Skills
        </h2>
        <div className="mb-3">
          <div className="font-medium text-gray-700 text-sm mb-1.5">Technical Skills</div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {safeData.skills.technical.map((skill: string, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-[#efeafc] rounded-sm text-sm border-[0.5px] border-[#dad3f8] shadow-xs transition whitespace-nowrap text-violet-400 font-normal">
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
      </SegmentWrapper>

      {safeData.projects && safeData.projects.length > 0 && (
        <SegmentWrapper id="projects">
          <h2 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1 uppercase tracking-wide"
              style={applySectionTitleStyles("projects")}>
            Projects
          </h2>
          {safeData.projects.map((project: Project) => (
            <div key={project.id} className="mb-5 last:mb-0 resume-item">
              <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                <div className="flex-1 min-w-0">
                  <EditableField
                    value={project.title}
                    placeholder="Project Name"
                    className="font-medium text-gray-800 text-sm"
                    onSave={val => handleFieldUpdate("projects", "title", val, project.id)}
                    minRows={1}
                    maxRows={1}
                  />
                </div>
                <EditableField
                  value={`${project.startDate} - ${project.endDate}`}
                  placeholder="Jan 2023 - Present"
                  className="text-sm text-gray-600 ml-3 whitespace-nowrap min-w-[100px] max-w-[160px]"
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
                className="text-sm text-gray-700 font-normal leading-relaxed"
                onSave={val => handleFieldUpdate("projects", "description", val, project.id)}
                minRows={1}
                maxRows={3}
              />
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.technologies.map((tech: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-[#efeafc] rounded-sm text-sm border-[0.5px] border-[#dad3f8] shadow-xs transition whitespace-nowrap text-violet-400 font-normal">
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
                  className="text-sm text-resume-purple hover:text-resume-purple-dark mt-1 inline-block"
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
        </SegmentWrapper>
      )}

      {/* Certifications Section */}
      {safeData.certifications && safeData.certifications.length > 0 && (
        <SegmentWrapper id="certifications">
          <h2 className="text-lg font-semibold mb-2" style={applySectionTitleStyles('certifications')}>
            Certifications
          </h2>
          <div className="space-y-2">
            {safeData.certifications.map((cert: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-resume-purple rounded-full flex-shrink-0"></span>
                <span className="text-sm text-gray-700">{cert}</span>
              </div>
            ))}
          </div>
        </SegmentWrapper>
      )}
    </div>
  );
};

export default CustomizableTemplate;
