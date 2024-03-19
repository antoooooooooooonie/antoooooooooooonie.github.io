import {
  useState,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
} from "react";
import "./App.css";
import { data } from "./data";
import { Command } from "./interfaces/Command";
import { InputPrompt } from "./components/InputPrompt";
import { PromptOutput } from "./components/PromptOutput";

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

    if (command.startsWith("status")) {
      return <PromptOutput>{data.status}</PromptOutput>;
    }

    if (command.startsWith("about")) {
      return <PromptOutput>{data.about}</PromptOutput>;
    }

    if (command.startsWith("contact")) {
      return <PromptOutput>{data.contact}</PromptOutput>;
    }

    if (command.startsWith("help")) {
      return processInput(`cowsay ${data.help}`).output;
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

function App() {
  const initialInput = useMemo(
    () => [
      {
        hidePrompt: true,
        ...processInput("help"),
      },
      { input: "", output: null },
    ],
    []
  );

  const [commands, setCommand] = useState<Command[]>(initialInput);
  const [commandCursor, setCommandCursor] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.ctrlKey && event.key === "l") {
        event.preventDefault();

        // Clear the command buffer
        setCommand(initialInput);
      } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();

        const newCursor = commandCursor + (event.key === "ArrowUp" ? -1 : 1);
        const prevCommands = commands.slice(0, -1);
        const commandHistory = prevCommands.filter(
          ({ hideInHistory }) => !hideInHistory
        );

        const lastCommand = { ...commands[commands.length - 1] };

        const commandIndex = commandHistory[commandHistory.length + newCursor];

        // Fill the current prompt with the previously entered text
        if (commandIndex) {
          setCommandCursor(newCursor);
          lastCommand.input = commandIndex.input;
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
  }, [commands, commandCursor, initialInput]);

  return commands.map((command, index) => (
    <InputPrompt
      key={`${command.input}_${index}`}
      command={command}
      value={command.input}
      handleInputSubmit={(event: ReactKeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          const input = event.target as HTMLInputElement;
          const inputValue = input.value;

          // Remove keyboard focus
          input.blur();

          const command = processInput(inputValue.toLocaleLowerCase());

          const prevCommands = commands.slice(0, -1);
          setCommandCursor(0);
          setCommand([...prevCommands, command, { input: "", output: null }]);
        }
      }}
    />
  ));
}

export default App;
