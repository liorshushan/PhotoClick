const dbSingleton = require("../dbSingleton");

// const getAvailableWorkers= async (req, res) => {


//     const currentDate = req.body.data

//     console.log(currentDate)

    
//     //  `faq_title` varchar(255) NOT NULL,
//     //`faq_content` varchar(255) NOT NULL

//     // retrieve faq data, means select faq_title, faq_content from faq

//     const workersQuery = `SELECT
//                               u.Personal_id,
//                               u.FirstName,
//                               u.LastName,
//                               u.Email,
//                               u.PhoneNumber
//                           FROM
//                               users as u
//                           JOIN
//                               orders_workers as ow ON u.Personal_id = ow.Personal_id
//                           JOIN
//                               orders as o ON ow.OrderNumber = o.OrderNumber
//                           WHERE
//                               o.OrderNumber = 123; `;

//     dbSingleton.query(workersQuery, [], (error, results) => {
        
//     if (error) {
//       console.error("Database query failed:", error);
//       res.status(500).send({ message: "Database error" });
//     } else {

//     // Map the results to the desired format
//       const formattedResults = results.map(row => ({
//         faq_id: row.faq_id,
//         faq_title: row.faq_title,
//         faq_content: row.faq_content
//       }));
//       console.log(formattedResults)
        
        
//       // Send the formatted results back as the response
//       return res.status(200).send({
//         success: true,
//         data: formattedResults
//       });
//     }
        
//   });

// }



const getAvailableWorkers= async (req, res) => {

    const dateOfEvent = req.body.data 

    console.log(dateOfEvent)

    const workersQuery = `SELECT
                              u.Personal_id, 
                              u.FirstName, 
                              u.LastName, 
                              u.RoleName, 
                              u.PhoneNumber
                          FROM
                              users u
                          LEFT JOIN
                              orders_workers ow 
                              ON u.Personal_id = ow.Personal_id
                          LEFT JOIN
                              orders o 
                              ON ow.OrderNumber = o.OrderNumber
                          WHERE
                              (DATE_FORMAT(o.DateOfEvent, '%Y-%m-%d') != ? OR o.DateOfEvent IS NULL)
                              AND u.RoleID != 2 
                              AND u.RoleID != 1;`; // Exclude customer and admin.
  
  
    dbSingleton.query(workersQuery, [dateOfEvent], (error, results) => {
        
    if (error) {
      console.error("Database query failed:", error);
      res.status(500).send({ message: "Database error" });
    } else {

    // Map the results to the desired format
      const workers = results.map(row => ({
        personalId: row.Personal_id,
        firstName: row.FirstName,
        lastName: row.LastName,
        roleName: row.RoleName,
        phoneNumber: row.PhoneNumber
      }));
      console.log(workers)
        
        
      // Send the formatted results back as the response
      return res.status(200).send({
        success: true,
        data: workers
      });
    }
        
  });

}

const getWorkersWhoServesOrder = async (req, res) => {

    const orderId = req.body.data;

    const workersQuery = `SELECT 
                            u.FirstName,
                            u.LastName,
                            u.PhoneNumber
                          FROM 
                            users as u
                          JOIN 
                            orders_workers as ow ON u.Personal_id = ow.Personal_id
                          JOIN 
                            orders as o ON ow.OrderNumber = o.OrderNumber
                          WHERE 
                            o.OrderNumber = ?;`; // Use parameterized query to prevent SQL injection


    dbSingleton.query(workersQuery, [orderId], (error, results) => {
        if (error) {
            console.error("Database query failed:", error);
            return res.status(500).send({ message: "Database error" });
        }

        // Map the results to the desired format (list of objects)
        const workers = results.map(row => ({
            firstName: row.FirstName,
            lastName: row.LastName,
            phoneNumber: row.PhoneNumber
        }));

        // Send the formatted results back as the response
        return res.status(200).send({
            success: true,
            data: workers
        });
    });
};


const getWorkerEvents= async (req, res) => {

    const personalId = req.body.data // according to personal id.

    console.log(currentDate)
    //  `faq_title` varchar(255) NOT NULL,
    //`faq_content` varchar(255) NOT NULL

    // retrieve faq data, means select faq_title, faq_content from faq

    const workersQuery = `SELECT `;

    dbSingleton.query(workersQuery, [], (error, results) => {
        
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


module.exports = {
  getAvailableWorkers,
  getWorkersWhoServesOrder
};