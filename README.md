# Book Recommender

A personalized book recommender and reading list tracker

## Project Structure

This project consists of three main components:

- **Backend** (Node.js/TypeScript): REST API with authentication and library management
- **Frontend** (React/Vite): User interface for the book recommender
- **Recommendation Engine** (Python): ML-based book recommendation system

## Getting Started

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (copy `.env.example` to `.env` and configure)

4. Run database migrations:

   ```bash
   npm run migration:run
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:5000`

### API Documentation

Once the backend is running, you can access the Swagger UI documentation at:
**http://localhost:5000/api-docs**

The Swagger UI provides interactive documentation for all API endpoints, including authentication, user management, and library operations.

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Recommendation Engine

1. Navigate to the recommendation-engine directory:

   ```bash
   cd recommendation-engine
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the recommendation engine:
   ```bash
   python main.py
   ```

## Docker

You can also run the entire application using Docker Compose:

```bash
docker-compose up
```
