import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Calendar, Upload, Download } from "lucide-react";
import CalendarView from "./CalendarView";
import AddVacations from "./AddVacations";
import Reports from "./Reports";
import { Vacation, Employee } from "./types";

const VacationManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedVacations = localStorage.getItem("vacations");
    const savedEmployees = localStorage.getItem("employees");

    if (savedVacations) setVacations(JSON.parse(savedVacations));
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("vacations", JSON.stringify(vacations));
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [vacations, employees]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Vacation Management System</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="add">
            <Upload className="w-4 h-4 mr-2" />
            Add Vacations
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Download className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <CalendarView
            vacations={vacations}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        </TabsContent>

        <TabsContent value="add">
          <AddVacations
            onVacationsAdd={(newVacations) => {
              setVacations([...vacations, ...newVacations]);
            }}
            existingVacations={vacations}
          />
        </TabsContent>

        <TabsContent value="reports">
          <Reports
            vacations={vacations}
            employees={employees}
            currentDate={currentDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VacationManagementSystem;
