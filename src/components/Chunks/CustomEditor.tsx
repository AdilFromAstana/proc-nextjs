// src/components/Chunks/CustomEditor.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface CustomEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  disabled?: boolean;
  floated?: boolean;
  inline?: boolean;
  autoresize?: boolean;
  height?: number;
  toolbar?: string;
  aToolbar?: string;
  pToolbar?: string;
  plugins?: string[];
  buttons?: Array<{
    id: string;
    [key: string]: any;
  }>;
  options?: Record<string, any>;
  onInit?: (editor: any) => void;
}

const TinyMCEAPI_KEY = "qy8wi8k5sfl8aapsdujc5bw9m2mmzxzeg2fu6uwz3h3qj5vc";

export const CustomEditor: React.FC<CustomEditorProps> = ({
  value = "",
  onChange,
  disabled = false,
  floated = false,
  inline = false,
  autoresize = true,
  // Возвращаем height, как в Vue, по умолчанию 100
  height = 50,
  toolbar = "undo redo | image | styleselect | bold italic | alignleft aligncenter alignright alignjustify | table | bullist numlist | link | preview | codesample",
  aToolbar = null,
  pToolbar = null,
  plugins = [
    "advlist autolink lists link image table",
    "table contextmenu paste noneditable pageembed preview codesample",
    // "autoresize" будет добавлен ниже, если autoresize=true
  ],
  buttons = [],
  options = {},
  onInit,
}) => {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleEditorChange = (content: string, editor: any) => {
    setContent(content);
    onChange?.(content);
  };

  const uploadImage = (blobInfo: any, success: Function, failure: Function) => {
    const formData = new FormData();
    formData.append("file", blobInfo.blob());
    success("https://via.placeholder.com/150");
  };

  // Подготавливаем плагины (как в Vue, добавляем в тот же массив)
  let finalPlugins = [...plugins];
  if (autoresize && !finalPlugins.includes("autoresize")) {
    // Добавляем в конец массива, как в Vue
    finalPlugins.push("autoresize");
  }

  const finalToolbar = [pToolbar, toolbar, aToolbar].filter(Boolean).join(" ");

  const editorSettings = {
    inline: inline,
    height: height,
    menubar: false,
    statusbar: false,
    branding: false,
    plugins: finalPlugins,
    toolbar: finalToolbar + " | wirisEditor wirisChemistry", // добавляем кнопки формул
    external_plugins: {
      wiris: "/node_modules/@wiris/mathtype-tinymce5/plugin.min.js",
      // ⚠️ путь нужно настроить правильно в зависимости от сборщика
    },
    mobile: { theme: "mobile" },
    images_upload_handler: uploadImage,
    autoresize_on_init: true,
    autoresize_bottom_margin: 0,
    autoresize_overflow_padding: 0,
    promotion: false,
    ...options,
    setup: (editor: any) => {
      editor.on("init", () => {
        buttons.forEach((button) => {
          editor.ui.registry.addButton(button.id, button);
        });

        if (floated) {
          applyFloatedSettings(editor);
          hideToolbar(editor);
        }

        onInit?.(editor);
      });

      if (floated) {
        editor.on("focus", () => showToolbar(editor));
        editor.on("blur", () => hideToolbar(editor));
      }
    },
  };

  // Функции для управления floated режимом, как в Vue
  const applyFloatedSettings = (editor: any) => {
    const editorContainer = editor.editorContainer;
    if (!editorContainer) return;

    const sidebarWrap = editorContainer.querySelector(".tox-sidebar-wrap");
    const toolbarOverlord = editorContainer.querySelector(
      ".tox-toolbar-overlord"
    );

    if (sidebarWrap && toolbarOverlord) {
      // Добавляем класс floated к контейнеру редактора, как в Vue
      editorContainer.classList.add("floated");

      // Сбрасываем фиксированную высоту, как в Vue
      // // Сохраняем исходную высоту контейнера для sidebarWrap
      // sidebarWrap.style.height = editorContainer.style.height;
      // // Устанавливаем auto для контейнера, как в Vue
      // editorContainer.style.height = "auto";
    }
  };

  const showToolbar = (editor: any) => {
    const editorContainer = editor.editorContainer;
    if (!editorContainer) return;

    const toolbarOverlord = editorContainer.querySelector(
      ".tox-toolbar-overlord"
    );
    if (toolbarOverlord) {
      toolbarOverlord.style.display = "flex";
      toolbarOverlord.style.overflow = "visible"; // Как в Vue
    }
  };

  const hideToolbar = (editor: any) => {
    const editorContainer = editor.editorContainer;
    if (!editorContainer) return;

    const toolbarOverlord = editorContainer.querySelector(
      ".tox-toolbar-overlord"
    );
    if (toolbarOverlord) {
      toolbarOverlord.style.display = "none";
    }
  };

  return (
    <div className="editor-component w-full">
      <Editor
        apiKey={TinyMCEAPI_KEY}
        value={content}
        onEditorChange={handleEditorChange}
        init={editorSettings}
        disabled={disabled}
      />

      <style jsx>{`
        .editor-component {
          width: 100%;
        }

        /* Стили для floated режима, как в Vue */
        :global(.editor-component .floated) {
          overflow: initial !important;
          position: relative;
        }

        :global(.editor-component .floated.tox-tinymce) {
          border: none !important; /* Как в Vue */
        }

        :global(.editor-component .floated .tox-toolbar-overlord) {
          width: 100%;
          background-color: #fff !important;
          border: 1px solid #ccc !important;
          margin-bottom: 4px !important; /* Как в Vue */
          position: absolute;
          bottom: 100%;
          left: 0;
          z-index: 1000;
        }

        :global(.editor-component .floated .tox-toolbar__primary) {
          background: none !important;
        }

        :global(.editor-component .floated .tox-edit-area) {
          border-top: none !important;
        }

        :global(.editor-component .floated .tox-sidebar-wrap) {
          border: 1px solid #ccc !important;
        }

        :global(.editor-component .floated .tox-edit-area__iframe) {
          position: static !important;
        }
      `}</style>
    </div>
  );
};

export default CustomEditor;
