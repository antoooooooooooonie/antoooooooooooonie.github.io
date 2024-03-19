export interface Command {
  input: string;
  hidePrompt?: boolean;
  hideInHistory?: boolean;
  output: string | JSX.Element | null;
}
