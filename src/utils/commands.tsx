import { PromptOutput } from "../components/PromptOutput";
import { data } from "../data";
import { Command } from "../interfaces/Command";

export const processInput = (command: string): Command => {
  const getOutput = () => {
    if (command == "") {
      return null;
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
