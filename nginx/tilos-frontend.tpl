    set $backend __BACKEND__HOST__;
    set $port __BACKEND__PORT__;
    set $streamerport __STREAMER__PORT__;
    set $my_hostname __HOSTNAME__;
    set $fix 0;




    location @prerender {
        set $prerender 0;
        if ($http_user_agent ~* "baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator") {
            set $prerender 1;
        }
        if ($args ~ "_escaped_fragment_") {
            set $prerender 1;
        }
        if ($http_user_agent ~ "Prerender") {
            set $prerender 0;
        }
        if ($uri ~ "\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff)") {
            set $prerender 0;
        }

        if ($prerender = 1) {
            rewrite .* /https://tilos.hu$request_uri? break;
            proxy_pass http://prerender:3000;
        }
        if ($prerender = 0) {
            rewrite .* /index.html last;
        }
    }


    location @index {
#        if ($http_user_agent ~* (googlebot|yahoo|bingbot|baiduspider|yandex|yeti|yodaobot|gigabot|ia_archiver|facebookexternalhit|twitterbot|developers\.google\.com|testagent)) {
#            proxy_pass http://127.0.0.2:5004;
#            break;
#        }
        rewrite .* /index.html last;
    }




    location / {
        try_files  /upload/$uri $uri $uri/ @prerender;
    }

    location /apidoc {
        proxy_pass http://$backend:$port;
        break;
    }

    location ~ ^/api/v1/.+$ {
        proxy_pass http://$backend:$port;
        break;
    }

    location ~ ^/api/int/.+$ {
        proxy_pass http://$backend:$port;
        break;
    }


    location ~ ^/feed/.+$ {
        proxy_pass http://$backend:$port;
        break;
    }


    location ~ ^/mp3/.+$ {
        proxy_pass http://$backend:$streamerport;
        break;
    }

    location ~ ^.*m3u$ {
        rewrite  ^/(.*) /api/v1/m3u/lastweek?stream=$1 break;
        proxy_pass http://$backend:$streamerport;
        break;
    }

    location ~ ^/(api|m3u)/.+$ {
        rewrite ^/(api|m3u)/.+$ /backend.php last;
    }

    location ~ ^/upload/.*\.php$ {
        rewrite ^.*$ /index.html last;
    }


