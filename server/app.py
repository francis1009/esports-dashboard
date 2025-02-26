# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration from environment variables
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret')
TABLEAU_DASHBOARD_URL = os.getenv('TABLEAU_DASHBOARD_URL', 'https://public.tableau.com/views/YourDashboard')

# Endpoint to fetch esports statistics data
@app.route('/api/stats', methods=['GET'])
def get_stats():
    # In a real application, you would fetch and process real data here.
    # This is a simulated example response.
    stats_data = {
        "total_viewers": 5000000,
        "tournaments": [
            {"name": "Championship 2024", "prize_pool": 1000000},
            {"name": "Summer Cup", "prize_pool": 500000}
        ],
        "sponsorships": {
            "endemic": 800000,
            "non_endemic": 200000
        }
    }
    return jsonify(stats_data)

# Endpoint to return the Tableau dashboard URL
@app.route('/api/tableau', methods=['GET'])
def get_tableau_dashboard():
    return jsonify({"tableau_dashboard_url": TABLEAU_DASHBOARD_URL})

# Endpoint to handle calculations (example: summing a list of numbers)
@app.route('/api/calc', methods=['POST'])
def calculate():
    data = request.get_json()
    if not data or 'numbers' not in data:
        return jsonify({"error": "No numbers provided"}), 400

    try:
        numbers = [float(num) for num in data['numbers']]
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid number format"}), 400

    result = sum(numbers)
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
