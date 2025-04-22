

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.models import resnet50, swin_t, ResNet50_Weights, Swin_T_Weights
from PIL import Image
import os

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for React app running at http://localhost:3000
CORS(app)

# Ensure uploads folder exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# Define the Hybrid Model Architecture
class HybridPlantDiseaseClassifier(nn.Module):
    def __init__(self, num_classes, dropout_rate=0.5):
        super(HybridPlantDiseaseClassifier, self).__init__()

        # Load pre-trained ResNet50 and Swin Transformer
        self.resnet = resnet50(weights=ResNet50_Weights.DEFAULT)
        self.swin = swin_t(weights=Swin_T_Weights.DEFAULT)

        # Freeze base layers
        for param in self.resnet.parameters():
            param.requires_grad = False
        for param in self.swin.parameters():
            param.requires_grad = False

        # Get feature dimensions
        resnet_features = self.resnet.fc.in_features
        swin_features = self.swin.head.in_features

        # Remove original classification heads
        self.resnet.fc = nn.Identity()
        self.swin.head = nn.Identity()

        # Hybrid feature fusion
        self.fusion = nn.Sequential(
            nn.Linear(resnet_features + swin_features, 1024),
            nn.BatchNorm1d(1024),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(1024, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        # Extract features from both models
        resnet_features = self.resnet(x)
        swin_features = self.swin(x)

        # Concatenate features
        combined_features = torch.cat([resnet_features, swin_features], dim=1)

        # Pass through fusion layers
        return self.fusion(combined_features)

# Load the trained hybrid model
num_classes = 38  # Adjust this based on your dataset
model = HybridPlantDiseaseClassifier(num_classes=num_classes)
model.load_state_dict(torch.load('miniproject2024.pth', map_location=torch.device('cpu')))
model.eval()  # Set the model to evaluation mode

# Class labels
class_labels = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 
    'Apple___healthy', 'Blueberry___healthy', 'Cherry___Powdery_mildew', 
    'Cherry___healthy', 'Corn___Cercospora_leaf_spot', 'Corn___healthy', 
    'Grape___Black_rot', 'Grape___Esca', 'Grape___healthy', 'Grape___Leaf_blight', 
    'Lemon___Greening', 'Lemon___healthy', 'Peach___Bacterial_spot', 'Peach___healthy', 
    'Pepper___Bacterial_spot', 'Pepper___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 
    'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 'Strawberry___Leaf_scorch', 
    'Strawberry___healthy', 'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Target_Spot', 
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___healthy'
]

# Image preprocessing function
def preprocess_image(image_path, img_height=224, img_width=224):
    img = Image.open(image_path).convert("RGB")  # Ensure the image is in RGB format
    transform = transforms.Compose([
        transforms.Resize((img_height, img_width)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    img_tensor = transform(img)
    img_tensor = img_tensor.unsqueeze(0)  # Add batch dimension
    return img_tensor

# API endpoint for prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file uploaded'}), 400

    image_file = request.files['image']

    if not image_file.content_type.startswith('image/'):
        return jsonify({'error': 'Invalid file type. Please upload an image.'}), 400

    # Save the uploaded image
    image_path = os.path.join('uploads', image_file.filename)
    image_file.save(image_path)

    # Preprocess the image
    processed_image = preprocess_image(image_path)

    # Predict the class
    with torch.no_grad():
        output = model(processed_image)
        softmax_output = torch.softmax(output, dim=1)[0]
        top_5_probs, top_5_indices = torch.topk(softmax_output, k=5)

    # Get top 5 predictions
    top_predictions = [
        {
            'class': class_labels[idx],
            'probability': prob.item()
        } 
        for idx, prob in zip(top_5_indices, top_5_probs)
    ]

    # Define a threshold for confidence
    confidence_threshold = 0.7  # Adjust this value as needed

    # Check if the top prediction meets the confidence threshold
    top_prediction = top_predictions[0]
    if top_prediction['probability'] < confidence_threshold:
        return jsonify({
            'predicted_class': "I don't recognize it",
            'probability': top_prediction['probability'],
            'top_predictions': top_predictions,
            'image_url': f'http://localhost:5000/uploads/{image_file.filename}'
        }), 200

    # Return prediction with image URL and top predictions
    return jsonify({
        'predicted_class': top_prediction['class'],
        'probability': top_prediction['probability'],
        'top_predictions': top_predictions,
        'image_url': f'http://localhost:5000/uploads/{image_file.filename}'
    })

# Route to serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

if __name__ == '__main__':
    app.run(debug=True)


























