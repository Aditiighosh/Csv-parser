# Assignment: CSV File Upload and Parsing with Background Jobs in Next.js

## Overview

This project is a CSV parsing and user management application built with Next.js. It allows users to upload a CSV file, add multiple user entries, and process these entries in the background using a job queue powered by Redis and Bull. The processed data is then saved back to the CSV file, and users can download the updated file.

## Features

- Upload CSV files
- Add multiple user entries
- Process user entries in the background using a job queue
- Save processed data back to the CSV file
- Download the updated CSV file

## Technologies Used

- Next.js
- React
- Axios
- Bull (Job Queue)
- Redis
- csv-parser (CSV Parsing)
- csv-stringify (CSV Stringifying)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Redis server

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/csv-parser.git
    cd csv-parser
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the Redis server:

    ```bash
    redis-server
    ```

### Running the Application

1. Start the Next.js development server:

    ```bash
    npm run dev
    ```

2. Start the worker process:

    ```bash
    npm run worker
    ```

3. Open your browser and navigate to `http://localhost:3000` to access the application.

### Project Structure

- `src/app/page.tsx`: Main page component for uploading CSV files and adding user entries.
- `src/app/api/upload/route.js`: API route for handling CSV file uploads.
- `src/app/api/addUser/route.js`: API route for adding user entries to the job queue and processing them.
- `src/queue.js`: Job queue configuration and processing logic.
- `public/uploads`: Directory for storing uploaded CSV files.

### Usage

1. Upload a CSV file using the file input on the main page.
2. Add multiple user entries using the form provided.
3. Submit the entries to process them in the background.
4. Download the updated CSV file once processing is complete.

## ⚡Edge cases handled

### 📁 CSV File Validation in /api/upload Route
- The uploaded CSV file may not have columns named exactly as `name` and `email`.
- I handled different variations (e.g., `Name`, `full_name`, `Email Address`, etc.) by normalizing the column names during validation.
- If required fields are missing after normalization, appropriate error responses are returned.

### 👥 Flexible User Addition in /api/addUser Route
- 🔄 The order of columns in the CSV file may vary. I ensured that the correct data maps to the right fields regardless of the column order.
- ✂️ The CSV file might contain additional columns. I ensured that only the required fields are processed, and extra fields are ignored without affecting the process.
- ➕ Partial data: the data of additional columns is missing, the system adds available data while leaving the missing fields blank without causing errors.

### 🏃 Job Queuing with Bull
- ⚡ In the /api/addUser route, I implemented job queuing using Bull.
- 🔄 The API supports adding multiple users at once, and these requests are processed asynchronously in the background for better performance.
- 🕒 The system provides real-time feedback during the job processing phase.

### 🐞 Testing & Debugging
- 📝 Added detailed console logs throughout the code for easier testing and debugging.
- 🚨 Logs provide step-by-step visibility during file upload, parsing, validation, user addition, and job processing stages.


### License

This project is licensed under the MIT License. See the LICENSE file for details.

### Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Axios](https://axios-http.com/)
- [Bull](https://github.com/OptimalBits/bull)
- [Redis](https://redis.io/)
- [csv-parser](https://www.npmjs.com/package/csv-parser)
- [csv-stringify](https://www.npmjs.com/package/csv-stringify)
