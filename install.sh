curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644 --disable traefik
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl apply -f /home/atweek/home_server/confs/ingresses/deploy.yaml
# kubectl patch deployment ingress-nginx-controller -n ingress-nginx --patch "$(cat confs/ingresses/ingress.yaml)"