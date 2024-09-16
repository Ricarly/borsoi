#!/bin/bash
echo "Activating virtual environment..."
source /opt/venv/bin/activate
echo "Python version:"
python --version
echo "Pip version:"
pip --version
echo "Installed packages:"
pip list
echo "Starting Gunicorn..."
python -m gunicorn --bind 0.0.0.0:$PORT wsgi:app