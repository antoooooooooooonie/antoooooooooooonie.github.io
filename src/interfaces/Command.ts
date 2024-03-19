export interface Command {
  input: string;
  hidePrompt: boolean;
  hideInHistory: boolean;
  output: JSX.Element | null;
}
