const dbSingleton = require("../dbSingleton");

const getRevenue = async (req, res) => {
  const selectedDate = req.body.data;

  const getRevenueQuery = `SELECT sum(TotalPrice) from orders`;

  dbSingleton.query(ordersQuery, [selectedDate], (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      return res.status(500).send({ message: "Database error" });
    }
    const revenue = results.map((row) => ({
      totalPrice: row.totalPrice,
    }));

    console.log(revenue);

    return res.status(200).send({
      success: true,
      data: revenue,
    });
  });
};

module.exports = {
  getRevenue,
};
