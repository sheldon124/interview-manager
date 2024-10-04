const mockInterviews = [
  {
    id: 1,
    interviewee: "Dawar Waqar",
    date: "2024-10-02",
    time: "10:00 AM",
    duration: "30 mins",
    role: "Software Engineer",
    interviewer: "Sundar Pichai",
    assigned: true,
    additional_notes: "In person",
  },
  {
    id: 5,
    interviewee: "Michael Scott",
    date: "2024-10-03",
    time: "01:00 PM",
    duration: "60 mins",
    role: "Regional Manager",
    interviewer: "",
    assigned: false,
    additional_notes: "In person",
  },
  {
    id: 6,
    interviewee: "Jim Halpert",
    date: "2024-10-03",
    time: "02:00 PM",
    duration: "30 mins",
    role: "Sales Representative",
    interviewer: "",
    assigned: false,
    additional_notes: "In person",
  },
  {
    id: 7,
    interviewee: "Pam Beesly",
    date: "2024-10-04",
    time: "03:00 PM",
    duration: "45 mins",
    role: "Office Administrator",
    interviewer: "Jan Levinson",
    assigned: true,
    additional_notes: "Virtual",
  },
  {
    id: 8,
    interviewee: "Stanley Hudson",
    date: "2024-10-04",
    time: "04:00 PM",
    duration: "30 mins",
    role: "Sales Representative",
    interviewer: "",
    assigned: false,
    additional_notes: "In person",
  },
  {
    id: 9,
    interviewee: "Kevin Malone",
    date: "2024-10-04",
    time: "05:00 PM",
    duration: "30 mins",
    role: "Accountant",
    interviewer: "Oscar Martinez",
    assigned: true,
    additional_notes: "In person",
  },
  {
    id: 10,
    interviewee: "Angela Martin",
    date: "2024-10-04",
    time: "06:00 PM",
    duration: "30 mins",
    role: "Accountant",
    interviewer: "",
    assigned: false,
    additional_notes: "Virtual",
  },
  {
    id: 11,
    interviewee: "Andy Bernard",
    date: "2024-10-04",
    time: "07:00 PM",
    duration: "30 mins",
    role: "Sales Manager",
    interviewer: "Robert California",
    assigned: true,
    additional_notes: "In person",
  },
  {
    id: 12,
    interviewee: "Creed Bratton",
    date: "2024-10-04",
    time: "08:00 PM",
    duration: "15 mins",
    role: "Quality Assurance",
    interviewer: "Angela Martin",
    assigned: true,
    additional_notes: "In person",
  },
  {
    id: 13,
    interviewee: "Toby Flenderson",
    date: "2024-10-04",
    time: "09:00 PM",
    duration: "30 mins",
    role: "HR Manager",
    interviewer: "",
    assigned: false,
    additional_notes: "Virtual",
  },
  {
    id: 14,
    interviewee: "Meredith Palmer",
    date: "2024-10-04",
    time: "10:00 PM",
    duration: "15 mins",
    role: "Supplier Relations",
    interviewer: "Pam Beesly",
    assigned: true,
    additional_notes: "In person",
  },
  {
    id: 15,
    interviewee: "Kelly Kapoor",
    date: "2024-10-04",
    time: "11:00 PM",
    duration: "30 mins",
    role: "Customer Service Rep",
    interviewer: "",
    assigned: false,
    additional_notes: "Virtual",
  },
];

// Function to filter dummy interviews by date
function getInterviewsByDate(date: string) {
  return mockInterviews.filter((interview) => interview.date == date);
}

export { mockInterviews, getInterviewsByDate };