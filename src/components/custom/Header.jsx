import React from 'react';
import '../../css/Header.css'; // Assuming you use a CSS file for styling

function Header() {
  return (
    <div className="header">
      <img src="logo.png" alt="Logo" className="logo" /> {/* Add your logo path */}
      <h1 className="title">My Travel Planner</h1>

      {/* yha hm change kiye hai */}
      {/* <button className="sign-in-btn">Sign In</button> */}
    </div>
  );
}

export default Header;















// import React from 'react';
// import '../../css/Header.css'; // Assuming you use a CSS file for styling

// function Header() {
//   return (
//     <div className="header">
//       <img src="logo.png" alt="AgroHelp Logo" className="logo" /> {/* Update the logo path if needed */}
//       <h1 className="title">AgroHelp</h1> {/* Updated the title */}

//       {/* Example Button for Navigation - you can modify this further */}
//       {/* You could have a menu to switch between Crop Recommendations and Fertilizer Suggestions */}
//       <div className="navigation">
//         <button className="nav-btn">Crop Recommendation</button>
//         <button className="nav-btn">Fertilizer Suggestions</button>
//       </div>
//     </div>
//   );
// }

// export default Header;
