export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error("API request failed");
  }

  const json = await res.json();
  return json.data || json;
}

export const fetchStudents = () => request("/students");
export const fetchSubjects = () => request("/subjects");
export const fetchAttendance = () => request("/attendance");
export const fetchDashboard = () => request("/dashboard");
