
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

/**
 * Hyperlink information
 */
export interface ILinkInfo {
  /**
   * Target page id (if any)
   */
  PageId: number;

  /**
   * Target sub-address
   */
  SubAddress: string;
  /**
   * Target address
   */
  Address: string;

  /**
   * The description of the link
   */
  Description: string;

  /**
  * The target shape id
  */
  ShapeId: string;

  /**
   * The target zoom
   */
  Zoom: string;

}
