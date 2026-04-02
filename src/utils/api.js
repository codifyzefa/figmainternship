// Mock API request utility
export const apiRequest = async (endpoint, options = {}) => {
  console.log(`Mock API request to: ${endpoint}`, options);
  // Default to empty array for public notices
  if (endpoint === '/notices/public') {
    return [
      {
        title: "Summer Internship Program 2026",
        content: "Applications are now open for the summer session across all departments.",
        date: "2026-03-15"
      },
      {
        title: "New Partner Companies Added",
        content: "We've added 10 new technology companies to our partner list.",
        date: "2026-03-10"
      },
      {
        title: "Workshop: Building Your Portfolio",
        content: "Join us for an online session on how to build a professional portfolio.",
        date: "2026-03-05"
      }
    ];
  }
  return null;
};
