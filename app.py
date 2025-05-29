from flask import Flask, request, jsonify, send_file, send_from_directory
from openai import OpenAI
import os
from dotenv import load_dotenv
import base64
from pathlib import Path
from flask_cors import CORS
from datetime import datetime
import io
import httpx
import threading
from collections import defaultdict
import time

# Load environment variables
load_dotenv()

# Configure proxy settings
proxies = {
    "http://": "http://127.0.0.1:6152",
    "https://": "http://127.0.0.1:6152",
    "all://": "socks5://127.0.0.1:6153"
}

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Thread-local storage for OpenAI clients
thread_local = threading.local()

# User tracking with thread safety
active_users = defaultdict(int)
users_lock = threading.Lock()
ACTIVE_THRESHOLD = 60  # seconds

def cleanup_inactive_users():
    current_time = time.time()
    with users_lock:
        inactive = [uid for uid, last_seen in active_users.items() 
                   if current_time - last_seen > ACTIVE_THRESHOLD]
        for uid in inactive:
            del active_users[uid]

def get_active_users_count():
    cleanup_inactive_users()
    with users_lock:
        return len(active_users)

def get_openai_client():
    if not hasattr(thread_local, "client"):
        # Create a new client for each thread
        transport = httpx.HTTPTransport(proxy=proxies["https://"])
        http_client = httpx.Client(transport=transport)
        thread_local.client = OpenAI(
            api_key=os.getenv('OPENAI_API_KEY'),
            http_client=http_client
        )
    return thread_local.client

# Ensure the generated_images directory exists
Path("generated_images").mkdir(exist_ok=True)

@app.route('/')
def root():
    return send_file('templates/index.html')

@app.route('/static/css/<path:path>')
def send_css(path):
    return send_from_directory('static/css', path)

@app.route('/static/js/<path:path>')
def send_js(path):
    return send_from_directory('static/js', path)

@app.route('/active-users', methods=['POST'])
def update_active_users():
    user_id = request.json.get('userId')
    if user_id:
        with users_lock:
            active_users[user_id] = time.time()
    return jsonify({
        'active_users': get_active_users_count()
    })

@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        data = request.json
        system_prompt = data.get('system_prompt')
        user_prompt = data.get('user_prompt')
        user_id = data.get('userId')
        
        # Update user activity
        if user_id:
            with users_lock:
                active_users[user_id] = time.time()
        
        # Combine prompts
        full_prompt = f"{system_prompt}\n\nUser request: {user_prompt}"
        
        # Get thread-specific OpenAI client
        client = get_openai_client()
        
        # Generate image
        result = client.images.generate(
            model="gpt-image-1",  # Using GPT Image model
            prompt=full_prompt,
            quality="medium",
            size="1024x1024",
            background="transparent"
        )

        # Get base64 image data
        image_base64 = result.data[0].b64_json
        image_bytes = base64.b64decode(image_base64)
        
        # Generate timestamp filename with microseconds for uniqueness
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        filename = f"dragon_boat_{timestamp}.png"
        filepath = os.path.join("generated_images", filename)
        
        # Save the image
        with open(filepath, 'wb') as f:
            f.write(image_bytes)
        
        # Create data URL for frontend
        data_url = f"data:image/png;base64,{image_base64}"
        
        return jsonify({
            'status': 'success',
            'image_url': data_url,
            'saved_path': filepath,
            'active_users': get_active_users_count()
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/latest-images')
def get_latest_images():
    try:
        # Get list of all image files in generated_images directory
        image_files = [f for f in os.listdir('generated_images') if f.endswith('.png')]
        # Sort by filename (which contains timestamp) in reverse order
        image_files.sort(reverse=True)
        # Take only the latest 12 images
        latest_images = image_files[:12]
        
        # Create list of image data
        images_data = []
        for img_file in latest_images:
            file_path = os.path.join('generated_images', img_file)
            with open(file_path, 'rb') as f:
                img_data = base64.b64encode(f.read()).decode('utf-8')
            images_data.append({
                'filename': img_file,
                'data': f'data:image/png;base64,{img_data}',
                'created_at': os.path.getctime(file_path)
            })
            
        return jsonify({
            'status': 'success',
            'images': images_data
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/results')
def results():
    return send_file('templates/results.html')

if __name__ == '__main__':
    # Enable threading for better concurrency
    app.run(host='0.0.0.0', port=8002, threaded=True) 