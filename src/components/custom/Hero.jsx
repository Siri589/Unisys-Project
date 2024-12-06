import React from 'react';
import '../../css/Hero.css';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="hero">
      <h1 className="hero-title">Discover Your Next Adventure with AI</h1>
   
      <Link to ={'/crop-recommendation'}>
      <button> Get Crop Recommendations </button>
      </Link>
      <br/>
      <Link to ={'/fertilizer-suggestion'}>
      <button> Get Fertilizer Suggestion </button>
      </Link>

    </div>
  );
}

export default Hero;








// import React from 'react';
// import '../../css/Hero.css';
// import { Link } from 'react-router-dom';

// function Hero() {
//   return (
//     <div className="hero">
//       <h1 className="hero-title">Discover Optimal Crop & Fertilizer Recommendations with AI</h1> {/* Updated the title */}

//       {/* Update the Link to lead to Crop Recommendations or Fertilizer Suggestions page */}
//       <Link to={'/recommendations'}>
//         <button>Start Recommendations</button> {/* Changed button text */}
//       </Link>
//     </div>
//   );
// }

// export default Hero;
