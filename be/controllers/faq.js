const dbSingleton = require("../dbSingleton");

const getFAQData= async (req, res) => {

    //  `faq_title` varchar(255) NOT NULL,
    //`faq_content` varchar(255) NOT NULL

    // retrieve faq data, means select faq_title, faq_content from faq

    const faqQuery = `SELECT faq_id,  faq_title, faq_content FROM faq`;

    dbSingleton.query(faqQuery, [], (error, results) => {
        
    if (error) {
      console.error("Database query failed:", error);
      res.status(500).send({ message: "Database error" });
    } else {

    // Map the results to the desired format
      const formattedResults = results.map(row => ({
        faq_id: row.faq_id,
        faq_title: row.faq_title,
        faq_content: row.faq_content
      }));
      console.log(formattedResults)
        
        
      // Send the formatted results back as the response
      return res.status(200).send({
        success: true,
        data: formattedResults
      });
    }
        
  });

}


const addFaqData = async (req, res) => {
    const { faq_title, faq_content } = req.body.data; // Destructure correctly

    console.log("--------------------------------------------------------");
    console.log(req.body); // Log the received body for debugging

    // SQL query to insert FAQ data
    const faqQuery = `INSERT INTO faq (faq_title, faq_content) VALUES (?, ?)`;

    dbSingleton.query(faqQuery, [faq_title, faq_content], (error, results) => {
        if (error) {
            console.error("Database query failed:", error);
            return res.status(500).send({ message: "Database error" });
        } 

        const insertedId = results.insertId; 
        console.log("--------------------------------------------------------");
        console.log(insertedId); 
        
        // Send the formatted results back as the response
        return res.status(200).send({
            success: true,
            faq_id: insertedId
        });
    });
};
const deleteFaqData = async (req, res) => {
  const id = req.body.data
  console.log("--------------------------------------------------------")
  console.log(id)

    // TODO: make an update query. add the question and answer.
    const faqQuery = `DELETE FROM  faq  WHERE faq_id = ?`;

    dbSingleton.query(faqQuery, [id],  (error, results) => {
        
    if (error) {
      console.error("Database query failed:", error);
      res.status(500).send({ message: "Database error" });
    } else {
        
      // Send the formatted results back as the response
      return res.status(200).send({
        success: true
      });
    }
        
  });
}


module.exports = {
  getFAQData,
  addFaqData,
  deleteFaqData
};
