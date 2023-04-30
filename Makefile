install:
	curl -sfL https://get.k3s.io | sh -s - server --write-kubeconfig-mode 644

uninstall:
	/usr/local/bin/k3s-uninstall.sh
	
run:
	kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.11.1/cert-manager.yaml
	kubectl apply -k .
	
mount:
	mount /dev/sda1 /mnt/flesh