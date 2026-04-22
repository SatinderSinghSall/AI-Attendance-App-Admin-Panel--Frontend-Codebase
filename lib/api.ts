export const BASE_URL = "http://localhost:5000/api";

async function request(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  const json = await res.json();

  return json.data || json;
}

export const fetchStudents = () => request("/students");
export const fetchSubjects = () => request("/subjects");
export const fetchAttendance = () => request("/attendance");
export const fetchDashboard = () => request("/dashboard");
