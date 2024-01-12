#!/bin/bash

DOCKER_HUB_USERNAME="izimio"
DOCKER_HUB_REPO_NAME="r-type-data-consumption"

# Generate a random tag using date and a random number
DOCKER_IMAGE_TAG="$(date +%Y%m%d%H%M%S)"

IMAGE_NAME=$DOCKER_HUB_USERNAME/$DOCKER_HUB_REPO_NAME:$DOCKER_IMAGE_TAG

docker build -t $IMAGE_NAME .
docker login
docker push $IMAGE_NAME

GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "Docker image pushed to Docker Hub as $DOCKER_HUB_USERNAME/$DOCKER_HUB_REPO_NAME:$DOCKER_IMAGE_TAG"
echo "Now go to Caprover and deploy the new image"
echo -e "${NC}"

echo "Docker image name:"
echo "NAME:" $IMAGE_NAME
