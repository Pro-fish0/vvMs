import { useState, useEffect } from "react";
import {
  Vacation,
  Employee,
} from "../components/VacationManagementSystem/types";

export const useVacations = () => {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const savedVacations = localStorage.getItem("vacations");
    const savedEmployees = localStorage.getItem("employees");

    if (savedVacations) setVacations(JSON.parse(savedVacations));
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
  }, []);

  useEffect(() => {
    localStorage.setItem("vacations", JSON.stringify(vacations));
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [vacations, employees]);

  return { vacations, setVacations, employees, setEmployees };
};
