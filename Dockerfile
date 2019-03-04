FROM node:11.1.0
RUN mkdir -p /code
WORKDIR /code

RUN apt-get update && apt-get install -y python-dev screen

# RUN npm set progress=false && \
RUN npm install -g create-react-app @aws-amplify/cli

# CHANGE the UID accordingly, follow the step at the note section.
RUN useradd -m -u 501 -s /bin/bash ec2-user