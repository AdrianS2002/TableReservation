export interface Table {
    id: string; 
    reserved: boolean; 
    reservations?: Array<{
      startTime: string;
      endTime: string;
      date:string;
      name?: string;
    }>; 
    isOverlapping?: boolean;
  }
  