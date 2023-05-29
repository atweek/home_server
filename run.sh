#! /bin/bash

RED='\033[0;31m'
NC='\033[0m'

echo -e "${RED}[CERT-MANAGER]${NC}"
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml
sleep 30
echo -e "${RED}[NGINX]${NC}"
kubectl apply -f ./confs/nginx/deploy.yaml
kubectl apply -f ./confs/nginx/nginx_configmap.yaml
kubectl apply -f ./confs/nginx/nginx-service.yaml
sleep 60
echo -e "${RED}[CERT]${NC}"
kubectl apply -f ./confs/cert-manager
sleep 10
echo -e "${RED}[OTHER]${NC}"
kubectl apply -k .
sleep 60

# kubectl create namespace argocd
# kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
echo -e "${RED}[ГОТОВО]${NC}"