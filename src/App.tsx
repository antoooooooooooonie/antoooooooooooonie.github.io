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
    return (
      <a href="https://github.com/antoooooooooooonie/antoooooooooooonie.github.io">
        &lt;Open GitHub&gt;
      </a>
    );
  }
  if (command.startsWith("help")) {
    return processInput(`cowsay ${helpMessage}`);
  }
  if (command.startsWith("status")) {
    return "I am currently not taking on new clients.";
  }
  if (command.startsWith("about")) {
    return (
      <pre>{`* UI: I opted for a text user interface
because it's more efficient.  

* Privacy:
I don't save any of your info.
Not because I don't care about, but because I do <3`}</pre>
    );
  }

  if (command.startsWith("contact")) {
    return (
      <>
        <p>
          I am most easily reachable via{" "}
          <a href="mailto:tribute_massifs.0j@icloud.com">
            tribute_massifs.0j@icloud.com
          </a>
          .
        </p>
        <p><em>This is a relay address that will send mail to my actual address.</em></p>
      </>
    );
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

// Hidden commands:
// * cowsay {input}: make the cow say something

const helpMessage = `Hello, I'm Anthony Madhvani.

I run a one-man software consulting company called 
De Codefabriek, which roughly translates to
'The Code Manufactory'.
I promise it sounds way cooler in Dutch.

Commands:
* info: more info about me
* clients: my past and current clients (duh)
* status: am I currently available for work?
* contact: how to reach me and legal stuff
* source: view this site's source code
* about: website lore! so meta!
* help: show this message

Controls:
* CTRL+L: clear the buffer
* ↑: go back in history
* ↓: go forward in history`;

type InputPromptProps = {
  command: Command;
  value: string | null;
  handleInputSubmit: (event: ReactKeyboardEvent<HTMLInputElement>) => void;
  // key: number;
};

const InputPrompt: React.FC<InputPromptProps> = ({
  command,
  value,
  handleInputSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {!command.hidePrompt && (
        <>
          {inputPrefix}
          <input
            ref={inputRef}
            defaultValue={value || ""}
            // Don't allow editing commands that have already been handled
            disabled={!!command.output}
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
      value={command.input}
      handleInputSubmit={(event: ReactKeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          const inputValue = (event.target as HTMLInputElement).value;

          const prevCommands = commands.slice(0, -1);
          setCommandCursor(0);
          setCommand([
            ...prevCommands,
            { input: inputValue, output: processInput(inputValue) },
            { input: "", output: null },
          ]);
        }
      }}
    />
  ));
}

export default App;
