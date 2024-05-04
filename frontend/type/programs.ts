export type setChange = (cnt: number) => void;
export type setIsAdd = (isAdd: boolean) => void;
export type Course = {
  id: string;
  name: string;
  color: string;
  hour: number;
};

export const colors = ['blue', 'gray', 'green', 'orange', 'pink', 'purple'];
