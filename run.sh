#! /bin/bash

RED='\033[0;31m'
NC='\033[0m'

export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
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
echo -e "${RED}[ARGOCD]${NC}"
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl apply -f confs/argocd/ingress.yaml
sleep 20
argocd admin initial-password -n argocd > confs/other/argopass
sleep 10
echo -e "${RED}[OTHER]${NC}"
kubectl apply -k .
sleep 60
echo -e "${RED}[ГОТОВО]${NC}"