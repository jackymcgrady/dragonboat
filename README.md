# Dragon Image Generator

This is a Flask application that uses OpenAI's DALL-E to generate images based on user prompts. It features a simple web interface and tracks active users.

## Project Structure

```
.
├── app.py                  # Main Flask application
├── generated_images/       # Directory where generated images are saved
├── static/                 # Static files (CSS, JS)
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── templates/
│   └── index.html          # Main HTML page for the user interface
├── .env                    # Environment variables (OPENAI_API_KEY)
└── README.md               # This file
```

## Setup

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Create a virtual environment and activate it:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    The application requires Python 3 and the following libraries. You can install them using pip:
    ```bash
    pip install Flask openai python-dotenv flask-cors httpx
    ```
    Alternatively, you can create a `requirements.txt` file with the following content:
    ```
    Flask
    openai
    python-dotenv
    Flask-CORS
    httpx
    ```
    And then install using:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up Environment Variables:**
    Create a `.env` file in the root directory of the project and add your OpenAI API key:
    ```env
    OPENAI_API_KEY='your_openai_api_key_here'
    ```

5.  **Proxy Configuration (Optional):**
    The application is configured to use proxies defined in `app.py`:
    ```python
    proxies = {
        "http://": "http://127.0.0.1:6152",
        "https://": "http://127.0.0.1:6152",
        "all://": "socks5://127.0.0.1:6153"
    }
    ```
    Adjust these settings in `app.py` if your proxy configuration is different or if you don't need proxies.

## Running the Application

1.  **Ensure your virtual environment is activated.**
2.  **Run the Flask application:**
    ```bash
    python app.py
    ```
3.  Open your web browser and go to `http://localhost:8002` (or `http://0.0.0.0:8002`).

## Endpoints

*   `/`: Serves the main `index.html` page.
*   `/static/css/<path:path>`: Serves CSS files.
*   `/static/js/<path:path>`: Serves JavaScript files.
*   `/active-users`: (POST) Updates and returns the count of active users.
    *   Request body: `{ "userId": "some_unique_user_id" }`
*   `/generate-image`: (POST) Generates an image based on prompts.
    *   Request body: `{ "system_prompt": "System instructions", "user_prompt": "User's image request", "userId": "some_unique_user_id" }`
    *   Response (success): `{ "status": "success", "image_url": "data:image/png;base64,...", "saved_path": "generated_images/...", "active_users": count }`
    *   Response (error): `{ "status": "error", "message": "Error details" }`

## How it Works

*   **Backend:** Flask handles HTTP requests.
*   **Image Generation:** Uses the OpenAI Python library to interact with the DALL-E API (specifically "gpt-image-1" model in the code, which seems to be a placeholder or custom name for a DALL-E model).
*   **User Interface:** A simple HTML page with JavaScript to send requests to the backend and display the generated image.
*   **User Activity:** Tracks active users based on API calls, with an inactivity threshold of 60 seconds.
*   **Concurrency:** Uses thread-local storage for OpenAI clients to ensure each thread has its own client instance, which is good practice for concurrent requests.
*   **Image Storage:** Generated images are saved as PNG files in the `generated_images` directory with a timestamped filename.

## To Do / Potential Improvements

*   Replace `"gpt-image-1"` with the correct DALL-E model name if it's a placeholder (e.g., `dall-e-3`, `dall-e-2`).
*   Add more robust error handling and logging.
*   Implement user authentication if needed.
*   Improve the user interface.
*   Add unit and integration tests.
*   Consider a more persistent way to track active users if needed beyond in-memory storage. 