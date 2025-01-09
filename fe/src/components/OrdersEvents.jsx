import React, { useState, useEffect } from "react";
import CalendarComponent from "../components/CalendarComponent.jsx";
import "../assets/styles/ordersDate.css";
import "../assets/styles/Calendar.css";

const OrdersEvents = (props) => {
  const { isAdmin } = props;
  const [orders, setOrders] = useState([]);
  const [ordersAtDate, setOrdersAtDate] = useState([]);
  const [selectedDate, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // New state for selected order


  const fetchAvailableWorkers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8801/api/getAvailableWorkers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: selectedDate }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setAvailableWorkers(data.data);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8801/api/getTotalOrders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
        const filteredOrders = data.data.filter(
          (order) => order.dateOfEvent === selectedDate
        );
        setOrdersAtDate(filteredOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableWorkers();
    fetchOrders();
  }, [selectedDate]);

  const Spinner = () => (
    <div className='spinner'>
      <p>Loading...</p>
    </div>
  );

  function handleSelectedOrder(order)
  {
    setSelectedOrder(order)
    /*
    1. make a fetch to find all available workers at the given date:
    */ 
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {/* Calendar Component */}
          <CalendarComponent
            selectedDate={selectedDate}
            setDate={setDate}
            orders={orders}
            setOrdersAtDate={setOrdersAtDate}
            />
            {selectedOrder && (
              <>
                  <p>Order details</p>
                    <div className="selectedOrder"> 
                      {Object.entries(selectedOrder).map(([key, value]) => (
                          <p key={key}>
                            <strong>{key}</strong> {value}
                          </p>))
                      }
                    </div>
                </>
              )}

          {/* Display Orders if they exist */}
          {ordersAtDate.length > 0 && (
            <>
                <h2>Orders for {selectedDate}</h2>
                <div className="event-list">
                {ordersAtDate.map((order) => (
                  <button
                    key={order.orderNumber}
                    onClick={() => handleSelectedOrder(order)} // Add onClick handler
                  >
                    <strong>{order.eventName}</strong> at {order.eventPlace} on{" "}
                    {order.dateOfEvent}
                  </button>
                ))}
                </div>

              {/* Display workers if orders exist */}
              <div className='workers-list'>
                {availableWorkers.length === 0 ? (
                  <p>No available workers for this date.</p>
                  ) : (
                    /*
                    1. Make a workers count from the OrderDescription
                    2. Make a selection to worker, and substract from needed workers.
                    3. Show selected workers.
                    5. Make a button to fetch the data into database.
                    */
                  availableWorkers.map((worker) => (
                    <div key={worker.Personal_id} className='worker-item'>
                      <strong>
                        {worker.firstName} {worker.lastName}
                      </strong>{" "}
                      - {worker.roleName} - {worker.phoneNumber}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default OrdersEvents;
