# Local Artisan Marketplace

## Overview

The Local Artisan Marketplace is an online platform that connects local artisans with customers interested in purchasing handmade products. It serves as a marketplace where artisans can showcase their creations and sell them directly to consumers.

to see the website:`nodejs-project-localartisanwebsite.onrender.com`

## Features

- **Product Listings:** Artisans can list their products with details such as name, price, category, and images.
- **Search Functionality:** Customers can search for products based on category or keywords.
- **User Authentication:** Users can sign up and log in to their accounts to access additional features like saving favorite products.
- **Responsive Design:** The platform is designed to work seamlessly across different devices and screen sizes.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Image Upload:** Multer
- **Authentication:** JWT (JSON Web Tokens)

## Setup Instructions

1. Clone the repository: `git clone https://github.com/your-username/local-artisan-marketplace.git`
2. Navigate to the project directory: `cd local-artisan-marketplace`
3. Install dependencies: `npm install`
4. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=your-mongodb-uri
     JWT_SECRET=your-jwt-secret
     ```
5. Start the server: `npm start`
6. Open your browser and navigate to `http://localhost:3000` to access the application.



## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
