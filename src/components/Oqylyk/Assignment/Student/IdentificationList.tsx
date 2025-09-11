import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

// Интерфейсы
interface Identification {
  id: number;
  screenshot?: string;
  screenshots?: string[];
  getTime: () => string;
}

interface AssignmentActionList {
  models: Identification[];
}

interface IdentificationListProps {
  identities: AssignmentActionList;
}

const IdentificationList: React.FC<IdentificationListProps> = ({
  identities,
}) => {
  return (
    <div className="max-h-[250px] text-center -mx-5 -mb-4 overflow-y-auto">
      {identities.models.length === 0 ? (
        <div className="text-muted-foreground py-8">
          Нет идентификационных фотографий
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2 p-2">
          {identities.models.map((identification, index) => (
            <React.Fragment key={`${identification.id}-${index}`}>
              {/* SINGLE PHOTO */}
              {identification.screenshot && (
                <Card className="identification-item w-[100px] inline-block align-top m-1">
                  <CardContent className="p-2">
                    <a
                      href={identification.screenshot.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative w-full h-[80px] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CheckCircle className="absolute -top-2 -left-2 text-green-500 bg-white rounded-full w-5 h-5" />
                      <img
                        src={identification.screenshot.trim()}
                        className="w-full h-full object-cover"
                        alt="Идентификация"
                      />
                    </a>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {identification.getTime()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SERIES PHOTO */}
              {identification.screenshots &&
                identification.screenshots.map((photo, photoIndex) => (
                  <Card
                    key={`${identification.id}-${index}-${photoIndex}`}
                    className="identification-item w-[100px] inline-block align-top m-1"
                  >
                    <CardContent className="p-2">
                      <a
                        href={photo.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-[80px] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={photo.trim()}
                          className="w-full h-full object-cover"
                          alt="Идентификация"
                        />
                      </a>
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {identification.getTime()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdentificationList;
