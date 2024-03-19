import {
  useState,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
} from "react";
import "./App.css";
import { Command } from "./interfaces/Command";
import { InputPrompt } from "./components/InputPrompt";
import { emptyCommand, initialInput, processInput } from "./utils/commands";

// When the user navigated to an anchor link, use the content of the anchor link as the command and remove the anchor link from the URL
const useListenOnAnchorLink = (
  setCommand: React.Dispatch<React.SetStateAction<Command[]>>
) => {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        setCommand((commands) => [
          ...commands.slice(0, -1),
          processInput(hash.slice(1)),
          emptyCommand,
        ]);

        // Remove the anchor link
        history.pushState(
          "",
          document.title,
          window.location.pathname + window.location.search
        );
      }
    };

    window.addEventListener("hashchange", handleHashChange, false);

    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
    };
  }, [setCommand]);
};

function App() {
  const [commands, setCommand] = useState<Command[]>(initialInput);
  const [commandCursor, setCommandCursor] = useState<number>(0);

  useListenOnAnchorLink(setCommand);

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

          // Remove keyboard focus
          input.blur();

          setCommandCursor(0);

          setCommand((commands) => [
            ...commands.slice(0, -1),
            processInput(inputValue.toLocaleLowerCase()),
            emptyCommand,
          ]);
        }
      }}
    />
  ));
}

export default App;
