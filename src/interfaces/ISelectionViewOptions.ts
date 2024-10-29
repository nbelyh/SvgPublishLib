
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

import { DiagramInfoSelectionMode } from './Constants';

export interface ISelectionViewOptions {

  /// Enable "simple box" selection style
  enableBoxSelection?: boolean;

  /// Size of the dilate
  dilate?: number;

  /// Size of the connection dilate
  connDilate?: number;

  /// Size of blur
  blur?: number;

  /// Enable blur (empty for none)
  enableBlur?: boolean;

  /// Enable dilate (empty for none)
  enableDilate?: boolean;

  /// Enable connection dilate (empty for none)
  enableConnDilate?: boolean;

  /// Mode, "normal" for border only, lighten/darken for full box
  selectionMode?: DiagramInfoSelectionMode;

  /// Shape hover color
  hoverColor?: string;

  /// Hyperlink hover color
  hyperlinkColor?: string;

  /// Shape selection color
  selectionColor?: string;

  /// Enable prev shape highlight
  enablePrevShapeColor?: boolean;

  /// Enable next shape highlight
  enableNextShapeColor?: boolean;

  /// Enable prev conn highlight
  enablePrevConnColor?: boolean;

  /// Enable next conn highlight
  enableNextConnColor?: boolean;

  /// Prev shape highlight color
  prevShapeColor?: string;

  /// Next shape highlight color
  nextShapeColor?: string;

  /// Prev conn highlight color
  prevConnColor?: string;

  /// Next shape highlight color
  nextConnColor?: string;
}
