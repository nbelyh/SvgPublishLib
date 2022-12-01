
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { ILinkInfo } from './ILinkInfo';

/**
 * Shape information: links, properties, connections, layers, etc
 */
export interface IShapeInfo {

  /**
   * Client-side shape id
   */
  ShapeId: string;

  /**
   * Default link index (if any)
   */
  DefaultLink?: number;

  /**
   * Shape hyperlinks
   */
  Links: ILinkInfo[];

  /**
   * Shape properties (shape data)
   */
  Props: { [name: string]: string };

  /**
   * Comment
   */
  Comment?: string;

  /**
   * Layers the shape is associated with
   */
  Layers: number[];

  /**
   * Shape text
   */
  Text: string;

  /**
   * in case the shape is a container
   */
  IsContainer?: boolean;

  /**
   * The text of the container (in case the shape is a container, otherwise null)
   */
  ContainerText: string;

  /**
   * The type of the container (in case the shape is a container, otherwise null)
   */
  ContainerCategories: string;

  /**
   * The name of the shape's master
   */
  MasterName: string;

  PopoverMarkdown?: string;
  SidebarMarkdown?: string;
  TooltipMarkdown?: string;
  ContentMarkdown?: string;
}
