docker run --env-file server/.env -p 8888:8888 alona-server:latest

docker build -t alona-server:latest -t alona-server:0.1.4 . && docker save -o alona-server-0.1.4.tar alona-server:latest