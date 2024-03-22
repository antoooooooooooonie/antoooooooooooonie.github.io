import { PromptOutput } from "../components/PromptOutput";
import { Tetris } from "../components/Tetris/Tetris";
import { data } from "../data";
import { Command } from "../interfaces/Command";

export const processInput = (command: string): Command => {
  const getOutput = () => {
    if (command == "") {
      return null;
    }

    if (command.startsWith("so")) {
      return <PromptOutput>{data.source}</PromptOutput>;
    }

    if (command.startsWith("cl")) {
      return <PromptOutput>{data.clients}</PromptOutput>;
    }

    if (command.startsWith("se")) {
      return <PromptOutput>{data.services}</PromptOutput>;
    }

    if (command.startsWith("st")) {
      return <PromptOutput>{data.status}</PromptOutput>;
    }

    if (command.startsWith("ab")) {
      return <PromptOutput>{data.about}</PromptOutput>;
    }

    if (command.startsWith("con")) {
      return <PromptOutput>{data.contact}</PromptOutput>;
    }

    if (command.startsWith("he")) {
      return processInput(`cowsay ${data.help}`).output;
    }

    if (command.startsWith("tetris")) {
      return <Tetris/>;
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
    input: command.toLocaleLowerCase(),
    output: getOutput(),
    hideInHistory: command == "",
    hidePrompt: false,
  };
};

export const emptyCommand: Command = processInput("");

export const initialInput: Command[] = [
  {
    ...processInput("help"),
    hidePrompt: true,
    hideInHistory: false,
  },
  emptyCommand,
];
