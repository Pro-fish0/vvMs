export type VacationType = "Regular" | "Sick" | "Compensatory" | "Companion";

export interface Vacation {
  type: VacationType;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  department?: string;
}

export interface Employee {
  id: string;
  name: string;
  department?: string;
  vacationBalance?: {
    regular: number;
    sick: number;
    compensatory: number;
  };
}
