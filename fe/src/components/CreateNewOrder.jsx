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
  const [quantities, setQuantities] = useState({});
  const [dynamicDescription, setDynamicDescription] = useState("");
  const [baseDescription, setBaseDescription] = useState(""); // Base description
  const [additionalIncludes, setAdditionalIncludes] = useState(""); // Additional includes
  const [loading, setLoading] = useState(true);
  const [clearInput, setClearInput] = useState(false);

  // Fetch API Data
  const fetchPrices = async () => {
    try {
      const response = await fetch("http://localhost:8801/api/getPrices");
      const data = await response.json();
      if (data.success) setPrices(data.data);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const response = await fetch("http://localhost:8801/api/getEventTypes");
      const data = await response.json();
      if (data.success) setEventTypes(data.data);
    } catch (error) {
      console.error("Error fetching event types:", error);
    }
  };

  const fetchPackStyles = async () => {
    try {
      const response = await fetch("http://localhost:8801/api/getPackStyles");
      const data = await response.json();
      if (data.success) setPackStyles(data.data);
    } catch (error) {
      console.error("Error fetching pack styles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    fetchEventTypes();
    fetchPackStyles();
  }, []);

  // Calculate total price and update dynamic description
  useEffect(() => {
    if (!formInputs.packStyle || loading || !packStyles[formInputs.packStyle])
      return;

    const packBasePrice = packStyles[formInputs.packStyle]?.basePrice -
      (packStyles[formInputs.packStyle]?.basePrice * packStyles[formInputs.packStyle]?.discount) || 0;
    
    const additionalCost = Object.keys(quantities).reduce(
      (total, product) =>
        total + (quantities[product] || 0) * (prices[product] || 0),
      0
    );

    setTotalPrice(packBasePrice + additionalCost);
    updateDescription(packStyles[formInputs.packStyle]?.description || "");
  }, [formInputs.packStyle, quantities, prices, packStyles]);

  const handleQuantityChange = (product, value) => {
    const numericValue = Math.max(parseInt(value, 10) || 0, 0);
    setQuantities((prev) => ({ ...prev, [product]: numericValue }));
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearProducts = () => {
    setQuantities({});
    setTotalPrice(packStyles[formInputs.packStyle]?.basePrice || 0);
    setAdditionalIncludes(""); // Reset additional includes
  };

  const handleClearAll = () => {
    handleClearProducts();
    setFormInputs({
      eventType: "",
      packStyle: "",
      eventDate: "",
      eventTime: "",
    });
    setPlace({});
    setClearInput(true);
    setTimeout(() => setClearInput(false), 100);
  };

  const updateDescription = (baseDescriptionText) => {
    // Base description is set when pack style is selected
    setBaseDescription(baseDescriptionText);

    // Build the additional includes section
    let additionalDescription = "";
    const updatedDescription = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([product, quantity]) => `${quantity} ${product}`)
      .join(", ");

    if (updatedDescription) {
      additionalDescription = `Additional Includes: ${updatedDescription}.`;
    }

    setAdditionalIncludes(additionalDescription);

    // Combine base description and additional includes
    setDynamicDescription(`${baseDescriptionText} ${additionalDescription}`);
  };

  const handleSubmit = async () => {
    const orderDetails = {
      ...formInputs,
      eventPrice: totalPrice,
      place,
      quantities,
      email: localStorage.getItem("userEmail"),
      dynamicDescription: dynamicDescription
    };

    try {
      const response = await fetch("http://localhost:8801/api/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Order created successfully!");
        handleClearAll();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className='create-new-order'>
      <div className='form-content'>
        <div className='products-to-add'>
          <h3 className='title'>Products To Add</h3>
          {Object.keys(prices).map((product) => (
            <div className='product-item' key={product}>
              <label>
                {product} = {prices[product].toFixed(2)}₪
              </label>
              <div className='quantity-controls'>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      product,
                      (quantities[product] || 0) - 1
                    )
                  }
                >
                  -
                </button>
                <input
                  type='number'
                  value={quantities[product] || 0}
                  onChange={(e) =>
                    handleQuantityChange(product, e.target.value)
                  }
                />
                <button
                  onClick={() =>
                    handleQuantityChange(
                      product,
                      (quantities[product] || 0) + 1
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <button onClick={handleClearProducts} className='submit'>
            Clear Products
          </button>
          <button onClick={handleClearAll} className='submit'>
            Clear All
          </button>
          <p>{dynamicDescription}</p>
        </div>
        <div className='order-details'>
          <h3 className='title'>Event Details</h3>
          <select
            name='eventType'
            value={formInputs.eventType}
            onChange={handleFormInputChange}
          >
            <option value='' disabled>
              Select Event Type
            </option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            name='packStyle'
            value={formInputs.packStyle}
            onChange={handleFormInputChange}
          >
            <option value='' disabled>
              Select Pack Style
            </option>
            {Object.keys(packStyles).map((key) => (
              <option key={key} value={key}>
                {packStyles[key].name}
              </option>
            ))}
          </select>
          <PlacesAutoComplete onSelect={setPlace} clearInput={clearInput} />
          <input
            type='date'
            name='eventDate'
            value={formInputs.eventDate}
            onChange={handleFormInputChange}
          />
          <input
            type='time'
            name='eventTime'
            value={formInputs.eventTime}
            onChange={handleFormInputChange}
          />
          <div className='total-price'>
            <h4>Total Price: {totalPrice.toFixed(2)}₪</h4>
          </div>
          <button onClick={handleSubmit} className='submit'>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewOrder;
