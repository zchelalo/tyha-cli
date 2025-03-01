#!/bin/bash

echo "Setting certificates for the authentication service"

openssl genrsa -out ./certs/private_access.pem 2048
openssl rsa -in ./certs/private_access.pem -pubout -out ./certs/public_access.pem

openssl genrsa -out ./certs/private_refresh.pem 2048
openssl rsa -in ./certs/private_refresh.pem -pubout -out ./certs/public_refresh.pem

openssl genrsa -out ./certs/private_recover.pem 2048
openssl rsa -in ./certs/private_recover.pem -pubout -out ./certs/public_recover.pem

openssl genrsa -out ./certs/private_verify.pem 2048
openssl rsa -in ./certs/private_verify.pem -pubout -out ./certs/public_verify.pem