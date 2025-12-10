# NGO - Donator Demand Fulfilment Platform

A simple, secure, and clean platform for NGOs to post needs and donators to fulfill them. No login required.

## 🚀 Features

- **For NGOs**:
    - Post needs (Furniture, Medical, etc.) with images.
    - View offers privately using your email address.
- **For Donators**:
    - Browse needs by City and Category.
    - Submit fulfillment offers directly to the NGO.
- **Tech Stack**:
    - Node.js & Express.js
    - MongoDB
    - HTML/CSS/Vanilla JS (No Frameworks)
    - Multer (Image Uploads)

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js**: You must have Node.js installed. [Download Here](https://nodejs.org/)
- **MongoDB**: You must have a MongoDB instance running (either local or Atlas).

### Installation

1.  **Open Terminal** in this project folder (`c:\Users\rishi\OneDrive\Desktop\proto_type`).
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
    *Note: If `package.json` was missing during setup, running `npm init -y` first might be needed, but the current code expects these packages:*
    `express`, `mongoose`, `multer`, `cors`, `helmet`, `dotenv`

3.  **Environment Setup**:
    - The code defaults to `mongodb://localhost:27017/ngo-platform`.
    - If using a cloud DB, create a `.env` file in the root:
        ```
        MONGODB_URI=your_connection_string
        PORT=5000
        ```

### Running the App

1.  Start the server:
    ```bash
    node server.js
    ```
2.  Open your browser and visit:
    ```
    http://localhost:5000
    ```

## 🧪 How to Test

1.  **Post a Need**:
    - Click "Post a Need".
    - Fill the form (remember the Email you use!).
    - Upload an image.
    - Submit -> You should be redirected to Browse.

2.  **Browse & Donate**:
    - You should see your new card on the Browse page.
    - Click "View Details".
    - Fill the "I want to help" form on the right.

3.  **View Offers (NGO)**:
    - On the same "Need Details" page, scroll to the "NGO Admin Area" (yellow box).
    - Enter the **same email** you used to post the need.
    - Click "View Offers".
    - You should see the donator's message appear.
