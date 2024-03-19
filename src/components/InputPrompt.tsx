import { useRef, KeyboardEvent } from "react";
import { data } from "../data";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { Command } from "../interfaces/Command";

type InputPromptProps = {
  command: Command;
  value: string | null;
  handleInputSubmit: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export const InputPrompt: React.FC<InputPromptProps> = ({
  command,
  value,
  handleInputSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { isMobile } = useWindowWidth();

  return (
    <div>
      {!command.hidePrompt && (
        <>
          {isMobile ? data.prefixMobile : data.prefix}
          <input
            ref={inputRef}
            placeholder="Enter command here"
            defaultValue={value || ""}
            // Don't allow editing commands that have already been handled
            disabled={!!command.output}
            onKeyDown={handleInputSubmit}
            autoFocus={!isMobile}
            style={{
              outline: "none",
              border: "none",
              boxShadow: "none",
              backgroundColor: "transparent",
            }}
          />
        </>
      )}
      <div>{command.output}</div>
    </div>
  );
};
