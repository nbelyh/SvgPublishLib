
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

export interface ISelectionViewOptions {

  /// Enable "simple box" selection style
  enableBoxSelection: boolean;

  /// Size of the dilate
  dilate: number;

  /// Size of blur
  blur: number;

  /// Enable blur (empty for none)
  enableBlur: boolean;

  /// Enable dilate (empty for none)
  enableDilate: boolean;

  /// Mode, "normal" for border only, lighten/darken for full box
  mode: string;

  /// Shape hover color
  hoverColor: string;

  /// Hyperlink hover color
  hyperlinkColor: string;

  /// Shape selection color
  selectColor: string;
}
