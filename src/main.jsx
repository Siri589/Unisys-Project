import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import FertilizerSuggestion from './fertilizer-suggestion/index.jsx';
import CropRecommendation from './crop-recomment/index.jsx';
import PlantDiseaseDetector from './plant-disease-detection/index.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/fertilizer-suggestion',
    element: <FertilizerSuggestion />,
  },
  {
    path: '/crop-recommendation',
    element: <CropRecommendation />,
  },
  {
    path: '/plant-disease-detection',
    element: <PlantDiseaseDetector />,
  },
]);

function MainApp() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<MainApp />);
