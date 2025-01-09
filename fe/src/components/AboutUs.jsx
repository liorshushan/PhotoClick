import React, {useEffect, useState} from "react";
import "../assets/styles/AboutUs.css";

const AboutUs = (proprs) => {
  
  const {isAdmin} = proprs
  const [aboutData, setAboutData] = useState({}); // State variable for FAQs

    useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const response = await fetch("http://localhost:8801/api/aboutUsData", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch FAQ data");
        }

        const aboutUsData = await response.json();

        setAboutData(aboutUsData.data)
        // // Format the content using prettyContent before setting the state
        // const formattedContent = prettyContent(aboutUsData.data.page_content);
        // setAboutData({
        //   ...aboutUsData.data,
        //   page_content: formattedContent,
        // });


      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      }; 

      fetchAboutUsData();


      
    }, []);
  
  

  function prettyContent(content) {
    console.log(content);

    // Split the content by periods (.) or colons (:), preserving delimiters
    const sentences = content
      .split(/(?<=[.:])/g) // Split at '.' or ':' while keeping them attached to sentences
      .filter(Boolean); // Remove empty strings

    // Map each sentence to a <p> element
    return sentences.map((sentence, index) => (
      <p key={index}>{sentence.trim()}</p>
    ));
  }
  
  //const formattedContent = aboutData ? prettyContent(aboutData.page_content) : "Loading content...";

  function updateData(event)
  {

    // avoid default page refresh of form.
    event.preventDefault();

    const textArea = document.querySelector(".textarea")

    setAboutData((previousData) => ({
      ...previousData, // Spread the previous state to retain all other attributes
      page_content: textArea.value, // Update only the page_content attribute with current value of textarea.
    }));

    // update database.
     const updatePageContent = async () => {
      try {
        const response = await fetch("http://localhost:8801/api/editPageContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({"data": textArea.value }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch FAQ data");
        }

        const result = await response.json();

        console.log(result.success)


      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }; 
    
    updatePageContent()


  }
  
  function prettyContentV2(content)
  {
    let prettyContent = ""
    for (let i = 0; i < content.length; i++)
    {
      prettyContent += content[i]

      if (content[i] === ".")
        prettyContent += "/n"
    }
    setAboutData((prevData) => prevData.page_content = prettyContent)
  }

  // function prettyContent(content) {
  //   console.log(content)
  //   // Replace periods with a period followed by a line break
  //   return prettyContent = content.replace(/\./g, '.<br />');
  // }

  return (

    <div>
      <div className="about-us">
        <h1>{aboutData.page_title}</h1>
        <p className="pageContent" >
          {aboutData.page_content && prettyContent(aboutData.page_content)}
        </p>
        <pre className="preStyle">

Email: photoclickteam@gmail.com
Phone: +972 (04) 858-4567
Address: Natan Elbaz 1, Haifa, North, Israel.
          

        </pre>
        
        <h6>Email: photoclickteam@gmail.com</h6>
      <h6>Phone: +972 (04) 858-4567</h6>
      <h6>Address: Natan Elbaz 1, Haifa, North, Israel.</h6>
    </div>
      {isAdmin && (
        <>
          <form action="">
            <textarea className="textarea" name="aboutUs" id="aboutUs" defaultValue={aboutData.page_content}/>
             <button onClick={updateData}>Edit</button>
          </form>
           
          </>
        )}
    </div>
  );
};

export default AboutUs;
