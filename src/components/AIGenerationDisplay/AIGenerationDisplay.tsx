import { sanitize } from "dompurify";
import { marked } from "marked";
import { Sandpack } from "@codesandbox/sandpack-react";
import "./style.scss";
import { useState } from "react";
import { Folder, FileText, ChevronDown, ChevronRight } from "lucide-react";


const parseFolderStructure = (text: string) => {
  const lines = text.trim().split('\n');
  const structure: Record<string, any> = {};
  const descriptions: Record<string, string> = {};
  let currentNode: Record<string, any> | null = null;
  let currentPath: string[] = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // If this is a description (no leading /), attach it to the last full path
    if (!trimmedLine.startsWith('/')) {
      if (currentPath.length > 0) {
        const key = currentPath.join('/');
        descriptions[key] = (descriptions[key] || '') + ' ' + trimmedLine.trim();
      }
      return;
    }

    // Reset path for each directory level
    const depth = (line.match(/^\s*/)?.[0].length || 0) / 2 || 0;
    currentPath = currentPath.slice(0, depth);
    const name = trimmedLine.replace('/', '');
    currentPath.push(name);

    // Build the nested structure
    let parent = structure;
    for (let i = 0; i < currentPath.length - 1; i++) {
      const part = currentPath[i];
      if (!parent[part]) parent[part] = { children: {} };
      parent = parent[part].children;
    }

    parent[name] = { children: {}, description: '' };
  });

  // Attach descriptions to their corresponding nodes
  const attachDescriptions = (node: any, path: string[] = []) => {
    for (const [name, content] of Object.entries(node)) {
      const fullPath = [...path, name].join('/');
      if (descriptions[fullPath]) {
        (content as any).description = descriptions[fullPath].trim();
      }
      attachDescriptions((content as any).children, [...path, name]);
    }
  };

  attachDescriptions(structure);
  return structure;
};

interface DirectoryTreeProps {
  text: string;
  level?: number;
}

const DirectoryTree: React.FC<DirectoryTreeProps> = ({ text, level = 0 }) => {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const structure = parseFolderStructure(text);

  const toggleFolder = (name: string) => {
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const renderTree = (node: any, path: string[] = []) => {
    return Object.entries(node).map(([name, content]: any) => {
      const isFolder = content.children && Object.keys(content.children).length > 0;
      const currentPath = [...path, name].join('/');
      const isOpen = open[currentPath] || false;
      return (
        <li key={currentPath} className="my-1">
          {isFolder ? (
            <div
              className="flex flex-col cursor-pointer hover:bg-gray-100 p-1 rounded-lg"
              onClick={() => toggleFolder(currentPath)}
            >
              <div className="flex items-center">
                {isOpen ? <ChevronDown className="mr-2" size={18} /> : <ChevronRight className="mr-2" size={18} />}
                <Folder className="mr-2" size={18} />
                <span className="font-semibold">{name}</span>
              </div>
              {content.description && <p className="text-sm text-gray-500 ml-8 mt-1">{content.description}</p>}
            </div>
          ) : (
            <div className="flex items-center pl-6">
              <FileText className="mr-2 text-blue-500" size={18} />
              <span>{name}</span>
            </div>
          )}
          {isFolder && isOpen && (
            <ul className={`pl-${level * 4 + 4} list-none`}>
              {renderTree(content.children, [...path, name])}
            </ul>
          )}
        </li>
      );
    });
  };

  return <ul className={`pl-${level * 4} list-none`}>{renderTree(structure)}</ul>;
};

export const AIGenerationDisplay = ({
  checkResult,
}: {
  checkResult: {
    chatGptResponse: {
      codeParts: string[];
      responseSplittedByCode: string[];
      folderStructure: string;
    };
  };
}) => {
  const folderStructureSplitted =
    checkResult.chatGptResponse.folderStructure.split("????");
  return checkResult.chatGptResponse.responseSplittedByCode.length > 0 ? (
    <div style={{ all: "revert" }} className="ai-response !max-w-full">
      {checkResult.chatGptResponse.responseSplittedByCode.map((el, index) =>
        el.includes("import React from") ? (
          <Sandpack
            key={index}
            options={{
              editorHeight: 500,
            }}
            customSetup={{
              dependencies: {
                i18next: "25.0.1",
                "react-i18next": "latest",
              },
            }}
            template="react"
            files={{
              "/App.js": el,
            }}
          />
        ) : (
          <div
            key={index}
            dangerouslySetInnerHTML={{
              __html: sanitize(marked.parse(el || "") as string),
            }}
          />
        )
      )}
      {checkResult.chatGptResponse.folderStructure ? (
        <div className="bg-[rgba(34,197,94,0.1)] border border-green-300 rounded-xl p-6 my-6 shadow-md text-white backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Folder className="text-green-700" size={40} />
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: sanitize(marked.parse(folderStructureSplitted[0] || "") as string),
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: sanitize(marked.parse(folderStructureSplitted[1] || "") as string),
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: sanitize(marked.parse(folderStructureSplitted[2] || "") as string),
            }}
          />
        </div>
      ) : null}
    </div>
  ) : null;
};
