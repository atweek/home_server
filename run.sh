#! /bin/bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml
sleep 5
kubectl apply -f ./confs/nginx/deploy.yaml
kubectl apply -f ./confs/nginx/nginx_configmap.yaml
kubectl apply -f ./confs/nginx/nginx-service.yaml
sleep 60
kubectl apply -f ./confs/cert-manager
sleep 10
kubectl apply -k .
sleep 60
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
echo "[ГОТОВО]"