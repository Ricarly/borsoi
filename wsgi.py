import sys
import os
import gunicorn
print("Python version:", sys.version)
print("Current working directory:", os.getcwd())
print("Contents of current directory:", os.listdir())
print("PATH:", os.environ.get('PATH'))
print("PYTHONPATH:", os.environ.get('PYTHONPATH'))

try:
    print("Gunicorn version:", gunicorn.__version__)
except ImportError as e:
    print(f"Erro ao importar Gunicorn: {e}")
    print("Gunicorn não encontrado. Verificando se está instalado:")
    try:
        import subprocess
        result = subprocess.run(['pip', 'list'], capture_output=True, text=True)
        print("Pacotes instalados:")
        print(result.stdout)
    except Exception as e:
        print(f"Erro ao listar pacotes: {e}")

from main import app

if __name__ == "__main__":
    print("Starting the application...")
    app.run()