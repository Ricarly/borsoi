#!/bin/bash
pip install -r requirements.txt
gunicorn wsgi:app