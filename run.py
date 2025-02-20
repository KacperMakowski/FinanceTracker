import subprocess
import sys
import os
from threading import Thread


def run_flask():
    if sys.platform == 'win32':
        subprocess.run(['python', 'app.py'])
    else:
        subprocess.run(['python3', 'app.py'])


def run_tailwind():
    command = 'npx @tailwindcss/cli -i ./static/src/input.css -o ./static/src/output.css --watch'
    if sys.platform == 'win32':
        subprocess.run(command, shell=True)
    else:
        subprocess.run(command.split())


if __name__ == "__main__":
    # Upewnij się, że katalog static/src istnieje
    os.makedirs('./static/src', exist_ok=True)

    # Uruchom procesy w osobnych wątkach
    flask_thread = Thread(target=run_flask)
    tailwind_thread = Thread(target=run_tailwind)

    flask_thread.start()
    tailwind_thread.start()

    try:
        flask_thread.join()
        tailwind_thread.join()
    except KeyboardInterrupt:
        print("\nZatrzymywanie aplikacji...")
        sys.exit(0)