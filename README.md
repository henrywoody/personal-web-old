# README

Henry Woody's personal website

## Tech

This website runs on my Raspberry Pi, running Raspbian. The server is Nginx. The backend is written in Node.js and uses the Express framework. The frontend uses Pug as a templating engine.



## Renewing SSL Certificates

This websites SSL certificates come from [Certbot by Let's Encrypt](https://certbot.eff.org/).

To renew certificates (for the current OS and server), run:

```shell
sudo certbot renew --authenticator webroot --installer nginx --webroot-path /home/pi/projects/personal-web/views
```

