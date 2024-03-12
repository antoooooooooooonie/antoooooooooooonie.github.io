declare module "cowsay2" {
  export function say(
    message: string,
    options?: { n?: boolean; W?: number }
  ): string;
}
