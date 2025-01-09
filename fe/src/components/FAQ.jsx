import React, { useState , useEffect} from "react";
import "../assets/styles/FAQ.css";

const FAQ = (params) => {

  const { isAdmin } = params
  
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqArr, setFAQArr] = useState([]); // State variable for FAQs

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

    useEffect(() => {
    const fetchFAQData = async () => {
      try {
        const response = await fetch("http://localhost:8801/api/faqData", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch FAQ data");
        }

        const faqData = await response.json();
        setFAQArr(faqData.data)

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchFAQData();
    }, []);
  
  const addFaq = async () => {

    const faqData = {
      "faq_title": document.querySelector("#faq_title").value,
      "faq_content": document.querySelector("#faq_content").value
    }
      try {
        const response = await fetch("http://localhost:8801/api/addFaq", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ "data": faqData}),
        });

        if (!response.ok) {
          throw new Error("Failed to add FAQ data");
        }

        const data = await response.json();

        if (data.success)
        {
          //display succsfull addition
            setFAQArr((prevArr) => [
                ...prevArr,
                {"faq_id": data.faq_id, "faq_title": faqData.faq_title, "faq_content": faqData.faq_content},
            ]);
          
        }
        else
        {
          // an error has occured.  
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
  };
  
    const deleteFaq = async (faq_id) => {

      try {
        const response = await fetch("http://localhost:8801/api/deleteFaq", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({"data": faq_id }),
        });

        if (!response.ok) {
          throw new Error("Failed to add FAQ data");
        }

        const data = await response.json();

        if (data.success)
        {
          // refresh
          setFAQArr(faqArr.filter((item) => item.faq_id != faq_id))
        }
        else
        {
          // an error has occured.  
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

  return (
    <div>
    <ul className="faq-list">
        {faqArr.map((item, index) => (
        
        <div>
            <li key={index}>
              <h4
                onClick={() => toggleFAQ(index)}
                className={activeIndex === index ? "active" : ""}
              >
                {item.faq_title}
              </h4>
              <p className={activeIndex === index ? "active" : ""}>{item.faq_content}</p>
              {isAdmin && (
                <>
                    {/* <button onClick={() => {
                        // execute update, communicate with be, remove contact
                    }}>Edit</button> */}
                      <button onClick={() => deleteFaq(faqArr[index].faq_id)} >Delete</button>
                  </>
                )}
            </li>
        </div>

      ))}
      </ul>

      {isAdmin && (
        <>
          <form action="">
            <label htmlFor="faq_title">
              <input type="text" placeholder="Enter a question" name="faq_title" id="faq_title"/>
            </label>
            <label htmlFor="faq_content">
              <input type="text" placeholder="Enter an answer" name="faq_content" id="faq_content"/>
            </label>
          </form>
            <button onClick={() => addFaq()}>Add</button>
          </>
        )}
    </div>



  );
};

export default FAQ;
