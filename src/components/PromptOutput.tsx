import Markdown from "react-markdown";

export const PromptOutput: React.FC<{ children: string | null }> = ({ children }) => {
  return <Markdown>{children}</Markdown>;
};