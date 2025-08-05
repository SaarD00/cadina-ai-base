import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Award } from 'lucide-react';
import { Label } from "@/components/ui/label";

interface CertificationsFormProps {
  data: string[];
  onChange: (certifications: string[]) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ data, onChange }) => {
  const [newCertification, setNewCertification] = useState("");

  const addCertification = () => {
    if (newCertification.trim() && !data.includes(newCertification.trim())) {
      onChange([...data, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCertification();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <Award className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
          <p className="text-sm text-gray-600">Add your professional certifications and achievements</p>
        </div>
      </div>

      <Card className="border-orange-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
            <Award className="h-4 w-4 text-orange-600" />
            Professional Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certification" className="text-sm font-medium text-gray-700">
              Add Certification
            </Label>
            <div className="flex gap-2">
              <Input
                id="certification"
                placeholder="e.g., AWS Certified Developer, Google Analytics Certified..."
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={addCertification} 
                size="sm"
                disabled={!newCertification.trim()}
                className="px-4"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {data.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Your Certifications ({data.length})
              </Label>
              <div className="space-y-2">
                {data.map((certification, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{certification}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(index)}
                      className="h-8 w-8 p-0 hover:bg-orange-100"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Award className="h-12 w-12 mx-auto mb-3 text-orange-300" />
              <p className="text-sm">No certifications added yet</p>
              <p className="text-xs text-gray-400 mt-1">Add your professional certifications to showcase your expertise</p>
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-1">💡 Tips for Certifications</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Include the full certification name and issuing organization</li>
              <li>• Focus on certifications relevant to your target role</li>
              <li>• List most recent or prestigious certifications first</li>
              <li>• Include expiration dates if applicable (you can add this in the summary)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificationsForm;