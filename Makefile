CERT_MANAGER_URL = https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml

install:
	curl -sfL https://get.k3s.io | sh -s - server --write-kubeconfig-mode 644
	export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

uninstall:
	# kubectl delete -f $(CERT_MANAGER_URL)
	/usr/local/bin/k3s-uninstall.sh
	
run:
	kubectl apply -f $(CERT_MANAGER_URL)
	kubectl apply -k .
	export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

	
mount:
	mount /dev/sda1 /mnt/flesh

remove:
		kubectl delete -f $(CERT_MANAGER_URL)
		kubectl delete -k .

token:
	sudo cat /var/lib/rancher/k3s/server/node-token

install_agent:
	curl -sfL https://get.k3s.io | K3S_URL=https://192.168.1.35:6443 K3S_TOKEN={} sh -

uninstall_agent:
	/usr/local/bin/k3s-agent-uninstall.sh
worker:
	kubectl label node tinkerboard-2 node-role.kubernetes.io/worker=worker

helm:
	helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
	helm repo update
	helm install quickstart ingress-nginx/ingress-nginx