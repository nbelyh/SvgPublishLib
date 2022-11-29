export interface IShape {
  PopoverMarkdown?: string;
  SidebarMarkdown?: string;
  TooltipMarkdown?: string;
  Comment?: string;
  DefaultLink: number;
  Links: any[];
  Props: { [name: string]: string };
}