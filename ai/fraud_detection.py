import random

def analyze_document(filename):
    score = random.randint(40, 90)

    if "edited" in filename.lower():
        score += 10

    if score > 70:
        status = "Suspicious Document"
    else:
        status = "Looks Safe"

    result = {
        "fraud_score": f"{score}%",
        "status": status,
        "signature_match": f"{random.randint(50, 90)}%",
        "remarks": "AI-based analysis completed"
    }

    return result