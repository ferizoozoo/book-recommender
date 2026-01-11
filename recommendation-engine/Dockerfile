# Use the official Python image with a specific version as the base image
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the requirements file (if you have one)
COPY requirements.txt ./

# Install application dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Specify the command to run when the container starts
CMD [ "fastapi", "dev", "./main.py" ]
