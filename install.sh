curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644 --disable traefik
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml