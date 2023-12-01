
//-----------------------------------------------------------------------
// Copyright (c) 2017-2022 Nikolay Belykh unmanagedvisio.com All rights reserved.
// Nikolay Belykh, nbelyh@gmail.com
//-----------------------------------------------------------------------

export class Geometry {

  /*

  */
  public static makeClientPoint = (clientX: number, clientY: number) => {
    return { clientX, clientY };
  };

  /*
      compute geometric distance between points
  */
  public static diff = (pt1, pt2) => {
    const dx = pt1.clientX - pt2.clientX;
    const dy = pt1.clientY - pt2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };


  public static fitInBox(width: number, height: number, maxWidth: number, maxHeight: number) {

    const aspect = width / height;

    if (width > maxWidth || height < maxHeight) {
      width = maxWidth;
      height = Math.floor(width / aspect);
    }

    if (height > maxHeight || width < maxWidth) {
      height = maxHeight;
      width = Math.floor(height * aspect);
    }

    return {
      width: width,
      height: height
    };
  }
}
