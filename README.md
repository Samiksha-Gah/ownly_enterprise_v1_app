# Ownly Enterprise

A data integration platform that connects and transforms data from multiple sources into actionable insights.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ (for frontend)
- Python 3.8+ (for backend)
- npm or yarn (Node package manager)
- pip (Python package manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Samiksha-Gah/ownly_enterprise_v1_app.git
   cd ownly_enterprise_v1_app
   ```

2. **Set up the backend:**
   ```bash
   # Create and activate a virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate

   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Set up the frontend:**
   ```bash
   cd ownly/frontend
   npm install
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   # From the project root directory
   cd ownly
   python app.py  # or your main backend file
   ```

2. **Start the frontend development server:**
   ```bash
   # From the frontend directory
   cd ownly/frontend
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000 (or your configured port)

## Key Features

- **Data Integration**: Connect to multiple data sources
- **Real-time Processing**: Process and analyze data in real-time
- **User-friendly Interface**: Intuitive dashboard for data visualization
- **Custom Queries**: Create and save custom data queries

## Project Structure

```
windsurf-project/
├── ownly/
│   ├── frontend/          # React frontend application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── app.py            # Backend server
├── requirements.txt      # Python dependencies
└── README.md
```

## Development

### Frontend Development
- Run development server: `npm run dev`
- Build for production: `npm run build`
- Run tests: `npm test`

### Backend Development
- Run linter: `flake8 .`
- Run tests: `pytest`
- Format code: `black .`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
