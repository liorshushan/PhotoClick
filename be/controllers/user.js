const dbSingleton = require("../dbSingleton");
const nodemailer = require("nodemailer");

const getRole = async (roleID) => {
  const sqlQuery = "SELECT RoleName FROM users WHERE RoleID = ?";
  return new Promise((resolve, reject) => {
    dbSingleton.query(sqlQuery, [roleID], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results[0]?.RoleName);
    });
  });
};

const getUser = async (req, res) => {
  const sqlQuery = "SELECT * FROM users WHERE Email = ? and Password = ?";
  const userEmail = req.body.userEmail;
  const userPassword = req.body.userPassword;
  try {
    const userResults = await new Promise((resolve, reject) => {
      dbSingleton.query(
        sqlQuery,
        [userEmail, userPassword],
        (error, results) => {
          if (error || results.length === 0) {
            return reject(error || new Error("User not found"));
          }
          resolve(results);
        }
      );
    });
    const roleID = userResults[0].RoleID;
    const personalId = userResults[0].PersonalId;
    

    const roleName = await getRole(roleID);
    res.json({ roleID, roleName, personalId, ...userResults[0] });
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Database error" });
  }
};

const addUser = (req, res) => {
  const isUserExist = "SELECT * FROM users WHERE Email = ?";
  const sqlQuery =
    "INSERT INTO users (Email, Password, FirstName, LastName, PhoneNumber, StreetAddress, RoleID, RoleName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const newUserDetails = [
    req.body.email, // userEmail
    req.body.password, // userPassword
    req.body.firstName, // userFirstName
    req.body.lastName, // userLastName
    req.body.phoneNumber, // userPhoneNumber
    req.body.address, // userStreetAddress
    req.body.roleID, // userRoleID
    req.body.roleName, // userRoleName
  ];
  dbSingleton.query(isUserExist, [newUserDetails[0]], (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      res.status(500).json({ message: "Database error" }); // Ensure JSON response
    } else if (results.length !== 0) {
      res.status(400).json({ message: "User already exists" }); // Ensure JSON response
    } else {
      dbSingleton.query(sqlQuery, newUserDetails, (error, results) => {
        if (error) {
          console.error("Database query failed:", error);
          res.status(500).json({ message: "Database error" }); // Ensure JSON response
        } else {
          console.log(results);
          res.status(201).json({ message: "User created successfully!" }); // Ensure JSON response
        }
      });
    }
  });
};

const forgotPassword = (req, res) => {
  const sqlQuery = "SELECT * FROM users WHERE Email = ?";
  const userEmail = req.body.userEmail;
  dbSingleton.query(sqlQuery, [userEmail], (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      res.status(500).send({ message: "Database error" });
    } else if (results.length === 0) {
      res.status(404).send({ message: "User not found" });
    } else {
      const text = `
        <h1>Hello ${results[0].FirstName} ${results[0].LastName}</h1>
        <h2>Your password is: ${results[0].Password}</h2>
        <h3>Please sign in and change your password for security reasons.</h3>
        <h4>PhotoClick.</h4>
      `;
      sendEmailToUser(userEmail, text)
        .then(() => res.send({ message: "Password sent to email" }))
        .catch((err) => {
          console.error("Error sending email:", err);
          res.status(500).send({ message: "Error sending email" });
        });
    }
  });
};

async function sendEmailToUser(mailAddress, text) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "photoclickteam@gmail.com",
      pass: "uaht pomh wcre nlhr",
    },
  });
  let info = await transporter.sendMail({
    from: "photoclickteam@gmail.com",
    to: mailAddress,
    subject: "PhotoClick | Reset Password",
    html: `<div>${text}</div>`,
  });
  console.log(info.messageId);
}

const getUserDetails = (req, res) => {
  const userEmail = req.body.email;
  console.log("Received request for user details with email:", userEmail);
  const sqlQuery = `
    SELECT Email, FirstName, LastName, PhoneNumber, StreetAddress, RoleID, RoleName 
    FROM users 
    WHERE Email = ?`;
  dbSingleton.query(sqlQuery, [userEmail], (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      res.status(500).send({ message: "Database error" });
    } else if (results.length === 0) {
      console.log("User not found for email:", userEmail);
      res.status(404).send({ message: "User not found" });
    } else {
      console.log("User details fetched from database:", results[0]);
      res.status(200).json(results[0]);
    }
  });
};

const updateUserDetails = (req, res) => {
  const { email, firstName, lastName, phoneNumber, address, newPassword } =
    req.body;
  console.log("Updating user details for email:", email);
  const sqlQuery = newPassword
    ? `UPDATE users SET FirstName = ?, LastName = ?, PhoneNumber = ?, StreetAddress = ?, Password = ? WHERE Email = ?`
    : `UPDATE users SET FirstName = ?, LastName = ?, PhoneNumber = ?, StreetAddress = ? WHERE Email = ?`;
  const queryParams = newPassword
    ? [firstName, lastName, phoneNumber, address, newPassword, email]
    : [firstName, lastName, phoneNumber, address, email];
  dbSingleton.query(sqlQuery, queryParams, (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      res.status(500).send({ message: "Database error" });
    } else {
      console.log("User details updated successfully");
      res.status(200).send({ success: true });
    }
  });
};

/*until here all works*/

// Function to get pack styles and prices
const getPackStyles = () => {
  return new Promise((resolve, reject) => {
    const getPricesQuery =
      "SELECT ProductPackSerial, Price, ItemType FROM products_packs";
    dbSingleton.query(getPricesQuery, (err, results) => {
      if (err) {
        return reject(err);
      }
      const prices = {};
      const packStyles = {};
      results.forEach((row) => {
        prices[row.ProductPackSerial] = row.Price; // This stores prices for both packs and products
        if (row.ItemType === "Pack") {
          packStyles[row.ProductPackSerial] = {
            basePrice: row.Price,
            discount: 0, // Default discount
          };
        }
      });

      // Set specific discounts for known pack styles
      packStyles[201].discount = 0.05; // Bronze
      packStyles[202].discount = 0.1; // Silver
      packStyles[203].discount = 0.15; // Gold

      resolve({ prices, packStyles });
    });
  });
};

// Function to get the EventSerial
const getEventSerial = (eventType) => {
  return new Promise((resolve, reject) => {
    const eventKindQuery =
      "SELECT EventSerial FROM eventkind WHERE EventName = ?";
    dbSingleton.query(eventKindQuery, [eventType], (err, eventKindResult) => {
      if (err) {
        return reject(err);
      }
      if (eventKindResult.length === 0) {
        return reject(new Error("Invalid event type"));
      }
      resolve(eventKindResult[0].EventSerial);
    });
  });
};

const getProductPackSerials = () => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT ProductPackSerial, ItemType FROM products_packs";
    dbSingleton.query(sqlQuery, (err, results) => {
      if (err) {
        return reject(err);
      }
      const productPackSerials = {};
      results.forEach((row) => {
        if (row.ItemType === "Pack") {
          switch (row.ProductPackSerial) {
            case 201:
              productPackSerials["bronze"] = row.ProductPackSerial;
              break;
            case 202:
              productPackSerials["silver"] = row.ProductPackSerial;
              break;
            case 203:
              productPackSerials["gold"] = row.ProductPackSerial;
              break;
            default:
              console.error("Unknown pack style:", row.ProductPackSerial);
          }
        } else if (row.ItemType === "Product") {
          switch (row.ProductPackSerial) {
            case 901:
              productPackSerials["stills"] = row.ProductPackSerial;
              break;
            case 902:
              productPackSerials["video"] = row.ProductPackSerial;
              break;
            case 903:
              productPackSerials["album30x80"] = row.ProductPackSerial;
              break;
            case 904:
              productPackSerials["album40x60"] = row.ProductPackSerial;
              break;
            case 905:
              productPackSerials["magnets10x12"] = row.ProductPackSerial;
              break;
            case 906:
              productPackSerials["magnets20x24"] = row.ProductPackSerial;
              break;
            case 907:
              productPackSerials["canvas50x70"] = row.ProductPackSerial;
              break;
            case 908:
              productPackSerials["canvas60x90"] = row.ProductPackSerial;
              break;
            default:
              console.error("Unknown product:", row.ProductPackSerial);
          }
        }
      });
      resolve(productPackSerials);
    });
  });
};

const calculateTotalPrice = (quantities, prices, selectedPack) => {
  // Calculate the price for additional products
  const additionalProductsPrice = Object.keys(quantities).reduce(
    (total, productSerial) => {
      const productPrice = prices[productSerial] || 0;
      const productQuantity = quantities[productSerial] || 0;
      return total + productQuantity * productPrice;
    },
    0
  );

  // Calculate the discount based on the selected package
  const discount = selectedPack.basePrice * selectedPack.discount;

  // Calculate the pack price after applying the discount
  const packPriceAfterDiscount = selectedPack.basePrice - discount;

  // Total price is the package price after discount plus the price of additional products
  const totalPrice = packPriceAfterDiscount + additionalProductsPrice;

  console.log("Pack Price After Discount:", packPriceAfterDiscount);
  console.log("Additional Products Price:", additionalProductsPrice);
  console.log("Total Price:", totalPrice);

  return totalPrice;
};

// Function to create an order and save it to the database
// Adjust the backend to handle the price sent from the frontend
const createOrder = async (req, res) => {
  const {
    eventType,
    packStyle,
    eventDate,
    eventTime,
    eventPrice,
    place,
    quantities,
    dynamicDescription
  } = req.body;
  const email = req.body.email;

  try {
    const { prices, packStyles } = await getPackStyles();
    const eventSerial = await getEventSerial(eventType);
    const productPackSerials = await getProductPackSerials();

    // Check for the next available OrderNumber
    const checkOrderNumberQuery = `SELECT MAX(OrderNumber) AS maxOrderNumber FROM orders`;
    dbSingleton.query(checkOrderNumberQuery, (err, orderNumberResult) => {
      if (err) {
        console.error("Database query failed at checkOrderNumberQuery:", err);
        return res.status(500).json({
          success: false,
          message: "Database error at checkOrderNumberQuery",
        });
      }

      let nextOrderNumber = (orderNumberResult[0].maxOrderNumber || 1000) + 1;

      // Insert into orders table
      const orderQuery = `
        INSERT INTO orders (OrderNumber, EventName, EventSerial, TotalPrice, EventPlace, Email, OrderDate, OrderHour, DateOfEvent, HourOfEvent, OrderDescription)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)
      `;
      dbSingleton.query(
        orderQuery,
        [
          nextOrderNumber,
          eventType,
          eventSerial,
          eventPrice, // Use the price sent from the frontend
          place.name,
          email,
          eventDate,
          eventTime,
          dynamicDescription
        ],
        (err, orderResult) => {
          if (err) {
            console.error("Database query failed at orderQuery:", err);
            return res.status(500).json({
              success: false,
              message: "Database error at orderQuery",
            });
          }

          const orderNumber = nextOrderNumber;

          // Insert into order_items table
          const orderItems = [];
          for (const [product, quantity] of Object.entries(quantities)) {
            if (quantity > 0) {
              const productPackSerial = productPackSerials[product]; // Use the correct serial number
              if (productPackSerial) {
                orderItems.push([orderNumber, productPackSerial, quantity]);
              }
            }
          }

          if (productPackSerials[packStyle]) {
            const packSerial = productPackSerials[packStyle];
            orderItems.push([orderNumber, packSerial, 1]);
          }

          console.log("Order Items to Insert:", orderItems); // Log the order items

          if (orderItems.length > 0) {
            const orderItemsQuery = `
              INSERT INTO order_items (OrderNumber, ProductPackSerial, Quantity)
              VALUES ?
            `;
            dbSingleton.query(
              orderItemsQuery,
              [orderItems],
              (err, orderItemsResult) => {
                if (err) {
                  console.error(
                    "Database query failed at orderItemsQuery:",
                    err
                  );
                  return res.status(500).json({
                    success: false,
                    message: "Database error at orderItemsQuery",
                  });
                }
                res.status(201).json({
                  success: true,
                  message: "Order created successfully!",
                });
              }
            );
          } else {
            res.status(400).json({
              success: false,
              message: "No items to insert into order_items.",
            });
          }
        }
      );
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

// Function to get user orders
const getUserOrders = async (req, res) => {
  const userEmail = req.body.email; // for later replace to userid

  const sqlQuery = `
    SELECT 
      orders.OrderNumber, 
      orders.TotalPrice, 
      orders.EventName, 
      orders.DateOfEvent, 
      orders.HourOfEvent, 
      orders.OrderDate, 
      orders.OrderHour,
      orders.EventPlace,
      order_items.ProductPackSerial, 
      order_items.Quantity,
      products_packs.Description AS ItemDescription,
      products_packs.Price AS ItemPrice
    FROM orders
    LEFT JOIN order_items ON orders.OrderNumber = order_items.OrderNumber
    LEFT JOIN products_packs ON order_items.ProductPackSerial = products_packs.ProductPackSerial
    WHERE orders.Email = ?
  `;

  dbSingleton.query(sqlQuery, [userEmail], (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this user" });
    }

    // Organize orders with their items
    const orders = {};

    results.forEach((row) => {
      if (!orders[row.OrderNumber]) {
        orders[row.OrderNumber] = {
          OrderNumber: row.OrderNumber,
          TotalPrice: row.TotalPrice,
          EventName: row.EventName,
          DateOfEvent: row.DateOfEvent,
          HourOfEvent: row.HourOfEvent,
          OrderDate: row.OrderDate,
          OrderHour: row.OrderHour,
          EventPlace: row.EventPlace,
          Items: [],
        };
      }
      orders[row.OrderNumber].Items.push({
        ProductPackSerial: row.ProductPackSerial,
        Quantity: row.Quantity,
        ItemDescription: row.ItemDescription,
        ItemPrice: row.ItemPrice,
      });
    });

    res.status(200).json({ success: true, orders: Object.values(orders) });
  });
};



// Function to get user orders
const getUserOrdersV2 = async (req, res) => {
  const userEmail = req.body.email; // for later replace to userid

  const sqlQuery = `
    SELECT 
      orders.OrderNumber, 
      orders.TotalPrice, 
      orders.EventName, 
      orders.DateOfEvent, 
      orders.HourOfEvent, 
      orders.OrderDate, 
      orders.OrderHour,
      orders.EventPlace,
      order_items.ProductPackSerial, 
      order_items.Quantity,
      products_packs.Description AS ItemDescription,
      products_packs.Price AS ItemPrice
    FROM orders
    LEFT JOIN order_items ON orders.OrderNumber = order_items.OrderNumber
    LEFT JOIN products_packs ON order_items.ProductPackSerial = products_packs.ProductPackSerial
    WHERE orders.Email = ?
  `;

  dbSingleton.query(sqlQuery, [userEmail], (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this user" });
    }

    // Organize orders with their items
    const orders = {};

    results.forEach((row) => {
      if (!orders[row.OrderNumber]) {
        orders[row.OrderNumber] = {
          OrderNumber: row.OrderNumber,
          TotalPrice: row.TotalPrice,
          EventName: row.EventName,
          DateOfEvent: row.DateOfEvent,
          HourOfEvent: row.HourOfEvent,
          OrderDate: row.OrderDate,
          OrderHour: row.OrderHour,
          EventPlace: row.EventPlace,
          Items: [],
        };
      }
      orders[row.OrderNumber].Items.push({
        ProductPackSerial: row.ProductPackSerial,
        Quantity: row.Quantity,
        ItemDescription: row.ItemDescription,
        ItemPrice: row.ItemPrice,
      });
    });

    res.status(200).json({ success: true, orders: Object.values(orders) });
  });
};

module.exports = {
  getUser,
  addUser,
  forgotPassword,
  getUserDetails,
  updateUserDetails,
  createOrder,
  getUserOrders,
};
