# README

Henry Woody's personal website



## Renewing SSL Certificates

Run

```shell
sudo certbot renew --dry-run --authenticator webroot --installer nginx --webroot-path /home/pi/projects/personal-web/views
```

