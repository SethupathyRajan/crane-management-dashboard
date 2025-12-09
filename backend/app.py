from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app) 

FILE_PATH = "Daily_Operational_Data.xlsx"

@app.route("/api/data", methods=["GET"])
def get_data():
    try:
        df = pd.read_excel(FILE_PATH)

        # Convert NaN → ""
        df = df.fillna("")

        data = df.to_dict(orient="records")
        return jsonify({"status": "success", "data": data})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
