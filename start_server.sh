#!/bin/bash
gunicorn --workers=4 --bind 0.0.0.0:8002 app:app 