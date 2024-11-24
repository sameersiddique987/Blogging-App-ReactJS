

import { collection, getDocs, orderBy, query , doc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Greeting from "../conponents/Greeting";
import { auth, db } from "../firebase/firebaseMethords";
import { onAuthStateChanged } from "firebase/auth";




const  AllBlogs = () => {
  
  const [data, setData] = useState([]); // For user data
const [blogs, setBlogs] = useState([]); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Query for Users
          const userQuery = query(
            collection(db, "users"),
            where("id", "==", user.uid)
          );
  
          // Query for Blogs
          const blogQuery = query(
            collection(db, "blogs"),
            where("uid", "==", user.uid) // Ensure "uid" matches user's ID
          );
  
          // Fetch Users
          const userSnapshot = await getDocs(userQuery);
          const userDataArray = []; // Temporary array to store user data
          userSnapshot.forEach((doc) => {
            console.log("User Data:", doc.data());
            userDataArray.push(doc.data());
          });
  
          // Fetch Blogs
          const blogSnapshot = await getDocs(blogQuery);
          const blogDataArray = []; // Temporary array to store blog data
          blogSnapshot.forEach((doc) => {
            console.log("Blog Data:", doc.data());
            blogDataArray.push({
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(), // Convert timestamp
            });
          });
  
          // Update States
          if (userDataArray.length > 0) {
            setData(userDataArray); // Set user data
          }
  
          if (blogDataArray.length > 0) {
            setBlogs(blogDataArray); // Set blogs
          }
        } catch (error) {
          console.log("Error fetching data:", error);
        }
      }
    });
  
    return () => unsubscribe(); // Clean up subscription
  }, []);
  
 
    
    //  const [Data, setData] = useState([]);

    // useEffect(() => {
    //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //     if (user) {
    //       try {
    //         const q = query(
    //           collection(db, "users"), 
    //            where("id", "==", user.uid),
    //           // orderBy("createdAt", "asc")
    //         );

    //         const b = query(
    //           collection(db, "blogs"), 
    //           where("id", "==", user.uid), 
    //           // orderBy("createdAt", "asc")
    //         );
            
    //         const querySnapshot = await getDocs(q)
    //         const userDataArray = []; // Temporary array to store user data             
    //         querySnapshot.forEach((doc) => {
    //           console.log(doc.data());
    //           userDataArray.push(doc.data());
    //         });

            
          
    //         // Update Data state
    //         if (userDataArray.length > 0) {
    //           setData(userDataArray);
    //         }
    //         console.log(user);
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     }
    //   });
    //   return () => unsubscribe(); // Clean up subscription
    // }, []);
  

    
    const formatDate = (timestamp) => {
      if (timestamp?.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          time:'numeric'
        });
      }
      return "";
    };
   
    return (
      <>
      <div className="bg-blue-50 h-[full] p-4">
    <div className="bg-white text-black navbar p-4">
      <h1 className="font-bold text-xl"><Greeting/></h1>
    </div>
  
    <h1 className="font-bold text-xl m-3">All Blogs</h1>
    <div className="bg-white h-full pb-8  overflow-auto">
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={index} className="flex ml-5 mt-2">
            {/* Blog Image */}
            <div className="w-[80px] h-[80px] mt-5 rounded-full overflow-hidden flex-shrink-0">
              <img src={item.file} alt="Blog" className="w-full h-full object-cover" />
            </div>
 
            <div className="ml-3 mt-7">
               <div className="flex items-center">
                 <div className="m-3">
                 <h1 className="font-bold">{item.title}</h1>
                   <p className="text-black text-sm">
                   {item.FirstName} <span>Time: {formatDate(item.createdAt)}</span>
                 </p>
                </div>
             </div>
              <div>
                <h3 className="text-gray-600">{item.description}</h3>
              </div>
            </div>
          </div>
         ))
     ) : ( 
        <p className="m-5">No blogs available.</p>
      )}
    </div>
  </div>
  </>
    )
}

// blogs.map((blog, index) => (
//   <div key={index}>
//     <h3>{blog.title}</h3>
//     <p>{blog.description}</p>
//     <small>{blog.createdAt.toLocaleString()}</small>
//   </div>
// ))
  
  

export default AllBlogs










