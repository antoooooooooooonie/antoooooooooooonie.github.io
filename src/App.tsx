import {
  useState,
  KeyboardEvent as ReactKeyboardEvent,
  useRef,
  useEffect,
} from "react";
import "./App.css";
import Markdown from "react-markdown";
import { data } from "./data";
import { useWindowWidth } from "./hooks/useWindowWidth";

interface Command {
  input: string;
  hidePrompt?: boolean;
  hideInHistory?: boolean;
  output: string | JSX.Element | null;
}

const processInput = (command: string): Command => {
  const getOutput = () => {
    if (command == "") {
      return command;
    }
    if (command.startsWith("source")) {
      return <PromptOutput>{data.source}</PromptOutput>;
    }
    if (command.startsWith("service")) {
      return <PromptOutput>{data.services}</PromptOutput>;
    }
    if (command.startsWith("help")) {
      return processInput(`cowsay ${data.help}`).output;
    }
    if (command.startsWith("status")) {
      return <PromptOutput>{data.status}</PromptOutput>;
    }
    if (command.startsWith("about")) {
      return <PromptOutput>{data.about}</PromptOutput>;
    }

    if (command.startsWith("contact")) {
      return <PromptOutput>{data.contact}</PromptOutput>;
    }

    if (command.startsWith("cowsay")) {
      const input = command.split(/cowsay (.*)/s).join("");
      return (
        <>
          <PromptOutput>{input}</PromptOutput>
          <PromptOutput>{data.cow}</PromptOutput>
        </>
      );
    }

    return <PromptOutput>{data.unknown(command)}</PromptOutput>;
  };

  return {
    input: command,
    output: getOutput(),
    hideInHistory: command == "",
  };
};

type InputPromptProps = {
  command: Command;
  value: string | null;
  handleInputSubmit: (event: ReactKeyboardEvent<HTMLInputElement>) => void;
};

const PromptOutput: React.FC<{ children: string | null }> = ({ children }) => {
  return <Markdown>{children}</Markdown>;
};

const InputPrompt: React.FC<InputPromptProps> = ({
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

function App() {
  const [commands, setCommand] = useState<Command[]>([
    {
      hidePrompt: true,
      ...processInput("help"),
    },
    { input: "", output: null },
  ]);

  const [commandCursor, setCommandCursor] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.ctrlKey && event.key === "l") {
        event.preventDefault();

        // Clear the command buffer
        setCommand([{ input: "", output: null }]);
      } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();

        const newCursor = commandCursor + (event.key === "ArrowUp" ? -1 : 1);
        const prevCommands = commands.slice(0, -1);
        const prevCommandsFiltered = prevCommands.filter((c) => !c.hideInHistory);

        const lastCommand = { ...commands[commands.length - 1] };

        const commandIndex = prevCommandsFiltered[prevCommandsFiltered.length + newCursor];

        // Fill the current prompt with the previously entered text
        if (commandIndex) {
          setCommandCursor(newCursor);
          lastCommand.input =
            commandIndex.input;
          setCommand([...prevCommands, lastCommand]);
        }

        // Reset the cursor to 0 when we run out of command history
        if (!commandIndex) {
          setCommandCursor(0);
          lastCommand.input = "";
          setCommand([...prevCommands, lastCommand]);
        }
      }
    };

    // Add the keydown event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Remove the keydown event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [commands, commandCursor]);

  return commands.map((command, index) => (
    <InputPrompt
      key={`${command.input}_${index}`}
      command={command}
      value={command.input}
      handleInputSubmit={(event: ReactKeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          const input = event.target as HTMLInputElement;
          const inputValue = input.value;

          const command = processInput(inputValue.toLocaleLowerCase());

          // Remove keyboard focus
          input.blur();

          const prevCommands = commands.slice(0, -1);
          setCommandCursor(0);
          setCommand([...prevCommands, command, { input: "", output: null }]);
        }
      }}
    />
  ));
}

export default App;
