import React, { useState, useEffect } from "react";
import "../assets/styles/Reports.css";

const Revenue = (props) => {
  const { isAdmin } = props;
  const [revenus, setRevenue] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const fetchRevenue = async () => {
    try {
      const response = await fetch("http://localhost:8801/api/getRevenue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: selectedDate }),
      });
      const data = await response.json();
      if (data.success) {
        setRevenue(data.data);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };
  useEffect(() => {
    fetchRevenue();
  }, [selectedDate]);
};

const Reports = () => {
  return (
    <>
      {/*List of orders: Each item contains customer name, EventName, EventPlace, TotalPrice, OrderDate, OrderHour, DateOfEvent, HourOfEvent*/}
      {/* create query with fetch for roleId 3 and 4*/}
      {}
      {/*Role: Photographer   Name: Aviv  Status: Available / Unavailabe ????*/}
      <h1>Reports</h1>

      <button className='button1'> Revenue </button>
      <button className='button1'> Income </button>
      <button className='button1'> Expenses </button>
    </>
  );
};

export default Reports;
