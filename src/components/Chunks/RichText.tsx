import React from "react";

const RichText = ({ content, className = "" }) => {
  // Определяем, что отображать
  const renderContent = () => {
    // Если content - строка, проверяем является ли она HTML
    if (typeof content === "string") {
      // Простая проверка на наличие HTML тегов
      const isHtml = /<[a-z][\s\S]*>/i.test(content);

      if (isHtml) {
        // Рендерим как HTML
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
      } else {
        // Рендерим как обычный текст
        return <div>{content}</div>;
      }
    }

    // Если content - React элемент или null/undefined
    return content;
  };

  return (
    <>
      <style jsx>{`
        .rich-text {
          color: #000;
          background-color: transparent;
        }

        .rich-text p {
          display: block;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 0;
          margin-inline-end: 0;
          line-height: 22px;
        }

        .rich-text h1 {
          display: block;
          font-size: 2em;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
          margin-left: 0;
          margin-right: 0;
          font-weight: bold;
        }

        .rich-text h2 {
          display: block;
          font-size: 1.5em;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
          margin-left: 0;
          margin-right: 0;
          font-weight: bold;
        }

        .rich-text h3 {
          display: block;
          font-size: 1.17em;
          margin-top: 1em;
          margin-bottom: 1em;
          margin-left: 0;
          margin-right: 0;
          font-weight: bold;
        }

        .rich-text h4 {
          display: block;
          margin-top: 1.33em;
          margin-bottom: 1.33em;
          margin-left: 0;
          margin-right: 0;
          font-weight: bold;
        }

        .rich-text h5 {
          display: block;
          font-size: 0.83em;
          margin-top: 1.67em;
          margin-bottom: 1.67em;
          margin-left: 0;
          margin-right: 0;
          font-weight: bold;
        }

        .rich-text h6 {
          display: block;
          font-size: 0.67em;
          margin-top: 2.33em;
          margin-bottom: 2.33em;
          margin-left: 0;
          margin-right: 0;
          font-weight: bold;
        }

        .rich-text strong,
        .rich-text b {
          font-weight: bold;
        }

        .rich-text i {
          font-style: italic;
        }

        .rich-text img {
          display: inline-block;
        }

        .rich-text ul {
          display: block;
          list-style-type: disc;
          margin-top: 1em;
          margin-bottom: 1em;
          margin-left: 0;
          margin-right: 0;
          padding-left: 40px;
        }

        .rich-text *:first-child {
          margin-block-start: 0;
        }

        .rich-text p:last-child {
          margin-block-end: 0;
        }

        .rich-text code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            Liberation Mono, Courier New, monospace;
          font-size: 0.9rem;
          border-radius: 5px;
        }
      `}</style>
      <div className={`rich-text ${className}`}>{renderContent()}</div>
    </>
  );
};

export default RichText;
