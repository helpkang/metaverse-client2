
export interface Point {
    x: number;
    y: number;
  }
  export interface Size {
    w: number;
    h: number;
  }
  
  export interface Rect extends Point, Size {
    
  }
  export interface RectColor extends Rect {
    color:string
  }
  
  
  export interface ViewInfo {
    //global position to screen top left
    x: number;
    y: number
    
    //  size
    w: number;
    h: number;
  
    //global position of 
    gx: number
    gy: number
  
  
  }