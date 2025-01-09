const dbSingleton = require("../dbSingleton");

const getOrdersAtDate = async (req, res) => {
  const selectedDate = req.body.data; // Expecting date in 'YYYY-MM-DD' format

  console.log(selectedDate);

  const ordersQuery = `
SELECT 
  OrderNumber, 
  EventName, 
  EventPlace, 
  TotalPrice, 
  DATE_FORMAT(OrderDate, '%Y-%m-%d') AS OrderDate, 
  OrderHour, 
  DATE_FORMAT(DateOfEvent, '%Y-%m-%d') AS DateOfEvent, 
  HourOfEvent
FROM orders;`;

  dbSingleton.query(ordersQuery, [selectedDate], (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      return res.status(500).send({ message: "Database error" });
    }

    const orders = results.map((row) => ({
      orderNumber: row.OrderNumber,
      eventName: row.EventName,
      eventPlace: row.EventPlace,
      totalPrice: row.TotalPrice,
      orderDate: row.OrderDate,
      orderHour: row.OrderHour,
      dateOfEvent: row.DateOfEvent,
      hourOfEvent: row.HourOfEvent,
    }));

    console.log(orders);

    return res.status(200).send({
      success: true,
      data: orders,
    });
  });
};

const getPrices = async (req, res) => {
  const ordersQuery = `
SELECT 
  ProductDescription, 
  ProductPrice
FROM products;`;

  dbSingleton.query(ordersQuery, [], (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      return res.status(500).send({ message: "Database error" });
    }

    // const prices = {
    //   stills: 800,
    //   video: 1200,
    //   album30x80: 250,
    //   album40x60: 300,
    //   magnets10x12: 1,
    //   magnets20x24: 2,
    //   canvas50x70: 350,
    //   canvas60x90: 400,
    // };

    // Map the database results to the prices object
    const prices = results.reduce((acc, row) => {
      acc[row.ProductDescription] = row.ProductPrice; // Create keys like 'stills', 'album30x80', etc.
      return acc;
    }, {});

    return res.status(200).send({
      success: true,
      data: prices,
    });
  });
};

const getTotalOrders = async (req, res) => {
  const ordersQuery = `
    SELECT 
      OrderNumber, 
      EventName, 
      EventPlace, 
      TotalPrice, 
      DATE_FORMAT(OrderDate, '%Y-%m-%d') AS OrderDate, 
      DATE_FORMAT(OrderHour, '%H:%i:%s') AS OrderHour, 
      DATE_FORMAT(DateOfEvent, '%Y-%m-%d') AS DateOfEvent, 
      DATE_FORMAT(HourOfEvent, '%H:%i:%s') AS HourOfEvent,
      OrderDescription
    FROM orders;
    `;

  dbSingleton.query(ordersQuery, (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      return res.status(500).send({ message: "Database error" });
    }

    const orders = results.map((row) => ({
      orderNumber: row.OrderNumber,
      eventName: row.EventName,
      eventPlace: row.EventPlace,
      totalPrice: row.TotalPrice,
      orderDate: row.OrderDate,
      orderHour: row.OrderHour,
      dateOfEvent: row.DateOfEvent,
      hourOfEvent: row.HourOfEvent,
      orderDescription: row.OrderDescription
    }));

    console.log(orders);

    return res.status(200).send({
      success: true,
      data: orders,
    });
  });
};

const getEventTypes = async (req, res) => {
  const ordersQuery = `
    SELECT 
      EventName
    FROM eventkind;
    `;

  dbSingleton.query(ordersQuery, (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      return res.status(500).send({ message: "Database error" });
    }

    const eventTypes = results.map((row) => row.EventName);

    return res.status(200).send({
      success: true,
      data: eventTypes,
    });
  });
};

const getPackStyles = async (req, res) => {
  const packsQuery = `
    SELECT 
      SerialPack,
      PackDescription,
      PricePack,
      PackName,
      SteelsPhotographers,
      VideoPhotographers,
      Albums30X80,
      Albums40X60,
      Magnets10X12,
      Magnets20X24,
      Canvas50X70,
      Canvas60X90
    FROM packs;
  `;

  dbSingleton.query(packsQuery, (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      return res.status(500).send({ message: "Database error" });
    }

    const discountMap = {
      201: 0.05, // Bronze
      202: 0.1, // Silver
      203: 0.15, // Gold
    };

    const packStyles = {
      custom: {
        basePrice: 0,
        discount: 0,
        name: "Custom (No Discount)",
        description: "Choose Your Own Products (No Discount)",
        included: {},
      },
    };

    results.forEach((row) => {
      const key = row.PackName.toLowerCase().split(" ")[0]; // e.g., "bronze", "silver", "gold"

      packStyles[key] = {
        basePrice: parseFloat(row.PricePack),
        discount: discountMap[row.SerialPack] || 0,
        name: `${row.PackName} = ${row.PricePack.toFixed(2)}₪ + ${(
          (discountMap[row.SerialPack] || 0) * 100
        ).toFixed(0)}% Discount`,
        description: row.PackDescription,
        included: {
          ...(row.SteelsPhotographers && { stills: row.SteelsPhotographers }),
          ...(row.VideoPhotographers && { video: row.VideoPhotographers }),
          ...(row.Albums30X80 && { album30x80: row.Albums30X80 }),
          ...(row.Albums40X60 && { album40x60: row.Albums40X60 }),
          ...(row.Magnets10X12 && { magnets10x12: row.Magnets10X12 }),
          ...(row.Magnets20X24 && { magnets20x24: row.Magnets20X24 }),
          ...(row.Canvas50X70 && { canvas50x70: row.Canvas50X70 }),
          ...(row.Canvas60X90 && { canvas60x90: row.Canvas60X90 }),
        },
      };
    });

    return res.status(200).send({
      success: true,
      data: packStyles,
    });
  });
};

module.exports = {
  getOrdersAtDate,
  getTotalOrders,
  getPrices,
  getEventTypes,
  getPackStyles,
};

// get all products associated to the order.
// get type of pack according to the order.
