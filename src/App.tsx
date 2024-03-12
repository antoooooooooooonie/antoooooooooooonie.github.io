import {
  useState,
  KeyboardEvent as ReactKeyboardEvent,
  useRef,
  useEffect,
} from "react";
import "./App.css";

import * as cowsay from "cowsay2";

const inputPrefix = <span>guest&#64;decodefabriek&#126;&gt; </span>;

const processInput = (command: string): JSX.Element | string => {
  if (command.startsWith("source")) {
    return <a href="https://github.com/antoooooooooooonie/antoooooooooooonie.github.io">&lt;Open GitHub&gt;</a>;
  }
  if (command.startsWith("help")) {
    return processInput(`cowsay ${helpMessage}`);
  }

  if (command.startsWith("cowsay")) {
    // const input = command.split("cowsay ", 2)[1];
    const input = command.split(/cowsay (.*)/s).join("");
    return (
      <pre>
        {cowsay.say(input, {
          n: true,
        })}
      </pre>
    );
  }
  return `Unknown command: ${command}`;
};

const helpMessage =
`Hello, I'm Anthony.

Commands:
* source: view this site's source code
* help: show this message

Controls:
* CTRL+L: clear the buffer
* ↑: go back in history
* ↓: go forward in history
* cowsay {input}: make the cow say something`;

type InputPromptProps = {
  command: Command;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputSubmit: (event: ReactKeyboardEvent<HTMLInputElement>) => void;
  // key: number;
};

const InputPrompt: React.FC<InputPromptProps> = ({
  command,
  handleInputChange,
  handleInputSubmit,
}) => {
  const [creationDate] = useState(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Save the current cursor position before the state is updated
    const cursorPosition = event.currentTarget.selectionStart;

    handleInputChange(event);

    // Restore the cursor position after the component is updated
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = cursorPosition;
        inputRef.current.selectionEnd = cursorPosition;
      }
    });
  };

  return (
    <div key={creationDate}>
      {!command.hidePrompt && (
        <>
          {inputPrefix}
          <input
            ref={inputRef}
            value={command.input}
            onChange={handleTextChange}
            onKeyDown={handleInputSubmit}
            autoFocus={true}
            style={{
              outline: "none",
              border: "none",
              boxShadow: "none",
              backgroundColor: "transparent",
            }}
          />
        </>
      )}
      <div>
        <span>{command.output}</span>
      </div>
    </div>
  );
};

interface Command {
  input: string;
  hidePrompt?: boolean;
  output: string | JSX.Element | null;
}

function App() {
  const [commands, setCommand] = useState<Command[]>([
    {
      input: "help",
      hidePrompt: true,
      output: processInput("help"),
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

        const lastCommand = { ...commands[commands.length - 1] };

        // Fill the current prompt with the previously entered text
        if (prevCommands[prevCommands.length + newCursor]) {
          setCommandCursor(newCursor);
          lastCommand.input =
            prevCommands[prevCommands.length + newCursor].input;
          setCommand([...prevCommands, lastCommand]);
        }

        // Reset the cursor to 0 when we run out of command history
        if (!prevCommands[prevCommands.length + newCursor]) {
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
      handleInputSubmit={(event: ReactKeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.disabled = true;

          const prevCommands = commands.slice(0, -1);
          setCommandCursor(0);
          setCommand([
            ...prevCommands,
            { input: command.input, output: processInput(command.input) },
            { input: "", output: null },
          ]);
        }
      }}
      handleInputChange={(event) => {
        const prevCommands = commands.slice(0, -1);

        setCommand([
          ...prevCommands,
          { input: event.target.value, output: command.output },
        ]);
      }}
    />
  ));
}

export default App;
