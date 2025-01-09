import React, { useState } from "react";
import Papa from "papaparse";
import { parseDate } from "../../utils/dates";
import { Vacation } from "./types";

interface AddVacationsProps {
  onVacationsAdd: (newVacations: Vacation[]) => void;
  existingVacations: Vacation[];
}

const AddVacations = ({
  onVacationsAdd,
  existingVacations,
}: AddVacationsProps) => {
  const [csvData, setCsvData] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<Vacation[]>([]);

  const validateVacations = (vacations: Vacation[]) => {
    const newErrors: string[] = [];

    vacations.forEach((vacation, index) => {
      const start = parseDate(vacation.startDate);
      const end = parseDate(vacation.endDate);

      if (!start || !end) {
        newErrors.push(`Row ${index + 1}: Invalid date format`);
        return;
      }

      if (start > end) {
        newErrors.push(`Row ${index + 1}: Start date must be before end date`);
      }

      // Check for overlapping vacations
      const overlapping = existingVacations.some((existing) => {
        const existingStart = parseDate(existing.startDate);
        const existingEnd = parseDate(existing.endDate);

        if (!existingStart || !existingEnd) return false;

        return (
          vacation.employeeId === existing.employeeId &&
          !(end < existingStart || start > existingEnd)
        );
      });

      if (overlapping) {
        newErrors.push(`Row ${index + 1}: Overlapping vacation dates`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedData = event.clipboardData.getData("text");
    setCsvData(pastedData);

    Papa.parse(pastedData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedVacations = results.data as Vacation[];
        setPreview(parsedVacations);
        validateVacations(parsedVacations);
      },
    });
  };

  const handleSubmit = () => {
    if (validateVacations(preview)) {
      onVacationsAdd(preview);
      setCsvData("");
      setPreview([]);
      setErrors([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded p-4">
        <h3 className="font-medium mb-2">Paste CSV Data</h3>
        <textarea
          className="w-full h-32 p-2 border rounded"
          placeholder="Paste your CSV data here..."
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
          onPaste={handlePaste}
        />
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border-red-200 border rounded p-4">
          <h4 className="text-red-700 font-medium mb-2">Validation Errors</h4>
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index} className="text-red-600">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {preview.length > 0 && (
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Preview</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Employee</th>
                <th className="text-left p-2">Start Date</th>
                <th className="text-left p-2">End Date</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((vacation, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{vacation.type}</td>
                  <td className="p-2">{vacation.employeeName}</td>
                  <td className="p-2">{vacation.startDate}</td>
                  <td className="p-2">{vacation.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={errors.length > 0 || preview.length === 0}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Import Vacations
      </button>
    </div>
  );
};

export default AddVacations;
