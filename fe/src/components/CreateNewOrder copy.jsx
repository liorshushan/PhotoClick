import React, { useState, useEffect } from "react";
import "../assets/styles/CreateNewOrder.css";
import PlacesAutoComplete from "./PlacesAutoComplete";

const CreateNewOrder = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [place, setPlace] = useState({});
  const [eventTypes, setEventTypes] = useState([]);
  const [prices, setPrices] = useState({});
  const [packStyles, setPackStyles] = useState({});
  const [formInputs, setFormInputs] = useState({
    eventType: "",
    packStyle: "",
    eventDate: "",
    eventTime: "",
  });
  const [quantities, setQuantities] = useState({
    stills: 0,
    video: 0,
    album30x80: 0,
    album40x60: 0,
    magnets10x12: 0,
    magnets20x24: 0,
    canvas50x70: 0,
    canvas60x90: 0,
  });
  const [clearInput, setClearInput] = useState(false);

  // Fetch event types
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await fetch("http://localhost:8801/api/eventTypes");
        if (response.ok) {
          const data = await response.json();
          setEventTypes(data); // Assuming it's an array
        } else {
          console.error("Failed to fetch event types.");
        }
      } catch (error) {
        console.error("Error fetching event types:", error);
      }
    };

    fetchEventTypes();
  }, []);

  // Fetch prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("http://localhost:8801/api/prices");
        if (response.ok) {
          const data = await response.json();
          setPrices(data); // Assuming it's an object
        } else {
          console.error("Failed to fetch prices.");
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, []);

  // Fetch pack styles
  useEffect(() => {
    const fetchPackStyles = async () => {
      try {
        const response = await fetch("http://localhost:8801/api/packStyles");
        if (response.ok) {
          const data = await response.json();
          setPackStyles(data); // Assuming it's an object
        } else {
          console.error("Failed to fetch pack styles.");
        }
      } catch (error) {
        console.error("Error fetching pack styles:", error);
      }
    };

    fetchPackStyles();
  }, []);

  // Recalculate Total Price
  useEffect(() => {
    calculateTotalPrice();
  }, [formInputs.packStyle, quantities]);

  const calculateTotalPrice = () => {
    const packStyle = packStyles[formInputs.packStyle] || {
      basePrice: 0,
      discount: 0,
    };
    const additionalProductsPrice = Object.keys(quantities).reduce(
      (total, product) =>
        total + (quantities[product] || 0) * (prices[product] || 0),
      0
    );

    const discount = packStyle.basePrice * packStyle.discount;
    const finalPrice = packStyle.basePrice - discount + additionalProductsPrice;

    setTotalPrice(finalPrice);
    return finalPrice; // Return the final price for backend use
  };

  const handleQuantityChange = (product, amount) => {
    setQuantities((prevQuantities) => {
      const newQuantity = Math.max((prevQuantities[product] || 0) + amount, 0);
      return { ...prevQuantities, [product]: newQuantity };
    });
  };

  const handleInputChange = (product, value) => {
    const newQuantity = Math.max(parseInt(value) || 0, 0);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product]: newQuantity,
    }));
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleClearProducts = () => {
    setQuantities({
      stills: 0,
      video: 0,
      album30x80: 0,
      album40x60: 0,
      magnets10x12: 0,
      magnets20x24: 0,
      canvas50x70: 0,
      canvas60x90: 0,
    });
    setTotalPrice(0);
  };

  const handleClearAll = () => {
    handleClearProducts();
    setFormInputs({
      eventType: "",
      packStyle: "custom",
      eventDate: "",
      eventTime: "",
    });
    setPlace({});
    setClearInput(true);
    setTimeout(() => setClearInput(false), 100);
  };

  const handleSubmit = async () => {
    const totalPrice = calculateTotalPrice(); // Calculate total price before submitting

    const orderDetails = {
      eventType: formInputs.eventType,
      packStyle: formInputs.packStyle,
      eventDate: formInputs.eventDate,
      eventTime: formInputs.eventTime,
      eventPrice: totalPrice,
      place,
      quantities,
      email: localStorage.getItem("userEmail"),
    };

    try {
      const response = await fetch("http://localhost:8801/api/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Order created successfully!");
      } else {
        alert(`Error creating order: ${data.message}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order. Please try again.");
    }
  };

  return (
    <div className='create-new-order'>
      <div className='form-content'>
        <div className='products-to-add'>
          <h3>Products To Add</h3>
          {Object.keys(prices).map((product) => (
            <div className='product-item' key={product}>
              <label>
                {product.charAt(0).toUpperCase() + product.slice(1)} ={" "}
                {prices[product]?.toFixed(2)}₪
              </label>
              <div className='quantity-controls'>
                <button onClick={() => handleQuantityChange(product, -1)}>
                  -
                </button>
                <input
                  type='number'
                  value={quantities[product] || 0}
                  onChange={(e) => handleInputChange(product, e.target.value)}
                />
                <button onClick={() => handleQuantityChange(product, 1)}>
                  +
                </button>
              </div>
            </div>
          ))}
          <div className='button-group'>
            <button
              type='button'
              className='button clear'
              onClick={handleClearProducts}
            >
              Clear Products
            </button>
            <button
              type='button'
              className='button clear'
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>
          {formInputs.packStyle !== "" && (
            <p className='pack-description'>
              {packStyles[formInputs.packStyle]?.description || ""}
            </p>
          )}
        </div>
        <div className='order-details'>
          <h3>Event Details</h3>
          <select
            id='eventType'
            name='eventType'
            className='input'
            value={formInputs.eventType}
            onChange={handleFormInputChange}
            required
          >
            <option value='' disabled>
              Select Event Type
            </option>
            {eventTypes.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
          <select
            id='packStyle'
            name='packStyle'
            className='input'
            value={formInputs.packStyle}
            onChange={handleFormInputChange}
          >
            <option value='' disabled>
              Select Pack Style
            </option>
            {Object.keys(packStyles).map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
        <button type='button' onClick={handleSubmit}>
          Submit Order
        </button>
      </div>
    </div>
  );
};

export default CreateNewOrder;
