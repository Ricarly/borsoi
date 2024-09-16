import sys
import os

print("Python version:", sys.version)
print("Current working directory:", os.getcwd())
print("Contents of current directory:", os.listdir())

from main import app

if __name__ == "__main__":
    print("Starting the application...")
    app.run()