import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Header from './components/custom/Header.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CropRecommendation from './crop-recomment/index.jsx';
import FertilizerRecommendation from './fertilizer-suggestion/index.jsx';
import Viewtrip from './view-trip/[tripId]/index.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/crop-recommendation',
    element: <CropRecommendation />,
  },
  {
    path: '/fertilizer-suggestion',
    element: <FertilizerRecommendation />,
  },
  {
    path: '/view-trip/:tripId',
    element: <Viewtrip />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <RouterProvider router={router} />
  </StrictMode>
);


// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import App from './App.jsx';
// import Header from './components/custom/Header.jsx';
// import { RouterProvider, createBrowserRouter } from 'react-router-dom';
// import CreateTrip from './create-trip/index.jsx';
// import Viewtrip from './view-trip/[tripId]/index.jsx';// Adjusted import

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//   },
//   {
//     path: '/create-trip',
//     element: <CreateTrip />,
//   },
//   {
//     path: '/view-trip/:tripId',
//     element: <Viewtrip />, // Ensure the component is correctly handling the dynamic route
//   },
// ]);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>
// );
