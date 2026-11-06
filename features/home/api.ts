import { type EmployeeHome, sampleEmployeeHome } from './data'

// Runs only inside the route loader. Sample data for the pilot; swap for a real HR API call.
export async function fetchEmployeeHome(): Promise<EmployeeHome> {
  return sampleEmployeeHome
}
