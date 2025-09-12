import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

// Интерфейсы
interface Identification {
  id: number;
  screenshot?: string;
  screenshots?: string[];
  created_at: string;
}

interface IdentificationList {
  identities: Identification[];
}

const IdentificationList: React.FC<IdentificationList> = ({ identities }) => {
  function formatCreatedAt(dateStr: string): string {
    const date = new Date(dateStr);

    const days = [
      "воскресенье",
      "понедельник",
      "вторник",
      "среда",
      "четверг",
      "пятница",
      "суббота",
    ];

    const day = days[date.getDay()];
    const hours = date.getHours().toString();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `Во ${day}, в ${hours}:${minutes}`;
  }

  return (
    <div className="max-h-[250px] text-center -mx-5 -mb-4 overflow-y-auto">
      {!identities ? (
        <div className="text-muted-foreground py-8">
          Нет идентификационных фотографий
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2 p-2">
          {identities.map((identification, index) => (
            <React.Fragment key={`${identification.id}-${index}`}>
              {/* SINGLE PHOTO */}
              {identification.screenshot && (
                <Card className="identification-item w-[100px] inline-block align-top m-0 p-0 border-none relative">
                  <CheckCircle className="absolute -top-2 -left-2 text-green-500 bg-white rounded-full w-5 h-5 z-10" />
                  <CardContent className="p-0">
                    <a
                      href={identification.screenshot.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-[80px] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={identification.screenshot.trim()}
                        className="w-full h-full object-cover"
                        alt="Идентификация"
                      />
                    </a>
                    <div className="mt-2 text-xs">
                      {formatCreatedAt(identification.created_at)}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SERIES PHOTO */}
              {identification.screenshots &&
                identification.screenshots.map((photo, photoIndex) => (
                  <Card
                    key={`${identification.id}-${index}-${photoIndex}`}
                    className="identification-item w-[100px] inline-block align-top m-0 p-0 border-none"
                  >
                    <CardContent className="p-0">
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
                      <div className="mt-2 text-xs">
                        {formatCreatedAt(identification.created_at)}
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
