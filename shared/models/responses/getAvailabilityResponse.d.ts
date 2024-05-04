export interface GetAvailabilityResponse {
    availableInstructors: AvailableInstructors;
    availableRooms: AvailableRooms[];
    todos: Todo[];
}

export interface AvailableInstructors {
    availableInstructors: Instructor[];
    availableInstructorsPreference: Instructor[];
    unavailableInstructors: Instructor[];
}

export interface Instructor {
    id: string;
    avatarUrl: string;
    firstName: string;
}

export interface AvailableRooms {
    id: string;
    name: string;
    floor: number;
}

export interface Todo {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    isCompleted: boolean;
}
