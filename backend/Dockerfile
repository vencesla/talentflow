FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    icu-dev \
    libpq-dev \
    libsodium-dev \
    git \
    unzip \
    && docker-php-ext-install intl pdo pdo_pgsql sodium

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 8000
FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    icu-dev \
    libpq-dev \
    libsodium-dev \
    git \
    unzip \
    && docker-php-ext-install intl pdo pdo_pgsql sodium

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 9000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]