from flask import Flask, request, jsonify
import os
import sys

# 🔧 Add the parent directory to sys.path so Python can find 'ai'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai.fraud_detection import analyze_document

app = Flask(__name__)

@app.route('/')
def home():
    return "NyayChain Backend Running 🚀"

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files.get('file')

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    os.makedirs("uploads", exist_ok=True)
    filepath = os.path.join("uploads", file.filename)
    file.save(filepath)

    # 🔥 AI logic call
    result = analyze_document(file.filename)

    return jsonify(result)

if __name__ == '__main__':
    print("Starting server...")
    app.run(debug=True)