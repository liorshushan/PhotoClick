import React, { useState, useEffect } from "react";
import "../assets/styles/MyOrders.css"; // Ensure you have the correct CSS file

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8801/api/getUserOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: localStorage.getItem("userEmail") }),
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const toggleOrderDetails = (orderNumber) => {
    setSelectedOrder(selectedOrder === orderNumber ? null : orderNumber);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatItemDetails = (item) => {
    if (item.IsPack) {
      // Calculate the price after discount for packs
      const discountAmount = item.ItemPrice * item.Discount;
      const priceAfterDiscount = item.ItemPrice - discountAmount;
      return `${item.ItemDescription} = ${item.ItemPrice.toFixed(2)}₪ + ${(
        item.Discount * 100
      ).toFixed(0)}% Discount (Includes: ${item.PackDetails}) x ${
        item.Quantity
      } = ${(priceAfterDiscount * item.Quantity).toFixed(2)} ₪`;
    } else if (item.IsCustom) {
      return `Custom (No Discount)`;
    } else {
      // Format for individual products
      return `${item.ItemDescription} x ${item.Quantity} = ${
        item.ItemPrice * item.Quantity
      } ₪`;
    }
  };

  return (
    <div className="my-orders-sidebar">
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.OrderNumber} className="my-orders-number">
            <h4 onClick={() => toggleOrderDetails(order.OrderNumber)}>
              Order #{order.OrderNumber}
            </h4>
            {selectedOrder === order.OrderNumber && (
              <div className="my-orders-details">
                <p>Event: {order.EventName}</p>
                <p>Place: {order.EventPlace}</p>
                <p>Date: {formatDate(order.DateOfEvent)}</p>
                <p>Time: {order.HourOfEvent}</p>
                <p>Total Price: {order.TotalPrice} ₪</p>
                <p>Order Date: {formatDate(order.OrderDate)}</p>
                <p>Order Hour: {order.OrderHour}</p>
                <h5>Items:</h5>
                <ul>
                  {order.Items.map((item, index) => (
                    <li key={index}>{formatItemDetails(item)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
