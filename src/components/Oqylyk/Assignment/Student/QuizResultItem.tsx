import React from "react";
import {
  Type,
  Globe,
  Youtube,
  Image,
  BarChart3,
  HelpCircle,
  MessageSquare,
  Square,
  Move3d,
  HelpCircle as QuestionCircle,
  XCircle as TimesCircle,
  CheckCircle,
  Info,
} from "lucide-react";

// Component types data
interface ComponentType {
  id: string;
  component_type: string;
  icon: string;
  name: string;
  is_quiz: boolean;
}

const componentTypes: ComponentType[] = [
  {
    id: "text",
    component_type: "TextComponent",
    icon: "Type",
    name: "Текст",
    is_quiz: false,
  },
  {
    id: "iframe",
    component_type: "IFrameComponent",
    icon: "Globe",
    name: "Источник",
    is_quiz: false,
  },
  {
    id: "youtube",
    component_type: "YoutubeComponent",
    icon: "Youtube",
    name: "YouTube",
    is_quiz: false,
  },
  {
    id: "media",
    component_type: "MediaComponent",
    icon: "Image",
    name: "Медиа",
    is_quiz: false,
  },
  {
    id: "poll",
    component_type: "PollComponent",
    icon: "BarChart3",
    name: "Опрос",
    is_quiz: true,
  },
  {
    id: "free_question",
    component_type: "FreeQuestionComponent",
    icon: "HelpCircle",
    name: "Тестовый вопрос",
    is_quiz: true,
  },
  {
    id: "open_question",
    component_type: "OpenQuestionComponent",
    icon: "MessageSquare",
    name: "Открытый вопрос",
    is_quiz: true,
  },
  {
    id: "fill_space_question",
    component_type: "FillSpaceQuestionComponent",
    icon: "Square",
    name: "Заполните пробелы",
    is_quiz: true,
  },
  {
    id: "drag_and_drop_question",
    component_type: "DragAndDropQuestionComponent",
    icon: "Move3d",
    name: "Drag & Drop",
    is_quiz: true,
  },
];

// Icon mapping
const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Type: Type,
  Globe: Globe,
  Youtube: Youtube,
  Image: Image,
  BarChart3: BarChart3,
  HelpCircle: HelpCircle,
  MessageSquare: MessageSquare,
  Square: Square,
  Move3d: Move3d,
};

// Result icon mapping
const resultIconMap = {
  1: QuestionCircle,
  2: TimesCircle,
  3: CheckCircle,
  default: Info,
};

interface AssignmentResult {
  result: number;
  points: number | null;
  getClassName: () => string;
}

interface Component {
  id?: number;
  component_type?: string;
  quiz_id?: number;
  lesson_id?: number;
}

interface MinimalComponent {
  component_type: string;
}

interface QuizResultItemProps {
  index: number;
  result: AssignmentResult;
  component: Component | MinimalComponent | null | undefined;
  isPointSystemEnabled: boolean;
  onClick?: () => void;
}

const QuizResultItem: React.FC<QuizResultItemProps> = ({
  index = 0,
  result,
  component,
  isPointSystemEnabled = false,
  onClick,
}) => {
  // Method to get component meta by type
  const getComponentMetaByType = (
    type: string | undefined
  ): ComponentType | undefined => {
    if (!type) return undefined;
    return componentTypes.find((item) => item.component_type === type);
  };

  // Get component meta
  const componentMeta = component?.component_type
    ? getComponentMetaByType(component.component_type)
    : undefined;

  // Safely extract properties with fallbacks
  const iconName = componentMeta?.icon ?? "Type";
  const componentName = componentMeta?.name ?? "Компонент";

  // Get component icon
  const IconComponent = iconMap[iconName] || Type;

  // Get result icon
  const ResultIcon =
    (resultIconMap as any)[result.result] || resultIconMap.default;

  // Get result class name
  const resultClassName = result.getClassName ? result.getClassName() : "";

  return (
    <div
      className="relative inline-block w-[70px] cursor-pointer bg-[#F7F7F7] align-top text-center hover:bg-[#F4F4F4]"
      onClick={onClick}
    >
      <style>{`
        .quiz-result-item:hover .component-index {
          background-color: #E0E0E0 !important;
        }
        .quiz-result-item:hover .result-wrap {
          background-color: #E0E0E0 !important;
        }
      `}</style>

      {/* Component index */}
      <div className="w-full py-2 px-0 bg-[#E5E5E5] text-center text-[#666] text-sm font-semibold">
        В{index + 1}
      </div>

      {/* Component icon */}
      <div className="absolute top-[1px] right-[5px]">
        <IconComponent width={12} height={12} color="#000" opacity={0.1} />
      </div>

      {/* Component result */}
      <div className="h-[50px] leading-[50px] text-center relative">
        <div
          className={`inline-block align-middle w-8 h-8 rounded-full bg-[#EEE] overflow-hidden ${resultClassName} ${
            isPointSystemEnabled && result.points !== null ? "info" : ""
          }`}
        >
          {isPointSystemEnabled && result.points !== null ? (
            <div className="text-xs font-semibold leading-[31px]">
              {result.points}
            </div>
          ) : (
            <ResultIcon width={16} height={16} color="#CCC" />
          )}
        </div>
      </div>

      {/* Component name */}
      <div className="hidden mt-[10px] text-[#9077ba] text-xs font-medium">
        {componentName}
      </div>
    </div>
  );
};

export default QuizResultItem;
