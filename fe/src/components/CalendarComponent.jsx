import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = (props) => {
  // const { selectedDate, setDate, orders, isCoolDown, coolDown } = props;
  const { selectedDate, setDate, orders, coolDown, setOrdersAtDate} = props;



  /**
   * 1. 
   * @param {*} date 
   * @returns 
   */
  const handleDateChange = (date) => {
    // if (isCoolDown) return; // Prevent action if cooldown is active
    //coolDown(true); // Set cooldown
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setDate(formattedDate); // Update date
    
  };


  //   // The function to apply background color to all days
  // const tileClassName = ({ view }) => {
  //   if (view !== 'month') return ''; // Only apply styles for the month view

  //   // Apply a background color for all days (green for example)
  //   return 'future-order';
  // };



const tileClassName = ({ date, view }) => {
  if (view !== 'month') return ''; // Only apply styles for the month view

  // Format the current date to YYYY-MM-DD
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;


  // Find if any order matches the current date
  const matchingOrder = orders.find((order) => order.dateOfEvent === formattedDate);

  if (matchingOrder) {
    const currentDate = new Date();
    const currentFormattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`; // Format current date

    // Compare formatted dates
    if (formattedDate < currentFormattedDate) {
      return 'past-order'; // Apply past-order class for past dates (yellow background)
    } else {
      return 'future-order'; // Apply future-order class for future or current dates (green background)
    }
  }

  return ''; // No styling if no order exists for this date
  };

  return (
    <>
      <h1>Calendar</h1>
      <Calendar 
        tileClassName={tileClassName} 
        onChange={handleDateChange} 
        value={selectedDate ? new Date(selectedDate) : new Date()} 
      />
    </>
  );
};

export default CalendarComponent;
