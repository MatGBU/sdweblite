# Installation and Execution

In command terminal, enter:
```
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt-get update
sudo apt-get install python3.10 python3.10-venv
python3.10 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

To run, enter:
```
uvicorn main:app --reload
```

In your web browser, open http://127.0.0.1:8000 and login with:
```
user1@gmail.com
12345
```

Private page will take you to controls