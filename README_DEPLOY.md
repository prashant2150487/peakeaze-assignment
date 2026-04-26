# EC2 Deployment Guide

This project uses GitHub Actions for CI/CD. When you push to the `main` branch, it automatically lints, builds, and deploys to your AWS EC2 instance.

## 1. Prerequisites on EC2

Ensure your EC2 instance (Ubuntu recommended) has Nginx installed:

```bash
sudo apt update
sudo apt install nginx -y
```

### Configure Nginx
Create a configuration file: `/etc/nginx/sites-available/invoice-app`

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    root /var/www/html/invoice-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the config:
```bash
sudo ln -s /etc/nginx/sites-available/invoice-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Ensure permissions:
```bash
sudo mkdir -p /var/www/html/invoice-app
sudo chown -R $USER:$USER /var/www/html/invoice-app
```

## 2. GitHub Secrets

Add the following secrets in your GitHub repository settings (**Settings > Secrets and variables > Actions**):

| Secret Name | Description |
| ----------- | ----------- |
| `AWS_EC2_HOST` | Your EC2 public IP or DNS name |
| `AWS_EC2_USER` | Usually `ubuntu` for Ubuntu instances |
| `AWS_EC2_SSH_KEY` | The contents of your `.pem` private key |
| `VITE_API_URL` | Your production API base URL |

## 3. Deployment Flow

1. Push your changes to the `main` branch.
2. Monitor the progress in the **Actions** tab of your GitHub repository.
3. Once finished, your app will be live at your EC2 IP address.
