export const saveVacations = (vacations: any[]) => {
  localStorage.setItem("vacations", JSON.stringify(vacations));
};

export const saveEmployees = (employees: any[]) => {
  localStorage.setItem("employees", JSON.stringify(employees));
};

export const loadVacations = () => {
  const savedVacations = localStorage.getItem("vacations");
  return savedVacations ? JSON.parse(savedVacations) : [];
};

export const loadEmployees = () => {
  const savedEmployees = localStorage.getItem("employees");
  return savedEmployees ? JSON.parse(savedEmployees) : [];
};
