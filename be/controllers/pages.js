const dbSingleton = require("../dbSingleton");


// assume that data is valid, not empty.
const getAboutUsData = async (req, res) => {

    //  `faq_title` varchar(255) NOT NULL,
    //`faq_content` varchar(255) NOT NULL

    // retrieve faq data, means select faq_title, faq_content from faq

    const faqQuery = `SELECT page_name,  page_title, page_content, page_info FROM page_content WHERE page_name = ?`;


    dbSingleton.query(faqQuery, "AboutUs", (error, results) => {
        
        if (error) {
            console.error("Database query failed:", error);
            return res.status(500).send({ message: "Database error" });
        } else {
            // Check if results are returned
            if (results.length ===  0) {
                return res.status(404).send({ message: "No data found for the specified page" });
            }

            const row = results[0];

            // Create page data from the row
            const pageData = {
                page_name: row.page_name,
                page_title: row.page_title,
                page_content: row.page_content,
                page_info: row.page_info
            };

            // Send the formatted results back as the response
            return res.status(200).send({
                success: true,
                data: pageData
            });
        }
    });

}


const editPageContent = async (req, res) => {

  const new_page_content = req.body.data;
  console.log(new_page_content);

  const updateQuery = `UPDATE page_content SET page_content = ?`;

  // Query to check if the data is actually updated.
  const selectQuery = `SELECT page_content FROM page_content LIMIT 1`;

  dbSingleton.query(updateQuery, [new_page_content], (error, results) => {
    if (error) {
      console.error("Database query failed:", error);
      return res.status(500).send({ message: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(200).send({
        success: false,
      });
    }

    // Select to make sure the data is updated.
    dbSingleton.query(selectQuery, (selectError, selectResults) => {
      if (selectError) {
        console.error("Database query failed during select:", selectError);
        return res.status(500).send({ message: "Database select error" });
      }

      // Check if the value matches the new content
      const row = selectResults[0];
      if (!row || row.page_content !== new_page_content) {
        return res.status(200).send({
          success: false,
        });
      }

      // Successfully updated and verified
      return res.status(200).send({
        success: true,
      });
    });
  });
};


module.exports = {
    getAboutUsData,
    editPageContent
}