
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

export interface IShape {
  PopoverMarkdown?: string;
  SidebarMarkdown?: string;
  TooltipMarkdown?: string;
  Comment?: string;
  DefaultLink: number;
  Links: any[];
  Props: { [name: string]: string };
}